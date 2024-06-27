import mongoose from "mongoose";

const ActivitiesSchema = new mongoose.Schema(
    {
        activitiesType: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
);

const ActivitiesEntry = mongoose.model("activities", ActivitiesSchema);

export default ActivitiesEntry;
