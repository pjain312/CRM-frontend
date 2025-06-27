import { FaHome, FaUser, FaUsers, FaCog, FaCalendar } from "react-icons/fa";

export const menuItems = [
    { id: 1, label: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { id: 2, label: "Leads", icon: <FaUser />, path: "/leads" },
    { id: 3, label: "Patient Lists", icon: <FaUsers />, path: "/patient-lists" },
    { id: 4, label: "Physio Overview", icon: <FaCog />, path: "/physio-overview" },
    { id: 5, label: "Appointment", icon: <FaCalendar />, path: "/appointment" },
  ];