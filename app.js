// OpenWeatherMap API Key
let apiKey = '9cb3686b6b1ef98aeb19d9136a719ae3';
// Base URL for the OpenWeatherMap API
let url = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + apiKey;

// DOM elements
let city = document.querySelector('.name'); // Element to display city name and flag
let form = document.querySelector("form"); // Form for submitting the city search
let temperature = document.querySelector('.temperature'); // Element to display temperature and weather icon
let description = document.querySelector('.description'); // Element to display weather description
let valueSearch = document.getElementById('name'); // Input field for city search
let clouds = document.getElementById('clouds'); // Element to display cloud percentage
let humidity = document.getElementById('humidity'); // Element to display humidity percentage
let pressure = document.getElementById('pressure'); // Element to display pressure value
let main = document.querySelector('main'); // Main container to show errors or weather data

// Validate the existence of required DOM elements before proceeding
if (!city || !form || !temperature || !description || !valueSearch || !clouds || !humidity || !pressure || !main) {
    console.error('One or more required DOM elements are missing!');
}

// Add event listener to the form submit event
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission
    if (valueSearch.value.trim() !== '') { // Ensure the input field is not empty
        searchWeather(valueSearch.value.trim()); // Fetch weather data for the entered city
    }
});

// Function to fetch weather data from the API based on the provided city name
const searchWeather = (query) => {
    fetch(url + '&q=' + query)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            if (data.cod == 200) {
                // Update UI with weather data
                city.querySelector('figcaption').innerHTML = data.name;
                city.querySelector('img').src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`;
                temperature.querySelector('img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
                temperature.querySelector('span').innerText = Math.round(data.main.temp);
                description.innerText = data.weather[0].description;

                clouds.innerText = data.clouds.all;
                humidity.innerText = data.main.humidity;
                pressure.innerText = data.main.pressure;
            }
            valueSearch.value = ''; // Clear input field after search
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            valueSearch.value = ''; // Clear input field
            alert('City not found. Please enter a valid city name.');
        });
};


// Function to handle errors and display messages to the user
const handleError = (message) => {
    main.classList.add('error'); // Add error styling to the main container
    main.innerText = message; // Display the error message in the main container
    setTimeout(() => {
        main.classList.remove('error'); // Remove error styling after a timeout
        main.innerText = ''; // Clear the error message
    }, 3000); // Error message is visible for 3 seconds
};

// Function to initialize the app with a default city
const initApp = () => {
    valueSearch.value = 'Manila'; // Set default city to "Manila"
    searchWeather('Manila'); // Fetch and display weather data for the default city
};

// Ensure the app initializes only after the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
