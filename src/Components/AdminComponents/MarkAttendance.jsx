// import React, { useState, useEffect } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import { supabase } from "../../supabaseClient"; // Adjust the path to your Supabase client config

// const MarkAttendance = () => {
//     const [date, setDate] = useState(new Date());
//     const [staff, setStaff] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [attendance, setAttendance] = useState({});
//     const [remarks, setRemarks] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(false);

//     // Fetch staff data
//     useEffect(() => {
//         const fetchStaff = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const { data, error } = await supabase.from("staff").select("guruID, full_name");
//                 if (error) throw error;
//                 setStaff(data);
//             } catch (err) {
//                 setError("Failed to fetch staff.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStaff();
//     }, []);

//     // Toggle attendance status
//     const handleToggleAttendance = (guruID) => {
//         setAttendance((prev) => ({
//             ...prev,
//             [guruID]: prev[guruID] === "Present" ? "Absent" : "Present",
//         }));
//     };

//     // Handle remarks input
//     const handleRemarksChange = (guruID, value) => {
//         setRemarks((prev) => ({
//             ...prev,
//             [guruID]: value,
//         }));
//     };

//     // Submit attendance
//     const handleSubmit = async () => {
//         setLoading(true);
//         setError(null);
//         setSuccess(false);
//         try {
//             const attendanceRecords = Object.entries(attendance).map(([guruID, status]) => ({
//                 guruID,
//                 date: date.toISOString().split("T")[0],
//                 status,
//                 remarks: remarks[guruID] || null,
//             }));

//             const { error } = await supabase.from("attendance").upsert(attendanceRecords, {
//                 onConflict: ["guruID", "date"],
//             });

//             if (error) throw error;
//             setSuccess(true);
//         } catch (err) {
//             setError("Failed to save attendance.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Filter staff based on search term
//     const filteredStaff = staff.filter((s) =>
//         (s.full_name || "").toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
//             <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>
//             <div className="mb-6">
//                 <Calendar onChange={setDate} value={date} />
//             </div>
//             <div className="mb-4">
//                 <input
//                     type="text"
//                     placeholder="Search staff by name"
//                     className="p-2 border border-gray-300 rounded w-full"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//             </div>
//             {loading && <p>Loading...</p>}
//             {error && <p className="text-red-500">{error}</p>}
//             {success && <p className="text-green-500">Attendance saved successfully!</p>}
//             <div className="bg-white p-4 rounded shadow">
//                 <ul>
//                     {filteredStaff.map((staffMember) => (
//                         <li
//                             key={staffMember.guruID}
//                             className="flex flex-col md:flex-row items-start md:items-center justify-between py-2 border-b"
//                         >
//                             <span className="font-medium">{staffMember.full_name}</span>
//                             <div className="flex items-center space-x-4 mt-2 md:mt-0">
//                                 <button
//                                     onClick={() => handleToggleAttendance(staffMember.guruID)}
//                                     className={`px-4 py-2 rounded ${
//                                         attendance[staffMember.guruID] === "Present"
//                                             ? "bg-green-500 text-white"
//                                             : attendance[staffMember.guruID] === "Absent"
//                                             ? "bg-red-500 text-white"
//                                             : "bg-gray-300 text-black"
//                                     }`}
//                                 >
//                                     {attendance[staffMember.guruID] || "Absent"}
//                                 </button>
//                                 <input
//                                     type="text"
//                                     placeholder="Remarks"
//                                     className="p-2 border border-gray-300 rounded"
//                                     value={remarks[staffMember.guruID] || ""}
//                                     onChange={(e) =>
//                                         handleRemarksChange(staffMember.guruID, e.target.value)
//                                     }
//                                 />
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//             <button
//                 onClick={handleSubmit}
//                 className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//                 disabled={loading}
//             >
//                 Save Attendance
//             </button>
//         </div>
//     );
// };

// export default MarkAttendance;

import React from 'react';

const MarkAttendance = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>
            <p>This feature is under development.</p>
        </div>
    );
}

export default MarkAttendance;