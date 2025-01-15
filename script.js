let button = document.querySelector("button")
button.addEventListener("click", async function getweather() {
    try {
            const loadingScreen = document.getElementById('loading');
            let input = document.querySelector("input")
            let parent = document.querySelector(".main")
            let maininfo = document.querySelector(".info")
            let mainaddinfo = document.querySelector(".add-info")
            let content = parent.querySelector(".content")
            let info = parent.querySelector(".temp-info")
            let addinfo = document.querySelector(".general")
            let airquality = document.querySelector(".air")
            let forcastmain = document.querySelector("#forecast-container")
            let url = "https://api.weatherapi.com/v1/"
            let key = "d3d11d2cb91c4fd39c1171442251401"
            let city = input.value;
            
            // let response = await fetch(`${url}?&key=${key}&q=${city}&aqi=yes`)
            let [response1, response2] = await Promise.all([
                fetch(`${url}current.json?&key=${key}&q=${city}&aqi=yes`),
                fetch(`${url}forecast.json?&key=${key}&q=${city}&days=5`)
            ])

            if(!response1.ok && !response2.ok){
                // console.log(`Data not found: ${response.status}`);
                await alert("This city doesn't exist")
            }
            
            // loaader
            let loader = document.querySelector(".loader")
           
            let toggel = ()=>{
                loader.style.display = "block"

                setTimeout(()=>{
                    loader.style.display = "none"
                }, 2000)
            }

            
            // let data = await response.json()
            const data1 = await response1.json();
            const data2 = await response2.json();

            // Show loading screen
            // loadingScreen.style.display = 'block';


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

            toggel()
            maininfo.style.display = "block"
            mainaddinfo.style.display = "flex"
            forcastmain.style.display = "block"
            console.log(data1);
            console.log(data2);
        } catch(error){
            console.error("Error:", error);
        } finally {
            // loadingScreen.style.display = 'none';
        }
})
