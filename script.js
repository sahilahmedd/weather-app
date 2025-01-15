let button = document.querySelector("button")
button.addEventListener("click", async function getweather() {
    let input = document.querySelector("input")
    let parent = document.querySelector(".main")
    let content = parent.querySelector(".content")
    let info = parent.querySelector(".temp-info")
    let addinfo = document.querySelector(".general")
    let airquality = document.querySelector(".air")
    let city = input.value;
    let url = "https://api.weatherapi.com/v1/"
    let key = "d3d11d2cb91c4fd39c1171442251401"

    // let response = await fetch(`${url}?&key=${key}&q=${city}&aqi=yes`)
    let [response1, response2] = await Promise.all([
        fetch(`${url}current.json?&key=${key}&q=${city}&aqi=yes`),
        fetch(`${url}forecast.json?&key=${key}&q=${city}&days=10`)
    ])
    if(!response1.ok && !response2.ok){
        console.log(`Error fetching data ${response.status}`);        
    }

    // let data = await response.json()
    const data1 = await response1.json();
    const data2 = await response2.json();

    // General Info
    content.innerHTML = `
    <h2>City: ${data1.location.name}</h2>
    <p>Region: ${data1.location.region}</p>
    <p>Country: ${data1.location.country}</p>
    <p>Time Zone: ${data1.location.tz_id}</p>
    `
    // Current Info
    info.innerHTML = `
    <h3>Current Info:</h3>
    <p>Temp: ${data1.current.temp_c}°C / ${data1.current.temp_f}°F</p>
    <p>Today: ${data1.current.condition.text}<img src="${data1.current.condition.icon}"></p>
    `

    // Additional Info
    addinfo.innerHTML = `
    <h3>Additional Info:</h3>
    <p>Humidity: ${data1.current.humidity}</p>
    <p>Cloud: ${data1.current.cloud}</p>
    <p>Feels Like: ${data1.current.feelslike_c}°C / ${data1.current.feelslike_f}°F</p>
    <p>Wind speed: ${data1.current.wind_kph}Kph / ${data1.current.wind_mph}Mph</p>
    `

    // Air quality index
    airquality.innerHTML = `
    <h3>Air quality:</h3>
    <p>Carbon: ${data1.current.air_quality.co}</p>
    <p>Nitrogen: ${data1.current.air_quality.no2}</p>
    <p>Ozon: ${data1.current.air_quality.o3}</p>
    `

    // 5 Days forcast
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    data2.forecast.forecastday.forEach(day => {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day-forecast");

        const date = new Date(day.date).toDateString();
        const icon = day.day.condition.icon;
        const condition = day.day.condition.text;
        const maxTemp = day.day.maxtemp_c;
        const minTemp = day.day.mintemp_c;

        dayDiv.innerHTML = `
            <h3>${date}</h3>
            <img src="${icon}" alt="${condition}">
            <p>${condition}</p>
            <p>Max: ${maxTemp}°C</p>
            <p>Min: ${minTemp}°C</p>
        `;

        forecastContainer.appendChild(dayDiv);
    });

    console.log(data1);
    console.log(data2);
    

})
