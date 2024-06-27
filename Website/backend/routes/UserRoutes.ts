import express from "express";

import {
  auth,
  currentUser,
  logout,
} from "../controllers/UsersController";
import { verify } from "../services/ActivitiesService";

const router = express.Router();

router.post("/auth", auth);
router.post("/logout", logout);
router.get("/me", verify, currentUser);

export default router;
