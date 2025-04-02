import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, User } from 'lucide-react';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';

const StaffProfile = () => {
  const { guruID } = useParams(); // Get the guruID from the URL
  const [staff, setStaff] = useState(null); // State to store staff details
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(''); // State to manage errors
  const navigate = useNavigate(); // For navigation

  // Fetch staff details based on guruID
  useEffect(() => {
    const fetchStaff = async () => {
      if (!guruID) {
        setError('Invalid staff ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Start loading
        console.log(`Fetching staff details for guruID: ${guruID}`); // Debugging log

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
        console.error('Error fetching staff:', err.message); // Log the error
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
          <div className="bg-white rounded-lg shadow p-6 text-center">
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

                {/* Employment Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Employment Details</h3>
                  <p><span className="text-gray-600">Type:</span> {staff.employment_type}</p>
                  <p><span className="text-gray-600">Hire Date:</span> {new Date(staff.hire_date).toLocaleDateString()}</p>
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
              </div>

              {/* Additional Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Additional Information</h3>
                <p>Last updated: {new Date(staff.updated_at).toLocaleString()}</p>
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