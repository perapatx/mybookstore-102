import React from "react";

const EmployeeView = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">รายละเอียดพนักงาน</h2>

        <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
          <p><strong>ชื่อไทย:</strong> {employee.firstNameTh} {employee.lastNameTh}</p>
          <p><strong>ชื่ออังกฤษ:</strong> {employee.firstNameEn} {employee.lastNameEn}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>เบอร์โทร:</strong> {employee.phone}</p>
          <p><strong>ตำแหน่ง:</strong> {employee.position}</p>
          <p><strong>แผนก:</strong> {employee.department}</p>
          <p><strong>เงินเดือน:</strong> {employee.salary.toLocaleString()} บาท</p>
          <p><strong>วันที่เริ่มงาน:</strong> {employee.startDate}</p>
          <p>
            <strong>สถานะ:</strong>{" "}
            {employee.status === "active" ? (
              <span className="px-2 inline-flex text-xs rounded-full bg-green-100 text-green-800">ทำงาน</span>
            ) : (
              <span className="px-2 inline-flex text-xs rounded-full bg-red-100 text-red-800">ลาออก</span>
            )}
          </p>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;
