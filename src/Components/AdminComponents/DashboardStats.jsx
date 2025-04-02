import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalStaff: 0,
    activeStaff: 0,
    expiredIds: 0,
    departments: []
  });

  // Fetch initial data and set up real-time subscription
  useEffect(() => {
    const fetchInitialData = async () => {
      await getStats();
    };

    fetchInitialData();

    // Set up real-time subscription
    const staffSubscription = supabase
      .channel('staff-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'staff' },
        () => getStats()
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(staffSubscription);
    };
  }, []);

  const getStats = async () => {
    try {
      // Get total staff count
      const { count: totalStaff } = await supabase
        .from('staff')
        .select('*', { count: 'exact', head: true });

      // Get active staff count
      const { count: activeStaff } = await supabase
        .from('staff')
        .select('*', { count: 'exact', head: true })
        .eq('id_status', 'active');

      // Get expired IDs count
      const { count: expiredIds } = await supabase
        .from('staff')
        .select('*', { count: 'exact', head: true })
        .eq('id_status', 'expired');

      // Get unique departments
      const { data: departmentsData } = await supabase
        .from('staff')
        .select('department')
        .not('department', 'is', null);

      const uniqueDepartments = [...new Set(departmentsData.map(d => d.department))];

      setStats({
        totalStaff,
        activeStaff,
        expiredIds,
        departments: uniqueDepartments
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Staff" 
          value={stats.totalStaff} 
          icon="👥" 
          color="bg-blue-100 text-blue-800"
          trend={stats.totalStaff > 0 ? 'up' : 'none'}
        />
        <StatCard 
          title="Active IDs" 
          value={stats.activeStaff} 
          icon="✅" 
          color="bg-green-100 text-green-800"
          trend={stats.activeStaff > 0 ? 'up' : 'none'}
        />
        <StatCard 
          title="Expired IDs" 
          value={stats.expiredIds} 
          icon="⚠️" 
          color="bg-yellow-100 text-yellow-800"
          trend={stats.expiredIds > 0 ? 'up' : 'none'}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Departments</h3>
        <div className="flex flex-wrap gap-2">
          {stats.departments.map(dept => (
            <span 
              key={dept} 
              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {dept}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced StatCard with trend indicator
const StatCard = ({ title, value, icon, color, trend }) => (
  <div className={`${color} p-6 rounded-lg shadow`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-3xl">{icon}</span>
        {trend === 'up' && (
          <span className="text-xs bg-white bg-opacity-30 px-2 py-1 rounded-full mt-2">
            ↑ Live
          </span>
        )}
      </div>
    </div>
  </div>
);

export default DashboardStats;