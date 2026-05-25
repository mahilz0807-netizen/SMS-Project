import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Dashboard from "./pages/dashboard/Dashboard";

import AddStudent from "./pages/students/AddStudent";
import StudentList from "./pages/students/StudentList";
import DropoutStudents from "./pages/students/DropoutStudents";

import Courses from "./pages/courses/Courses";

import Attendance from "./pages/attendance/Attendance";
import Results from "./pages/results/Results";
import Notifications from "./pages/notification/Notifications";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="students/form" element={<AddStudent />} />
          <Route path="students/records" element={<StudentList />} />
          <Route path="students/dropout" element={<DropoutStudents />} />

          <Route path="course" element={<Courses />} />

          <Route path="attendance" element={<Attendance />} />
          <Route path="results" element={<Results />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}