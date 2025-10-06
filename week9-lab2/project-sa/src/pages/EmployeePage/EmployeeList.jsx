import React from "react";

const EmployeeList = ({ employees, onAdd, onEdit, onDelete, onView }) => {
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">จัดการข้อมูลพนักงาน</h2>
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          เพิ่มพนักงานใหม่
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อไทย</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ตำแหน่ง</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">แผนก</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((emp) => (
              <tr key={emp.id}>
                {/* แสดงแค่ชื่อไทย */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {emp.firstNameTh} {emp.lastNameTh}
                </td>

                {/* ตำแหน่ง */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.position}</td>

                {/* แผนก */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.department}</td>

                {/* สถานะ */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs rounded-full ${
                      emp.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {emp.status === "active" ? "ทำงาน" : "ลาออก"}
                  </span>
                </td>

                {/* ปุ่มจัดการ */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => onView(emp)} className="text-gray-600 hover:text-gray-900 mr-3">ดู</button>
                  <button onClick={() => onEdit(emp)} className="text-blue-600 hover:text-blue-900 mr-3">แก้ไข</button>
                  <button onClick={() => onDelete(emp.id)} className="text-red-600 hover:text-red-900">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
