const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const weatherDetails = document.getElementById('weather-details');
const weatherError = document.getElementById('weather-error');

const API_KEY = '9b9136a7794e474b8e605455241112';
const API_URL = 'https://api.weatherapi.com/v1/forecast.json';

let debounceTimer = null;

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

async function fetchWeather(location) {
  const url = `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(location)}&days=7&aqi=no&alerts=no`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    if (!data || !data.location) throw new Error('No location found');
    hideError();
    displayWeather(data);
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

function displayWeather(data) {
  const { location, current, forecast } = data;
  const days = forecast.forecastday.slice(0, 3);

  weatherDetails.innerHTML = days.map((day, i) => {
    const isToday = i === 0;
    const temp = isToday ? current.temp_c : day.day.avgtemp_c;
    const icon = isToday ? current.condition.icon : day.day.condition.icon;
    const text = isToday ? current.condition.text : day.day.condition.text;
    const wind = isToday ? `${current.wind_kph} km/h ${current.wind_dir}` : `${day.day.maxwind_kph} km/h`;
    const humidity = isToday ? current.humidity : day.day.avghumidity;

    return `
      <div class="col-md-4 w-auto mt-3">
        <div class="weather-card text-center">
          <h4 class="text-start">${location.name}</h4>
          <p class="text-muted mb-1">${dayLabel(day.date, i)} · ${day.date}</p>
          <p class="temp fw-bolder">${temp}°C <img src="https:${icon}" alt="${text}"/></p>
          <p><i class="fa-solid fa-wind"></i> ${wind}</p>
          <p><i class="fa-solid fa-droplet"></i> ${humidity}%</p>
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
