import React, { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, BarChart3, X, Upload, FileText } from 'lucide-react';
import { ReportAPI, employeeAPI } from "../services/api";

const Report = () => {
  const [employees, setEmployees] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    name: '',
    description: '',
    date: '',
    category: '',
    files: []
  });

  // โหลดข้อมูลพนักงาน & รายงาน
  useEffect(() => {
    loadEmployees();
    loadReports();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeAPI.getAll();
      const transformed = data.map(emp => ({
        id: emp.id,
        name: emp.thai_first_name + emp.thai_last_name,
        position: emp.position,
        department: emp.department_id,
      }));
      setEmployees(transformed);
    } catch (err) {
      console.error("Error loading employees:", err);
      alert("ไม่สามารถโหลดข้อมูลพนักงานได้");
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
    try {
      const data = await ReportAPI.getAll();
      setReports(data);
    } catch (err) {
      console.error("Error loading reports:", err);
      alert("ไม่สามารถโหลดข้อมูลรายงานได้");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "employeeId") {
      const selected = employees.find(emp => emp.id === value);
      setFormData(prev => ({
        ...prev,
        employeeId: value,
        employeeName: selected ? `${selected.name} (${selected.position})` : ""
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, files: [...prev.files, ...files] }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.employeeId || !formData.name || !formData.description || !formData.date || !formData.category) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      await ReportAPI.create(formData);
      alert("สร้างรายงานสำเร็จ");
      setShowModal(false);
      setFormData({
        employeeId: '',
        employeeName: '',
        name: '',
        description: '',
        date: '',
        category: '',
        files: []
      });
      loadReports();
    } catch (err) {
      console.error("Error creating report:", err);
      alert("เกิดข้อผิดพลาดในการสร้างรายงาน");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ต้องการลบรายงานนี้หรือไม่?")) return;
    try {
      await ReportAPI.delete(id);
      setReports(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Error deleting report:", err);
      alert("ลบรายงานไม่สำเร็จ");
    }
  };

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setSelectedReport(null);
    setShowDetailModal(false);
  };

  const pendingReports = reports.filter(r => r.status === 'รอพิจารณา').length;
  const approvedReports = reports.filter(r => r.status === 'อนุมัติแล้ว').length;
  const uniqueEmployees = [...new Set(reports.map(r => r.employeeId))].length;

  const stats = [
    { icon: Users, label: 'พนักงานทั้งหมด', value: uniqueEmployees.toString(), bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
    { icon: Clock, label: 'รอพิจารณา', value: pendingReports.toString(), bgColor: 'bg-yellow-50', iconColor: 'text-yellow-500' },
    { icon: CheckCircle, label: 'อนุมัติแล้ว', value: approvedReports.toString(), bgColor: 'bg-green-50', iconColor: 'text-green-500' },
    { icon: BarChart3, label: 'รายงานทั้งหมด', value: reports.length.toString(), bgColor: 'bg-purple-50', iconColor: 'text-purple-500' },
  ];

  const categories = [
    'รายงานประจำเดือน',
    'รายงานโครงการ',
    'รายงานการประชุม',
    'รายงานทางการเงิน',
    'รายงานอื่นๆ'
  ];

  // UI Section
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">รายงาน</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
          >
            + สร้างรายงานใหม่
          </button>
        </div>

        {/* สถิติ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ตารางรายงาน */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">รายงานทั้งหมด</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["รหัสพนักงาน","ชื่อพนักงาน","ชื่อรายงาน","วันที่สร้าง","ประเภท","สถานะ","จัดการ"].map((head) => (
                    <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">ยังไม่มีรายงาน</td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">{report.employee_id}</td>
                      <td className="px-6 py-3">{report.employee_name}</td>
                      <td className="px-6 py-3">{report.name}</td>
                      <td className="px-6 py-3">{report.date}</td>
                      <td className="px-6 py-3">{report.category}</td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          report.status === 'อนุมัติแล้ว' ? 'bg-green-100 text-green-800'
                          : report.status === 'ไม่อนุมัติ' ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <button onClick={() => handleViewDetail(report)} className="text-blue-600 hover:text-blue-900 mr-3">ดู</button>
                        <button onClick={() => handleDelete(report.id)} className="text-red-600 hover:text-red-900">ลบ</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ Modal เพิ่มรายงาน */}
        {showModal && (
          <ReportModal
            formData={formData}
            setFormData={setFormData}
            employees={employees}
            categories={categories}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            handleSubmit={handleSubmit}
            closeModal={() => setShowModal(false)}
          />
        )}

        {/* ✅ Modal ดูรายละเอียด */}
        {showDetailModal && selectedReport && (
          <ReportDetailModal report={selectedReport} onClose={handleCloseDetail} />
        )}
      </div>
    </div>
  );
};

// ✅ แยก component ของ Modal ออกมาให้สะอาด (จะเขียนเพิ่มให้ต่อได้)
const ReportModal = () => null;
const ReportDetailModal = () => null;

export default Report;


// import React, { useState,useEffect } from 'react';
// import { MailIcon, PhoneIcon, LocationMarkerIcon, ClockIcon } from '@heroicons/react/outline';
// import { Users, Clock, CheckCircle, BarChart3, X, Upload, FileText } from 'lucide-react';
// import { ReportAPI } from "../services/api";
// import { employeeAPI } from "../services/api";

// const Report = () => {
//   // ข้อมูลพนักงานตัวอย่าง
//   const [employees, setEmployees] = useState([]);
 
//   const [loading, setLoading] = useState(true);
//     useEffect(() => {
//         loadEmployees();
//       }, []);

//       const loadEmployees = async () => {
//         try {
//           setLoading(true);
//           const data = await employeeAPI.getAll();
          
//           // Transform backend data to match frontend format
//           const transformedData = data.map(emp => ({
//           id: emp.id,
//           name: emp.thai_first_name + emp.thai_last_name, // Database doesn't have Thai names
//           position: emp.position,
//           department: emp.department_id,
//           }));
          
//           setEmployees(transformedData)
//         } catch (err) {
//           console.error("Error loading employee data:", err);
//           alert("ไม่สามารถโหลดข้อมูลพนักงาน");
//         } finally {
//           setLoading(false);
//         }
//   };
//   const [showModal, setShowModal] = useState(false);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [formData, setFormData] = useState({
//     employeeId: '',
//     employeeName: '',
//     name: '',
//     description: '',
//     date: '',
//     category: '',
//     files: []
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     // ถ้าเลือกพนักงานให้อัพเดททั้งรหัสและชื่อ
//     if (name === "employeeId") {
//       const selectedEmployee = employees.find(emp => emp.id === value);
//       setFormData(prev => ({
//         ...prev,
//         employeeId: value,
//         employeeName: selectedEmployee ? `${selectedEmployee.name} (${selectedEmployee.position})` : ""
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setFormData(prev => ({
//       ...prev,
//       files: [...prev.files, ...files]
//     }));
//   };

//   const removeFile = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       files: prev.files.filter((_, i) => i !== index)
//     }));
//   };

//   const handleSubmit = () => {
//     if (!formData.employeeId || !formData.name || !formData.description || !formData.date || !formData.category) {
//       alert('กรุณากรอกข้อมูลให้ครบถ้วน');
//       return;
//     }
    
//     const newReport = {
//       id: Date.now(),
//       ...formData,
//       status: 'รอพิจารณา',
//       createdAt: new Date().toLocaleString('th-TH')
//     };
//     setReports(prev => [...prev, newReport]);
//     setFormData({
//       employeeId: '',
//       employeeName: '',
//       name: '',
//       description: '',
//       date: '',
//       category: '',
//       files: []
//     });
//     setShowModal(false);
//   };

//   const handleStatusChange = (reportId, newStatus) => {
//     setReports(prev => prev.map(report => 
//       report.id === reportId ? { ...report, status: newStatus } : report
//     ));
//   };

//   const handleViewDetail = (report) => {
//     setSelectedReport(report);
//     setShowDetailModal(true);
//   };

//   const handleCloseDetail = () => {
//     setShowDetailModal(false);
//     setSelectedReport(null);
//   };

//   const pendingReports = reports.filter(r => r.status === 'รอพิจารณา').length;
//   const approvedReports = reports.filter(r => r.status === 'อนุมัติแล้ว').length;
//   const uniqueEmployees = [...new Set(reports.map(r => r.employeeId))].length;

//   const stats = [
//     {
//       icon: Users,
//       label: 'พนักงานทั้งหมด',
//       value: uniqueEmployees.toString(),
//       bgColor: 'bg-blue-50',
//       iconColor: 'text-blue-500'
//     },
//     {
//       icon: Clock,
//       label: 'รอพิจารณา',
//       value: pendingReports.toString(),
//       bgColor: 'bg-yellow-50',
//       iconColor: 'text-yellow-500'
//     },
//     {
//       icon: CheckCircle,
//       label: 'อนุมัติแล้ว',
//       value: approvedReports.toString(),
//       bgColor: 'bg-green-50',
//       iconColor: 'text-green-500'
//     },
//     {
//       icon: BarChart3,
//       label: 'รายงานทั้งหมด',
//       value: reports.length.toString(),
//       bgColor: 'bg-purple-50',
//       iconColor: 'text-purple-500'
//     }
//   ];

//   const categories = [
//     'รายงานประจำเดือน',
//     'รายงานโครงการ',
//     'รายงานการประชุม',
//     'รายงานทางการเงิน',
//     'รายงานอื่นๆ'
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 max-w-7xl">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">รายงาน</h1>
//           <button
//             onClick={() => setShowModal(true)}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
//           >
//             + สร้างรายงานใหม่
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {stats.map((stat, index) => (
//             <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
//               <div className="flex items-center">
//                 <div className={`${stat.bgColor} p-3 rounded-lg`}>
//                   <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-gray-600 text-sm">{stat.label}</p>
//                   <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//             <h2 className="text-xl font-semibold text-gray-900">รายงานที่สร้างแล้ว</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     รหัสพนักงาน
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     ชื่อพนักงาน
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     ชื่อรายงาน
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     วันที่สร้าง
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     ประเภท
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     สถานะ
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     จัดการ
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {reports.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
//                       <div className="flex flex-col items-center">
//                         <FileText className="w-12 h-12 text-gray-300 mb-2" />
//                         <p>ยังไม่มีรายงาน</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   reports.map((report) => (
//                     <tr key={report.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">{report.employeeId}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{report.employeeName}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">{report.name}</div>
//                         <div className="text-sm text-gray-500 truncate max-w-xs">{report.description}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {report.date}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
//                           {report.category}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <select
//                           value={report.status}
//                           onChange={(e) => handleStatusChange(report.id, e.target.value)}
//                           className={`px-3 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer ${
//                             report.status === 'อนุมัติแล้ว' 
//                               ? 'bg-green-100 text-green-800' 
//                               : report.status === 'ไม่อนุมัติ'
//                               ? 'bg-red-100 text-red-800'
//                               : 'bg-yellow-100 text-yellow-800'
//                           }`}
//                         >
//                           <option value="รอพิจารณา">รอพิจารณา</option>
//                           <option value="อนุมัติแล้ว">อนุมัติแล้ว</option>
//                           <option value="ไม่อนุมัติ">ไม่อนุมัติ</option>
//                         </select>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <button 
//                           onClick={() => handleViewDetail(report)}
//                           className="text-blue-600 hover:text-blue-900 font-medium mr-3"
//                         >
//                           ดู
//                         </button>
//                         <button 
//                           onClick={() => setReports(prev => prev.filter(r => r.id !== report.id))}
//                           className="text-red-600 hover:text-red-900 font-medium"
//                         >
//                           ลบ
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Modal สร้างรายงาน */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
//                 <h2 className="text-2xl font-bold text-gray-900">📝 สร้างรายงานใหม่</h2>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg p-1 transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="p-6">
//                 <div className="space-y-6">
//                   {/* Dropdown เลือกพนักงาน - สไตล์เหมือนภาษี */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       เลือกพนักงาน <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="employeeId"
//                       value={formData.employeeId}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:border-blue-400 transition-colors"
//                     >
//                       <option value="">-- กรุณาเลือกพนักงาน --</option>
//                       {employees.map(emp => (
//                         <option key={emp.id} value={emp.id}>
//                           {emp.id} - {emp.name} ({emp.position} - {emp.department})
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       ชื่อรายงาน <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
//                       placeholder="กรุณาใส่ชื่อรายงาน"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       รายละเอียด <span className="text-red-500">*</span>
//                     </label>
//                     <textarea
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       rows="4"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
//                       placeholder="กรุณาใส่รายละเอียดของรายงาน"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       วันที่สร้าง <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="date"
//                       name="date"
//                       value={formData.date}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       ประเภทของรายงาน <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="category"
//                       value={formData.category}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:border-blue-400 transition-colors"
//                     >
//                       <option value="">-- เลือกประเภทรายงาน --</option>
//                       {categories.map((cat, index) => (
//                         <option key={index} value={cat}>{cat}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       ไฟล์ประกอบ
//                     </label>
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50">
//                       <input
//                         type="file"
//                         onChange={handleFileChange}
//                         multiple
//                         className="hidden"
//                         id="file-upload"
//                         accept=".doc,.docx,.xls,.xlsx,.pdf,.txt"
//                       />
//                       <label htmlFor="file-upload" className="cursor-pointer">
//                         <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
//                         <p className="text-sm text-gray-600 font-medium">
//                           คลิกเพื่ออัพโหลดไฟล์ หรือลากไฟล์มาวางที่นี่
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           รองรับไฟล์ Word, Excel, PDF (ขนาดไม่เกิน 10MB)
//                         </p>
//                       </label>
//                     </div>

//                     {formData.files.length > 0 && (
//                       <div className="mt-4 space-y-2">
//                         <p className="text-sm font-medium text-gray-700">ไฟล์ที่แนบ ({formData.files.length})</p>
//                         {formData.files.map((file, index) => (
//                           <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
//                             <div className="flex items-center">
//                               <FileText className="w-5 h-5 text-blue-500 mr-2" />
//                               <span className="text-sm text-gray-700 font-medium">{file.name}</span>
//                               <span className="ml-2 text-xs text-gray-500">
//                                 ({(file.size / 1024).toFixed(2)} KB)
//                               </span>
//                             </div>
//                             <button
//                               type="button"
//                               onClick={() => removeFile(index)}
//                               className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded p-1 transition-colors"
//                             >
//                               <X className="w-5 h-5" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
//                   <button
//                     onClick={() => setShowModal(false)}
//                     className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
//                   >
//                     ยกเลิก
//                   </button>
//                   <button
//                     onClick={handleSubmit}
//                     className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
//                   >
//                     ✓ สร้างรายงาน
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Modal รายละเอียด */}
//         {showDetailModal && selectedReport && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
//                 <h2 className="text-2xl font-bold text-gray-900">📋 รายละเอียดรายงาน</h2>
//                 <button
//                   onClick={handleCloseDetail}
//                   className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg p-1 transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="p-6 space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <label className="block text-sm font-medium text-gray-500 mb-1">
//                       รหัสพนักงาน
//                     </label>
//                     <p className="text-lg font-semibold text-gray-900">{selectedReport.employeeId}</p>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <label className="block text-sm font-medium text-gray-500 mb-1">
//                       ชื่อพนักงาน
//                     </label>
//                     <p className="text-lg font-semibold text-gray-900">{selectedReport.employeeName}</p>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <label className="block text-sm font-medium text-gray-500 mb-1">
//                       ชื่อรายงาน
//                     </label>
//                     <p className="text-lg font-semibold text-gray-900">{selectedReport.name}</p>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <label className="block text-sm font-medium text-gray-500 mb-1">
//                       วันที่สร้าง
//                     </label>
//                     <p className="text-lg text-gray-900">{selectedReport.date}</p>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <label className="block text-sm font-medium text-gray-500 mb-1">
//                       เวลาที่บันทึก
//                     </label>
//                     <p className="text-lg text-gray-900">{selectedReport.createdAt}</p>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <label className="block text-sm font-medium text-gray-500 mb-1">
//                       ประเภท
//                     </label>
//                     <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
//                       {selectedReport.category}
//                     </span>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-500 mb-1">
//                       สถานะ
//                     </label>
//                     <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
//                       selectedReport.status === 'อนุมัติแล้ว' 
//                         ? 'bg-green-100 text-green-800' 
//                         : selectedReport.status === 'ไม่อนุมัติ'
//                         ? 'bg-red-100 text-red-800'
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {selectedReport.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="border-t pt-6">
//                   <label className="block text-sm font-medium text-gray-500 mb-2">
//                     รายละเอียด
//                   </label>
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
//                       {selectedReport.description}
//                     </p>
//                   </div>
//                 </div>

//                 {selectedReport.files && selectedReport.files.length > 0 && (
//                   <div className="border-t pt-6">
//                     <label className="block text-sm font-medium text-gray-500 mb-3">
//                       📎 ไฟล์แนบ ({selectedReport.files.length} ไฟล์)
//                     </label>
//                     <div className="space-y-2">
//                       {selectedReport.files.map((file, index) => (
//                         <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
//                           <div className="flex items-center">
//                             <FileText className="w-5 h-5 text-blue-500 mr-3" />
//                             <span className="text-sm text-gray-700 font-medium">{file.name}</span>
//                           </div>
//                           <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
//                             {(file.size / 1024).toFixed(2)} KB
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex justify-end pt-6 border-t">
//                   <button
//                     onClick={handleCloseDetail}
//                     className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
//                   >
//                     ปิด
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Report;