// userData.js
export const users = [
  {
    id: 1,
    username: 'hr',
    password: 'hr123',
    role: 'hr',
    name: 'HR Admin',
    email: 'hr@company.com'
  },
  {
    id: 2,
    username: 'manager',
    password: 'manager123',
    role: 'manager',
    name: 'Manager User',
    email: 'manager@company.com'
  }
];

// ฟังก์ชันเพิ่ม user ใหม่
export const addUser = (newUser) => {
  users.push({
    id: users.length + 1,
    ...newUser
  });
};
