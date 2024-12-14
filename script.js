    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    let weatherCache = {};
    let isCelsius = true;
    let showPastWeather = false;

    document.getElementById('search-btn').addEventListener('click', fetchWeatherByCity);
    document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
    document.getElementById('refresh-btn').addEventListener('click', refreshPage);
    document.getElementById('toggle-history').addEventListener('click', togglePastWeather);
    loadSearchHistory();

    function fetchWeatherByCity() {
        const city = document.getElementById('city-input').value;
        if (city.trim()) {
            getWeather(city);
        }
    }

    function getWeather(city) {
        if (weatherCache[city]) {
            displayWeatherInfo(weatherCache[city]);
        } else {
            const apiKey = '2db5cbb4658b427d9df85441241910';  // Replace with your WeatherAPI key
            const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;

            document.getElementById('loading').style.display = 'block';

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('loading').style.display = 'none';
                    if (data.error) {
                        document.getElementById('weather-info').innerHTML = `<p>City not found. Please try again.</p>`;
                        return;
                    }
                    weatherCache[city] = data;
                    displayWeatherInfo(data);
                    addSearchToHistory(city);
                    updateBackground(data.current.condition.text.toLowerCase());
                })
                .catch(error => {
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('weather-info').innerHTML = `<p>City not found. Please try again.</p>`;
                });
        }
    }

    function displayWeatherInfo(data) {
        const temp = isCelsius ? `${data.current.temp_c}°C` : `${data.current.temp_f}°F`;
        const weatherInfo = `
            <p><strong>City:</strong> ${data.location.name}</p>
            <p><strong>Temperature:</strong> ${temp}</p>
            <p><img src="${data.current.condition.icon}" alt="Weather Icon"> ${data.current.condition.text}</p>
            <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${data.current.wind_kph} kph</p>
        `;
        document.getElementById('weather-info').innerHTML = weatherInfo;

        if (showPastWeather) {
            displayPastWeather(data.forecast.forecastday);
        }
    }

    function displayPastWeather(forecastData) {
        let pastWeatherInfo = '';
        forecastData.slice(0, 5).forEach(day => {
            pastWeatherInfo += `
                <p><strong>Date:</strong> ${day.date}</p>
                <p><img src="${day.day.condition.icon}" alt="Weather Icon"> ${day.day.condition.text}</p>
                <p><strong>Max Temp:</strong> ${day.day.maxtemp_c}°C</p>
                <p><strong>Min Temp:</strong> ${day.day.mintemp_c}°C</p>
            `;
        });
        document.getElementById('past-weather-info').innerHTML = pastWeatherInfo;
    }

    function addSearchToHistory(city) {
        if (!searchHistory.includes(city)) {
            searchHistory.push(city);
            if (searchHistory.length > 5) {
                searchHistory.shift();
            }
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            loadSearchHistory();
        }
    }

    function loadSearchHistory() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        searchHistory.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.addEventListener('click', () => getWeather(city));
            historyList.appendChild(li);
        });
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        document.querySelectorAll('.container, .input-field, .neon-button, .weather-info').forEach(el => {
            el.classList.toggle('dark-mode');
        });
    }

    function refreshPage() {
        document.getElementById('weather-info').innerHTML = '';
        document.getElementById('past-weather-info').innerHTML = '';
        document.getElementById('city-input').value = '';
    }

    function togglePastWeather() {
        showPastWeather = !showPastWeather;
        const city = document.getElementById('city-input').value;
        if (city.trim() && weatherCache[city]) {
            displayWeatherInfo(weatherCache[city]);
        }
    }

    // Particle background config
    particlesJS('particles-js', {
        particles: {
            number: { value: 100, density: { enable: true, value_area: 800 } },
            color: { value: ['#00aaff', '#00ffcc', '#ff6600', '#ff00cc'] },
            shape: { type: 'circle' },
            opacity: { value: 1, anim: { enable: true, speed: 0.5, opacity_min: 0, sync: false } },
            size: { value: 3, random: true },
            move: { enable: true, speed: 2, random: true, straight: false, out_mode: 'out', bounce: false },
        },
    });
