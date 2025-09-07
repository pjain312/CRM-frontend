import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Navigations/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Leads from "./pages/Leads/Leads";
import PatientLists from "./pages/PatientLists/PatientLists";
import PhysioOverview from "./pages/PhysioOverview/PhysioOverview";
import Appointments from "./pages/Appointment/Appointments";
import { NavigationProvider } from "./Navigations/navigation.context";
import Navbar from "./Navigations/Navbar/Navbar";
import "./App.css";

function App() {
  return (
    <Router>
      <NavigationProvider>
        <div className="app">
          <Sidebar />
          <div className="content-wrapper">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/patient-lists" element={<PatientLists />} />
                <Route path="/physio-overview" element={<PhysioOverview />} />
                <Route path="/appointment" element={<Appointments />} />
              </Routes>
            </main>
          </div>
        </div>
      </NavigationProvider>
    </Router>
  );
}

export default App;
