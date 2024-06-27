import {Request, Response} from "express";
import ActivitiesEntry from "../models/ActivitiesEntry";
import { PipelineStage } from "mongoose";

const getTrueKey = ({obj}: { obj: { asleep: boolean, looking_away: boolean, distracted: boolean } }) => {
    for (const key in obj) {
        // @ts-ignore
        if (obj[key]) return key;
    }
    return undefined;
};
export const add = async (req: Request, res: Response) => {
    const { body } = req;
    const getFirstTruthyItem = getTrueKey({ obj: body });

    try {
        // Get the most recent activity
        const latestActivity = await ActivitiesEntry.findOne().sort({ createdAt: -1 });

        const now = new Date().getTime(); // Get current time as a timestamp

// Check if the latest activity was created more than 1 second ago
        if (!latestActivity || now - new Date(latestActivity.createdAt).getTime() > 1000) {
            const newActivity = new ActivitiesEntry({
                activitiesType: getFirstTruthyItem || 'active',
                createdAt: new Date()
            });

            await newActivity.save();
            res.status(200).send({ message: "Activity added successfully." });
        } else {
            res.status(200).send({ message: "Activity not added. Last activity was less than 1 second ago." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while adding the activity." });
    }
};

export const getActivity = async (req: Request, res: Response) => {
    const pipeline = [
        {
            // Filter documents from the last 24 hours
            $match: {
                createdAt: { $gte: new Date(new Date().getTime() - (24 * 60 * 60 * 1000)) }
            }
        },
        {
            // Group by activitiesType and count occurrences
            $group: {
                _id: "$activitiesType",
                count: { $sum: 1 }
            }
        }
    ];

// Execute the aggregation pipeline
    const activityInLast24H = await ActivitiesEntry.aggregate(pipeline);
    res.status(200).send({data: {activitys: activityInLast24H}});
};

export const getActualActivity = async (req: Request, res: Response) => {
    const thirtyMinutesAgo = new Date(new Date().getTime() - (5 * 60 * 1000)); // 30 minutes in milliseconds

    const pipeline30M: PipelineStage[] = [
        {
            $match: {
                createdAt: { $gte: thirtyMinutesAgo }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                    hour: { $hour: "$createdAt" },
                    minute: { $minute: "$createdAt" },
                    tenSecondInterval: {
                        $subtract: [
                            { $second: "$createdAt" },
                            { $mod: [{ $second: "$createdAt"}, 10] }
                        ]
                    }
                },
                doc: { $first: "$$ROOT" }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
                "_id.day": 1,
                "_id.hour": 1,
                "_id.minute": 1,
                "_id.tenSecondInterval": 1
            }
        },
        {
            $replaceRoot: { newRoot: "$doc" }
        }
    ];

    const activityInLast30M = await ActivitiesEntry.aggregate(pipeline30M);
    res.status(200).send({ data: { activities: activityInLast30M } });
};
