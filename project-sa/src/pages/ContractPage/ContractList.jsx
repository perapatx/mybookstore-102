import React from "react";

const ContractList = ({ contracts, onAdd, onView, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString("th-TH") : "";
  };

  // ฟังก์ชันกำหนดสีตามสถานะ
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-700";
    const s = status.toLowerCase();
    if (s === "hired" || s === "active") return "bg-green-100 text-green-700";
    if (s === "inactive") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">รายการสัญญา</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            onClick={onAdd}
          >
            เพิ่มสัญญา
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-gray-600 font-medium">ID</th>
                <th className="px-6 py-4 text-left text-gray-600 font-medium">พนักงาน</th>
                <th className="px-6 py-4 text-left text-gray-600 font-medium">ประเภท</th>
                <th className="px-6 py-4 text-left text-gray-600 font-medium">เริ่ม</th>
                <th className="px-6 py-4 text-left text-gray-600 font-medium">สิ้นสุด</th>
                <th className="px-6 py-4 text-left text-gray-600 font-medium">สถานะ</th>
                <th className="px-6 py-4 text-left text-gray-600 font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900 font-medium">{c.id}</td>
                  <td className="px-6 py-4 text-gray-900">{c.employee_name || c.employee_id}</td>
                  <td className="px-6 py-4 text-gray-700">{c.type}</td>
                  <td className="px-6 py-4 text-gray-700">{formatDate(c.start_date)}</td>
                  <td className="px-6 py-4 text-gray-700">{formatDate(c.end_date)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(c.status)}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => onView(c)}
                      className=" text-blue-700 px-3 py-1 rounded hover:bg-blue-200 font-medium transition-colors"
                    >
                      ดู
                    </button>
                    
                    <button
                      onClick={() => onDelete(c.id)}
                      className=" text-red-700 px-3 py-1 rounded hover:bg-red-200 font-medium transition-colors"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
              {contracts.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    ยังไม่มีสัญญา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContractList;