import express from "express";

import {
    add, getActivity, getActualActivity,
} from "../controllers/ActivitiesController";

const router = express.Router();

router.post("/", add);
router.get("/", getActivity);
router.get("/actual", getActualActivity);

export default router;
