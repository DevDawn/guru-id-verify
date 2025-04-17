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

import { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import { Search } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttendanceRecords = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendance')
        .select('guruID, date, status, staff(full_name)');
      
      if (error) {
        console.error('Error fetching attendance records:', error);
        toast.error('Failed to load attendance records');
      } else {
        setAttendanceRecords(data);
        setFilteredRecords(data);
      }
      setLoading(false);
    };

    fetchAttendanceRecords();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = attendanceRecords.filter(record =>
      record.staff.full_name.toLowerCase().includes(term) ||
      record.guruID.toLowerCase().includes(term)
    );
    setFilteredRecords(filtered);
  };

  const handleSelectStaff = (guruID) => {
    const staffRecords = attendanceRecords.filter(record => record.guruID === guruID);
    setSelectedStaff(staffRecords);
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-[#052880]">Attendance Records</h2>

      {/* Search Bar */}
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

      {/* Attendance Records */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading attendance records...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((record, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectStaff(record.guruID)}
            >
              <h3 className="text-lg font-semibold">{record.staff.full_name}</h3>
              <p className="text-sm text-gray-600">{record.guruID}</p>
              <p className="text-sm text-gray-600">{record.date}</p>
              <p className={`text-sm font-medium ${record.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                Status: {record.status}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Selected Staff Attendance History */}
      {selectedStaff && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-[#052880]">
            Attendance History for {selectedStaff[0]?.staff.full_name}
          </h3>
          <div className="space-y-2">
            {selectedStaff.map((record, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg border border-gray-200"
              >
                <p className="text-sm text-gray-600">Date: {record.date}</p>
                <p className={`text-sm font-medium ${record.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                  Status: {record.status}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setSelectedStaff(null)}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
          >
            Back to All Records
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceRecords;