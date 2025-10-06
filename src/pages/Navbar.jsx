import react, { useEffect, useState } from "react";
import logo from "../assets/cmwlogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useModel } from "../ModelContext";
import api from "../../axios";

const Navbar = () => {
      const { open } = useModel();
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await api.get("/api/v1/me", { withCredentials: true, signal: controller.signal });
        setMe(res?.data?.user || null);
      } catch (_e) {
        setMe(null);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/logout", {}, { withCredentials: true });
      setMe(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Jobs", path: "/jobs" },
    { name: "Find Talents", path: "/talents" },
    { name: "About Us", path: "/about" },
    { name: "Testimonials", path: "/testimonials" },
  ];
  return (
    <>
      <div className="w-full max-w-[890px] h-16 sm:h-20 rounded-full border border-gray-300 mx-auto my-4 sm:my-11 shadow-[0_0_20px_0_rgba(127,127,127,0.15)] px-3 sm:px-4 relative">
        <div className="flex justify-between items-center py-4">
          {/* logo-div */}
          <div className="flex items-center">
            <img src={logo} alt="Company Logo" className="h-8 w-auto sm:h-10" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-6 md:gap-10 items-center justify-center">
            {navLinks.map((item, index) => (
              <Link key={index} to={item.path} className="text-gray-700 hover:text-[#6100AD] transition-colors">
                {item.name}
              </Link>
            ))}
            {me?.role === "admin" ? (
              <button onClick={handleLogout} className="text-[#6100AD] font-medium hover:text-[#4A0080] transition-colors">Logout</button>
            ) : (
              <Link to="/admin" className="text-[#6100AD] font-medium hover:text-[#4A0080] transition-colors">Admin</Link>
            )}
          </div>

          {/* Desktop Create Jobs Button */}
          <div className="hidden lg:flex items-center">
            <button 
              className="bg-[linear-gradient(180deg,#A128FF_0%,#6100AD_113.79%)] py-2 text-white px-4 rounded-full hover:shadow-lg transition-shadow text-sm sm:text-base" 
              onClick={open}
            >
              Create Jobs
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={`w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop - completely transparent */}
          <div 
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div className="fixed top-20 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 lg:hidden max-w-sm mx-auto mobile-menu-enter">
            <div className="flex flex-col py-4">
              {navLinks.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.path} 
                  className="px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#6100AD] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 my-2"></div>
              {me?.role === "admin" ? (
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }} 
                  className="px-6 py-3 text-[#6100AD] font-medium hover:bg-gray-50 transition-colors text-left"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  to="/admin" 
                  className="px-6 py-3 text-[#6100AD] font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <div className="px-6 py-3">
                <button 
                  className="w-full bg-[linear-gradient(180deg,#A128FF_0%,#6100AD_113.79%)] py-3 text-white rounded-full hover:shadow-lg transition-shadow" 
                  onClick={() => {
                    open();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Create Jobs
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
