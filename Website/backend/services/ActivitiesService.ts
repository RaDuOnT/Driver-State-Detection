import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import ActivitiesEntry from "../models/ActivitiesEntry";
import UserEntry from "../models/UserEntry";

export async function verify(req: Request, res: Response, next: any) {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(" ")[1];
    const checkIfBlacklisted = await ActivitiesEntry.findOne({ token: token });

    if (checkIfBlacklisted)
      return res
        .status(401)
        .json({ message: "Session has expired. Please login" });

    jwt.verify(
      token,
      process.env.JWT_SECRET || "",
      async (err, decoded: any) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Session has expired. Please login" });
        }

        const { id } = decoded;
        const user = await UserEntry.findById(id);

        if (!user) {
          return res
            .status(401)
            .json({ message: "Session has expired. Please login" });
        }

        const { email } = user;
        //@ts-ignore
        req.user = { email, id };
        next();
      }
    );
  } catch (err) {
      console.log('Mongo save error')
  }
}
