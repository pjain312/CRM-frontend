import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Leads from "./pages/Leads/Leads";
import PatientList from "./pages/PatientList/PatientList";
import Appointment from "./pages/Appointment/Appointment";
import Packages from "./pages/Packages/Packages";
import SessionTypes from "./pages/SessionTypes/SessionTypes";
import Dashboard from "./pages/Dashboard/Dashboard";

const PhysioOverview = () => <p>Physio Overview</p>;

function App() {
  return (
    <Routes>
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
    </Routes>
  );
}

export default App;
