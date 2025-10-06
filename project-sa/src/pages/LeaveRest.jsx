import React, { useState, useEffect } from "react";

const LeaveRest = () => {
  console.log("LeaveRest loaded"); 
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setRequests([
      {
        id: 1,
        employee_id: "EMP001",
        employee_name: "สมชาย ใจดี",
        leave_type: "ลาป่วย",
        date_start: "2024-01-15",
        date_end: "2024-01-16",
        reason: "ป่วยไข้หวัด",
        status: "รอพิจารณา",
      },
      {
        id: 2,
        employee_id: "EMP002",
        employee_name: "สมศรี ขยัน",
        leave_type: "ลากิจ",
        date_start: "2025-10-12",
        date_end: "2025-10-13",
        reason: "ธุระครอบครัว",
        status: "อนุมัติ",
      },
      {
        id: 3,
        employee_id: "EMP003",
        employee_name: "สมปอง รักดี",
        leave_type: "ลาพักร้อน",
        date_start: "2025-10-20",
        date_end: "2025-10-22",
        reason: "ท่องเที่ยว",
        status: "ไม่อนุมัติ",
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-left mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              คำขอลา/หยุด
            </h1>
            <p className="text-gray-600">แสดงรายการคำขอลาของพนักงาน</p>
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
                    <td className="py-4 px-6 text-gray-900">{item.employee_name}</td>
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
