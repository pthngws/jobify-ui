import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;