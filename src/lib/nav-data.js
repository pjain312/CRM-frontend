import { FaHome, FaUser, FaUsers, FaCog, FaCalendar } from "react-icons/fa";

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
  ],
};

export default data;
