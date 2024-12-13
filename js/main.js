
const searchInput = document.getElementById('search-input');
const weatherDetails = document.getElementById('weather-details');

searchInput.addEventListener('input', () => {
  const location = searchInput.value.trim();
  if (location) {
    fetchWeather(location);
  } else {
    weatherDetails.innerHTML = '';
  }
});


async function fetchWeather(location) {
  const url = `http://api.weatherapi.com/v1/search.json?key=29dcee04ade54a57a8a231057240912&q=${location}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const locations = await response.json();
    if (locations.length === 0) {
      weatherDetails.innerHTML = `<p class="text-danger">No locations found. Try another search.</p>`;
      return;
    }

    displayWeather(locations[0].name);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    alert('Unable to fetch data. Please try again later.');
  }
}

async function displayWeather(location) {
  const url = `http://api.weatherapi.com/v1/current.json?key=29dcee04ade54a57a8a231057240912&q=${location}&aqi=no`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    weatherDetails.innerHTML = `
      <div class="col-md-4 w-auto mt-3">
        <div class="weather-card text-center">
          <h4 class="text-start">${data.location.name}</h4>
          <p class="temp fw-bolder">${data.current.temp_c}°C <img src="https:${data.current.condition.icon}"/></p>
          <p><i class="fa-regular fa-snowflake"></i> ${data.current.wind_kph} km/h ${data.current.wind_dir}</p>
          <p><i class="fa-solid fa-wind"></i> ${data.current.humidity}%</p>
          <p><i class="fa-solid fa-compass"></i> ${data.current.condition.text}</p>
        </div>
      </div>

            <div class="col-md-4 w-auto mt-3">
        <div class="weather-card text-center">
          <h4 class="text-start">${data.location.name}</h4>
          <p class="temp fw-bolder">${data.current.temp_c}°C <img src="https:${data.current.condition.icon}"/></p>
          <p><i class="fa-regular fa-snowflake"></i> ${data.current.wind_kph} km/h ${data.current.wind_dir}</p>
          <p><i class="fa-solid fa-wind"></i> ${data.current.humidity}%</p>
          <p><i class="fa-solid fa-compass"></i> ${data.current.condition.text}</p>
        </div>
      </div>

            <div class="col-md-4 w-auto mt-3">
        <div class="weather-card text-center">
          <h4 class="text-start">${data.location.name}</h4>
          <p class="temp fw-bolder">${data.current.temp_c}°C <img src="https:${data.current.condition.icon}"/></p>
          <p><i class="fa-regular fa-snowflake"></i> ${data.current.wind_kph} km/h ${data.current.wind_dir}</p>
          <p><i class="fa-solid fa-wind"></i> ${data.current.humidity}%</p>
          <p><i class="fa-solid fa-compass"></i> ${data.current.condition.text}</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error fetching current weather:', error.message);
    alert('Unable to fetch current weather data.');
  }
}

fetchWeather("cairo");

function contact(){

    document.getElementById("firstNav").classList.replace("d-block", "d-none");
    document.getElementById("firstcontent").classList.replace("d-block", "d-none");
    document.getElementById("firstfooter").classList.replace("d-block", "d-none");
    document.getElementById("secNav").classList.replace("d-none", "d-block");
    document.getElementById("secContent").classList.replace("d-none", "d-block");
    document.getElementById("secfooter").classList.replace("d-none", "d-block");
}

function home(){

    document.getElementById("firstNav").classList.replace("d-none", "d-block");
    document.getElementById("firstcontent").classList.replace("d-none", "d-block");
    document.getElementById("firstfooter").classList.replace("d-none", "d-block");
    document.getElementById("secNav").classList.replace("d-block", "d-none");
    document.getElementById("secContent").classList.replace("d-block", "d-none");
    document.getElementById("secfooter").classList.replace("d-block", "d-none");
}
