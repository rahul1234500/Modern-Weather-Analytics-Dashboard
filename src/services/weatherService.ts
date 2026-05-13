export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    conditionCode: number;
    time: string;
    uvIndex: number;
    pressure: number;
  };
  hourly: {
    time: string[];
    temp: number[];
    precipitation: number[];
  };
  daily: {
    time: string[];
    tempMax: number[];
    tempMin: number[];
    conditionCode: number[];
    sunrise: string[];
    sunset: string[];
  };
}

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export const getCondition = (code: number) => {
  const codes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    85: 'Slight snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail',
  };
  return codes[code] || 'Unknown';
};

export async function searchLocations(query: string): Promise<Location[]> {
  if (query.length < 2) return [];
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
  const data = await res.json();
  return data.results || [];
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure,uv_index',
    hourly: 'temperature_2m,precipitation_probability',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset',
    timezone: 'auto',
    past_days: '7'
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  const data = await res.json();

  return {
    current: {
      temp: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      condition: getCondition(data.current.weather_code),
      conditionCode: data.current.weather_code,
      time: data.current.time,
      uvIndex: data.current.uv_index,
      pressure: data.current.surface_pressure,
    },
    hourly: {
      time: data.hourly.time,
      temp: data.hourly.temperature_2m,
      precipitation: data.hourly.precipitation_probability,
    },
    daily: {
      time: data.daily.time,
      tempMax: data.daily.temperature_2m_max,
      tempMin: data.daily.temperature_2m_min,
      conditionCode: data.daily.weather_code,
      sunrise: data.daily.sunrise,
      sunset: data.daily.sunset,
    }
  };
}
