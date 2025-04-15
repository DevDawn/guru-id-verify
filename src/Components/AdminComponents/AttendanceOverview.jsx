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


import React from 'react'

const AttendanceOverview = () => {
  return (
    <div>
      THIS FEATURE IS UNDER DEVELOPMENT
    </div>
  )
}

export default AttendanceOverview
