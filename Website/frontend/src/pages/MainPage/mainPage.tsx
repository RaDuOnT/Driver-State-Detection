import React from "react";
import "./mainPage.css";

import TablePage from "../TablePage/TablePage";
import VideoPage from "../VideoPage/videoPage";

const mainPage = () => {
  return (
    <div className="MainPage">
      <VideoPage />
      <TablePage />
    </div>
  );
};

export default mainPage;
