import {
  RotateCcw,
  Search,
  Check,
  X,
  Clock,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { supabase } from "../../supabaseClient";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MarkAttendance = () => {
  const [date, setDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [attendance, setAttendance] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('all');
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationData, setConfirmationData] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStaffData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('staff').select('*');
      if (error) {
        console.error('Error fetching staff data:', error);
        toast.error('Failed to load staff data');
      } else {
        setStaffData(data);
      }
      setLoading(false);
    };

    fetchStaffData();
  }, []);

  const currentDateKey = date.toISOString().split('T')[0];
  const currentAttendance = attendance[currentDateKey] || {};

  const filteredStaff = staffData.filter((staff) => {
    const matchesSearch =
      staff.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.guruID.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'present') return matchesSearch && currentAttendance[staff.guruID] === 'Present';
    if (activeTab === 'absent') return matchesSearch && currentAttendance[staff.guruID] === 'Absent';
    if (activeTab === 'unmarked') return matchesSearch && !currentAttendance[staff.guruID];

    return matchesSearch;
  });

  const confirmAttendance = (guruID, status, staffName) => {
    setConfirmationData({ guruID, status, staffName });
    toast.info(
      <div>
        <p>Confirm attendance for {staffName}</p>
        <div className="flex justify-between mt-2">
          <button
            onClick={() => {
              handleAttendanceChange(guruID, status);
              toast.dismiss();
            }}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Yes, {status}
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  const handleAttendanceChange = async (guruID, status) => {
    // Update local state
    setAttendance((prev) => {
      const dayAttendance = { ...(prev[currentDateKey] || {}) };
      dayAttendance[guruID] = status;
      return {
        ...prev,
        [currentDateKey]: dayAttendance,
      };
    });

    // Update Supabase
    try {
      const { error } = await supabase
        .from('attendance')
        .upsert({
          guruID,
          date: currentDateKey,
          status,
        });

      if (error) {
        console.error('Error saving attendance:', error);
        toast.error('Failed to save attendance');
      } else {
        toast.success(`Attendance marked as ${status}`);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    }
  };

  const handleResetAttendance = () => {
    toast.warning(
      <div>
        <p>Reset all attendance for {currentDateKey}?</p>
        <div className="flex justify-between mt-2">
          <button
            onClick={() => {
              setAttendance((prev) => ({
                ...prev,
                [currentDateKey]: {},
              }));
              toast.dismiss();
              toast.success('Attendance reset');
            }}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Confirm Reset
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
      }
    );
  };

  const presentCount = Object.values(currentAttendance).filter((v) => v === 'Present').length;
  const absentCount = Object.values(currentAttendance).filter((v) => v === 'Absent').length;
  const unmarkedCount = staffData.length - presentCount - absentCount;

  return (
    <div className="overflow-hidden">
      <ToastContainer />
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 p-4">
          <div className="mb-6">
            <Calendar
              onChange={setDate}
              value={date}
              maxDate={new Date()}
              className="border border-none rounded-lg p-4 bg-white"
              tileClassName={({ date: tileDate }) =>
                tileDate instanceof Date &&
                tileDate.toISOString().split('T')[0] === currentDateKey
                  ? 'bg-blue-500 text-white font-bold rounded-full'
                  : 'hover:bg-gray-100 rounded-full'
              }
              navigationLabel={({ date }) => (
                <div className="text-lg font-semibold text-gray-700">
                  {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              )}
              nextLabel={<span className="text-gray-500 hover:text-gray-700">›</span>}
              prevLabel={<span className="text-gray-500 hover:text-gray-700">‹</span>}
              next2Label={null}
              prev2Label={null}
            />
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                Attendance Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">Present</span>
                  <span className="font-medium">{presentCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Absent</span>
                  <span className="font-medium">{absentCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Unmarked</span>
                  <span className="font-medium">{unmarkedCount}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-100">
                  <span className="font-semibold">Total Staff</span>
                  <span className="font-bold">{staffData.length}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleResetAttendance}
              className="w-full flex items-center justify-center gap-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            >
              <RotateCcw size={16} />
              Reset Today's Attendance
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              All Staff
            </button>
            <button
              onClick={() => setActiveTab('present')}
              className={`px-4 py-2 font-medium ${activeTab === 'present' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Present
            </button>
            <button
              onClick={() => setActiveTab('absent')}
              className={`px-4 py-2 font-medium ${activeTab === 'absent' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Absent
            </button>
            <button
              onClick={() => setActiveTab('unmarked')}
              className={`px-4 py-2 font-medium ${activeTab === 'unmarked' ? 'border-b-2 border-gray-500 text-gray-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Unmarked
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-[#052880]" size={18} />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-[#052880] border rounded-lg outline-none transition-all"
              />
            </div>
          </div>

          {/* Staff Cards */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading staff data...</div>
            ) : filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <div
                  key={staff.guruID}
                  className={`p-4 rounded-lg border transition-all ${
                    currentAttendance[staff.guruID] === 'Present'
                      ? 'bg-green-50 border-green-200'
                      : currentAttendance[staff.guruID] === 'Absent'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {staff.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{staff.full_name}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                          <span className="flex items-center">
                            ID: {staff.guruID}
                          </span>
                          <span className="flex items-center">
                            <Clock className="mr-1" size={14} />
                            {currentTime.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => confirmAttendance(staff.guruID, 'Present', staff.full_name)}
                        className={`p-2 rounded-full ${
                          currentAttendance[staff.guruID] === 'Present'
                            ? 'bg-green-500 text-white'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => confirmAttendance(staff.guruID, 'Absent', staff.full_name)}
                        className={`p-2 rounded-full ${
                          currentAttendance[staff.guruID] === 'Absent'
                            ? 'bg-red-500 text-white'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                {activeTab === 'all' 
                  ? 'No staff found matching your search'
                  : `No ${activeTab} staff found`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;