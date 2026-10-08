# Weather Forecast Application

This is a weather forecast web app I built using HTML, Tailwind CSS, and JavaScript as part of my web development course project. It lets you search for any city's current weather and also shows a 5-day forecast.

## Features

- Search weather by city name
- Get weather for your current location using Geolocation API
- Shows temperature, humidity, wind speed, and weather condition
- 5-day extended forecast with daily temp, wind, and humidity
- Dropdown of your last 5 searched cities (saved using localStorage)
- Toggle between °C and °F
- Shows a warning if the temperature goes above 40°C
- Background changes color automatically when it's raining
- Custom error messages instead of browser alert popups

## Technologies Used

- HTML5
- Tailwind CSS
- JavaScript (Fetch API, async/await)
- OpenWeatherMap API

## How to Run This Project

1. Clone or download this repository
2. Open the folder in VS Code
3. Get a free API key from OpenWeatherMap
4. Open script.js and paste your API key where it says apiKey
5. Open index.html using Live Server

## What I Learned

While building this project, I faced a lot of small bugs that took time to fix, even though most of them turned out to be really minor mistakes. One issue I remember clearly was when my weather card just stopped showing any data, and there was no clear error message to explain why. After checking line by line, I found that I had written `getElementById("CurrentWeather")` with a capital C, but the actual id in my HTML was `currentWeather` with a lowercase c. Such a small typo, but it broke the whole function silently. This taught me that in JavaScript, even one letter being wrong in an id can cause the entire thing to fail, and from then on I started double-checking my ids carefully whenever something wasn't working.




## Author

Shifana Farveen H
BCA Final Year, Idhaya College