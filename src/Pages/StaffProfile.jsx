import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, User, Github, Linkedin, X } from 'lucide-react';
import QRCode from 'react-qr-code'; 
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';

const StaffProfile = () => {
  const { guruID } = useParams(); 
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchStaff = async () => {
      if (!guruID) {
        setError('Invalid staff ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Start loading

        const { data, error } = await supabase
          .from('staff') // Replace 'staff' with your actual table name
          .select('*')
          .eq('guruID', guruID) // Match the guruID (case-sensitive)
          .single(); // Expect a single result

        if (error || !data) {
          throw new Error('Staff not found'); // Handle errors
        }

        setStaff(data); // Set the staff data
      } catch (err) {
        setError(err.message); // Set the error message
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchStaff();
  }, [guruID]);

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p>Loading staff data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="p-6 max-w-4xl mx-auto">
          <div className="p-6 text-center">
            <p className="text-[#ea0000]">{error}</p>
            <button
              onClick={() => navigate(-1)} // Go back to the previous page
              className="mt-4 px-4 py-2 bg-gray-200 rounded-md"
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  // Show staff profile
  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="flex items-center text-[#052880] mb-4"
        >
          <ArrowLeft className="mr-1" size={18} />
          Back
        </button>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#052880] p-4 text-white">
            <h1 className="text-xl font-bold">{staff.full_name}</h1>
            <p className="text-sm opacity-80">{staff.position} • {staff.department}</p>
          </div>

          {/* Content Section */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-1">
              {staff.id_image_url ? (
                <img
                  src={staff.id_image_url}
                  alt={staff.full_name}
                  className="w-full h-auto rounded-lg border-2 border-gray-200"
                  onError={(e) => (e.target.src = '/placeholder-image.png')} // Fallback to placeholder
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <User className="text-gray-400" size={48} />
                </div>
              )}

              <div className="mt-4 bg-[#052880] p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">GURU ID</h3>
                <p className="font-mono bg-white p-2 rounded">{staff.guruID}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Personal Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <p><span className="text-gray-600">Email:</span> {staff.email}</p>
                  <p><span className="text-gray-600">Phone:</span> {staff.phone || 'N/A'}</p>
                </div>

                {/* Social Profiles */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <span className="text-[#052880] mr-2">Social Profiles</span>
                  </h3>
                  <div className="flex space-x-4">
                    {/* GitHub */}
                    {staff.github_url && (
                      <a
                        href={staff.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-700 hover:text-[#052880]"
                      >
                        <Github className="mr-1" size={18} />
                        <span className="text-sm">GitHub</span>
                      </a>
                    )}

                    {/* LinkedIn */}
                    {staff.linkedin_url && (
                      <a
                        href={staff.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-700 hover:text-[#052880]"
                      >
                        <Linkedin className="mr-1" size={18} />
                        <span className="text-sm">LinkedIn</span>
                      </a>
                    )}

                    {/* Twitter */}
                    {staff.x_url && (
                      <a
                        href={staff.x_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-700 hover:text-[#052880]"
                      >
                        <X className="mr-1" size={18} />
                        <span className="text-sm"> (Formerly Twitter)</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Employment Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Employment Details</h3>
                  <p><span className="text-gray-600">Type:</span> {staff.employment_type}</p>
                  <p><span className="text-gray-600">Employment Date:</span> {new Date(staff.hire_date).toLocaleDateString()}</p>
                  <p><span className="text-gray-600">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      staff.id_status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : staff.id_status === 'expired'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.id_status.toUpperCase()}
                    </span>
                  </p>
                </div>

                {/* QR Code Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Profile QR Code</h3>
                  <div className="flex justify-center p-2 rounded">
                    <QRCode 
                      value={`${window.location.origin}/staff/${staff.guruID}`} // Generates the profile link
                      size={128} // Size of the QR code
                      fgColor="#052880" 
                      bgColor="#ffffff" // Background color
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Scan to view this profile
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StaffProfile;