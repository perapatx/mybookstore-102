import React, { useEffect } from "react";

const ContractPrint = ({ contract, onBack }) => {
  useEffect(() => {
    if (!contract) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>สัญญาจ้าง - ${contract.employeeName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            p { font-size: 16px; margin: 5px 0; }
            .status-active { color: green; font-weight: bold; }
            .status-inactive { color: red; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>สัญญาจ้างงาน</h1>
          <p><strong>รหัสสัญญา:</strong> ${contract.contractCode}</p>
          <p><strong>รหัสพนักงาน:</strong> ${contract.employeeId}</p>
          <p><strong>พนักงาน:</strong> ${contract.employeeName}</p>
          <p><strong>ประเภทสัญญา:</strong> ${contract.type}</p>
          <p><strong>วันที่เริ่ม:</strong> ${contract.startDate}</p>
          <p><strong>วันที่สิ้นสุด:</strong> ${contract.endDate}</p>
          <p><strong>เงินเดือน:</strong> ${contract.salary.toLocaleString()} บาท</p>
          <p><strong>สถานะ:</strong> <span class="${contract.status === 'active' ? 'status-active' : 'status-inactive'}">
            ${contract.status === 'active' ? 'ใช้งาน' : 'หมดอายุ'}
          </span></p>
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
