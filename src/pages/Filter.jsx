import React, { useState } from "react";
import Search from "../assets/Vector.png";
import JobType from "../assets/jobType.png";
import Location from "../assets/Location.png";
import dropDown from "../assets/Hicon/Linear/Down.png";

const Filter = ({ onChange = () => {} }) => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState(50);
  const [salaryDirty, setSalaryDirty] = useState(false);
  const [remote, setRemote] = useState(false);

  const emit = (next = {}) => {
    onChange({
      search,
      location,
      jobType,
      minSalary: salaryDirty ? salary * 1000 : undefined,
      maxSalary: salaryDirty ? (salary + 30) * 1000 : undefined,
      remote,
      ...next,
    });
  };

  return (
    <div className="bg-white py-3 px-2 sm:px-4 mx-2 sm:mx-4 rounded-lg shadow-sm border border-gray-200">
      {/* Mobile Layout - Stacked */}
      <div className="flex flex-col space-y-4 lg:hidden">
        {/* Search */}
        <div className="flex gap-2 items-center bg-gray-50 rounded-lg p-3">
          <img src={Search} alt="search" className="w-4 h-4 flex-shrink-0" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); emit({ search: e.target.value }); }}
            onKeyDown={(e) => { if (e.key === "Enter") { emit(); } }}
            placeholder="Search By Job Title, Role"
            aria-label="Search by job title or role"
            className="flex-1 bg-transparent outline-none text-sm text-[#686868] placeholder-[#BEBEBE]"
          />
        </div>

        {/* Filter Row 1 */}
        <div className="flex gap-3">
          {/* Location */}
          <div className="flex-1 relative">
            <div className="flex gap-2 items-center bg-gray-50 rounded-lg p-3">
              <img src={Location} alt="location" className="w-4 h-4 flex-shrink-0" />
              <select
                value={location}
                onChange={(e) => { setLocation(e.target.value); emit({ location: e.target.value }); }}
                className="flex-1 bg-transparent outline-none text-sm text-[#686868] appearance-none"
                style={{ WebkitAppearance: "none", MozAppearance: "none" }}
              >
                <option value="">Location</option>
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi</option>
                <option value="bengaluru">Bengaluru</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="chennai">Chennai</option>
                <option value="kolkata">Kolkata</option>
                <option value="pune">Pune</option>
                <option value="ahmedabad">Ahmedabad</option>
                <option value="jaipur">Jaipur</option>
                <option value="surat">Surat</option>
                <option value="noida">Noida</option>
                <option value="greater noida">Greater Noida</option>
                <option value="gurugram">Gurugram</option>
                <option value="gurgaon">Gurgaon</option>
                <option value="chandigarh">Chandigarh</option>
                <option value="indore">Indore</option>
                <option value="nagpur">Nagpur</option>
                <option value="lucknow">Lucknow</option>
                <option value="kochi">Kochi</option>
                <option value="coimbatore">Coimbatore</option>
                <option value="visakhapatnam">Visakhapatnam</option>
                <option value="thane">Thane</option>
                <option value="bhopal">Bhopal</option>
                <option value="patna">Patna</option>
                <option value="vadodara">Vadodara</option>
                <option value="ghaziabad">Ghaziabad</option>
                <option value="faridabad">Faridabad</option>
                <option value="rajkot">Rajkot</option>
                <option value="kanpur">Kanpur</option>
                <option value="guwahati">Guwahati</option>
                <option value="bhubaneswar">Bhubaneswar</option>
                <option value="mysuru">Mysuru</option>
                <option value="mangaluru">Mangaluru</option>
                <option value="thiruvananthapuram">Thiruvananthapuram</option>
                <option value="vijayawada">Vijayawada</option>
                <option value="ranchi">Ranchi</option>
                <option value="dehradun">Dehradun</option>
                <option value="panaji">Panaji</option>
                <option value="remote">Remote</option>
              </select>
              <img src={dropDown} alt="dropdown" className="w-3 h-3 pointer-events-none" />
            </div>
          </div>

          {/* Job Type */}
          <div className="flex-1 relative">
            <div className="flex gap-2 items-center bg-gray-50 rounded-lg p-3">
              <img src={JobType} alt="job type" className="w-4 h-4 flex-shrink-0" />
              <select
                value={jobType}
                onChange={(e) => { setJobType(e.target.value); emit({ jobType: e.target.value }); }}
                className="flex-1 bg-transparent outline-none text-sm text-[#686868] appearance-none"
                style={{ WebkitAppearance: "none", MozAppearance: "none" }}
              >
                <option value="">Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
              <img src={dropDown} alt="dropdown" className="w-3 h-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Row 2 */}
        <div className="space-y-3">
          {/* Salary */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between text-sm text-[#686868] mb-2">
              <span>Salary Per Month</span>
              <span className="text-sm font-medium text-[#333]">
                ₹{salary}k - ₹{salary + 30}k
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={salary}
              onChange={(e) => { const v = Number(e.target.value); setSalaryDirty(true); setSalary(v); emit({ minSalary: v * 1000, maxSalary: (v + 30) * 1000 }); }}
              className="w-full accent-purple-600 h-2"
            />
          </div>

          {/* Remote toggle */}
          <div className="flex items-center justify-center">
            <label className="text-sm text-[#686868] flex items-center gap-2 bg-gray-50 rounded-lg p-3 w-full justify-center">
              <input 
                type="checkbox" 
                checked={remote} 
                onChange={(e) => { const checked = e.target.checked; setRemote(checked); emit({ remote: checked, location: checked ? "" : location }); }} 
                className="w-4 h-4 accent-purple-600"
              />
              Remote only
            </label>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden lg:flex flex-wrap justify-around items-center gap-3 sm:gap-4">
        {/* Search */}
        <div className="flex justify-center gap-2 items-center">
          <img src={Search} alt="search" className="w-4 h-4" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); emit({ search: e.target.value }); }}
            onKeyDown={(e) => { if (e.key === "Enter") { emit(); } }}
            placeholder="Search By Job Title, Role"
            aria-label="Search by job title or role"
            className="w-[200px] md:w-[260px] lg:w-[320px] bg-transparent outline-none text-sm text-[#686868] placeholder-[#BEBEBE] px-0"
          />
        </div>

        {/* Location */}
        <div className="flex items-center justify-between gap-4 border-l border-gray-300 pl-4 h-full relative min-w-[240px]">
          <div className="flex gap-2 items-center">
            <img src={Location} alt="location" className="w-4 h-4" />
            <select
              value={location}
              onChange={(e) => { setLocation(e.target.value); emit({ location: e.target.value }); }}
              className="bg-transparent outline-none text-sm text-[#686868] pr-8 appearance-none"
              style={{ WebkitAppearance: "none", MozAppearance: "none" }}
            >
              <option value="">Preferred Location</option>
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="bengaluru">Bengaluru</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="chennai">Chennai</option>
              <option value="kolkata">Kolkata</option>
              <option value="pune">Pune</option>
              <option value="ahmedabad">Ahmedabad</option>
              <option value="jaipur">Jaipur</option>
              <option value="surat">Surat</option>
              <option value="noida">Noida</option>
              <option value="greater noida">Greater Noida</option>
              <option value="gurugram">Gurugram</option>
              <option value="gurgaon">Gurgaon</option>
              <option value="chandigarh">Chandigarh</option>
              <option value="indore">Indore</option>
              <option value="nagpur">Nagpur</option>
              <option value="lucknow">Lucknow</option>
              <option value="kochi">Kochi</option>
              <option value="coimbatore">Coimbatore</option>
              <option value="visakhapatnam">Visakhapatnam</option>
              <option value="thane">Thane</option>
              <option value="bhopal">Bhopal</option>
              <option value="patna">Patna</option>
              <option value="vadodara">Vadodara</option>
              <option value="ghaziabad">Ghaziabad</option>
              <option value="faridabad">Faridabad</option>
              <option value="rajkot">Rajkot</option>
              <option value="kanpur">Kanpur</option>
              <option value="guwahati">Guwahati</option>
              <option value="bhubaneswar">Bhubaneswar</option>
              <option value="mysuru">Mysuru</option>
              <option value="mangaluru">Mangaluru</option>
              <option value="thiruvananthapuram">Thiruvananthapuram</option>
              <option value="vijayawada">Vijayawada</option>
              <option value="ranchi">Ranchi</option>
              <option value="dehradun">Dehradun</option>
              <option value="panaji">Panaji</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          <img src={dropDown} alt="dropdown" className="w-3 h-3 absolute right-2 pointer-events-none" />
        </div>

        {/* Job Type */}
        <div className="flex items-center justify-between gap-4 border-l border-gray-300 pl-4 h-full relative min-w-[220px]">
          <div className="flex gap-2 items-center">
            <img src={JobType} alt="job type" className="w-4 h-4" />
            <select
              value={jobType}
              onChange={(e) => { setJobType(e.target.value); emit({ jobType: e.target.value }); }}
              className="bg-transparent outline-none text-sm text-[#686868] pr-8 appearance-none"
              style={{ WebkitAppearance: "none", MozAppearance: "none" }}
            >
              <option value="">Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <img src={dropDown} alt="dropdown" className="w-3 h-3 absolute right-2 pointer-events-none" />
        </div>

        {/* Salary */}
        <div className="flex flex-col justify-between gap-2 border-l border-gray-300 pl-4 h-full min-w-[220px]">
          <div className="flex justify-between text-sm text-[#686868]">
            <span>Salary Per Month</span>
            <span className="text-sm font-medium text-[#333]">
              ₹{salary}k - ₹{salary + 30}k
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={salary}
            onChange={(e) => { const v = Number(e.target.value); setSalaryDirty(true); setSalary(v); emit({ minSalary: v * 1000, maxSalary: (v + 30) * 1000 }); }}
            className="w-48 sm:w-56 accent-purple-600"
          />
        </div>

        {/* Remote toggle */}
        <div className="flex items-center justify-between gap-2 border-l border-gray-300 pl-4 h-full">
          <label className="text-sm text-[#686868] flex items-center gap-2">
            <input type="checkbox" checked={remote} onChange={(e) => { const checked = e.target.checked; setRemote(checked); emit({ remote: checked, location: checked ? "" : location }); }} />
            Remote only
          </label>
        </div>
      </div>
    </div>
  );
};

export default Filter;
