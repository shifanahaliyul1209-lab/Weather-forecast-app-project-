const apiKey = "b9d6475737f67890a7e4bcbf6b381882";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const currentWeatherDiv = document.getElementById("currentWeather");
const unitToggle = document.getElementById("unitToggle");
const tempAlert = document.getElementById("tempAlert");
let currentTempCelsius = null;
let isFahrenheit = false;

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    showError("Please enter a city name");
    return;
  }
  getWeather(city);
});
// Fetches current weather data for a given city name
async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    clearError();
    displayWeather(data);
    fetchForecast(city);
    saveRecentCity(city);
} catch (error) {
  showError(error.message);
}
  
    
  
}
const locationBtn = document.getElementById("locationBtn");

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeatherByCoords(lat, lon);
    },
    (error) => {
      console.log("Error getting location:", error.message);
    }
  );
});
// Fetches weather data using the user's current location
async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Could not fetch weather for your location");
    }

    const data = await response.json();
    displayWeather(data);

  } catch (error) {
  showError(error.message);
}

}
// Fetches the 5-day extended forecast for a given city
async function fetchForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Could not fetch forecast");
    }

    const data = await response.json();
    displayForecast(data);

  } catch (error) {
    console.log("Error:", error.message);
  }
}

function displayForecast(data) {
  const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  dailyData.forEach(day => {
    const date = day.dt_txt.split(" ")[0];
    const temp = day.main.temp;
    const humidity = day.main.humidity;
    const wind = day.wind.speed;
    const condition = day.weather[0].main;

    forecastDiv.innerHTML += `
      <div class="bg-slate-600 text-white p-3 rounded-lg">
        <p class="font-bold">${date}</p>
        <p>Temp: ${temp}°C</p>
        <p>Wind: ${wind} m/s</p>
        <p>Humidity: ${humidity}%</p>
        <p>${condition}</p>
      </div>
    `;
  });
}
function displayWeather(data) {
  const cityName = data.name;
  currentTempCelsius = data.main.temp;
  if (currentTempCelsius > 40){
    
   
  tempAlert.textContent = `⚠️ Extreme heat warning: ${currentTempCelsius.toFixed(1)}°C in ${data.name}!`;
  tempAlert.classList.remove("hidden");
} else {
  tempAlert.classList.add("hidden");
  tempAlert.textContent = "";
}

const temp = isFahrenheit
  ? (currentTempCelsius * 9/5 + 32).toFixed(1)
  : currentTempCelsius.toFixed(1);
const unitLabel = isFahrenheit ? "°F" : "°C";
 const humidity= data.main.humidity; 
  
  
    
  const wind = data.wind.speed;
  const condition = data.weather[0].main;
  if (condition === "Rain" || condition === "Drizzle" || condition === "Thunderstorm") {
  document.body.classList.remove("bg-slate-100");
  document.body.classList.add("bg-slate-500");
} else {
  document.body.classList.remove("bg-slate-500");
  document.body.classList.add("bg-slate-100");
}

  currentWeatherDiv.innerHTML = `
    <div class="bg-blue-500 text-white p-4 rounded-lg">
      <h2 class="text-2xl font-bold">${cityName}</h2>
      <p>Temperature: ${temp}${unitLabel}</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind: ${wind} m/s</p>
      <p>${condition}</p>
    </div>
  `;
}
// Saves a searched city to localStorage and keeps only the last 5
function saveRecentCity(city) {
  console.log("saveRecentCity called with:",city);
  let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];

  recentCities = recentCities.filter(
    c => c.toLowerCase() !== city.toLowerCase()
  );

  recentCities.unshift(city);
  recentCities = recentCities.slice(0, 5);

  localStorage.setItem("recentCities", JSON.stringify(recentCities));
  renderRecentCities();
}
// Displays the dropdown of recently searched cities
function renderRecentCities() {
  const recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
  const recentCitiesDiv = document.getElementById("recentCities");

  if (recentCities.length === 0) {
    recentCitiesDiv.innerHTML = "";
    return;
  }

  recentCitiesDiv.innerHTML = `
    <select id="recentDropdown" class="px-3 py-2 rounded-lg border">
      <option value="" disabled selected>Recent searches</option>
      ${recentCities.map(city => `<option value="${city}">${city}</option>`).join("")}
    </select>
  `;

  document.getElementById("recentDropdown").addEventListener("change", (e) => {
    const selectedCity = e.target.value;
    getWeather(selectedCity);
    fetchForecast(selectedCity);
  });
}

renderRecentCities();
unitToggle.addEventListener("click", () => {
  isFahrenheit = !isFahrenheit;
  unitToggle.textContent = isFahrenheit ? "Show in °C" : "Show in °F";

  if (currentTempCelsius !== null) {
    const temp = isFahrenheit
      ? (currentTempCelsius * 9/5 + 32).toFixed(1)
      : currentTempCelsius.toFixed(1);
    const unitLabel = isFahrenheit ? "°F" : "°C";
    const tempParagraph = currentWeatherDiv.querySelector("p");
    tempParagraph.textContent = `Temperature: ${temp}${unitLabel}`;
  }
});
const errorMsgDiv = document.getElementById("errorMsg");
// Shows an error message in the custom popup box
function showError(message) {
  errorMsgDiv.textContent = message;
  errorMsgDiv.classList.remove("hidden");
}

function clearError() {
  errorMsgDiv.textContent = "";
  errorMsgDiv.classList.add("hidden");
}

