import react from "react"
import Navbar from "./Navbar"
import Filter from "./Filter"
import Cards from "./Cards"
import { useModel } from "../ModelContext"
import JobForm from "./JobForm"
import { useState } from "react"



const Hero = () => {
  const { isOpen, close } = useModel();
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
    minSalary: undefined,
    maxSalary: undefined,
    remote: false,
  });

  return (
    <>
      <div className="flex flex-col gap-12 shadow-[0_0_14px_0_rgba(198,191,191,0.25)]">
        <Navbar />
        <Filter onChange={setFilters} />
      </div>

      <div>
        <Cards filters={filters} />
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
              aria-label="Close modal"
            >
              ✕
            </button>
            {/* Job form */}
            <div className="p-4 sm:p-6">
              <JobForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
