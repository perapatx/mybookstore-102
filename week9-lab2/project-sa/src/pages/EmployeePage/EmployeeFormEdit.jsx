import React, { useState } from "react";

const EmployeeFormEdit = ({ employee, onSave, onCancel }) => {
  const [form, setForm] = useState({
    firstNameTh: employee.firstNameTh || "",
    lastNameTh: employee.lastNameTh || "",
    firstNameEn: employee.firstNameEn || "",
    lastNameEn: employee.lastNameEn || "",
    email: employee.email || "",
    position: employee.position || "",
    department: employee.department || "",
    salary: employee.salary || "",
    phone: employee.phone || "",
    startDate: employee.startDate || "",
    status: employee.status || "active",
  });

  const positions = ["Developer", "HR Manager", "Marketing Manager", "Sales Executive", "Accountant"];
  const departments = ["IT", "HR", "Marketing", "Sales", "Finance"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, salary: parseInt(form.salary) });
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">แก้ไขข้อมูลพนักงาน</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ชื่อไทย */}
        <div>
          <label>ชื่อไทย</label>
          <input
            name="firstNameTh"
            value={form.firstNameTh}
            onChange={handleChange}
            pattern="^[ก-๙\s]+$"
            title="กรอกได้เฉพาะตัวอักษรไทย"
            required
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div>
          <label>นามสกุลไทย</label>
          <input
            name="lastNameTh"
            value={form.lastNameTh}
            onChange={handleChange}
            pattern="^[ก-๙\s]+$"
            title="กรอกได้เฉพาะตัวอักษรไทย"
            required
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* ชื่ออังกฤษ */}
        <div>
          <label>ชื่ออังกฤษ</label>
          <input
            name="firstNameEn"
            value={form.firstNameEn}
            onChange={handleChange}
            pattern="^[A-Za-z\s]+$"
            title="กรอกได้เฉพาะตัวอักษรอังกฤษ"
            required
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>
        <div>
          <label>นามสกุลอังกฤษ</label>
          <input
            name="lastNameEn"
            value={form.lastNameEn}
            onChange={handleChange}
            pattern="^[A-Za-z\s]+$"
            title="กรอกได้เฉพาะตัวอักษรอังกฤษ"
            required
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Email */}
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* ตำแหน่ง */}
        <div>
          <label>ตำแหน่ง</label>
          <select
            name="position"
            value={form.position}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="">เลือกตำแหน่ง</option>
            {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
          </select>
        </div>

        {/* แผนก */}
        <div>
          <label>แผนก</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="">เลือกแผนก</option>
            {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </select>
        </div>

        {/* เงินเดือน */}
        <div>
          <label>เงินเดือน</label>
          <input
            name="salary"
            type="number"
            value={form.salary}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* เบอร์โทร */}
        <div>
          <label>เบอร์โทร</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* วันที่เริ่มงาน */}
        <div>
          <label>วันที่เริ่มงาน</label>
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        {/* สถานะ */}
        <div>
          <label>สถานะ</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="active">ทำงาน</option>
            <option value="inactive">ลาออก</option>
          </select>
        </div>

        {/* ปุ่มบันทึก/ยกเลิก */}
        <div className="md:col-span-2 flex justify-end gap-4 mt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600">ยกเลิก</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">บันทึก</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeFormEdit;
