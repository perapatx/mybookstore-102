import React from "react";

const ContractView = ({ contract, onClose }) => {
  return (
    <div className="p-6 bg-white rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">รายละเอียดสัญญา</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <p><strong>ID:</strong> {contract.id}</p>
        <p><strong>พนักงาน:</strong> {contract.employee_name || contract.employee_id}</p>
        <p><strong>ประเภท:</strong> {contract.type}</p>
        <p><strong>เริ่ม:</strong> {contract.start_date}</p>
        <p><strong>สิ้นสุด:</strong> {contract.end_date}</p>
        <p><strong>เงินเดือน:</strong> {contract.salary}</p>
        <p><strong>สถานะ:</strong> {contract.status}</p>
      </div>
      <button
        onClick={onClose}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        ปิด
      </button>
    </div>
  );
};

export default ContractView;
