import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Leads from "./pages/Leads/Leads";
import PatientList from "./pages/PatientList/PatientList";
import Appointment from "./pages/Appointment/Appointment";
import Packages from "./pages/Packages/Packages";
import SessionTypes from "./pages/SessionTypes/SessionTypes";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./Routes/ProtectedRoutes";
import PublicRoute from "./Routes/PublicRoutes";

const PhysioOverview = () => <p>Physio Overview</p>;

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/patient-list" element={<PatientList />} />
          <Route path="/physio-overview" element={<PhysioOverview />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/sessionTypes" element={<SessionTypes />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
