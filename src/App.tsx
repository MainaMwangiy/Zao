import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./components/layout/Dashboard";
import Expenses from "./components/Expenses/Expenses";
import Reports from "./components/Reports";
import { DarkModeProvider } from './hooks/DarkModeContext';
import Notifications from "./components/Notifications/index";
import Users from "./components/Users/Users";
import Login from "./components/auth";
import PrivateRoute from "./hooks/PrivateRoute";
import Harvests from "./components/Harvests/Harvests";
import Transactions from "./components/Transactions/Transactions";
import Profile from "./components/Profile/Profile";
import Incomes from "./components/Bills/Incomes";
import Projects from "./components/Projects/Projects";
import ModulePage from "./components/Form/page";
import { expensesConfig } from "./config/expenses/config";

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
              <Route path="/expenses" element={<ModulePage config={expensesConfig} showAddNew={false} />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/harvests" element={<Harvests />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-bills" element={<Incomes />} />
              <Route path="/projects/:projectId" element={<Projects />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </Router>
    </DarkModeProvider>
  );
};

export default App;
