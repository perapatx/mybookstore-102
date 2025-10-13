import React, { useEffect, useState } from "react";
import { employeeAPI, contractAPI } from "../../services/api";
import ContractForm from "./ContractForm";
import ContractList from "./ContractList";
import ContractView from "./ContractView";

const ContractPage = () => {
  const [employees, setEmployees] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [empRes, contractRes] = await Promise.all([
          employeeAPI.getAll(),
          contractAPI.getAll(),
        ]);

        // แปลงพนักงาน
        const empData = (empRes.data || empRes || []).map((emp) => ({
          id: emp.id,
          name:
            emp.thai_first_name && emp.thai_last_name
              ? `${emp.thai_first_name} ${emp.thai_last_name}`
              : emp.firstNameTh && emp.lastNameTh
              ? `${emp.firstNameTh} ${emp.lastNameTh}`
              : "ไม่ระบุชื่อ",
        }));
        setEmployees(empData);

        // สัญญา
        const contractData = contractRes.data?.data || contractRes.data || [];
        setContracts(Array.isArray(contractData) ? contractData : []);
      } catch (err) {
        console.error("โหลดข้อมูลไม่สำเร็จ:", err);
        alert("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAdd = async (contract) => {
    try {
      const res = await contractAPI.create(contract);
      const newContract = res.data || res.data?.data || contract;
      setContracts([...contracts, newContract]);
      setView("list");
      alert("สร้างสัญญาเรียบร้อยแล้ว");
    } catch (err) {
      console.error("สร้างสัญญาไม่สำเร็จ:", err);
      alert(err.response?.data?.error || "ไม่สามารถสร้างสัญญาได้");
    }
  };

  const handleUpdate = async (updated) => {
    try {
      const res = await contractAPI.update(updated.id, updated);
      const updatedContract = res.data?.data || res.data || updated;
      setContracts(
        contracts.map((c) => (c.id === updated.id ? updatedContract : c))
      );
      setView("list");
      alert("แก้ไขสัญญาสำเร็จ");
    } catch (err) {
      console.error("แก้ไขไม่สำเร็จ:", err);
      alert(err.response?.data?.error || "ไม่สามารถแก้ไขสัญญาได้");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณต้องการลบสัญญานี้หรือไม่?")) return;
    try {
      await contractAPI.delete(id);
      setContracts(contracts.filter((c) => c.id !== id));
      alert("ลบสัญญาสำเร็จ");
    } catch (err) {
      console.error("ลบไม่สำเร็จ:", err);
      alert("ไม่สามารถลบสัญญาได้");
    }
  };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div className="p-6">
      {view === "list" && (
        <ContractList
          contracts={contracts}
          onAdd={() => setView("add")}
          onView={(c) => {
            setSelectedContract(c);
            setView("detail");
          }}
          onEdit={(c) => {
            setSelectedContract(c);
            setView("edit");
          }}
          onDelete={handleDelete}
        />
      )}

      {(view === "add" || view === "edit") && (
        <ContractForm
          employees={employees}
          contract={view === "edit" ? selectedContract : null}
          onSave={view === "edit" ? handleUpdate : handleAdd}
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