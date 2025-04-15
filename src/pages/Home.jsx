// pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeSection from "../components/WelcomeSection";
import ActionSection from "../components/ActionSection";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Lấy thông tin người dùng 
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
  
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);
  


  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <WelcomeSection user={user} />
          <ActionSection user={user} />
        </div>
      </main>

    </div>
  );
};

export default Home;