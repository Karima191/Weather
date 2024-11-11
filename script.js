const searchButton = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const errorMessage = document.querySelector(".error");
const touristPlacesContainer = document.getElementById("tourist-places");
const placesContent = document.querySelector(".places-content");

// API Keys
const OPENWEATHER_API_KEY = "5299294c1989590d703650f31334f878";
const OPENTRIPMAP_API_KEY = "5ae2e3f221c38a28845f05b67a4ff2875427ddeaf0a23c1f30420616";

searchButton.addEventListener("click", () => {
    const city = document.querySelector(".search-box input").value;
    if (city === '') return;

    fetchWeatherData(city);
});

function fetchWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === "404") {
                showError();
            } else {
                displayWeatherData(json);
                fetchTouristPlaces(json.coord.lat, json.coord.lon);
            }
        })
        .catch(err => console.error('Error fetching weather data:', err));
}

function displayWeatherData(data) {
    weatherBox.style.display = "block";
    weatherDetails.style.display = "block";
    errorMessage.style.display = "none";

    const image = weatherBox.querySelector("img");
    const temperature = weatherBox.querySelector(".temperature");
    const description = weatherBox.querySelector(".description");
    const humidity = weatherDetails.querySelector(".humidity span");
    const wind = weatherDetails.querySelector(".wind span");

    switch (data.weather[0].main) {
        case "Clear": image.src = "weather-images/clear-sky.png"; break;
        case "Rain": image.src = "weather-images/rain.png"; break;
        case "Clouds": image.src = "weather-images/clouds.png"; break;
        default: image.src = "weather-images/broken-clouds.png";
    }

    temperature.innerHTML = `${parseInt(data.main.temp)}<span>°C</span>`;
    description.innerHTML = `${data.weather[0].description}`;
    humidity.innerHTML = `${data.main.humidity}%`;
    wind.innerHTML = `${parseInt(data.wind.speed)} Km/h`;
}

function showError() {
    errorMessage.style.display = "block";
    weatherBox.style.display = "none";
    weatherDetails.style.display = "none";
    touristPlacesContainer.style.display = "none";
}

async function fetchTouristPlaces(lat, lon) {
    const radius = 10000; // 10 km radius
    const limit = 10;

    try {
        const response = await fetch(
            `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&limit=${limit}&apikey=${OPENTRIPMAP_API_KEY}`
        );
        const data = await response.json();
        displayTouristPlaces(data.features);
    } catch (error) {
        console.error("Error fetching tourist places:", error);
    }
}

function displayTouristPlaces(places) {
    placesContent.innerHTML = "";

    if (places && places.length > 0) {
        touristPlacesContainer.style.display = "block";
        places.forEach(place => {
            const placeElement = document.createElement("div");
            placeElement.classList.add("place");

            const placeName = place.properties.name || "Unnamed place";
            const placeCategory = place.properties.kinds.split(',').join(', ');
            const placeLink = `https://opentripmap.com/en/card/${place.properties.xid}`;

            placeElement.innerHTML = `
                <h3>${placeName}</h3>
                <p>Category: ${placeCategory}</p>
                <a href="${placeLink}" target="_blank">View details</a>
            `;

            placesContent.appendChild(placeElement);
        });
    } else {
        touristPlacesContainer.innerHTML = "<p>No tourist places found nearby.</p>";
    }
}
