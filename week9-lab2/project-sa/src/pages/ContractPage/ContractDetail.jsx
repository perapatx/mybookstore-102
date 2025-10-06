import React from "react";

const ContractDetail = ({ contract, onBack, onEdit, onPrint }) => {
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">รายละเอียดสัญญา</h2>
        <button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded-lg">กลับ</button>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-bold text-xl mb-4">{contract.employeeName}</h3>
        <p><strong>ประเภท:</strong> {contract.type}</p>
        <p><strong>ระยะเวลา:</strong> {contract.startDate} - {contract.endDate}</p>
        <p><strong>เงินเดือน:</strong> {contract.salary.toLocaleString()} บาท</p>
        <p><strong>สถานะ:</strong> {contract.status}</p>
        <div className="mt-6 space-x-3">
          <button onClick={onEdit} className="bg-blue-600 text-white px-4 py-2 rounded">แก้ไข</button>
          <button onClick={onPrint} className="bg-green-600 text-white px-4 py-2 rounded">พิมพ์</button>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
