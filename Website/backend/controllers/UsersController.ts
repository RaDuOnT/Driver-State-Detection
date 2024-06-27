import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import ActivitiesEntry from "../models/ActivitiesEntry";
import {
  getUserEntryById,
  getByEmail,
} from "../services/UserEntryService";

type Payload = {
  id: string;
};

const auth = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are mandatory" }).end();
      return;
    }

    const user = await getByEmail(email);

    if (!user) {
      res.status(400).json({ error: "Email or password are incorrect" }).end();
      return;
    }

    if (password !== user.password) {
      res.status(400).json({ error: "Email or password are incorrect" }).end();
      return
    }

    //@ts-ignore
    const token = user.generateAccessJWT();
    res.status(200).json({ token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

const currentUser = async (req: Request, res: Response) => {
  const defaultReturnObject = { authenticated: false, user: null };
  try {
    const token = String(req?.headers?.authorization?.replace("Bearer ", ""));
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as Payload;
    const user = await getUserEntryById(decoded.id);

    if (!user) {
      res.status(400).json(defaultReturnObject);
      return;
    }

    const { email, name, createdAt, isActive } = user;
    res.status(200).json({
      authenticated: true,
      user: { email, name, createdAt, isActive },
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(400).json(defaultReturnObject);
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.sendStatus(204);
    const token = String(req?.headers?.authorization?.replace("Bearer ", ""));
    const checkIfBlacklisted = await ActivitiesEntry.findOne({ token });

    if (checkIfBlacklisted) return res.sendStatus(204);

    const newBlacklist = new ActivitiesEntry({
      token,
    });
    await newBlacklist.save();
    res.setHeader("Clear-Site-Data", '"localstorage"');
    res.status(200).json({ message: "You are logged out!" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
  res.end();
};

export { currentUser, auth, logout };
