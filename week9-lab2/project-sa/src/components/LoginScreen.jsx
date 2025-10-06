import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { users } from '../data/userData'; // ดึง users จากไฟล์กลาง

const LoginScreen = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(
    sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null
  );

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // ค้นหา user จาก userData.js
      const user = users.find(
        u => u.username === username && u.password === password
      );

      if (user) {
        const userWithoutPassword = {
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.name,
          email: user.email
        };
        
        setLoggedInUser(userWithoutPassword);
        sessionStorage.setItem('user', JSON.stringify(userWithoutPassword));
        setIsLoggedIn(true);
        navigate('/');
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        setPassword('');
      }
      
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUsername('');
    setPassword('');
    setError('');
    sessionStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // ถ้าล็อกอินแล้ว


  // Login screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">HR Management</h1>
          <p className="text-gray-600">เข้าสู่ระบบเพื่อจัดการข้อมูลพนักงาน</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อผู้ใช้
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="กรอกชื่อผู้ใช้"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รหัสผ่าน
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="กรอกรหัสผ่าน"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3 font-medium">บัญชีทดสอบ:</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
              <div>
                <p className="text-sm font-medium text-purple-900">HR Admin</p>
                <p className="text-xs text-purple-700">hr / hr123</p>
              </div>
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">Full Access</span>
            </div>
            <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">Manager</p>
                <p className="text-xs text-green-700">manager / manager123</p>
              </div>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">Limited Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
