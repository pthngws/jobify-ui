
import { useLocation, useNavigate } from "react-router-dom";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const ViewResume = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeUrl = location.state?.resumeUrl;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();



  if (!resumeUrl) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg font-semibold">
            Không tìm thấy CV để hiển thị!
          </p>
          <button
            onClick={() => navigate("/profile")}
            className="mt-4 px-5 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:shadow-sm transition-all duration-200"
          >
            Quay lại hồ sơ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:shadow-sm transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Tải CV
              </a>
            <div className="flex gap-3">

              
            </div>
          </div>
          <div className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-xl shadow-md overflow-hidden">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={resumeUrl}
                plugins={[defaultLayoutPluginInstance]}
                onDocumentLoad={() => console.log("PDF loaded")}
                onDocumentError={() => console.error("Không thể hiển thị CV.")}
              />
            </Worker>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewResume;