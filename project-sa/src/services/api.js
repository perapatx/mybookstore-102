// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee API calls
export const employeeAPI = {
  // Get all employees
  getAll: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  // Get employee by ID
  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Create new employee
  create: async (employeeData) => {
    const payload = {
      thai_first_name: employeeData.firstNameTh,
      thai_last_name: employeeData.lastNameTh,
      eng_first_name: employeeData.firstNameEn,
      eng_last_name: employeeData.lastNameEn,
      gender: employeeData.gender,
      birth_date: employeeData.birthDate,
      address: employeeData.address,
      phone: employeeData.phone,
      email: employeeData.email,
      department_id: employeeData.department,
      position: employeeData.position,
      hire_date: employeeData.startDate,
      status: employeeData.status === 'active' ? 'Active' : 'Inactive',
    };
    const response = await api.post('/employees', payload);
    return response.data;
  },

  // Update employee
  update: async (id, employeeData) => {
    const payload = {
      thai_first_name: employeeData.firstNameTh,
      thai_last_name: employeeData.lastNameTh,
      eng_first_name: employeeData.firstNameEn,
      eng_last_name: employeeData.lastNameEn,
      gender: employeeData.gender,
      birth_date: employeeData.birthDate,
      address: employeeData.address,
      phone: employeeData.phone,
      email: employeeData.email,
      department_id: employeeData.department,
      position: employeeData.position,
      hire_date: employeeData.startDate,
      status: employeeData.status === 'active' ? 'Active' : 'Inactive',
    };
    const response = await api.put(`/employees/${id}`, payload);
    return response.data;
  },

  // Delete employee
  delete: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
};

export const leaveAPI = {
  // Get all employees
  getAll: async () => {
    const response = await api.get('/leaves');
    return response.data;
  },


};

export const holidayAPI = {
  // Get all employees
  getAll: async () => {
    const response = await api.get('/holiday');
    return response.data;
  },
  
  create: async (holidayData) => {
    const response = await api.post('/holidays', holidayData);
    return response.data;
  },

  // ✅ ลบวันหยุด
  delete: async (id) => {
    const response = await api.delete(`/holidays/${id}`);
    return response.data;
  },

};
export const ReportAPI = {
  getAll: async () => {
    const res = await api.get('/reports');
    return res.data;
  },

  create: async (reportData) => {
    const formData = new FormData();
    formData.append("employee_id", reportData.employeeId);
    formData.append("employee_name", reportData.employeeName);
    formData.append("name", reportData.name);
    formData.append("description", reportData.description);
    formData.append("date", reportData.date);
    formData.append("category", reportData.category);

    reportData.files.forEach(file => {
      formData.append("files", file);
    });

    const res = await api.post('/reports', formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/reports/${id}`);
    return res.data;
  }
};
export default api;
