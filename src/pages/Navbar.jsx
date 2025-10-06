import react, { useEffect, useState } from "react";
import logo from "../assets/cmwlogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useModel } from "../ModelContext";
import api from "../../axios";

const Navbar = () => {
      const { open } = useModel();
  const navigate = useNavigate();
  const [me, setMe] = useState(null);

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
    <div className="w-full max-w-[890px] h-16 sm:h-20 rounded-full border border-gray-300 mx-auto my-11 shadow-[0_0_20px_0_rgba(127,127,127,0.15)] px-3 sm:px-4">
      <div className="flex justify-around gap-6 md:gap-10 items-center py-4">
        {/* logo-div */}
        <div className="flex items-center justify-between">
          <img src={logo} />
        </div>
        {/* navlink-div */}
        <div className="flex gap-6 md:gap-10 items-center justify-center">
          {navLinks.map((item, index) => (
            <span key={index}>{item.name}</span>
          ))}
          {me?.role === "admin" ? (
            <button onClick={handleLogout} className="text-[#6100AD] font-medium">Logout</button>
          ) : (
            <Link to="/admin" className="text-[#6100AD] font-medium">Admin</Link>
          )}
        </div>
        {/* button */}
        <div className="flex items-center justify-between">
          <button className="bg-[linear-gradient(180deg,#A128FF_0%,#6100AD_113.79%)] py-2 text-white px-4 rounded-full" onClick={open}>Create Jobs</button>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
