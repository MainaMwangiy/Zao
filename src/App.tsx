import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./components/layout/Dashboard";
import Reports from "./components/Reports";
import { DarkModeProvider } from './hooks/DarkModeContext';
import Notifications from "./components/Notifications/index";
import Login from "./components/auth";
import PrivateRoute from "./hooks/PrivateRoute";
import Profile from "./components/Profile/Profile";
import Incomes from "./components/Bills/Incomes";
import Projects from "./components/Projects/Projects";
import ModulePage from "./components/Form/page";
import { usersConfig } from "./config/users/config";
import { harvestsConfig } from "./config/harvests/config";
import { expensesConfig } from "./config/expenses/config";
import { SubmissionProvider } from "./components/Form/context";
import { transactionsConfig } from "./config/transactions/config";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <DarkModeProvider>
        <SubmissionProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/expenses" element={<ModulePage config={expensesConfig} />} />
                  <Route path="/users" element={<ModulePage config={usersConfig} showAddNew={true} />} />
                  <Route path="/harvests" element={<ModulePage config={harvestsConfig} />} />
                  <Route path="/transactions" element={<ModulePage config={transactionsConfig} showAddNew={true} />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/my-bills" element={<Incomes />} />
                  <Route path="/projects/:projectId" element={<Projects />} />
                </Route>
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Route>
            </Routes>
          </Router>
        </SubmissionProvider>
      </DarkModeProvider>
    </Provider>
  );
};

export default App;
