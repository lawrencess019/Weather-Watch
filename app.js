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
                // Handle HTTP errors
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            if (data.cod == 200) {
                // Update UI with the weather data if the response is successful
                city.querySelector('figcaption').innerHTML = data.name; // Display city name
                city.querySelector('img').src = `https://flagsapi.com/${data.sys.country}/shiny/32.png`; // Display country flag
                temperature.querySelector('img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`; // Display weather icon
                temperature.querySelector('span').innerText = Math.round(data.main.temp); // Display rounded temperature
                description.innerText = data.weather[0].description; // Display weather description

                clouds.innerText = data.clouds.all; // Display cloud percentage
                humidity.innerText = data.main.humidity; // Display humidity percentage
                pressure.innerText = data.main.pressure; // Display pressure value

                // Change background based on cloud percentage
                changeBackground(data.clouds.all);
            } else {
                // Handle API response errors
                handleError(data.message);
            }
            valueSearch.value = ''; // Clear the input field
        })
        .catch(error => {
            // Handle network or other fetch-related errors
            console.error('Error fetching weather data:', error);
            handleError('Unable to fetch weather data.');
        });
};

// Function to change the background based on cloud percentage
const changeBackground = (cloudPercentage) => {
    if (cloudPercentage <= 20) {
        // Clear skies or very few clouds, set a bright or clear background
        document.body.style.backgroundImage = 'url("https://static.vecteezy.com/system/resources/previews/012/865/527/large_2x/clear-blue-sky-with-few-clouds-in-summer-this-clear-sky-is-usually-only-until-10-am-above-10-am-there-will-be-more-clouds-free-photo.jpg")'; // Replace with your image or color
    } else if (cloudPercentage <= 50) {
        // Partly cloudy, set a moderate background
        document.body.style.backgroundImage = 'url("https://www.wkbn.com/wp-content/uploads/sites/48/2021/03/clouds-cloudy-sky-spring-summer-fall-winter-weather-generic-8-1.jpg?w=1280")'; // Replace with your image or color
    } else if (cloudPercentage <= 80) {
        // Mostly cloudy, set a darker or overcast background
        document.body.style.backgroundImage = 'url("https://media.gettyimages.com/id/475721245/video/storms-cloudy.jpg?s=640x640&k=20&c=wnH7U96LBjS2GXZj90tZuUE1qt4hlu6Cj8b-EIxIWns=")'; // Replace with your image or color
    } else {
        // Overcast, set a dark or stormy background
        document.body.style.backgroundImage = 'url("https://www.rochesterfirst.com/wp-content/uploads/sites/66/2021/04/storm-466677_1920.jpg?w=900")'; // Replace with your image or color
    }
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
