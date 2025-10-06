import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import LoginScreen from './components/LoginScreen';
import ProtectedRoute from './components/ProtectRoute';
import SidebarLayout from './components/Sidebar';
import EmployeePageTest from "./pages/EmployeePage/EmployeePageTest";
import LeaveRest from './pages/LeaveRest';
import Calendar from './pages/Calendar';
import UserManage from './pages/UserManage';
import Report from './pages/Report';
import ContractPageTest from "./pages/ContractPage/ContractPageTest";
import Tax from './pages/TaxPage';
import NotFound from './components/NotFound';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("user"));

  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginScreen setIsLoggedIn={setIsLoggedIn} />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><SidebarLayout /></ProtectedRoute>}>
          <Route index element={<EmployeePageTest />} />
          <Route path="leave" element={<LeaveRest />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="report" element={<Report />} />
          <Route path="contract" element={<ContractPageTest />} />
          <Route path="tax" element={<Tax />} />
          <Route path="dashboard" element={<UserManage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
