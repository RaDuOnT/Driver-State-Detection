import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";

type SidebarProps = {
  children?: React.ReactNode;
};

const Sidebar = ({ children }: SidebarProps) => {
  return (
    <div className="Page_Container">
      <div className="NavContainer">
        <div className="NavButton">
          <Link to="/" className="NavButton">
            Video
          </Link>
        </div>
        <div className="NavButton">
          <Link to="/tabel" className="NavButton">
            Tabel
          </Link>
        </div>
        <div className="NavButton">
          <Link to="/" className="NavButton">
            weather
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Sidebar;
