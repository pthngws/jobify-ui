import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Logic lấy user từ localStorage (giống Profile và ViewResume)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Lỗi phân tích user:", err);
        handleLogout();
      }
    } else {
      handleLogout();
    }
  }, []);

  // Hàm logout chung
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col transition-all duration-300">
      <Header user={user} onLogout={handleLogout} />
      <main className="mt-10 flex-grow">
        <Outlet /> {/* Nơi render các page con như Profile, ViewResume */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;