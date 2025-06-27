import React from "react";
import "./Navbar.css";
import { FaBars } from "react-icons/fa";
import { useNavigationContext } from "../navigation.context";
import { menuItems } from "../Sidebar/sidebar.helper";

const Navbar = () => {
  const { clickedMenu } = useNavigationContext();
  return (
    <div className="navbar">
      <div className="navbar-content">
        <div className="navbar-icon">
          <FaBars />
        </div>
        <h1 className="navbar-title">{menuItems[clickedMenu - 1].label}</h1>
        <div className="navbar-actions">
          <div className="navbar-profile">
            <div className="profile-avatar">PJ</div>
            <span className="profile-name">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
