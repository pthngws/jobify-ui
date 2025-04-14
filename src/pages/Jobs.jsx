// pages/Jobs.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import { useFilter } from "../contexts/FilterContext";
import { getAllJobs } from "../services/jobService";

const Jobs = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAllJobs();
        if (response.data.success) {
          const formattedJobs = response.data.data.map((job) => ({
            id: job._id,
            title: job.title,
            company: job.company.name,
            location: job.location,
            salary: `${(job.salary.min / 1000000).toFixed(1)}-${(job.salary.max / 1000000).toFixed(1)} triệu`,
            type: job.jobType,
            createdAt: job.createdAt,
            closingDate: job.closingDate,
            companyAvatar: job.company.avatarUrl

          }));
          setJobs(formattedJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      }
    };

    fetchJobs();
  }, []);

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div>
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="text-center text-gray-600 dark:text-gray-400">
                Không tìm thấy công việc nào.
              </div>
            )}
          </div>

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