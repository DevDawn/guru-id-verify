import { Link } from "react-router-dom";
import { BadgeCheck, Users } from "lucide-react";
import ParticlesBackground from "../Components/ParticlesBackground";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Home = () => {
  return (
    <>
    <Navbar />
    <ParticlesBackground />
    <div className="flex flex-col items-center justify-start min-h-screen bg-white px-6 text-center py-10">
      {/* Branding / Tagline */}
      <span className="text-sm text-gray-500 uppercase tracking-wide">
        Seamless Digital Identity Verification
      </span>

      {/* Header Section */}
      <h1 className="text-4xl md:text-5xl font-bold text-[#052880] mt-3 leading-tight">
        Authenticate & Verify IDs  
        <span className="block text-[#ea0000]">With Confidence</span>
      </h1>
      
      <p className="text-lg text-gray-600 mt-3 max-w-xl">
        Built by Guru Innovation Hub to enhance security and trust in identification.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col md:flex-row gap-5">
        <Link 
          to="/verify" 
          className="flex items-center gap-2 bg-[#ea0000] text-white px-7 py-3 rounded-full shadow-lg hover:bg-[#c50000] transition-all"
        >
          <BadgeCheck size={22} />
          Verify ID
        </Link>

        <Link 
            to="/staff" // Updated link to /staff
            className="flex items-center gap-2 bg-[#052880] text-white px-7 py-3 rounded-full shadow-lg hover:bg-[#041c63] transition-all"
          >
            <Users size={22} /> {/* Updated icon to Users */}
            Staff Management
          </Link>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Home;
