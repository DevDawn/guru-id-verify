import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { supabase } from '../supabaseClient';
import AdminLayout from '../Components/AdminComponents/AdminLayout';
import StaffList from '../Components/AdminComponents/StaffList';
import StaffForm from '../Components/AdminComponents/StaffForm';
import DashboardStats from '../Components/AdminComponents/DashboardStats';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Check authentication on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login'); // Redirect to login after logout
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
    </AdminLayout>
  );
};

export default AdminPanel;