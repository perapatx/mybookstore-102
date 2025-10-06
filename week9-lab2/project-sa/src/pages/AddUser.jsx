import React, { useState } from 'react';
import {users, addUser } from '../data/userData';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('manager'); // default role
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
  // ตรวจสอบ HR ก่อนเพิ่ม
  if (!loggedInUser || loggedInUser.role !== 'hr') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold text-lg">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate
    if (!username || !password || !name || !email) {
      setError('กรุณากรอกทุกช่อง');
      return;
    }

    // ตรวจสอบ username ซ้ำ
    const exists = users.find(u => u.username === username);
    if (exists) {
      setError('ชื่อผู้ใช้นี้มีอยู่แล้ว');
      return;
    }

    // เพิ่ม user
    addUser({ username, password, name, email, role });
    setSuccess('เพิ่มผู้ใช้เรียบร้อยแล้ว!');

    // Reset form
    setUsername('');
    setPassword('');
    setName('');
    setEmail('');
    setRole('manager');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">เพิ่มผู้ใช้ใหม่</h2>

        {error && <p className="mb-4 text-red-600">{error}</p>}
        {success && <p className="mb-4 text-green-600">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อผู้ใช้</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ชื่อ</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">อีเมล</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">บทบาท</label>
            <select
              className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="hr">HR</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            เพิ่มผู้ใช้
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
