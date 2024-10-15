const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const WeatherBox = document.querySelector(".weather-box");
const WeatherDetails = document.querySelector(".weather-details");

search.addEventListener("click", () => {
    const APIKey = "5299294c1989590d703650f31334f878";
    const city = document.querySelector(".search-box input").value;

    if (city === '') return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === "404") {
                alert("City not found. Please try again.");
                return;
            }

            const image = document.querySelector(".weather-box img");
            const temperature = document.querySelector(".weather-box .temperature");
            const description = document.querySelector(".weather-box .description");
            const humidity = document.querySelector(".weather-details .humidity span");
            const wind = document.querySelector(".weather-details .wind span");

            // Update the weather icon based on the weather condition
            switch (json.weather[0].main) {
                case "Clear":
                    image.src = "weather-images/clear-sky.png";
                    break;
                case "Rain":
                    image.src = "weather-images/rain.png";
                    break;
                case "Heavy Rain":
                    image.src = "weather-images/heavy-rain.png";
                    break;
                case "Windy":
                    image.src = "weather-images/windy.png";
                    break;
                case "Sunny":
                    image.src = "weather-images/sun.png";
                    break;
                case "Snow":
                    image.src = "weather-images/snow.png";
                    break;
                case "Clouds":
                    image.src = "weather-images/clouds.png";
                    break;
                case "Broken Clouds":
                    image.src = "weather-images/cloud.png";
                    break;
                case "Mist":
                    image.src = "weather-images/mist.png";
                    break;
                case "Haze":
                    image.src = "weather-images/haze.png";
                    break;
                default:
                    image.src = "weather-images/broken-clouds.png"; // Adjusted file name
            }

            // Display temperature, description, humidity, and wind speed
            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)} Km/h`; // Added space before Km/h

            // Show the weather box and details
            WeatherBox.style.display = "";
            WeatherDetails.style.display = "";
        })
        .catch(err => console.error('Error fetching weather data:', err));
});
