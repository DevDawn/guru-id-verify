import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AdminLayout from '../Components/AdminComponents/AdminLayout';
import StaffList from '../Components/AdminComponents/StaffList';
import StaffForm from '../Components/AdminComponents/StaffForm';
import DashboardStats from '../Components/AdminComponents/DashboardStats';

// 🚀 Import your new attendance components (you'll create these next)
import AttendanceOverview from '../Components/AdminComponents/AttendanceOverview';
import MarkAttendance from '../Components/AdminComponents/MarkAttendance';
import AttendanceRecords from '../Components/AdminComponents/AttendanceRecords';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <AdminLayout 
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {activeTab === 'dashboard' && <DashboardStats />}
      {activeTab === 'staff' && (
        <StaffList 
          onEdit={(staff) => {
            setSelectedStaff(staff);
            setActiveTab('edit');
          }}
        />
      )}
      {activeTab === 'add' && (
        <StaffForm 
          onSuccess={() => {
            setActiveTab('staff');
          }}
        />
      )}
      {activeTab === 'edit' && selectedStaff && (
        <StaffForm 
          existingStaff={selectedStaff}
          onSuccess={() => {
            setActiveTab('staff');
            setSelectedStaff(null);
          }}
        />
      )}

      {/* 🆕 Attendance Tabs */}
      {activeTab === 'attendance-overview' && <AttendanceOverview />}
      {activeTab === 'mark-attendance' && <MarkAttendance />}
      {activeTab === 'view-records' && <AttendanceRecords />}
    </AdminLayout>
  );
};

export default AdminPanel;
