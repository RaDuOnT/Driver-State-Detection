import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { getActivities, getActualActivities } from "../../api/activities";
import "./tablePage.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

interface ActivityItem {
  _id: string;
  activitiesType: string;
  createdAt: string;
  __v: number;
}

interface ProcessedData {
  labels: string[];
  data: (string | number)[]; // Assuming the data can be a mix of strings and numbers
}

function processActivitiesData(activities: ActivityItem[]): ProcessedData {
  const timeLabels: string[] = [];
  const activityData: (string | number)[] = [];

  activities.forEach((activity) => {
    const activityTime = new Date(activity.createdAt);

    const timeLabel = activityTime.toLocaleTimeString();

    if (!timeLabels.includes(timeLabel)) {
      timeLabels.push(timeLabel);
    }

    const activityValue = mapActivityTypeToValue(activity.activitiesType);
    activityData.push(activityValue);
  });
  return { labels: timeLabels, data: activityData };
}

function mapActivityTypeToValue(activityType: string): string | number {
  switch (activityType) {
    case "asleep":
      return "1"; // Replace with the actual value you want to display
    case "looking_away":
      return "2";
    case "distracted":
      return "3";
    case "active":
      return "4";
    default:
      return "1";
  }
}
const TablePage = () => {
  const [activities, setActivities] = useState<any[] | null>(null);
  const [actualActivities, setActualActivities] = useState<any | null>(null);
  const [actualStatus, setActualStatus] = useState(1);

  useEffect(() => {
    getActivities().then((resp) => setActivities(resp?.data?.activitys));

    const fetchActivities = () => {
      getActualActivities().then((resp) => {
        const activities = resp?.data?.activities;
        if (activities) {
          const processedData = processActivitiesData(activities);
          const lastValue = activities[activities.length - 1];
          setActualStatus(
            lastValue.activitiesType === "asleep"
              ? 1
              : lastValue.activitiesType === "active"
              ? 3
              : 2
          );
          setActualActivities({
            labels: processedData.labels,
            datasets: [
              {
                label: "Activity Counts",
                data: processedData.data,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                tension: 0.4,
              },
            ],
          });
        }
      });
    };

    fetchActivities();

    const intervalId = setInterval(fetchActivities, 1000);

    // Clear the interval when the component`1 unmounts
    return () => clearInterval(intervalId);
  }, []);

  if (!activities || !actualActivities) {
    return <div>Loading...</div>;
    }

  const data = {
    labels: ["Distracted", "Asleep", "Active", "Looking Away"],
    datasets: [
      {
        label: "Number",
        data: [
          activities.find((item) => item?._id === "distracted")?.count || 0,
          activities.find((item) => item?._id === "asleep")?.count || 0,
          activities.find((item) => item?._id === "active")?.count || 0,
          activities.find((item) => item?._id === "looking_away")?.count || 0,
        ],
        backgroundColor: [
          "rgba(255, 159, 64, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(54, 162, 235, 0.8)",
        ],
        borderColor: [
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 4,
        cutout: "50%",
      },
    ],
  };

  let color = "#f00";
  switch (actualStatus) {
    case 2:
      color = "#ffd800";
      break;
    case 3:
      color = "#0f0";
  }
  return (
    <div className="tableLayout">
      <div className="status">
        <div className="notification">
          <div className="circle" style={{ backgroundColor: color }}></div>:
          Status
        </div>
      </div>
      <div className="w-full p-[30px] flex items-center flex-col">
        <div className="h-screen w-full flex justify-center mb-2 p-[50px] border-b-2 border-t-2">
          {" "}
          <div className=" w-full flex justify-center pt">
            <Doughnut data={data} options={{
              scales: {
             x: {
              display: true,
              title: {
                display: true,
                text: 'Number of times it happened in the last 24 hours',
                color: '#000000',
                font: {
                  family: 'Times',
                  size: 20,
                  style: 'normal',
                  lineHeight: 1.2
                },
                padding: {top: 30}
              }
            }}}
            }
             />
          </div>
        </div>
        <div className="w-8/12 flex items-center justify-center pt-[50px]">
          <Line
            data={actualActivities}
            options={{
              scales: {
                y: {
                  ticks: {
                    callback: function (value, index) {
                      const reversedMapping: { [key: string]: string } = {
                        "1": "asleep",
                        "2": "looking_away",
                        "3": "distracted",
                        "4": "active",
                      };

                      // Convert value to string and check if it exists in the mapping
                      const valueStr = value.toString();
                      return reversedMapping[valueStr] || "";
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TablePage;
