import React from "react";
import "./videoPage.css";

const videoPage = () => {
  return (
    <div className="Page_Container">
      <iframe className="Video_Feed" src="http://localhost:5000"></iframe>
    </div>
  );
};

export default videoPage;
