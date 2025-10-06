import React from "react";

const ContractView = ({ contract, onClose }) => {
  if (!contract) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold"
        >
          X
        </button>

        <h2 className="text-2xl font-bold mb-4">รายละเอียดสัญญา</h2>

        <div className="space-y-2">
          <p><span className="font-semibold">พนักงาน:</span> {contract.employeeName}</p>
          <p><span className="font-semibold">ประเภทสัญญา:</span> {contract.type}</p>
          <p><span className="font-semibold">ระยะเวลา:</span> {contract.startDate} - {contract.endDate}</p>
          <p><span className="font-semibold">เงินเดือน:</span> {contract.salary.toLocaleString()} บาท</p>
          <p>
            <span className="font-semibold">สถานะ:</span>{" "}
            <span className={`px-2 inline-flex text-xs rounded-full ${contract.status === "active" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"}`}>
              {contract.status === "active" ? "ใช้งาน" : "หมดอายุ"}
            </span>
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractView;
