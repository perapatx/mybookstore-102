import React, { useState } from "react";

const ContractForm = ({ employees, contract, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    contract || { employeeName: "", type: "", startDate: "", endDate: "", salary: 0, status: "active" }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "salary" ? parseInt(value) : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fade-in p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{contract ? "แก้ไขสัญญา" : "สร้างสัญญาใหม่"}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">พนักงาน</label>
          <select name="employeeName" value={formData.employeeName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg">
            <option value="">เลือกพนักงาน</option>
            {employees.map(emp => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">ประเภทสัญญา</label>
          <select name="type" value={formData.type} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg">
            <option value="">เลือกประเภท</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Intern">Intern</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">เริ่มวันที่</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">สิ้นสุดวันที่</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">เงินเดือน</label>
          <input type="number" name="salary" value={formData.salary} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">สถานะ</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
            <option value="active">ใช้งาน</option>
            <option value="inactive">หมดอายุ</option>
          </select>
        </div>
        <div className="md:col-span-2 flex space-x-2 mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">บันทึก</button>
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">ยกเลิก</button>
        </div>
      </form>
    </div>
  );
};

export default ContractForm;
