import {
  FaHome,
  FaUser,
  FaUsers,
  FaCog,
  FaCalendar,
  FaFolder,
  FaBookMedical,
} from "react-icons/fa";
import { getUser } from "../utils/auth";

export function getNavData() {
  const user = getUser();
  const isRoleId1 = user && user.RoleId === 1;

  const allNavItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: FaHome,
    },
    {
      title: "Leads",
      url: "/leads",
      icon: FaUser,
      requiresRoleId1: true,
    },
    {
      title: "Patient List",
      url: "/patient-list",
      icon: FaUsers,
    },
    // {
    //   title: "Physio Overview",
    //   url: "/physio-overview",
    //   icon: FaCog,
    // },
    {
      title: "Appointment",
      url: "/appointment",
      icon: FaCalendar,
    },
    {
      title: "Packages",
      url: "/packages",
      icon: FaFolder,
      requiresRoleId1: true,
    },
    {
      title: "Session Types",
      url: "/sessionTypes",
      icon: FaBookMedical,
      requiresRoleId1: true,
    },
  ];

  return allNavItems.filter((item) => !item.requiresRoleId1 || isRoleId1);
}

export default getNavData;
