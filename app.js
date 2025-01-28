// OpenWeatherMap API Key
let apiKey = '9cb3686b6b1ef98aeb19d9136a719ae3';
// Base URL for the OpenWeatherMap API
let url = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + apiKey;

// DOM elements
let city = document.querySelector('.name');
let form = document.querySelector("form");
let temperature = document.querySelector('.temperature');
let description = document.querySelector('.description');
let valueSearch = document.getElementById('name');
let clouds = document.getElementById('clouds');
let humidity = document.getElementById('humidity');
let pressure = document.getElementById('pressure');
let main = document.querySelector('main');

// Validate the existence of required DOM elements before proceeding
if (!city || !form || !temperature || !description || !valueSearch || !clouds || !humidity || !pressure || !main) {
    console.error('One or more required DOM elements are missing!');
}

// Add event listener to the form submit event
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (valueSearch.value.trim() !== '') {
        searchWeather(valueSearch.value.trim());
    }
});

// Function to fetch weather data from the API based on the provided city name
const searchWeather = (query) => {
    fetch(url + '&q=' + query)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`City not found: "${query}"`);
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            return response.json();
        })
        .then(data => {
            if (data.cod === 200) {
                city.querySelector('figcaption').innerHTML = data.name;
                city.querySelector('img').src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
                temperature.querySelector('img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
                temperature.querySelector('span').innerText = Math.round(data.main.temp);
                description.innerText = data.weather[0].description;

                clouds.innerText = data.clouds.all;
                humidity.innerText = data.main.humidity;
                pressure.innerText = data.main.pressure;
            } else {
                handleError(data.message);
            }
            valueSearch.value = '';
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            let errorMessage = 'Unable to fetch weather data.';
            if (error.message.startsWith('City not found:')) {
                errorMessage = error.message;
            }
            handleError(errorMessage);
        });
};

// Function to handle errors and display messages to the user
const handleError = (message) => {
    main.classList.add('error');
    main.innerText = message;
    setTimeout(() => {
        main.classList.remove('error');
        main.innerText = '';
    }, 5000);
};

const initApp = () => {
    valueSearch.value = 'Manila';
    searchWeather('Manila');
};

document.addEventListener('DOMContentLoaded', initApp);
