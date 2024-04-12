import axios from "axios";

export const fetchBackgroundImage = async () => {
  try {
    const response = await fetch("/api/background-image");
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error("Error fetching background image from API:", error);
    return "/images/fallback-bg.jpg";
  }
};

export const fetchLocationData = async () => {
  try {
    const response = await axios.get("https://ipapi.co/json/");
    return response.data;
  } catch (error) {
    console.error("Error fetching location data:", error);
    return null;
  }
};

export const fetchWeatherData = async (latitude, longitude) => {
  try {
    const response = await axios.get("/api/accuw");
    const { accuweatherApiKey } = response.data;

    const locationResponse = await axios.get(
      `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${accuweatherApiKey}&q=${latitude},${longitude}`
    );
    const locationKey = locationResponse.data.Key;

    const weatherResponse = await axios.get(
      `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${accuweatherApiKey}`
    );
    return weatherResponse.data[0];
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};
