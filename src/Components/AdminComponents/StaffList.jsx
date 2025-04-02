import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Edit, Trash2, Eye, Download } from 'lucide-react';
import StatusBadge from './StatusBadge';

const StaffList = ({ onEdit }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      let query = supabase.from('staff').select('*');
      
      if (filter !== 'all') {
        query = query.eq('id_status', filter);
      }

      const { data, error } = await query;
      if (!error) setStaff(data);
      setLoading(false);
    };

    fetchStaff();
  }, [filter]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to revoke this ID?')) return;
    
    const { error } = await supabase
      .from('staff')
      .update({ id_status: 'revoked' })
      .eq('id', id);
    
    if (!error) {
      setStaff(staff.map(s => s.id === id ? {...s, id_status: 'revoked'} : s));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold text-lg">Staff Members</h3>
        <div className="flex space-x-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#052880]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="revoked">Revoked</option>
          </select>
          <button className="bg-[#052880] text-white px-3 py-1 rounded text-sm flex items-center hover:bg-blue-700 transition-colors">
            <Download size={16} className="mr-1" />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GURU ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Loading staff data...</td>
              </tr>
            ) : staff.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No staff records found</td>
              </tr>
            ) : (
              staff.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {person.id_image_url && (
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full object-cover" src={person.id_image_url} alt={person.full_name} />
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{person.full_name}</div>
                        <div className="text-sm text-gray-500">{person.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{person.guru_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {person.position} ({person.department})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={person.id_status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => onEdit(person)}
                        className="text-[#052880] hover:text-blue-700"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => onEdit(person)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(person.id)}
                        className="text-[#ea0000] hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;