import React from "react";

const ContractList = ({ contracts, onAdd, onView, onEdit, onDelete }) => {
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">ระบบสัญญาจ้าง</h2>
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          สร้างสัญญาใหม่
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">พนักงาน</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">ประเภทสัญญา</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">ระยะเวลา</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">เงินเดือน</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">สถานะ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">จัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contracts.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">ไม่มีสัญญา</td>
              </tr>
            )}
            {contracts.map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-4">{c.employeeName}</td>
                <td className="px-6 py-4">{c.type}</td>
                <td className="px-6 py-4">{c.startDate} - {c.endDate}</td>
                <td className="px-6 py-4">{c.salary.toLocaleString()} บาท</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs rounded-full ${c.status === "active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"}`}>
                    {c.status === "active" ? "ใช้งาน" : "หมดอายุ"}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => onView(c)} className="text-blue-600 hover:text-blue-900">ดู</button>
                  <button onClick={() => onEdit(c)} className="text-green-600 hover:text-green-900">แก้ไข</button>
                  <button onClick={() => onDelete(c.id)} className="text-red-600 hover:text-red-900">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractList;
