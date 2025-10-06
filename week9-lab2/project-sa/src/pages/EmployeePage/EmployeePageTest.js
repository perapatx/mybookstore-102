import React, { useState } from "react";
import EmployeeList from "./EmployeeList";
import EmployeeView from "./EmployeeView";
import EmployeeFormAdd from "./EmployeeFormAdd";
import EmployeeFormEdit from "./EmployeeFormEdit";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      firstNameTh: "สมชาย",
      lastNameTh: "ใจดี",
      firstNameEn: "Somchai",
      lastNameEn: "Jaidee",
      email: "somchai@example.com",
      phone: "0812345678",
      position: "Developer",
      department: "IT",
      salary: 30000,
      startDate: "2023-01-15",
      status: "active",
    },
    {
      id: 2,
      firstNameTh: "สาวิตรี",
      lastNameTh: "สุขใจ",
      firstNameEn: "Sawitree",
      lastNameEn: "Sukjai",
      email: "sawitree@example.com",
      phone: "0898765432",
      position: "HR Manager",
      department: "HR",
      salary: 40000,
      startDate: "2022-08-01",
      status: "inactive",
    },
    {
      id: 3,
      firstNameTh: "อนุชา",
      lastNameTh: "พัฒนา",
      firstNameEn: "Anucha",
      lastNameEn: "Patthana",
      email: "anucha@example.com",
      phone: "0861234567",
      position: "Marketing Manager",
      department: "Marketing",
      salary: 35000,
      startDate: "2021-05-20",
      status: "active",
    },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [adding, setAdding] = useState(false);

  // ดูรายละเอียด
  const handleView = (emp) => setSelectedEmployee(emp);
  const handleCloseView = () => setSelectedEmployee(null);

  // เพิ่มพนักงาน
  const handleAdd = () => setAdding(true);
  const handleSaveAdd = (newEmp) => {
    const nextId = employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    setEmployees([...employees, { id: nextId, ...newEmp }]);
    setAdding(false);
  };
  const handleCancelAdd = () => setAdding(false);

  // แก้ไขพนักงาน
  const handleEdit = (emp) => setEditingEmployee(emp);
  const handleSaveEdit = (updatedEmp) => {
    setEmployees(employees.map(e => (e.id === editingEmployee.id ? { ...e, ...updatedEmp } : e)));
    setEditingEmployee(null);
  };
  const handleCancelEdit = () => setEditingEmployee(null);

  // ลบพนักงาน
  const handleDelete = (id) => {
    if (window.confirm("คุณต้องการลบพนักงานคนนี้หรือไม่?")) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

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
