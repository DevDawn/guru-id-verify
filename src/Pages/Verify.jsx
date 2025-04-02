import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Search, QrCode } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Verify = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!input.trim()) {
      setError('Please enter a GURU ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: queryError } = await supabase
        .from('staff')
        .select('*')
        .eq('guru_id', input.trim())
        .single();

      if (queryError || !data) {
        throw new Error('Staff not found');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (guruId) => {
    navigate(`/staff/${guruId}`);
  };

  return (
    <>
    <Navbar />
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#052880] mb-6">Verify Staff ID</h1>
      
      <div className="bg-white p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter GURU ID (e.g. GURU-123456-7890)"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#052880]"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            onClick={handleVerify}
            disabled={loading}
            className={`px-4 py-2 rounded-md cursor-pointer text-white ${loading ? 'bg-[#ea0000]' : 'bg-[#052880] hover:bg-blue-700'}`}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-[#ea0000] p-4 rounded">
            <p className="text-[#ea0000]">{error}</p>
          </div>
        )}
      </div>

      {result && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-[#052880]">Verification Result</h2>
            <span className={`px-3 py-1 rounded-full text-xs ${
              result.id_status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {result.id_status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              {result.id_image_url ? (
                <img 
                  src={result.id_image_url} 
                  alt={result.full_name}
                  className="w-full h-auto rounded-lg border-2 border-gray-200"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <User className="text-gray-400" size={48} />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{result.full_name}</h3>
                  <p className="text-gray-600">{result.position}, {result.department}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">GURU ID</p>
                    <p className="font-mono">{result.guru_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Employment Type</p>
                    <p>{result.employment_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hire Date</p>
                    <p>{new Date(result.hire_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="capitalize">{result.id_status}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleViewProfile(result.guru_id)}
                  className="mt-4 px-4 py-2 bg-[#052880] text-white rounded-md hover:bg-blue-700"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer />
  </>
  );
};

export default Verify;