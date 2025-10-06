// src/pages/ContractPage/index.js
import React, { useState } from "react";
import ContractList from "./ContractList";
import ContractForm from "./ContractForm";
import ContractView from "./ContractView";

const ContractPage = () => {
  // ตัวอย่างพนักงานสอดคล้องกับ EmployeePage
  const employees = [
    { id: "EMP001", firstNameTh: "สมชาย", lastNameTh: "ใจดี" },
    { id: "EMP002", firstNameTh: "สาวิตรี", lastNameTh: "สุขใจ" },
    { id: "EMP003", firstNameTh: "อนุชา", lastNameTh: "พัฒนา" },
  ];

  // แปลงชื่อเต็มสำหรับ select
  const employeeOptions = employees.map(emp => ({
    id: emp.id,
    name: `${emp.id} - ${emp.firstNameTh} ${emp.lastNameTh}`
  }));

  // ตัวอย่างสัญญาที่สร้างแล้ว (เพิ่ม contractCode)
  const initialContracts = [
    {
      id: 1,
      contractCode: "CT001",
      employeeId: "EMP001",
      employeeName: "สมชาย ใจดี",
      type: "Full-time",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      salary: 30000,
      status: "active"
    },
    {
      id: 2,
      contractCode: "CT002",
      employeeId: "EMP002",
      employeeName: "สาวิตรี สุขใจ",
      type: "Part-time",
      startDate: "2023-02-01",
      endDate: "2023-08-31",
      salary: 15000,
      status: "inactive"
    }
  ];

  const [contracts, setContracts] = useState(initialContracts);
  const [selectedContract, setSelectedContract] = useState(null);
  const [view, setView] = useState("list"); // list | add | edit | detail

  // 🔹 ฟังก์ชันสร้างรหัสสัญญาใหม่
  const generateContractCode = () => {
    const nextNumber = contracts.length + 1;
    return `CT${String(nextNumber).padStart(3, "0")}`; // เช่น CT003
  };

  const handleAdd = (contract) => {
    const emp = employees.find(e => e.id === contract.employeeId);
    setContracts([
      ...contracts,
      {
        ...contract,
        id: Date.now(),
        contractCode: generateContractCode(), // เพิ่มรหัสสัญญาอัตโนมัติ
        employeeName: emp ? `${emp.firstNameTh} ${emp.lastNameTh}` : contract.employeeName
      }
    ]);
    setView("list");
  };

  const handleUpdate = (updated) => {
    const emp = employees.find(e => e.id === updated.employeeId);
    setContracts(contracts.map(c => c.id === updated.id ? { 
      ...updated, 
      employeeName: emp ? `${emp.firstNameTh} ${emp.lastNameTh}` : updated.employeeName,
      contractCode: c.contractCode // คงค่า contractCode เดิมไว้
    } : c));
    setView("list");
  };

  const handleDelete = (id) => {
    if (window.confirm("ลบสัญญานี้หรือไม่?")) {
      setContracts(contracts.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-6">
      {view === "list" && (
        <ContractList
          contracts={contracts}
          onAdd={() => setView("add")}
          onView={(c) => { setSelectedContract(c); setView("detail"); }}
          onEdit={(c) => { setSelectedContract(c); setView("edit"); }}
          onDelete={handleDelete}
        />
      )}

      {view === "add" && (
        <ContractForm
          employees={employeeOptions}
          onSave={handleAdd}
          onCancel={() => setView("list")}
        />
      )}

      {view === "edit" && selectedContract && (
        <ContractForm
          employees={employeeOptions}
          contract={selectedContract}
          onSave={handleUpdate}
          onCancel={() => setView("list")}
        />
      )}

      {view === "detail" && selectedContract && (
        <ContractView
          contract={selectedContract}
          onClose={() => setView("list")}
        />
      )}
    </div>
  );
};

export default ContractPage;
