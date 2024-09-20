import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./components/layout/Dashboard";
import Ecommerce from "./components/Ecommerce";
import Reports from "./components/Reports";
import { DarkModeProvider } from './components/common/DarkModeContext';
import Notifications from "./components/Notifications/index";
import Users from "./components/Users/Users";
import Login from "./components/auth";
import PrivateRoute from "./components/common/PrivateRoute";

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
              <Route path="/ecommerce" element={<Ecommerce />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
};

export default App;
