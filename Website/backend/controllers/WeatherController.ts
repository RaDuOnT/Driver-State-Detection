import { getWeatherData } from "../services/WeatherService";
import { Request, Response } from "express";

export const getWeather = async (req: Request, res: Response) => {
  try {
    const entries = await getWeatherData();
    res.json({ data: entries, status: "success" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
