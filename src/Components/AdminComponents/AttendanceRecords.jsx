import { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import { Search, ChevronLeft } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttendanceRecords = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffAttendanceDetails, setStaffAttendanceDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // First fetch all staff
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('guruID, full_name, id_image_url');
        
        if (staffError) throw staffError;

        // Then fetch latest attendance for each staff
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('attendance')
          .select('guruID, date, status')
          .order('date', { ascending: false });

        if (attendanceError) throw attendanceError;

        // Merge staff data with their latest attendance
        const staffWithAttendance = staffData.map(staff => {
          const latestAttendance = attendanceData.find(a => a.guruID === staff.guruID);
          return {
            ...staff,
            latestStatus: latestAttendance?.status || 'Unmarked',
            latestDate: latestAttendance?.date || null
          };
        });

        setStaffList(staffWithAttendance);
        setFilteredStaff(staffWithAttendance);
      } catch (error) {
        toast.error('Failed to load data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = staffList.filter(staff =>
      staff.full_name.toLowerCase().includes(term) ||
      staff.guruID.toLowerCase().includes(term)
    );
    setFilteredStaff(filtered);
  };

  const handleSelectStaff = async (guruID) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('date, status')
        .eq('guruID', guruID)
        .order('date', { ascending: false });

      if (error) throw error;

      const staff = staffList.find(s => s.guruID === guruID);
      setSelectedStaff(staff);
      setStaffAttendanceDetails(data || []);
    } catch (error) {
      toast.error('Failed to load attendance records');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedStaff(null);
  };

  // Calculate stats for selected staff
  const presentCount = staffAttendanceDetails.filter(r => r.status === 'Present').length;
  const absentCount = staffAttendanceDetails.filter(r => r.status === 'Absent').length;
  const totalRecords = staffAttendanceDetails.length;

  return (
    <div className="p-6 bg-white rounded-lg">
      <ToastContainer />
      
      {/* Header with conditional back button */}
      <div className="flex items-center mb-4">
        {selectedStaff && (
          <button 
            onClick={handleBackToList}
            className="mr-2 text-[#052880] hover:text-blue-700"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h2 className="text-2xl font-bold text-[#052880]">
          {selectedStaff ? `${selectedStaff.full_name}'s Attendance` : 'Staff Attendance'}
        </h2>
      </div>

      {/* Search Bar (only shown in list view) */}
      {!selectedStaff && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-[#052880]" size={18} />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border-[#052880] border rounded-lg outline-none transition-all"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : selectedStaff ? (
        /* Staff Details View */
        <div>
          {/* Staff Summary */}
          <div className="flex items-center mb-6">
            <img 
              src={selectedStaff.id_image_url} 
              alt={selectedStaff.full_name}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="text-xl font-semibold">{selectedStaff.full_name}</h3>
              <p className="text-gray-600">{selectedStaff.guruID}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="text-sm text-green-600 mb-1">Present</h3>
              <p className="text-2xl font-bold">{presentCount}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h3 className="text-sm text-red-600 mb-1">Absent</h3>
              <p className="text-2xl font-bold">{absentCount}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-sm text-blue-600 mb-1">Total Records</h3>
              <p className="text-2xl font-bold">{totalRecords}</p>
            </div>
          </div>

          {/* Attendance History */}
          <h3 className="text-lg font-semibold mb-3">Attendance History</h3>
          {staffAttendanceDetails.length > 0 ? (
            <div className="space-y-2">
              {staffAttendanceDetails.map((record, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    record.status === 'Present'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{record.date}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      record.status === 'Present'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No attendance records found for this staff member
            </div>
          )}
        </div>
      ) : (
        /* Staff List View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStaff.map((staff) => (
            <div
              key={staff.guruID}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectStaff(staff.guruID)}
            >
              <div className="flex items-center">
                {/* <img 
                  src={staff.id_image_url} 
                  alt={staff.full_name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                /> */}
                <div>
                  <h3 className="text-lg font-semibold">{staff.full_name}</h3>
                  <p className="text-sm text-gray-600">{staff.guruID}</p>
                </div>
              </div>
              <div className="mt-2">
                {/* <p className="text-sm text-gray-600">
                  Latest: {staff.latestDate || 'No records'}
                
                </p> */}
                <p className={`text-sm font-medium ${
                  staff.latestStatus === 'Present' ? 'text-green-600' :
                  staff.latestStatus === 'Absent' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  Current Status: {staff.latestStatus}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceRecords;