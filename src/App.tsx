import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Ecommerce from "./components/Ecommerce";
import Reports from "./components/Reports";
import Notifications from "./components/Notifications";
import { DarkModeProvider } from './components/DarkModeContext';

const App: React.FC = () => {
  return (
    <DarkModeProvider>
    <Router>
      <MainLayout>
        <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/ecommerce" element={<Ecommerce />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </MainLayout>
    </Router>
    </DarkModeProvider>
  );
};

export default App;
