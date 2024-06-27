export type WeatherResponse = { data: WeatherEntry[] };

export type WeatherEntry = {
  x: string;
  y: Date;
};
