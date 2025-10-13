import React, { useState, useEffect } from "react";
import EmployeeList from "./EmployeeList";
import EmployeeView from "./EmployeeView";
import EmployeeFormAdd from "./EmployeeFormAdd";
import EmployeeFormEdit from "./EmployeeFormEdit";
import { employeeAPI } from "../../services/api";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [adding, setAdding] = useState(false);

  // Load employees from API on mount
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeAPI.getAll();
      
      // Transform backend data to match frontend format
      const transformedData = data.map(emp => ({
        id: emp.id,
        firstNameTh: emp.thai_first_name, // Database doesn't have Thai names
        lastNameTh: emp.thai_last_name,
        firstNameEn: emp.eng_first_name,
        lastNameEn: emp.eng_last_name,
        email: emp.email,
        phone: emp.phone,
        position: emp.position,
        department: emp.department_id,
        salary: 0, // Not in employee table
        birthDate: emp.birth_date,
        address: emp.address,
        gender: emp.gender,
        startDate: emp.hire_date,
        status: emp.status?.toLowerCase() === 'active' ? 'active' : 'inactive',
      }));
      
      setEmployees(transformedData);
    } catch (err) {
      console.error("Error loading employees:", err);
      alert("ไม่สามารถโหลดข้อมูลพนักงานได้");
    } finally {
      setLoading(false);
    }
  };

  // ดูรายละเอียด
  const handleView = (emp) => setSelectedEmployee(emp);
  const handleCloseView = () => setSelectedEmployee(null);

  // เพิ่มพนักงาน
  const handleAdd = () => setAdding(true);
  const handleSaveAdd = async (newEmp) => {
    try {
      await employeeAPI.create(newEmp);
      await loadEmployees(); // Reload list
      setAdding(false);
      alert("เพิ่มพนักงานสำเร็จ");
    } catch (err) {
      console.error("Error adding employee:", err);
      alert("ไม่สามารถเพิ่มพนักงานได้: " + (err.response?.data?.error || err.message));
    }
  };
  const handleCancelAdd = () => setAdding(false);

  // แก้ไขพนักงาน
  const handleEdit = (emp) => setEditingEmployee(emp);
  const handleSaveEdit = async (updatedEmp) => {
    try {
      await employeeAPI.update(editingEmployee.id, updatedEmp);
      await loadEmployees(); // Reload list
      setEditingEmployee(null);
      alert("แก้ไขข้อมูลสำเร็จ");
    } catch (err) {
      console.error("Error updating employee:", err);
      alert("ไม่สามารถแก้ไขข้อมูลได้: " + (err.response?.data?.error || err.message));
    }
  };
  const handleCancelEdit = () => setEditingEmployee(null);

  // ลบพนักงาน
  const handleDelete = async (id) => {
    if (window.confirm("คุณต้องการลบพนักงานคนนี้หรือไม่?")) {
      try {
        await employeeAPI.delete(id);
        await loadEmployees(); // Reload list
        alert("ลบพนักงานสำเร็จ");
      } catch (err) {
        console.error("Error deleting employee:", err);
        alert("ไม่สามารถลบพนักงานได้: " + (err.response?.data?.error || err.message));
      }
    }
  };

  if (loading && employees.length === 0) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-lg text-gray-600">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {!adding && !editingEmployee && (
        <EmployeeList
          employees={employees}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      {/* ฟอร์มเพิ่มพนักงาน */}
      {adding && (
        <EmployeeFormAdd
          onSave={handleSaveAdd}
          onCancel={handleCancelAdd}
          nextEmployeeId="จะถูกสร้างโดยระบบ"
        />
      )}

      {/* ฟอร์มแก้ไขพนักงาน */}
      {editingEmployee && (
        <EmployeeFormEdit
          employee={editingEmployee}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}

      {/* ดูรายละเอียด */}
      {selectedEmployee && (
        <EmployeeView
          employee={selectedEmployee}
          onClose={handleCloseView}
        />
      )}
    </div>
  );
};

export default EmployeePage;