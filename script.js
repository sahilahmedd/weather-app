document.getElementById("fetch-data").addEventListener("click", function() {
    const city = document.getElementById("city").value;
    const apiMethod = document.getElementById("api-method").value;

    if (!city || !apiMethod) {
        alert("Please select both city and API method.");
        return;
    }

    const apiKey = "d3d11d2cb91c4fd39c1171442251401";
    const apiUrl = `https://api.weatherapi.com/v1/${apiMethod}.json?key=${apiKey}&q=${city}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data, apiMethod);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("Failed to fetch weather data.");
        });
});

function displayWeatherData(data, apiMethod) {
    const resultSection = document.getElementById("weather-result");

    resultSection.innerHTML = ""; // Clear previous data

    if (apiMethod === "current") {
        resultSection.innerHTML = `
            <h2>Current Weather in ${data.location.name}</h2>
            <p>Temperature: ${data.current.temp_c}°C</p>
            <p>Condition: ${data.current.condition.text}</p>
            <p>Humidity: ${data.current.humidity}%</p>
            <p>Wind: ${data.current.wind_kph} km/h</p>
        `;
    } else if (apiMethod === "forecast") {
        resultSection.innerHTML = `
            <h2>Weather Forecast for ${data.location.name}</h2>
            <p>Forecast: ${data.forecast.forecastday[0].day.condition.text}</p>
            <p>High: ${data.forecast.forecastday[0].day.maxtemp_c}°C, Low: ${data.forecast.forecastday[0].day.mintemp_c}°C</p>
        `;
    } else if (apiMethod === "history") {
        resultSection.innerHTML = `
            <h2>Weather History for ${data.location.name}</h2>
            <p>Data for Date: ${data.forecast.forecastday[0].date}</p>
            <p>Max Temp: ${data.forecast.forecastday[0].day.maxtemp_c}°C</p>
            <p>Min Temp: ${data.forecast.forecastday[0].day.mintemp_c}°C</p>
        `;
    } else if (apiMethod === "alerts") {
        resultSection.innerHTML = `
            <h2>Weather Alerts for ${data.location.name}</h2>
            <p>Headline: ${data.alerts.alert[0].headline}</p>
            <p>Severity: ${data.alerts.alert[0].severity}</p>
            <p>Event: ${data.alerts.alert[0].event}</p>
        `;
    } else if (apiMethod === "astronomy") {
        resultSection.innerHTML = `
            <h2>Astronomy Data for ${data.location.name}</h2>
            <p>Sunrise: ${data.astronomy.astro.sunrise}</p>
            <p>Sunset: ${data.astronomy.astro.sunset}</p>
        `;
    } else if (apiMethod === "future") {
        resultSection.innerHTML = `
            <h2>Future Weather for ${data.location.name}</h2>
            <p>Forecast: ${data.forecast.forecastday[0].day.condition.text}</p>
            <p>High: ${data.forecast.forecastday[0].day.maxtemp_c}°C, Low: ${data.forecast.forecastday[0].day.mintemp_c}°C</p>
        `;
    }
}
