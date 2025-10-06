import React, { useEffect } from "react";

const ContractPrint = ({ contract, onBack }) => {
  useEffect(() => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head><title>สัญญาจ้าง - ${contract.employeeName}</title></head>
        <body>
          <h1>สัญญาจ้างงาน</h1>
          <p><strong>พนักงาน:</strong> ${contract.employeeName}</p>
          <p><strong>ประเภท:</strong> ${contract.type}</p>
          <p><strong>วันที่เริ่ม:</strong> ${contract.startDate}</p>
          <p><strong>วันที่สิ้นสุด:</strong> ${contract.endDate}</p>
          <p><strong>เงินเดือน:</strong> ${contract.salary.toLocaleString()} บาท</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    onBack();
  }, [contract, onBack]);

  return null;
};

export default ContractPrint;
