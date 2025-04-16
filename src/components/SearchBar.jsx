import React from "react";
import { useFilter } from "../contexts/FilterContext";

const SearchBar = ({ onSearch }) => {
  const { filter, updateFilter } = useFilter();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    updateFilter({ [name]: value });
    onSearch(); // Reset pagination
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(); // Reset pagination
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 shadow-md py-6 px-4 sm:px-6 lg:px-8 mb-8 rounded-lg">
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="text"
            name="keyword"
            value={filter.keyword || ""}
            onChange={handleFilterChange}
            placeholder="Tìm kiếm công việc, công ty..."
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 transition-colors duration-200 text-base"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
            aria-label="Search jobs"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {[
            {
              name: "location",
              options: [
                { value: "", label: "Tất cả vị trí" },
                { value: "Hà Nội", label: "Hà Nội" },
                { value: "TP. Hồ Chí Minh", label: "TP. Hồ Chí Minh" },
                { value: "Đà Nẵng", label: "Đà Nẵng" },
                { value: "Cần Thơ", label: "Cần Thơ" },
                { value: "Hải Phòng", label: "Hải Phòng" },
              ],
            },
            {
              name: "category",
              options: [
                { value: "", label: "Tất cả danh mục" },
                { value: "IT", label: "Công nghệ thông tin" },
                { value: "Marketing", label: "Marketing" },
                { value: "Finance", label: "Tài chính" },
                { value: "Sales", label: "Bán hàng" },
                { value: "Engineering", label: "Kỹ thuật" },
                { value: "Design", label: "Thiết kế" },
                { value: "HR", label: "Nhân sự" },
                { value: "Other", label: "Khác" },
              ],
            },
            {
              name: "jobType",
              options: [
                { value: "", label: "Tất cả loại" },
                { value: "full-time", label: "Toàn thời gian" },
                { value: "part-time", label: "Bán thời gian" },
                { value: "remote", label: "Làm việc từ xa" },
                { value: "contract", label: "Hợp đồng" },
                { value: "internship", label: "Thực tập" },
              ],
            },
            {
              name: "experienceLevel",
              options: [
                { value: "", label: "Tất cả cấp độ" },
                { value: "intern", label: "Thực tập sinh" },
                { value: "fresher", label: "Mới ra trường" },
                { value: "junior", label: "Junior" },
                { value: "mid-level", label: "Trung cấp" },
                { value: "senior", label: "Cao cấp" },
              ],
            },
            {
              name: "salaryRange",
              options: [
                { value: "", label: "Tất cả lương" },
                { value: "0-5000000", label: "Dưới 5 triệu" },
                { value: "5000000-10000000", label: "5 - 10 triệu" },
                { value: "10000000-20000000", label: "10 - 20 triệu" },
                { value: "20000000-30000000", label: "20 - 30 triệu" },
                { value: "30000000-999999999", label: "Trên 30 triệu" },
              ],
            },
          ].map(({ name, options }) => (
            <select
              key={name}
              name={name}
              value={filter[name] || ""}
              onChange={handleFilterChange}
              className="flex-1 min-w-[150px] px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm"
            >
              {options.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;