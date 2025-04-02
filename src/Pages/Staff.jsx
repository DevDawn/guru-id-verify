import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Eye } from 'lucide-react';
import StatusBadge from '../Components/AdminComponents/StatusBadge';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';

const Staff = () => {
  const [staff, setStaff] = useState([]); // State to store staff data
  const [loading, setLoading] = useState(true); // State to manage loading
  const [filter, setFilter] = useState('all'); // State to manage filter

  // Fetch staff data from Supabase
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      let query = supabase.from('staff').select('*'); // Query all staff

      // Apply filter if not "all"
      if (filter !== 'all') {
        query = query.eq('id_status', filter);
      }

      const { data, error } = await query;
      if (!error) {
        setStaff(data); // Set staff data
      } else {
        console.error('Error fetching staff:', error.message); // Log error
      }
      setLoading(false);
    };

    fetchStaff();
  }, [filter]);

  return (
    <>
      <Navbar />
      <div className="bg-white rounded-lg shadow overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-2xl text-[#052880]">Staff Directory</h3>
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#052880]"
            >
              <option value="all">All Staff</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#052880] mb-2"></div>
            <p>Loading staff directory...</p>
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No staff members found</p>
            <p className="text-sm">Try changing your filter settings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {staff.map((person) => (
              <div
                key={person.id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200"
              >
                <div className="relative group">
                  {/* Display staff image or fallback */}
                  {person.id_image_url ? (
                    <img
                      src={person.id_image_url}
                      alt={person.full_name || 'Staff Image'}
                      className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => (e.target.src = '/placeholder-image.png')} // Fallback to placeholder
                    />
                  ) : (
                    <div className="w-full h-52 bg-gray-100 flex items-center justify-center">
                      <div className="text-gray-400 text-lg">No Photo Available</div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={person.id_status} />
                  </div>

                  {/* View Profile Link */}
                  <Link
                    to={`/staff/${person.guruID}`} // Ensure guruID is passed correctly
                    className="absolute inset-0 flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300"
                  >
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <div className="bg-white rounded-full p-3 text-[#052880] shadow-lg">
                        <Eye size={20} />
                      </div>
                      <span className="text-white font-medium mt-1 block">View Profile</span>
                    </div>
                  </Link>
                </div>

                {/* Staff Details */}
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800">{person.full_name}</h3>
                    <span className="bg-[#052880] text-white text-xs px-2 py-1 rounded">
                      {person.guruID}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{person.position || 'Position not available'}</p>

                  <div className="space-y-1 text-sm">
                    <p className="flex items-center">
                      <span className="text-gray-500 w-24 inline-block">Department:</span>
                      <span className="font-medium">{person.department || 'N/A'}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="text-gray-500 w-24 inline-block">Status:</span>
                      <span className="capitalize">{person.id_status || 'N/A'}</span>
                    </p>
                    {person.employment_type && (
                      <p className="flex items-center">
                        <span className="text-gray-500 w-24 inline-block">Type:</span>
                        <span>{person.employment_type}</span>
                      </p>
                    )}
                  </div>

                  {/* View Full Profile Button */}
                  <Link
                    to={`/staff/${person.guruID}`} // Ensure guruID is passed correctly
                    className="mt-4 inline-block w-full text-center bg-[#052880] text-white py-2 px-4 rounded-md hover:bg-[#052880]/90 transition-colors"
                  >
                    View Full Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Staff;