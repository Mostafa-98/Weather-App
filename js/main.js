const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const weatherDetails = document.getElementById('weather-details');
const weatherError = document.getElementById('weather-error');

// Keyless data sources (no API key required, free for non-commercial use)
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

let debounceTimer = null;

// WMO weather codes -> label + icon
const WEATHER_CODES = {
  0: ['Clear sky', '☀️'],
  1: ['Mainly clear', '🌤️'],
  2: ['Partly cloudy', '⛅'],
  3: ['Overcast', '☁️'],
  45: ['Fog', '🌫️'],
  48: ['Depositing rime fog', '🌫️'],
  51: ['Light drizzle', '🌦️'],
  53: ['Moderate drizzle', '🌦️'],
  55: ['Dense drizzle', '🌧️'],
  56: ['Light freezing drizzle', '🌧️'],
  57: ['Dense freezing drizzle', '🌧️'],
  61: ['Slight rain', '🌦️'],
  63: ['Moderate rain', '🌧️'],
  65: ['Heavy rain', '🌧️'],
  66: ['Light freezing rain', '🌧️'],
  67: ['Heavy freezing rain', '🌧️'],
  71: ['Slight snow fall', '🌨️'],
  73: ['Moderate snow fall', '🌨️'],
  75: ['Heavy snow fall', '❄️'],
  77: ['Snow grains', '❄️'],
  80: ['Slight rain showers', '🌦️'],
  81: ['Moderate rain showers', '🌧️'],
  82: ['Violent rain showers', '⛈️'],
  85: ['Slight snow showers', '🌨️'],
  86: ['Heavy snow showers', '❄️'],
  95: ['Thunderstorm', '⛈️'],
  96: ['Thunderstorm with slight hail', '⛈️'],
  99: ['Thunderstorm with heavy hail', '⛈️']
};

function describe(code) {
  const entry = WEATHER_CODES[code] || ['Unknown', '🌡️'];
  return { text: entry[0], icon: entry[1] };
}

function compass(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  if (deg === null || deg === undefined) return '';
  return dirs[Math.round((deg % 360) / 22.5) % 16];
}

searchInput.addEventListener('input', () => {
  const location = searchInput.value.trim();
  clearTimeout(debounceTimer);
  if (location.length >= 3) {
    debounceTimer = setTimeout(() => fetchWeather(location), 400);
  }
});

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const location = searchInput.value.trim();
  if (location) fetchWeather(location);
});

async function geocode(location) {
  const response = await fetch(
    `${GEO_URL}?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
  );
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  const data = await response.json();
  if (!data || !data.results || !data.results.length) throw new Error('No location found');
  return data.results[0];
}

async function fetchWeather(location) {
  try {
    const place = await geocode(location);
    const url = `${FORECAST_URL}?latitude=${place.latitude}&longitude=${place.longitude}` +
      '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max' +
      '&hourly=relative_humidity_2m&timezone=auto&forecast_days=3';
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    if (!data || !data.current || !data.daily) throw new Error('No weather data');
    hideError();
    displayWeather(place, data);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    showError('Could not find that location. Try another search.');
  }
}

function showError(message) {
  weatherError.textContent = message;
  weatherError.classList.remove('d-none');
}

function hideError() {
  weatherError.classList.add('d-none');
}

function dayLabel(dateStr, index) {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long' });
}

function dailyHumidity(hourly, dayIndex) {
  const values = ((hourly && hourly.relative_humidity_2m) || []).slice(dayIndex * 24, dayIndex * 24 + 24);
  const clean = values.filter((v) => v !== null && v !== undefined);
  if (!clean.length) return null;
  return Math.round(clean.reduce((a, b) => a + b, 0) / clean.length);
}

function displayWeather(place, data) {
  const { current, daily, hourly } = data;
  const days = daily.time.slice(0, 3);

  weatherDetails.innerHTML = days.map((date, i) => {
    const isToday = i === 0;
    const temp = isToday
      ? Math.round(current.temperature_2m)
      : Math.round((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2);
    const code = isToday ? current.weather_code : daily.weather_code[i];
    const { text, icon } = describe(code);
    const wind = isToday
      ? `${Math.round(current.wind_speed_10m)} km/h ${compass(current.wind_direction_10m)}`.trim()
      : `${Math.round(daily.wind_speed_10m_max[i])} km/h`;
    const humidity = isToday ? current.relative_humidity_2m : dailyHumidity(hourly, i);
    const humidityText = humidity === null || humidity === undefined ? '--' : `${humidity}%`;

    return `
      <div class="col-md-4 w-auto mt-3">
        <div class="weather-card text-center">
          <h4 class="text-start">${place.name}</h4>
          <p class="text-muted mb-1">${dayLabel(date, i)} · ${date}</p>
          <p class="temp fw-bolder">${temp}°C <span class="weather-icon">${icon}</span></p>
          <p><i class="fa-solid fa-wind"></i> ${wind}</p>
          <p><i class="fa-solid fa-droplet"></i> ${humidityText}</p>
          <p><i class="fa-solid fa-compass"></i> ${text}</p>
        </div>
      </div>`;
  }).join('');
}

fetchWeather('cairo');

function contact() {
  document.getElementById('firstNav').classList.replace('d-block', 'd-none');
  document.getElementById('firstcontent').classList.replace('d-block', 'd-none');
  document.getElementById('firstfooter').classList.replace('d-block', 'd-none');
  document.getElementById('secNav').classList.replace('d-none', 'd-block');
  document.getElementById('secContent').classList.replace('d-none', 'd-block');
  document.getElementById('secfooter').classList.replace('d-none', 'd-block');
}

function home() {
  document.getElementById('firstNav').classList.replace('d-none', 'd-block');
  document.getElementById('firstcontent').classList.replace('d-none', 'd-block');
  document.getElementById('firstfooter').classList.replace('d-none', 'd-block');
  document.getElementById('secNav').classList.replace('d-block', 'd-none');
  document.getElementById('secContent').classList.replace('d-block', 'd-none');
  document.getElementById('secfooter').classList.replace('d-block', 'd-none');
}
