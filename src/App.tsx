import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./components/layout/Dashboard";
import Expenses from "./components/Expenses/Expenses";
import Reports from "./components/Reports";
import { DarkModeProvider } from './components/common/DarkModeContext';
import Notifications from "./components/Notifications/index";
import Users from "./components/Users/Users";
import Login from "./components/auth";
import PrivateRoute from "./components/common/PrivateRoute";
import Harvests from "./components/Harvests/Harvests";

const App: React.FC = () => {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/harvests" element={<Harvests />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </Router>
    </DarkModeProvider>
  );
};

export default App;
