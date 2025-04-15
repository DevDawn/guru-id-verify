// import { useEffect, useState } from 'react';
// import { supabase } from '../../supabaseClient';

// const DashboardStats = () => {
//   const [stats, setStats] = useState({
//     totalStaff: 0,
//     activeStaff: 0,
//     departments: [],
//     totalAttendance: 0, // New
//     presentToday: 0,    // New
//     absentToday: 0      // New
//   });

//   // Fetch initial data (NOTE: attendance data will be wired later)
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       await getStats();
//     };

//     fetchInitialData();

//     const staffSubscription = supabase
//       .channel('staff-changes')
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'staff' },
//         () => getStats()
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(staffSubscription);
//     };
//   }, []);

//   const getStats = async () => {
//     try {
//       // Just using dummy numbers for now; replace with real Supabase queries later
//       const totalStaff = 50;
//       const activeStaff = 48;
//       const totalAttendance = 35;
//       const presentToday = 30;
//       const absentToday = 5;

//       const departmentsData = [
//         { department: 'HR' },
//         { department: 'Engineering' },
//         { department: 'Sales' },
//       ];

//       const uniqueDepartments = [...new Set(departmentsData.map(d => d.department))];

//       setStats({
//         totalStaff,
//         activeStaff,
//         totalAttendance,
//         presentToday,
//         absentToday,
//         departments: uniqueDepartments
//       });
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <StatCard 
//           title="Total Staff" 
//           value={stats.totalStaff} 
//           icon="👥" 
//           color="bg-blue-100 text-blue-800"
//           trend={stats.totalStaff > 0 ? 'up' : 'none'}
//         />
//         <StatCard 
//           title="Active IDs" 
//           value={stats.activeStaff} 
//           icon="✅" 
//           color="bg-green-100 text-green-800"
//           trend={stats.activeStaff > 0 ? 'up' : 'none'}
//         />
//         <StatCard 
//           title="Marked Today" 
//           value={stats.totalAttendance} 
//           icon="📝" 
//           color="bg-purple-100 text-purple-800"
//           trend={stats.totalAttendance > 0 ? 'up' : 'none'}
//         />
//         <StatCard 
//           title="Present Today" 
//           value={stats.presentToday} 
//           icon="📗" 
//           color="bg-green-100 text-green-800"
//           trend={stats.presentToday > 0 ? 'up' : 'none'}
//         />
//         <StatCard 
//           title="Absent Today" 
//           value={stats.absentToday} 
//           icon="📕" 
//           color="bg-red-100 text-red-800"
//           trend={stats.absentToday > 0 ? 'up' : 'none'}
//         />
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="font-semibold text-lg mb-4">Departments</h3>
//         <div className="flex flex-wrap gap-2">
//           {stats.departments.map(dept => (
//             <span 
//               key={dept} 
//               className="px-3 py-1 bg-gray-100 rounded-full text-sm"
//             >
//               {dept}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ title, value, icon, color, trend }) => (
//   <div className={`${color} p-6 rounded-lg shadow`}>
//     <div className="flex justify-between items-start">
//       <div>
//         <p className="text-sm font-medium">{title}</p>
//         <p className="text-3xl font-bold">{value}</p>
//       </div>
//       <div className="flex flex-col items-end">
//         <span className="text-3xl">{icon}</span>
//         {trend === 'up' && (
//           <span className="text-xs bg-white bg-opacity-30 px-2 py-1 rounded-full mt-2">
//             ↑ Live
//           </span>
//         )}
//       </div>
//     </div>
//   </div>
// );

// export default DashboardStats;


import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalStaff: 0,
    activeStaff: 0,
    departments: [],
    totalAttendance: 0,
    presentToday: 0,
    absentToday: 0,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      await getStats();
    };

    fetchInitialData();

    // Real-time subscriptions for staff and attendance changes
    const staffSubscription = supabase
      .channel('staff-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'staff' },
        () => getStats()
      )
      .subscribe();

    const attendanceSubscription = supabase
      .channel('attendance-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance' },
        () => getStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(staffSubscription);
      supabase.removeChannel(attendanceSubscription);
    };
  }, []);

  const getStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Fetch total staff
      const { count: totalStaff, error: totalStaffError } = await supabase
        .from('staff')
        .select('*', { count: 'exact', head: true });

      if (totalStaffError) throw totalStaffError;

      // Fetch active staff
      const { count: activeStaff, error: activeStaffError } = await supabase
        .from('staff')
        .select('*', { count: 'exact', head: true })
        .eq('id_status', 'active');

      if (activeStaffError) throw activeStaffError;

      // Fetch total attendance records
      const { count: totalAttendance, error: totalAttendanceError } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true });

      if (totalAttendanceError) throw totalAttendanceError;

      // Fetch present today
      const { count: presentToday, error: presentTodayError } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
        .eq('status', 'Present');

      if (presentTodayError) throw presentTodayError;

      // Fetch absent today
      const { count: absentToday, error: absentTodayError } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
        .eq('status', 'Absent');

      if (absentTodayError) throw absentTodayError;

      // Fetch unique departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('staff')
        .select('department');

      if (departmentsError) throw departmentsError;

      const uniqueDepartments = [
        ...new Set(departmentsData.map((d) => d.department)),
      ];

      setStats({
        totalStaff: totalStaff || 0,
        activeStaff: activeStaff || 0,
        totalAttendance: totalAttendance || 0,
        presentToday: presentToday || 0,
        absentToday: absentToday || 0,
        departments: uniqueDepartments,
      });
    } catch (error) {
      console.error('Error fetching stats:', error.message);
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
          title="Marked Today"
          value={stats.totalAttendance}
          icon="📝"
          color="bg-purple-100 text-purple-800"
          trend={stats.totalAttendance > 0 ? 'up' : 'none'}
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon="📗"
          color="bg-green-100 text-green-800"
          trend={stats.presentToday > 0 ? 'up' : 'none'}
        />
        <StatCard
          title="Absent Today"
          value={stats.absentToday}
          icon="📕"
          color="bg-red-100 text-red-800"
          trend={stats.absentToday > 0 ? 'up' : 'none'}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Departments</h3>
        <div className="flex flex-wrap gap-2">
          {stats.departments.map((dept) => (
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