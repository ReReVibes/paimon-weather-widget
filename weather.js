let currentLocation = null;

// Paimon's weather messages

const weatherMessages = {

    clear: {
        day: [
            "It's a beautiful day!",
            "Perfect weather for an adventure!",
            "The sky looks so pretty today!"
        ],

        night: [
            "The stars are so pretty tonight!",
            "Paimon thinks the night sky looks beautiful.",
            "It's a lovely night for stargazing!"
        ]
    },

    cloudy: {
        day: [
            "Looks like the clouds are hanging around today.",
            "Paimon wonders if the clouds will clear up.",
            "It's a little gloomy today."
        ],

        night: [
            "The clouds are hiding the stars tonight.",
            "It's a cloudy night...",
            "Paimon wonders if the stars will come out."
        ]
    },

    drizzle: {
        day: [
            "Let's go splash some puddles!",
            "It's only a little drizzle!",
            "Paimon doesn't mind a little rain."
        ],

        night: [
            "That's the smell of petrichor.",
            "It's a little drizzly tonight.",
            "Paimon thinks the rain sounds nice at night."
        ]
    },

    rain: {
        day: [
            "Paimon hopes you brought an umbrella!",
            "Don't let Paimon get wet!",
            "Looks like it's going to be a rainy day."
        ],

        night: [
            "Paimon hopes you made it home before the rain!",
            "It's raining tonight...",
            "Paimon thinks it's a good night to stay inside."
        ]
    },

    thunderstorm: {
        day: [
            "Eek! Paimon doesn't like those scary noises!",
            "Whoa! That's a big storm!",
            "Maybe Paimon should stay inside today..."
        ],

        night: [
            "Eek! Thunder is even scarier at night!",
            "Paimon doesn't like thunderstorms at night!",
            "Maybe Paimon should hide under the blankets..."
        ]
    }
};


// Get a random Paimon message

function getRandomMessage(messages) {
    if (!messages || messages.length === 0) {
        return "Paimon is checking the weather...";
    }

    const randomIndex =
        Math.floor(Math.random() * messages.length);

    return messages[randomIndex];
}

// Convert weather code to category

function getWeatherCategory(code) {

    if (code === 0 || code === 1) {
        return "clear";
    }

    if (code === 2 || code === 3) {
        return "cloudy";
    }

    if (code >= 51 && code <= 57) {
        return "drizzle";
    }

    if (code >= 51 && code <= 67) {
        return "rain";
    }

    if (code >= 80 && code <= 82) {
        return "rain";
    }

    if (code >= 95 && code <= 99) {
        return "thunderstorm";
    }

    return "cloudy";
}

function getWeatherIcon(category, isDay) {

    if (category === "clear") {
        return isDay
            ? "images/clear-day.svg"
            : "images/clear-night.svg";
    }

    if (category === "cloudy") {
        return isDay
            ? "images/partly-cloudy-day.svg"
            : "images/partly-cloudy-night.svg";
    }

    if (category === "drizzle") {
        return isDay
            ? "images/partly-cloudy-day-drizzle.svg"
            : "images/partly-cloudy-night-drizzle.svg";
    }

    if (category === "rain") {
        return isDay
            ? "images/partly-cloudy-day-rain.svg"
            : "images/partly-cloudy-night-rain.svg";
    }

    if (category === "thunderstorm") {
        return isDay
            ? "images/thunderstorms-day-rain.svg"
            : "images/thunderstorms-night-rain.svg";
    }

    return isDay
        ? "images/cloudy-day.svg"
        : "images/cloudy-night.svg";
}


//paimon gif 
function getPaimonImage(category) {

    if (category === "clear" || category === "cloudy") {
        return "images/calm-paimon.gif";
    }

    if (category === "drizzle" || category === "rain") {
        return "images/paimon-rain.gif";
    }

    if (category === "thunderstorm") {
        return "images/lightning-paimon.gif";
    }

    return "images/paimon.gif";
}

// Get approximate location

async function getCurrentLocation() {

    const response =
        await fetch("https://ipwho.is/");

    if (!response.ok) {
        throw new Error("Could not determine location.");
    }

    const data = await response.json();

    if (!data.success) {
        throw new Error("Location lookup failed.");
    }

    return {
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        city: data.city
    };
}

// Get weather

async function updateWeather() {

    try {

        // Get location once
        if (!currentLocation) {

            currentLocation =
                await getCurrentLocation();

            document.getElementById("location").textContent =
                currentLocation.city;
        }


        const latitude =
            currentLocation.latitude;

        const longitude =
            currentLocation.longitude;


        // Build weather API URL
        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,weather_code,is_day`;


        // Request weather
        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error("Weather request failed.");
        }


        const data =
            await response.json();


        // Extract weather information
        const temperature =
            data.current.temperature_2m;

        const weatherCode =
            data.current.weather_code;

        const isDay =
            data.current.is_day === 1;


        // Choose Paimon's response
        const category =
            getWeatherCategory(weatherCode);

        const timeOfDay = isDay ? "day" : "night";

        const message = getRandomMessage(
            weatherMessages[category][timeOfDay]
        );


        // Update the widget
        const icon = getWeatherIcon(category, isDay);
        const paimonImage = getPaimonImage(category);
        console.log("Weather icon:", icon);


        document.getElementById("temperature").textContent =
            `${temperature}°C`;

        document.getElementById("weather-icon").src =
            icon;

        document.querySelector(".paimon").src =
            paimonImage;

        document.getElementById("paimon-message").textContent =
            message;



        console.log(
            "Weather updated:",
            temperature
        );

    }

    catch (error) {

        console.error(
            "Weather update failed:",
            error
        );

    }
}

// Start the widget

updateWeather();


// Update every 15 minutes
setInterval(
    updateWeather,
    15 * 60 * 1000
);

//time and date logic
const timeMainEl = document.getElementById('time-main');
const timeSecondsEl = document.getElementById('time-seconds');
const dateEl = document.getElementById('date');

const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
});

function partsToMainAndSeconds(parts) {
    let main = '';
    let seconds = '';
    let dayPeriod = '';
    let pastMinute = false;

    for (const part of parts) {
        if (part.type === 'second') {
            seconds = part.value;
        } else if (part.type === 'dayPeriod') {
            dayPeriod = part.value;
        } else if (!pastMinute) {
            // hour, then the ":" literal, then minute
            main += part.value;
            if (part.type === 'minute') pastMinute = true;
        }
    }

    return { main: main.trim(), seconds, dayPeriod };
}

function render() {
    const now = new Date();
    const parts = timeFormatter.formatToParts(now);
    const { main, seconds, dayPeriod } = partsToMainAndSeconds(parts);

    timeMainEl.textContent = main;
    timeSecondsEl.textContent = `:${seconds}${dayPeriod ? ' ' + dayPeriod : ''}`;
    dateEl.textContent = dateFormatter.format(now);
}

render();
// Align updates to the start of each second rather than a raw 1000ms interval,
// so the display doesn't visibly drift out of sync over time.
function scheduleNextTick() {
    const now = new Date();
    const msToNextSecond = 1000 - now.getMilliseconds();
    setTimeout(() => {
        render();
        scheduleNextTick();
    }, msToNextSecond);
}
scheduleNextTick();