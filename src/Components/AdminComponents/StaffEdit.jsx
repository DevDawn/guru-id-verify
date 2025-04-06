import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { User, Mail, Phone, Briefcase, Calendar, Link } from 'lucide-react';

const StaffEdit = () => {
  const { guruID } = useParams(); // Get the guruID from the URL
  const navigate = useNavigate(); // For navigation after saving
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    employment_type: 'Full-time',
    hire_date: '',
    id_image_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch staff data when the component mounts
  useEffect(() => {
    const fetchStaff = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('guruID', guruID) // Fetch staff by guruID
        .single();

      if (error) {
        setError('Failed to fetch staff data.');
        console.error(error);
      } else {
        setFormData(data); 
      }
      setIsLoading(false);
    };

    fetchStaff();
  }, [guruID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.full_name || !formData.email || !formData.department || !formData.position) {
        throw new Error('Please fill all required fields.');
      }

      const { error: dbError } = await supabase
        .from('staff')
        .update(formData)
        .eq('guruID', guruID); // Update staff by guruID

      if (dbError) throw dbError;

      alert('Staff member updated successfully!');
      navigate(-1); // Redirect to the staff list page
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-xl p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
          <User className="mr-3 text-blue-600" size={28} />
          {formData.full_name ? `Edit ${formData.full_name}` : 'Edit Staff'}

        </h2>
        <p className="text-gray-500 mt-1">Update the details of the staff member below.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Full Name"
          />
        </div>

        {/* Email */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Email Address"
          />
        </div>

        {/* Phone */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Phone Number"
          />
        </div>

        {/* Department */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Department"
          />
        </div>

        {/* Position */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Position"
          />
        </div>

        {/* Employment Type */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <select
            name="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
        </div>

        {/* Hire Date */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            name="hire_date"
            value={formData.hire_date}
            onChange={handleChange}
            required
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700"
          />
        </div>

        {/* ID Photo URL */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            name="id_image_url"
            value={formData.id_image_url}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Image URL (e.g., https://example.com/photo.jpg)"
          />
        </div>

        {formData.id_image_url && (
          <div className="mt-4">
            <img
              src={formData.id_image_url}
              alt="Staff ID Preview"
              className="w-20 h-20 rounded-md object-cover border border-gray-300"
            />
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffEdit;