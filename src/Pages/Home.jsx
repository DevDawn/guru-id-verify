import { Link } from "react-router-dom";
import { BadgeCheck, Users, Clock, Lock } from "lucide-react";
import ParticlesBackground from "../Components/ParticlesBackground";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <ParticlesBackground />
      <div className="flex flex-col items-center justify-start min-h-screen bg-white px-6 text-center py-16">
        {/* Branding / Tagline */}
        <span className="text-sm text-gray-500 uppercase tracking-wide">
          Seamless Digital Identity & Attendance System
        </span>

        {/* Header Section */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#052880] mt-3 leading-tight">
          Secure ID Verification  
          <span className="block text-[#ea0000]">+ Attendance Management</span>
        </h1>
        
        <p className="text-lg text-gray-600 mt-3 max-w-2xl">
          A comprehensive solution by Guru Innovation Hub for identity authentication, 
          staff management, and real-time attendance tracking.
        </p>

        {/* Key Features Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <BadgeCheck size={32} className="mx-auto text-[#052880]" />
            <h3 className="font-semibold mt-3">ID Verification</h3>
            <p className="text-gray-600 mt-2">Instant authentication of identities with fraud detection.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <Clock size={32} className="mx-auto text-[#ea0000]" />
            <h3 className="font-semibold mt-3">Attendance System</h3>
            <p className="text-gray-600 mt-2">Automated tracking with biometric or ID-based check-ins.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <Users size={32} className="mx-auto text-[#052880]" />
            <h3 className="font-semibold mt-3">Staff Management</h3>
            <p className="text-gray-600 mt-2">Centralized control of staff profiles and access.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col md:flex-row gap-5">
          <Link 
            to="/verify" 
            className="flex items-center gap-2 bg-[#ea0000] text-white px-7 py-3 rounded-full shadow-lg hover:bg-[#c50000] transition-all"
          >
            <BadgeCheck size={22} />
            Verify ID
          </Link>
          <Link 
            to="/staff" 
            className="flex items-center gap-2 bg-[#052880] text-white px-7 py-3 rounded-full shadow-lg hover:bg-[#041c63] transition-all"
          >
            <Users size={22} />
            Staff Portal
          </Link>
          <Link 
            to="/login" 
            className="flex items-center gap-2 bg-gray-800 text-white px-7 py-3 rounded-full shadow-lg hover:bg-gray-700 transition-all"
          >
            <Lock size={22} />
            Admin Login
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;