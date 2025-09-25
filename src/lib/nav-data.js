import { FaHome, FaUser, FaUsers, FaCog, FaCalendar, FaFolder, FaBookMedical } from "react-icons/fa";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: FaHome,
    },
    {
      title: "Leads",
      url: "/leads",
      icon: FaUser,
    },
    {
      title: "Patient List",
      url: "/patient-list",
      icon: FaUsers,
    },
    {
      title: "Physio Overview",
      url: "/physio-overview",
      icon: FaCog,
    },
    {
      title: "Appointment",
      url: "/appointment",
      icon: FaCalendar,
    },
    {
      title: "Packages",
      url: "/packages",
      icon: FaFolder,
    },
    {
      title: "Session Types",
      url: "/sessionTypes",
      icon: FaBookMedical,
    },
  ],
};

export default data;
