// pages/Jobs.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import { useFilter } from "../contexts/FilterContext";

const Jobs = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5; // Số công việc mỗi trang
  const navigate = useNavigate();
  const { filter } = useFilter();

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
  

  // Giả lập danh sách công việc (thay bằng API sau)
  useEffect(() => {
    const mockJobs = [
      {
        id: 1,
        title: "Lập trình viên React",
        company: "Công ty ABC",
        location: "Hà Nội",
        salary: "20-30 triệu",
        type: "Toàn thời gian",
      },
      {
        id: 2,
        title: "Nhân viên kinh doanh",
        company: "Công ty XYZ",
        location: "TP. Hồ Chí Minh",
        salary: "15-25 triệu",
        type: "Bán thời gian",
      },
      {
        id: 3,
        title: "Kỹ sư DevOps",
        company: "Công ty DEF",
        location: "Đà Nẵng",
        salary: "25-35 triệu",
        type: "Toàn thời gian",
      },
      {
        id: 4,
        title: "Thiết kế UI/UX",
        company: "Công ty GHI",
        location: "Hà Nội",
        salary: "18-28 triệu",
        type: "Toàn thời gian",
      },
      {
        id: 5,
        title: "Quản lý dự án",
        company: "Công ty JKL",
        location: "TP. Hồ Chí Minh",
        salary: "30-40 triệu",
        type: "Toàn thời gian",
      },
      {
        id: 6,
        title: "Nhân viên marketing",
        company: "Công ty MNO",
        location: "Đà Nẵng",
        salary: "12-20 triệu",
        type: "Bán thời gian",
      },
    ];
    setJobs(mockJobs);
  }, []);

  // Lọc và phân trang
  const filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(filter.keyword.toLowerCase()) &&
      (filter.location === "" || job.location === filter.location) &&
      (filter.type === "" || job.type === filter.type)
    );
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  // Xử lý chỉnh sửa công việc (cho employer)
  const handleEditJob = (jobId) => {
    navigate(`/edit-job/${jobId}`); // Giả định có route /edit-job/:id
  };

  // Xử lý xóa công việc (cho employer)
  const handleDeleteJob = (jobId) => {
    if (window.confirm("Bạn có chắc muốn xóa công việc này?")) {
      setJobs(jobs.filter((job) => job.id !== jobId));
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">


      {/* Main Content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Job List */}
          <div>
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  userRole={user.role}
                  onEdit={handleEditJob}
                  onDelete={handleDeleteJob}
                />
              ))
            ) : (
              <div className="text-center text-gray-600 dark:text-gray-400">
                Không tìm thấy công việc nào.
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition duration-200"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition duration-200 ${
                    currentPage === page
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition duration-200"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default Jobs;