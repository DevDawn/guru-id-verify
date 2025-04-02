import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <img src="/gurudevs.png" alt="Guru Logo" className="h-23 w-auto" />
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-[#ea0000] font-semibold"
                : "text-[#052880] hover:text-[#ea0000]"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/verify"
            className={({ isActive }) =>
              isActive
                ? "text-[#ea0000] font-semibold"
                : "text-[#052880] hover:text-[#ea0000]"
            }
          >
            Verify
          </NavLink>
          {/* <NavLink
            to="/scan"
            className={({ isActive }) =>
              isActive
                ? "text-[#ea0000] font-semibold"
                : "text-[#052880] hover:text-[#ea0000]"
            }
          >
            Scan
          </NavLink> */}
          <NavLink
            to="/staff"
            className={({ isActive }) =>
              isActive
                ? "text-[#ea0000] font-semibold"
                : "text-[#052880] hover:text-[#ea0000]"
            }
          >
            Staff
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden text-center bg-white shadow-md">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block py-2 px-6 ${
                isActive
                  ? "text-[#ea0000] font-semibold"
                  : "text-[#292a2c] hover:text-[#bd6d6d]"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/verify"
            className={({ isActive }) =>
              `block py-2 px-6  ${
                isActive
                  ? "text-[#ea0000] font-semibold"
                  : "text-[#052880] hover:text-[#ea0000]"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Verify
          </NavLink>
          {/* <NavLink
            to="/scan"
            className={({ isActive }) =>
              `block py-2 px-6  ${
                isActive
                  ? "text-[#ea0000] font-semibold"
                  : "text-[#052880] hover:text-[#ea0000]"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Scan
          </NavLink> */}
          <NavLink
            to="/staff"
            className={({ isActive }) =>
              `block py-2 px-6 ${
                isActive
                  ? "text-[#ea0000] font-semibold"
                  : "text-[#052880] hover:text-[#ea0000]"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Staff
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;