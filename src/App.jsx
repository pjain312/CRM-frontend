import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Leads from "./pages/Leads/Leads";
import PatientList from "./pages/PatientList/PatientList";
import PatientProfile from "./components/PatientProfile";
import Appointment from "./pages/Appointment/Appointment";
import Packages from "./pages/Packages/Packages";
import SessionTypes from "./pages/SessionTypes/SessionTypes";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./Routes/ProtectedRoutes";
import PublicRoute from "./Routes/PublicRoutes";
import RoleBasedRoute from "./Routes/RoleBasedRoute";

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
          <Route path="/leads" element={
            <RoleBasedRoute requiredRoleId={1}>
              <Leads />
            </RoleBasedRoute>
          } />
          <Route path="/patient-list" element={<PatientList />} />
          <Route path="/patient/:patientId" element={<PatientProfile />} />
          <Route path="/physio-overview" element={<PhysioOverview />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/packages" element={
            <RoleBasedRoute requiredRoleId={1}>
              <Packages />
            </RoleBasedRoute>
          } />
           <Route path="/sessionTypes" element={
            <RoleBasedRoute requiredRoleId={1}>
              <SessionTypes />
            </RoleBasedRoute>
          } />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
