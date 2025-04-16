import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UIShowcase from "./pages/UIShowcase";
import MainLayout from "./layouts/MainLayout";
import PublicRoute from "./routes/PublicRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import JobList from "./pages/JobList";
import ApplicationList from "./pages/ApplicationList";
import Profile from "./pages/Profile";
import Company from "./pages/Company";
import ViewResume from "./pages/ViewResume";
import JobDetail from "./pages/JobDetail";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { FilterProvider } from "./contexts/FilterContext";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <FilterProvider>
      <Router>
        <div className={isDarkMode ? "dark" : ""}>
          <button
            onClick={toggleDarkMode}
            className="fixed bottom-4 right-4 flex items-center px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700 focus:ring-2 focus:ring-green-300 dark:focus:ring-green-800 transition duration-200 shadow-md text-sm"
          >
            {isDarkMode ? (
              <>
                <SunIcon className="w-4 h-4 mr-1" />
                Chế độ sáng
              </>
            ) : (
              <>
                <MoonIcon className="w-4 h-4 mr-1" />
                Chế độ tối
              </>
            )}
          </button>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/verify-otp"
              element={
                <PublicRoute>
                  <VerifyOTP />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />
            <Route element={<MainLayout />}>
            <Route path="/ui-showcase" element={<UIShowcase />} />

              <Route path="/home" element={<Home />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/edit-job/:id" element={<PostJob />} />
              <Route path="/my-jobs" element={<JobList />} />
              <Route path="/job/:jobId/applications" element={<ApplicationList />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/company" element={<Company />} />
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/view-resume" element={<ViewResume />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </FilterProvider>
  );
}

export default App;