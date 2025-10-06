import React, { useState } from 'react';
import { MailIcon, PhoneIcon, LocationMarkerIcon, ClockIcon } from '@heroicons/react/outline';

const Employee = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">จัดการข้อมูลพนักงาน</h1>
            <p className="text-lg text-gray-600">
              มีคำถาม? ต้องการความช่วยเหลือ? เราพร้อมให้บริการคุณ
            </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;
