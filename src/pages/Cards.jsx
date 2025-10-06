import React, { useEffect, useState } from "react";
import frame from "../assets/Frame.png";
import img from "../assets/Frame_2.png";
import img_1 from "../assets/Frame_3.png";
import image from "../assets/image.png";
import { Link } from "react-router-dom";
import api from "../../axios";

// Helper function to format createdAt → "x hours ago"
const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  return "Just now";
};

const Cards = ({ filters = {} }) => {
  const [data, setData] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search || "");

  // Debounce search to reduce cancelled requests and flicker
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search || ""), 300);
    return () => clearTimeout(t);
  }, [filters.search]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchJobs = async () => {
      try {
        const params = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (filters.jobType) params.jobType = filters.jobType;
        if (filters.location) params.location = filters.location;
        if (typeof filters.minSalary !== 'undefined') params.minSalary = filters.minSalary;
        if (typeof filters.maxSalary !== 'undefined') params.maxSalary = filters.maxSalary;
        if (filters.remote) params.remote = true;

        const res = await api.get(`/api/v1/jobs`, {
          signal: controller.signal,
          withCredentials: true,
          params,
        });
        setData(res.data.jobs || []);
        console.log("Fetched Jobs:", res.data.jobs);
      } catch (err) {
        if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError" || err?.name === "AbortError") return;
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
    return () => controller.abort();
  }, [debouncedSearch, filters.jobType, filters.location, filters.minSalary, filters.maxSalary, filters.remote]);

  const visibleData = (() => {
    if (!debouncedSearch) return data;
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return data;

    // If there are exact title matches, prefer showing only those
    const exactMatches = data.filter((job) =>
      typeof job.title === "string" && job.title.trim().toLowerCase() === term
    );
    if (exactMatches.length > 0) return exactMatches;

    // Otherwise, show items where title or jobType contains the term
    return data.filter((job) => {
      const title = typeof job.title === "string" ? job.title.toLowerCase() : "";
      const role = typeof job.jobType === "string" ? job.jobType.toLowerCase() : "";
      return title.includes(term) || role.includes(term);
    });
  })();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-3 px-2 sm:px-4 my-6 sm:my-10 lg:my-16 mx-2 sm:mx-4 lg:mx-10">
      {visibleData.length === 0 && (
        <div className="col-span-full text-center text-gray-600 py-8">
          Data not available
        </div>
      )}
      {visibleData.map((job) => (
        <div
          key={job._id}
          className="w-full min-h-[400px] sm:min-h-[420px] lg:min-h-[450px] rounded-xl overflow-hidden bg-white flex flex-col gap-3 sm:gap-4 shadow-[0_0_14px_0_rgba(211,211,211,0.15)] hover:shadow-[0_0_20px_0_rgba(211,211,211,0.25)] transition-shadow duration-300"
        >
          {/* --- Card Header --- */}
          <div className="flex justify-between items-start px-3 py-3">
            <img
              src={image}
              className="object-contain shadow-[0_0_10.25px_0_rgba(148,148,148,0.25)] rounded-md px-1 py-2 w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0"
              alt="company logo"
            />
            <button className="bg-[#B0D9FF] rounded-full text-center px-3 sm:px-6 h-8 sm:h-10 text-xs sm:text-sm font-medium text-gray-700">
              {getTimeAgo(job.createdAt)}
            </button>
          </div>

          {/* --- Job Info --- */}
          <div className="flex flex-col gap-3 sm:gap-4 justify-between flex-1">
            <h3 className="font-bold text-lg sm:text-xl px-3 line-clamp-2">{job.title || "Not available"}</h3>
            
            {/* Job Details Grid */}
            <div className="px-3 space-y-2 sm:space-y-3">
              <div className="flex gap-2 items-center">
                <img src={frame} alt="exp icon" className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">1-3 yr Exp</span>
              </div>

              <div className="flex gap-2 items-center">
                <img src={img} alt="work type icon" className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">{job.jobType || "Not available"}</span>
              </div>

              <div className="flex gap-2 items-center">
                <img src={img_1} alt="location icon" className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">
                  {job.locations && job.locations.length > 0 
                    ? job.locations.length > 2 
                      ? `${job.locations.slice(0, 2).join(", ")} +${job.locations.length - 2} more`
                      : job.locations.join(", ")
                    : job.location || "Not available"}
                </span>
              </div>

              <div className="flex gap-2 items-center">
                <img src={img_1} alt="salary icon" className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">
                  {typeof job?.salaryRange?.min === "number" && typeof job?.salaryRange?.max === "number"
                    ? `${job.salaryRange.min / 1000}K - ${job.salaryRange.max / 1000}K`
                    : "Not available"}
                </span>
              </div>
            </div>
          </div>

          {/* --- Job Description (Short) --- */}
          <div className="px-3 flex-1">
            <ul className="list-disc pl-4 sm:pl-6 text-gray-800 text-xs sm:text-sm space-y-1">
              {job.requirements && job.requirements.length > 0 ? (
                job.requirements.slice(0, 2).map((req, idx) => (
                  <li key={idx} className="line-clamp-2">{req}</li>
                ))
              ) : (
                <li className="list-none text-gray-500">Not available</li>
              )}
            </ul>
          </div>

          {/* --- Apply Button --- */}
          <div className="flex gap-3 justify-center items-center py-3 px-4 mt-auto">
            <Link 
              to={`/jobs/${job._id}`} 
              className="w-full text-center rounded-md bg-[#00AAFF] text-white font-medium py-2.5 sm:py-3 text-sm sm:text-base hover:bg-[#0099E6] transition-colors duration-200"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
