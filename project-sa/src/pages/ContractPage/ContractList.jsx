import React from "react";

const ContractList = ({ contracts, onAdd, onView, onEdit, onDelete }) => {
  // ฟังก์ชันคำนวณระยะเวลา
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    const years = diffDays / 365;
    const months = diffDays / 30.44; // ค่าเฉลี่ยวันต่อเดือน
    
    if (years >= 1) {
      return `${years.toFixed(1)} ปี`;
    } else {
      return `${Math.round(months)} เดือน`;
    }
  };

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">รหัสสัญญา</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">พนักงาน</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ประเภทสัญญา</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ระยะเวลา</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">เงินเดือน</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">จัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contracts.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">ไม่มีสัญญา</td>
              </tr>
            )}
            {contracts.map((c) => (
              <tr key={c.id}>
                {/* 🔹 แสดงรหัสสัญญาแทนรหัสพนักงาน */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.contractCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.employeeName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {calculateDuration(c.startDate, c.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.salary.toLocaleString()} บาท</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${c.status === "active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"}`}>
                    {c.status === "active" ? "ใช้งาน" : "หมดอายุ"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  <button onClick={() => onView(c)} className="text-gray-600 hover:text-gray-900">ดู</button>
                  <button onClick={() => onEdit(c)} className="text-blue-600 hover:text-blue-900">แก้ไข</button>
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
