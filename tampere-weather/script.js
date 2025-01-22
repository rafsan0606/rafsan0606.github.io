
const apiKey = '0e5a987080219081be4992b07546732e';
const city = 'Tampere,FI';

const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data. Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
    }
}

const displayCurrentWeather = async () => {
    try {
        const data = await fetchData(currentWeatherUrl);
        document.getElementById('weather-icon').innerHTML = `<img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather Icon">`;
        document.getElementById('weather-description').textContent = data.weather[0].description;
        document.getElementById('temperature').textContent = `${data.main.temp} °C`;
        document.getElementById('feels-like').innerHTML = `Feels Like:<br> ${data.main.feels_like} °C`;
        document.getElementById('humidity').innerHTML = `Humidity:<br> ${data.main.humidity}%`;
        document.getElementById('temp-min').innerHTML = `Min: ${data.main.temp_min} °C<br>Max: ${data.main.temp_max} °C`;
       // document.getElementById('temp-max').textContent = `Max: ${data.main.temp_max} °C`;
        document.getElementById('wind-speed').innerHTML = `Wind Speed:<br> ${data.wind.speed} m/s`;

        updateBackgroundImage(data.main.temp);

    } catch (error) {
        console.error('Error displaying current weather data:', error.message);
    }
}

const displayForecast = async () => {
    try {
        const data = await fetchData(forecastUrl);
        const forecastContainer = document.getElementById('forecast-container');

        // Extract data for the next 3 hours
        const next3HoursData = data.list.slice(0, 3);

        // Display forecast for each hour
        next3HoursData.forEach(item => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';

            const forecastTime = document.createElement('h4');
            forecastTime.className = 'forecast-time';
            forecastTime.textContent = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const forecastIcon = document.createElement('img');
            forecastIcon.className = 'forecast-icon';
            forecastIcon.src = `http://openweathermap.org/img/w/${item.weather[0].icon}.png`;
            forecastIcon.alt = item.weather[0].description;

            const forecastTemperature = document.createElement('h4');
            forecastTemperature.className = 'forecast-temperature';
            forecastTemperature.textContent = `${item.main.temp} °C`;

            forecastItem.appendChild(forecastTime);
            forecastItem.appendChild(forecastIcon);
            forecastItem.appendChild(forecastTemperature);

            forecastContainer.appendChild(forecastItem);
        });
    } catch (error) {
        console.error('Error displaying forecast data:', error.message);
    }
}

const updateBackgroundImage = (temperature) => {
    const container = document.getElementById('container');
    container.classList.remove('background-cold', 'background-moderate', 'background-warm', 'background-hot');

    if (temperature < 0) {
        container.classList.add('background-cold');
    } else if (temperature < 10) {
        container.classList.add('background-moderate');
    } else if (temperature < 20) {
        container.classList.add('background-warm');
    } else {
        container.classList.add('background-hot');
    }
}

displayCurrentWeather();

displayForecast();

const refreshPage = () => {
    location.reload();
}