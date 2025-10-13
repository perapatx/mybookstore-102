import React, { useState, useEffect } from "react";
import { leaveAPI } from "../services/api";
const LeaveRest = () => {
  console.log("LeaveRest loaded"); 
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      loadEmployees();
    }, []);

    const loadEmployees = async () => {
      try {
        setLoading(true);
        const data = await leaveAPI.getAll();
        
        // Transform backend data to match frontend format
        const transformedData = data.map(emp => ({
          id: emp.id,
          employee_id: emp.employee_id, // Database doesn't have Thai names
          employee_name: emp.thai_first_name,
          employee_lastname: emp.thai_last_name,
          leave_type : emp.leave_type,
          date_start: emp.start_date ? emp.start_date.split("T")[0] : "",
          date_end: emp.end_date ? emp.end_date.split("T")[0] : "",
          reason : emp.reason,
          status : emp.status
        }));
        
        setRequests(transformedData)
      } catch (err) {
        console.error("Error loading Leave Reacord:", err);
        alert("ไม่สามารถโหลดข้อมูลวันลาได้");
      } finally {
        setLoading(false);
      }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-left mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              คำขอลา/หยุด
            </h1>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-gray-600 font-normal">รหัสพนักงาน</th>
                  <th className="py-3 px-6 text-left text-gray-600 font-normal">พนักงาน</th>
                  <th className="py-3 px-6 text-left text-gray-600 font-normal">ประเภท</th>
                  <th className="py-3 px-6 text-left text-gray-600 font-normal">วันที่</th>
                  <th className="py-3 px-6 text-left text-gray-600 font-normal">เหตุผล</th>
                  <th className="py-3 px-6 text-left text-gray-600 font-normal">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-gray-900">{item.employee_id}</td>
                    <td className="py-4 px-6 text-gray-900">{item.employee_name} {item.employee_lastname}</td>
                    <td className="py-4 px-6 text-gray-700">{item.leave_type}</td>
                    <td className="py-4 px-6 text-gray-700">
                      {item.date_start} - {item.date_end}
                    </td>
                    <td className="py-4 px-6 text-gray-700">{item.reason}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-4 py-1.5 rounded-md text-sm font-medium inline-block ${
                          item.status === "รอพิจารณา"
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : item.status === "อนุมัติ"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRest;
