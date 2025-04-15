// import React, { useState, useEffect } from "react";
// import { supabase } from "../../supabaseClient"; // Adjust the path to your Supabase config
// import ReactPaginate from "react-paginate";

// const AttendanceRecords = () => {
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [filteredRecords, setFilteredRecords] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const recordsPerPage = 10;

//   useEffect(() => {
//     fetchAttendanceRecords();
//   }, []);

//   useEffect(() => {
//     handleSearch();
//   }, [searchQuery, attendanceRecords]);

//   const fetchAttendanceRecords = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("attendance")
//         .select("id, date, status, staff (name)")
//         .order("date", { ascending: false });

//       if (error) throw error;

//       setAttendanceRecords(data);
//       setFilteredRecords(data);
//     } catch (error) {
//       console.error("Error fetching attendance records:", error.message);
//     }
//   };

//   const handleSearch = () => {
//     const filtered = attendanceRecords.filter((record) =>
//       record.staff.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setFilteredRecords(filtered);
//     setCurrentPage(0); // Reset to the first page on search
//   };

//   const handlePageClick = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   const displayedRecords = filteredRecords.slice(
//     currentPage * recordsPerPage,
//     (currentPage + 1) * recordsPerPage
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Attendance Records</h1>
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search by staff name"
//           className="border border-gray-300 rounded-md p-2 w-full"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>
//       <div className="overflow-x-auto">
//         <table className="table-auto w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border border-gray-300 px-4 py-2">Staff Name</th>
//               <th className="border border-gray-300 px-4 py-2">Date</th>
//               <th className="border border-gray-300 px-4 py-2">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayedRecords.map((record) => (
//               <tr key={record.id}>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {record.staff.name}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {new Date(record.date).toLocaleDateString()}
//                 </td>
//                 <td className="border border-gray-300 px-4 py-2">
//                   {record.status}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="mt-4">
//         <ReactPaginate
//           previousLabel={"Previous"}
//           nextLabel={"Next"}
//           pageCount={Math.ceil(filteredRecords.length / recordsPerPage)}
//           onPageChange={handlePageClick}
//           containerClassName={"flex justify-center space-x-2"}
//           previousLinkClassName={"px-3 py-1 bg-gray-200 rounded"}
//           nextLinkClassName={"px-3 py-1 bg-gray-200 rounded"}
//           disabledClassName={"opacity-50 cursor-not-allowed"}
//           activeClassName={"font-bold"}
//           pageClassName={"px-3 py-1 bg-gray-100 rounded"}
//         />
//       </div>
//     </div>
//   );
// };

// export default AttendanceRecords;

import React from 'react'

const AttendanceRecords = () => {
  return (
    <div>
      THIS FEATURE IS UNDER DEVELOPMENT
    </div>
  )
}

export default AttendanceRecords
