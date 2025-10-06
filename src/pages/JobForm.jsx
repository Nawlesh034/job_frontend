// JobForm.jsx
import React, { useState } from "react";
import api from "../../axios";
import { useForm } from "react-hook-form";

/**
 * JobForm - React Hook Form implementation for "Create Job Opening" modal
 *
 * Fields:
 * - jobTitle (text)
 * - companyName (text)
 * - location (select)
 * - jobType (select)
 * - salaryMin (number)
 * - salaryMax (number)
 * - applicationDeadline (date)
 * - jobDescription (textarea)
 *
 * Usage:
 * <JobForm onPublish={(data) => console.log("publish", data)} onSaveDraft={(data) => console.log("draft", data)} />
 */

export default function JobForm({ onPublish = () => {}, onSaveDraft = () => {} }) {
  const [selectedLocations, setSelectedLocations] = useState([]);
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      jobTitle: "",
      companyName: "",
      location: "",
      locations: [], // New field for multiple locations
      jobType: "",
      salaryMin: "",
      salaryMax: "",
      applicationDeadline: "",
      jobDescription: "",
    },
  });

  const locations = [
    { value: "remote", label: "Remote" },
    { value: "mumbai", label: "Mumbai" },
    { value: "bengaluru", label: "Bengaluru" },
    { value: "hyderabad", label: "Hyderabad" },
    { value: "delhi", label: "Delhi" },
    { value: "pune", label: "Pune" },
    { value: "chennai", label: "Chennai" },
    { value: "kolkata", label: "Kolkata" },
    { value: "gurgaon", label: "Gurgaon" },
    { value: "noida", label: "Noida" },
    { value: "ahmedabad", label: "Ahmedabad" },
    { value: "jaipur", label: "Jaipur" },
  ];

  // Must match backend enum: ["Full-time", "Part-time", "Contract", "Internship"]
  const jobTypes = [
    { value: "", label: "Select Job Type" },
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" },
  ];

  const watchSalaryMin = watch("salaryMin");
  const watchSalaryMax = watch("salaryMax");

  // Handle location selection
  const handleLocationChange = (locationValue, isChecked) => {
    let newLocations;
    if (isChecked) {
      newLocations = [...selectedLocations, locationValue];
    } else {
      newLocations = selectedLocations.filter(loc => loc !== locationValue);
    }
    setSelectedLocations(newLocations);
    setValue("locations", newLocations);
    setValue("location", newLocations[0] || ""); // Set primary location
  };

  const onSubmit = async (data) => {
    // simple validation logic for salary range
    const min = Number(data.salaryMin || 0);
    const max = Number(data.salaryMax || 0);
    if (min && max && min > max) {
      // you can set an error via setError if desired; here we alert
      alert("Minimum salary cannot be greater than maximum salary.");
      return;
    }

    // map form fields to backend shape
    const payload = {
      title: data.jobTitle.trim(),
      companyName: data.companyName.trim(),
      location: data.location, // Primary location for backward compatibility
      locations: data.locations || [], // Multiple locations
      jobType: data.jobType,
      salaryRange: {
        min: data.salaryMin ? Number(data.salaryMin) : undefined,
        max: data.salaryMax ? Number(data.salaryMax) : undefined,
        currency: "INR",
        period: "per_month",
      },
      description: data.jobDescription,
      requirements: [],
      responsibilities: [],
      applicationDeadline: data.applicationDeadline || undefined,
      isPublished: true,
    };

    try {
      await api.post("/api/v1/createJob", payload, { withCredentials: true });
      alert("Job created successfully");
      await onPublish(data);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to create job";
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        alert("Please login as admin to create jobs.");
      } else {
        alert(msg);
      }
    }
    // optionally reset form after publish
    // reset();
  };

  const handleSaveDraft = async () => {
    const values = {
      jobTitle: watch("jobTitle"),
      companyName: watch("companyName"),
      location: watch("location"),
      jobType: watch("jobType"),
      salaryMin: watch("salaryMin"),
      salaryMax: watch("salaryMax"),
      applicationDeadline: watch("applicationDeadline"),
      jobDescription: watch("jobDescription"),
    };
    await onSaveDraft(values);
    // optional feedback
    alert("Draft saved");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl bg-white rounded-lg p-4 sm:p-6">
      <h2 className="text-center font-semibold text-lg mb-4 sm:mb-6">Create Job Opening</h2>

      {/* Row 1: Job Title / Company Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Job Title</label>
          <input
            {...register("jobTitle", { required: "Job title is required", maxLength: { value: 120, message: "Max 120 chars" } })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="e.g. Full Stack Developer"
          />
          {errors.jobTitle && <p className="text-xs text-red-500 mt-1">{errors.jobTitle.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Company Name</label>
          <input
            {...register("companyName", { required: "Company name is required", maxLength: { value: 100, message: "Max 100 chars" } })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Amazon, Microsoft, Swiggy"
          />
          {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName.message}</p>}
        </div>
      </div>

      {/* Row 2: Locations / Job Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Locations (Select Multiple)</label>
          <div className="space-y-2">
            {/* Selected Locations Display */}
            {selectedLocations.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 bg-blue-50 rounded-lg border">
                {selectedLocations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {locations.find(l => l.value === loc)?.label}
                    <button
                      type="button"
                      onClick={() => handleLocationChange(loc, false)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Location Dropdown */}
            <select
              value=""
              onChange={(e) => {
                if (e.target.value && !selectedLocations.includes(e.target.value)) {
                  handleLocationChange(e.target.value, true);
                }
                e.target.value = ""; // Reset dropdown
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="">Add a location...</option>
              {locations
                .filter(loc => !selectedLocations.includes(loc.value))
                .map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
            </select>
            
            {selectedLocations.length === 0 && (
              <p className="text-xs text-red-500">Please select at least one location</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Type</label>
          <select
            {...register("jobType", { required: "Please select job type" })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            {jobTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {errors.jobType && <p className="text-xs text-red-500 mt-1">{errors.jobType.message}</p>}
        </div>
      </div>

      {/* Row 3: Salary Range / Application Deadline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Salary Range</label>
          <div className="flex gap-3">
            <input
              type="number"
              {...register("salaryMin", { min: { value: 0, message: "Invalid salary" } })}
              placeholder="₹0"
              className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <input
              type="number"
              {...register("salaryMax", { min: { value: 0, message: "Invalid salary" } })}
              placeholder="₹12,00,000"
              className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          {(errors.salaryMin || errors.salaryMax) && (
            <p className="text-xs text-red-500 mt-1">
              {errors.salaryMin?.message || errors.salaryMax?.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Application Deadline</label>
          <input
            type="date"
            {...register("applicationDeadline")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Job Description */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Job Description</label>
          <textarea
          {...register("jobDescription", { required: "Please add a job description" })}
          rows={6}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
          placeholder="Please share a description to let the candidate know more about the job role"
        />
        {errors.jobDescription && <p className="text-xs text-red-500 mt-1">{errors.jobDescription.message}</p>}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
          className="px-5 py-2 rounded-md border border-gray-400 text-sm font-medium bg-white hover:bg-gray-50 order-2 sm:order-1"
        >
          Save Draft
        </button>

        <div className="hidden sm:flex-1" />

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded-md bg-[#00AAFF] text-white font-medium hover:bg-blue-600 order-1 sm:order-2"
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </button>
      </div>
    </form>
  );
}
