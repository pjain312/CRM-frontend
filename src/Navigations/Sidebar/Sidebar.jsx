import React from "react";
import { useNavigationContext } from "../navigation.context";
import "./Sidebar.css";
import { menuItems } from "./sidebar.helper";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { clickedMenu, setClickedMenu } = useNavigationContext();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>PhysioCRM</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link 
            to={item.path} 
            key={item.id}
            style={{ textDecoration: 'none' }}
          >
            <div
              className={`nav-item ${clickedMenu === item.id ? "active" : ""}`}
              onClick={() => setClickedMenu(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
