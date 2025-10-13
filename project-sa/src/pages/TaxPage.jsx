import React, { useState, useEffect } from 'react';
import { taxAPI } from '../services/api';
import { employeeAPI } from '../services/api';

const TaxPage = () => {
  // ข้อมูลตัวอย่างพนักงาน
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([
    
  ]);
  const [taxRecords, setTaxRecords] = useState([]);

  useEffect(() => {
    loadEmployees();
    loadTax();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeAPI.getAll();
      const transformed = data.map(emp => ({
        id: emp.id,
        name: emp.thai_first_name +' ' +emp.thai_last_name,
        position: emp.position,
        department: emp.department_id,
      }));

      setEmployees(transformed);
    } catch (err) {
      console.error("Error loading employees:", err);
      alert("ไม่สามารถโหลดข้อมูลพนักงานได้");
    } finally {
      setLoading(false);
    }
  };

  // State สำหรับเก็บข้อมูลภาษีทั้งหมด
  
  const statusMap = {
  Calculated: "คำนวณแล้ว",
  inCalculated: "ยังไม่คำนวณ",
  };
  const loadTax = async () => {
    try {
      setLoading(true);
      const data = await taxAPI.getAll();
      const transformed = data.map(emp => ({
        id: emp.id,
        employeeName: emp.employee_name,
        year: emp.tax_year,
        income: emp.salary,
        expenses: emp.tax_paid,
        insurance: emp.benefits,
        status: statusMap[emp.status]
      }));

      setTaxRecords(transformed);
    } catch (err) {
      console.error("Error loading employees:", err);
      alert("ไม่สามารถโหลดข้อมูลพนักงานได้");
    } finally {
      setLoading(false);
    }
  };

  // State สำหรับควบคุมการแสดงหน้าฟอร์มคำนวณภาษี
  const [showCalculateForm, setShowCalculateForm] = useState(false);
  
  // State สำหรับเก็บข้อมูลในฟอร์ม
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    year: new Date().getFullYear(),
    monthlyIncome: ""
  });

  // ฟังก์ชันคำนวณภาษีตามขั้นบันไดภาษีเงินได้
  const calculateTax = (income) => {
    const deduction = 60000; // ค่าลดหย่อนพื้นฐาน
    const netIncome = income - deduction;
    
    // คำนวณภาษีตามขั้นบันได
    if (netIncome <= 0) return 0;
    if (netIncome <= 150000) return netIncome * 0; // 0%
    if (netIncome <= 300000) return (netIncome - 150000) * 0.05; // 5%
    if (netIncome <= 500000) return 7500 + (netIncome - 300000) * 0.10; // 10%
    if (netIncome <= 750000) return 27500 + (netIncome - 500000) * 0.15; // 15%
    return 65000 + (netIncome - 750000) * 0.20; // 20%
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงค่าในฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // ถ้าเลือกพนักงานให้อัพเดททั้งรหัสและชื่อ
    if (name === "employeeId") {
      const selectedEmployee = employees.find(emp => emp.id === value);
      setFormData(prev => ({
        ...prev,
        employeeId: value,
        employeeName: selectedEmployee ? selectedEmployee.name : ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // ฟังก์ชันจัดการการส่งฟอร์มคำนวณภาษี
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // คำนวณรายได้ต่อปีจากรายได้ต่อเดือน
    const yearlyIncome = parseFloat(formData.monthlyIncome) * 12;
    // คำนวณภาษี
    const tax = calculateTax(yearlyIncome);
    // คำนวณประกันสังคม 1.5% ของรายได้
    const insurance = yearlyIncome * 0.015;
    
    // สร้างข้อมูลภาษีใหม่
    const newRecord = {
      id: formData.employeeId,
      name: formData.employeeName,
      year: parseInt(formData.year),
      income: yearlyIncome,
      expenses: tax,
      insurance: insurance,
      status: "คำนวณแล้ว"
    };

    // เพิ่มข้อมูลใหม่เข้าไปในรายการภาษี
    setTaxRecords([...taxRecords, newRecord]);
    // รีเซ็ตฟอร์ม
    setFormData({ employeeId: "", employeeName: "", year: new Date().getFullYear(), monthlyIncome: "" });
    // กลับไปหน้าแรก
    setShowCalculateForm(false);
  };

  // ฟังก์ชันลบข้อมูลภาษี
  const handleDelete = (id) => {
    setTaxRecords(taxRecords.filter(record => record.id !== id));
  };

  // หน้าฟอร์มคำนวณภาษี
  if (showCalculateForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Card ฟอร์มพร้อมเงาและขอบ */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              {/* Header พร้อมปุ่มกลับ */}
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">คำนวณภาษีพนักงาน</h1>
                <button
                  onClick={() => setShowCalculateForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  กลับ
                </button>
              </div>

              {/* ฟอร์มกรอกข้อมูล */}
              <div>
                {/* Dropdown เลือกพนักงาน */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    เลือกพนักงาน
                  </label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">เลือกพนักงาน</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.id} - {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Input ปี */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    ปี
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Input รายได้ต่อเดือน */}
                <div className="mb-8">
                  <label className="block text-gray-700 font-medium mb-2">
                    รายได้ต่อเดือน
                  </label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleInputChange}
                    placeholder="กรอกรายได้ต่อเดือน"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* ปุ่มคำนวณภาษี */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  คำนวณภาษี
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // หน้าแสดงรายการภาษี
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header พร้อมปุ่มคำนวณภาษีใหม่ */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">จัดการภาษีพนักงาน</h1>
            <button
              onClick={() => setShowCalculateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              คำนวณภาษีใหม่
            </button>
          </div>

          {/* Card ตารางพร้อมเงาและขอบ */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              {/* หัวตาราง */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-600 font-medium">รหัสพนักงาน</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-medium">ชื่อพนักงาน</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-medium">ปี</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-medium">รายได้</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-medium">ภาษี</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-medium">ประกันสังคม</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-medium">สถานะ</th>
                  <th className="px-6 py-4 text-left text-gray-600 font-medium">จัดการ</th>
                </tr>
              </thead>
              {/* เนื้อหาตาราง */}
              <tbody className="divide-y divide-gray-100">
                {taxRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 font-medium">{record.id}</td>
                    <td className="px-6 py-4 text-gray-900">{record.employeeName}</td>
                    <td className="px-6 py-4 text-gray-700">{record.year}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {record.income.toLocaleString()} บาท
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {record.expenses.toLocaleString()} บาท
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {record.insurance.toLocaleString()} บาท
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* แสดงข้อความเมื่อไม่มีข้อมูล */}
            {taxRecords.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                ยังไม่มีข้อมูลภาษี
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxPage;
