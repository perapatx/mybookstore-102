import React, { useState, useEffect } from "react";

const ContractForm = ({ contract, employees, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    employee_id: contract?.employee_id || "",
    type: contract?.type || "",
    start_date: contract?.start_date || "",
    end_date: contract?.end_date || "",
    salary: contract?.salary || 0,
    status: contract?.status || "active",
  });

  useEffect(() => {
    setFormData({
      employee_id: contract?.employee_id || "",
      type: contract?.type || "",
      start_date: contract?.start_date || "",
      end_date: contract?.end_date || "",
      salary: contract?.salary || 0,
      status: contract?.status || "active",
    });
  }, [contract]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "salary"
          ? parseFloat(value) || 0
          : name === "employee_id"
          ? parseInt(value) || 0
          : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.employee_id || !formData.type || !formData.start_date) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    onSave({ ...formData, id: contract?.id });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6">
        {contract ? "แก้ไขสัญญา" : "สร้างสัญญาใหม่"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-2">พนักงาน</label>
          <select
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          >
            <option value="">-- เลือกพนักงาน --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">ประเภทสัญญา</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">-- เลือกประเภท --</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Intern">Intern</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">เริ่มวันที่</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">สิ้นสุดวันที่</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">เงินเดือน</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">สถานะ</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="active">ใช้งาน</option>
            <option value="inactive">หมดอายุ</option>
          </select>
        </div>

        <div className="md:col-span-2 flex gap-4 mt-6">
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium shadow-md transition-colors"
          >
            บันทึก
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full md:w-auto bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium shadow-md transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContractForm;