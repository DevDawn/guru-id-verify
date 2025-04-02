import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { generateGuruID } from '../../utils';
import { User, Mail, Phone, Briefcase, Calendar, Link } from 'lucide-react';

const StaffForm = ({ onSuccess }) => {
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    employment_type: 'Full-time',
    hire_date: new Date().toISOString().split('T')[0],
    id_image_url: ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  // Form submissionz
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.full_name || !formData.email || !formData.department || !formData.position) {
        throw new Error('Please fill all required fields');
      }

      // Validate URL if provided
      if (formData.id_image_url && !isValidUrl(formData.id_image_url)) {
        throw new Error('Please enter a valid image URL');
      }

      // Generate GURU ID
      const guruID = generateGuruID();

      // Insert staff record
      const { error: dbError } = await supabase.from('staff').insert({
        ...formData,
        guruID,
        id_status: 'active'
      });

      if (dbError) throw dbError;

      // On success
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Simple URL validation
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-[#052880] mb-6 flex items-center">
        <User className="mr-2" size={24} />
        Add New Staff Member
      </h2>

      {error && (
        <div className="bg-red-50 border-l-4 border-[#ea0000] p-4 mb-6 rounded">
          <p className="text-[#ea0000] font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            {/* <div className="flex items-center space-x-2 text-gray-700 mb-2">
              <User size={18} />
              <h3 className="font-medium">Personal Information</h3>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-[#ea0000]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                  className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#052880] focus:border-transparent"
                  placeholder="John Doe"
                />
                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-[#ea0000]">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#052880] focus:border-transparent"
                  placeholder="john@gurudevs.com"
                />
                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#052880] focus:border-transparent"
                  placeholder="+234 800 000 0000"
                />
                <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            {/* <div className="flex items-center space-x-2 text-gray-700 mb-2">
              <Briefcase size={18} />
              <h3 className="font-medium">Employment Information</h3>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-[#ea0000]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  required
                  className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#052880] focus:border-transparent"
                  placeholder="Technical"
                />
                <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position <span className="text-[#ea0000]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  required
                  className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#052880] focus:border-transparent"
                  placeholder="Senior Developer"
                />
                <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type
              </label>
              <select
                value={formData.employment_type}
                onChange={(e) => setFormData({...formData, employment_type: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#052880] focus:border-transparent"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hire Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.hire_date}
                  onChange={(e) => setFormData({...formData, hire_date: e.target.value})}
                  className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#052880] focus:border-transparent"
                />
                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* ID Photo URL */}
        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Photo URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={formData.id_image_url}
              onChange={(e) => setFormData({...formData, id_image_url: e.target.value})}
              className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#052880] focus:border-transparent"
              placeholder="https://example.com/photo.jpg"
            />
            <Link className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          {formData.id_image_url && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
              <img 
                src={formData.id_image_url} 
                alt="Staff Preview" 
                className="h-32 w-32 rounded-md object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="pt-6 flex justify-end space-x-3 border-t border-gray-200">
          <button
            type="button"
            onClick={onSuccess}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className={`px-6 py-2 rounded-md text-white font-medium ${isUploading ? 'bg-blue-400' : 'bg-[#052880] hover:bg-blue-700'} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Add Staff Member'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;