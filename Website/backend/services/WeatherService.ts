import { fetchWeatherApi } from "openmeteo";

export const getWeatherData = async () => {
  const params = {
    latitude: 44.4268,
    longitude: 26.1025,
    daily: "temperature_2m_mean",
  };

  const URL = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(URL, params);

  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  const response = responses[0];

  const utcOffsetSeconds = response.utcOffsetSeconds();

  const daily = response.daily()!;

  const weatherData = range(
    Number(daily.time()),
    Number(daily.timeEnd()),
    daily.interval()
  ).map((t, index) => ({
    x: daily.variables(0)!.valuesArray()![index],
    y: new Date((t + utcOffsetSeconds) * 1000),
  }));

  return weatherData;
};
