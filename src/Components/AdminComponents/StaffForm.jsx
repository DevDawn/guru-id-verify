import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { generateGuruID } from '../../utils';
import { User, Mail, Phone, Briefcase, Calendar, Link, Github, Linkedin, Twitter, Image } from 'lucide-react';

const StaffForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    employment_type: 'Full-time',
    hire_date: new Date().toISOString().split('T')[0],
    id_image_url: '',
    github_url: '',
    linkedin_url: '',
    x_url: ''
  });

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, id_image_url: url });
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setError('');

    try {
      if (!formData.full_name || !formData.email || !formData.department || !formData.position) {
        throw new Error('Please fill all required fields');
      }

      const guruID = generateGuruID();

      const { data, error: dbError } = await supabase
        .from('staff')
        .insert([{
          ...formData,
          guruID,
          id_status: 'active',
          github_url: formData.github_url || 'https://github.com/GuruInnovationHub/',
          linkedin_url: formData.linkedin_url || 'https://www.linkedin.com/company/guru-i-hub/',
          x_url: formData.x_url || 'https://x.com/Guruhub01'
        }])
        .select();

      if (dbError) throw dbError;
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
          <User className="mr-3 text-blue-600" size={28} />
          {formData.full_name ? `Add ${formData.full_name}` : 'Add New Staff'}
        </h2>
        <p className="text-gray-500 mt-1">Fill in the details below to register a new staff member</p>
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
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Full Name"
            required
          />
        </div>

        {/* Email */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Email"
            required
          />
        </div>

        {/* Phone */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Phone"
          />
        </div>

        {/* Department */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Department"
            required
          />
        </div>

        {/* Position */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Position"
            required
          />
        </div>

        {/* Employment Type */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <select
            value={formData.employment_type}
            onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
            className="block w-full pl-3 pr-3 py-2 bg-transparent outline-none text-gray-700"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {/* Hire Date */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            value={formData.hire_date}
            onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Image URL */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            value={formData.id_image_url}
            onChange={handleImageUrlChange}
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="Image URL"
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4">
            <img src={imagePreview} alt="ID Preview" className="w-32 h-32 object-cover rounded-md" />
          </div>
        )}

        {/* GitHub URL */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Github className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="GitHub URL"
          />
        </div>

        {/* LinkedIn URL */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Linkedin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            value={formData.linkedin_url}
            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="LinkedIn URL"
          />
        </div>

        {/* X (Twitter) URL */}
        <div className="relative border-b border-gray-300 focus-within:border-blue-500">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Twitter className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            value={formData.x_url}
            onChange={(e) => setFormData({ ...formData, x_url: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            placeholder="X (Twitter) URL"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={onSuccess}
            className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className={`px-6 py-2.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 ${
              isUploading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? 'Saving...' : 'Save Staff Member'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;
