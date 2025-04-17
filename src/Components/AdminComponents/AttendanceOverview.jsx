// import React, { useEffect, useState } from "react";
// import { supabase } from "../../supabaseClient";

// const AttendanceOverview = () => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [attendanceStats, setAttendanceStats] = useState({
//         totalPresent: 0,
//         totalAbsent: 0,
//         recentEntries: [],
//     });

//     useEffect(() => {
//         const fetchAttendanceStats = async () => {
//             try {
//                 setLoading(true);

//                 const today = new Date().toISOString().split("T")[0];

//                 // Fetch total present today
//                 const { count: totalPresent, error: presentError } = await supabase
//                     .from("attendance")
//                     .select("*", { count: "exact", head: true })
//                     .eq("date", today)
//                     .eq("status", "Present");

//                 if (presentError) throw new Error("Failed to fetch present count.");

//                 // Fetch total absent today
//                 const { count: totalAbsent, error: absentError } = await supabase
//                     .from("attendance")
//                     .select("*", { count: "exact", head: true })
//                     .eq("date", today)
//                     .eq("status", "Absent");

//                 if (absentError) throw new Error("Failed to fetch absent count.");

//                 // Fetch last 10 attendance entries with staff name
//                 const { data: recentEntries, error: recentError } = await supabase
//                     .from("attendance")
//                     .select("guruID, date, status, staff:staff(guruID, full_name)")
//                     .order("date", { ascending: false })
//                     .limit(10);

//                 if (recentError) throw new Error("Failed to fetch recent attendance entries.");

//                 setAttendanceStats({
//                     totalPresent: totalPresent || 0,
//                     totalAbsent: totalAbsent || 0,
//                     recentEntries: recentEntries || [],
//                 });
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAttendanceStats();
//     }, []);

//     if (loading) {
//         return <div className="text-center text-gray-500">Loading...</div>;
//     }

//     if (error) {
//         return <div className="text-center text-red-500">Error: {error}</div>;
//     }

//     return (
//         <div className="p-6 bg-white rounded shadow">
//             <h1 className="text-2xl font-bold mb-4">Attendance Overview</h1>
//             <div className="grid grid-cols-2 gap-4 mb-6">
//                 <div className="p-4 bg-green-100 rounded">
//                     <h2 className="text-lg font-semibold">Total Present Today</h2>
//                     <p className="text-2xl font-bold text-green-600">
//                         {attendanceStats.totalPresent}
//                     </p>
//                 </div>
//                 <div className="p-4 bg-red-100 rounded">
//                     <h2 className="text-lg font-semibold">Total Absent Today</h2>
//                     <p className="text-2xl font-bold text-red-600">
//                         {attendanceStats.totalAbsent}
//                     </p>
//                 </div>
//             </div>
//             <h2 className="text-xl font-semibold mb-4">Recent Attendance Entries</h2>
//             <table className="w-full border-collapse border border-gray-200">
//                 <thead>
//                     <tr className="bg-gray-100">
//                         <th className="border border-gray-200 p-2">Staff Name</th>
//                         <th className="border border-gray-200 p-2">Date</th>
//                         <th className="border border-gray-200 p-2">Status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {attendanceStats.recentEntries.map((entry, index) => (
//                         <tr key={index} className="text-center">
//                             <td className="border border-gray-200 p-2">
//                                 {entry.staff?.full_name || "Unknown"}
//                             </td>
//                             <td className="border border-gray-200 p-2">{entry.date}</td>
//                             <td
//                                 className={`border border-gray-200 p-2 ${
//                                     entry.status === "Present"
//                                         ? "text-green-600"
//                                         : "text-red-600"
//                                 }`}
//                             >
//                                 {entry.status}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default AttendanceOverview;

import { useEffect, useState } from 'react';
import { supabase } from "../../supabaseClient";
import { Check, X, Clock, TrendingUp, TrendingDown } from 'lucide-react';

const AttendanceOverview = () => {
  const [todayStats, setTodayStats] = useState(null);
  const [comparisonStats, setComparisonStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch today's stats
      const { data: todayData } = await supabase
        .from('staff')
        .select('guruID, attendance!left(status, date)')
        .eq('attendance.date', new Date().toISOString().split('T')[0]);

      // Fetch yesterday's stats
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const { data: yesterdayData } = await supabase
        .from('staff')
        .select('guruID, attendance!left(status, date)')
        .eq('attendance.date', yesterday.toISOString().split('T')[0]);

      // Process today's data
      const totalStaff = todayData?.length || 0;
      const presentToday = todayData?.filter(s => s.attendance?.[0]?.status === 'Present').length || 0;
      const absentToday = todayData?.filter(s => s.attendance?.[0]?.status === 'Absent').length || 0;
      const unmarkedToday = totalStaff - presentToday - absentToday;

      // Process yesterday's data
      const presentYesterday = yesterdayData?.filter(s => s.attendance?.[0]?.status === 'Present').length || 0;

      setTodayStats({
        totalStaff,
        present: presentToday,
        absent: absentToday,
        unmarked: unmarkedToday,
        presentPercentage: Math.round((presentToday / totalStaff) * 100),
        absentPercentage: Math.round((absentToday / totalStaff) * 100),
        unmarkedPercentage: Math.round((unmarkedToday / totalStaff) * 100)
      });

      setComparisonStats({
        changeCount: presentToday - presentYesterday,
        changePercentage: presentYesterday > 0 
          ? Math.round(((presentToday - presentYesterday) / presentYesterday) * 100)
          : 0
      });

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading attendance Overview...</div>;
  }

  return (
    <div className="bg-white rounded-lg  p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#052880]">Attendance Overview</h2>
      
      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm text-blue-600 mb-1">Total Staff</h3>
          <p className="text-2xl ">{todayStats.totalStaff}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-sm text-green-600 mb-1">Present</h3>
          <p className="text-2xl ">{todayStats.present} <span className="text-sm">({todayStats.presentPercentage}%)</span></p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-sm text-red-600 mb-1">Absent</h3>
          <p className="text-2xl ">{todayStats.absent} <span className="text-sm">({todayStats.absentPercentage}%)</span></p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-1">Unmarked</h3>
          <p className="text-2xl ">{todayStats.unmarked} <span className="text-sm">({todayStats.unmarkedPercentage}%)</span></p>
        </div>
      </div>
      
      {/* Comparison with Yesterday */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
        <h3 className="text-sm text-yellow-700 mb-2">Compared to Yesterday</h3>
        <div className="flex items-center">
          {comparisonStats.changeCount >= 0 ? (
            <TrendingUp className="text-green-500 mr-2" />
          ) : (
            <TrendingDown className="text-red-500 mr-2" />
          )}
          <p className="font-medium">
            {comparisonStats.changeCount >= 0 ? '+' : ''}{comparisonStats.changeCount} staff ({comparisonStats.changePercentage >= 0 ? '+' : ''}{comparisonStats.changePercentage}%)
          </p>
          <span className="text-gray-500 ml-2">vs yesterday</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceOverview;