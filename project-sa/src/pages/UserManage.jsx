import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import BookCard from '../components/BookCard';
//import LoadingSpinner from '../components/LoadingSpinner';
//import './BookDetailPage.css';
import { users } from '../data/userData'; // ดึง users จากไฟล์กลาง

const UserManage = () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
    console.log(loggedInUser.role); // "hr" หรือ "manager"
      return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <h1 className="text-3xl font-bold text-gray-800">บัญชีผู้ใช้</h1>
                          <p className="text-gray-600 mt-1">ยินดีต้อนรับ, {loggedInUser.name}</p>
                        </div>
                        <div className="items-center mt-8 p-6 bg-gray-50 rounded-lg">
                        <Link to="/adduser" 
                          className="inline-flex items-center justify-center px-8 py-3 bg-green-300 
                            text-white font-semibold rounded-lg hover:bg-green-400 
                            transform hover:scale-105 transition-all duration-200">
                              เพิ่มบุคคล
                        </Link>
                      </div>
                      </div>
          
                      {/* ข้อมูลผู้ใช้และสิทธิ์ */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                          <h3 className="text-lg font-semibold text-blue-900 mb-4">ข้อมูลผู้ใช้</h3>
                          <div className="space-y-2">
                            <p className="text-gray-700"><span className="font-medium">ชื่อ:</span> {loggedInUser.name}</p>
                            <p className="text-gray-700"><span className="font-medium">ชื่อผู้ใช้:</span> {loggedInUser.username}</p>
                            <p className="text-gray-700"><span className="font-medium">อีเมล:</span> {loggedInUser.email}</p>
                            <p className="text-gray-700">
                              <span className="font-medium">บทบาท:</span>{' '}
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                loggedInUser.role === 'hr' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {loggedInUser.role === 'hr' ? 'HR Admin' : 'Manager'}
                              </span>
                            </p>
                          </div>
                        </div>
          
                        <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                          <h3 className="text-lg font-semibold text-green-900 mb-4">สิทธิ์การเข้าถึง</h3>
                          <div className="space-y-2">
                            {loggedInUser.role === 'hr' ? (
                              <>
                                <p className="flex items-center text-gray-700">
                                  <span className="text-green-600 mr-2">✓</span> จัดการข้อมูลพนักงาน
                                </p>
                                <p className="flex items-center text-gray-700">
                                  <span className="text-green-600 mr-2">✓</span> เพิ่ม/ลบพนักงาน
                                </p>
                                <p className="flex items-center text-gray-700">
                                  <span className="text-green-600 mr-2">✓</span> ดูรายงานทั้งหมด
                                </p>
                                <p className="flex items-center text-gray-700">
                                  <span className="text-green-600 mr-2">✓</span> จัดการบัญชีผู้ใช้
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="flex items-center text-gray-700">
                                  <span className="text-green-600 mr-2">✓</span> ดูข้อมูลพนักงาน
                                </p>
                                <p className="flex items-center text-gray-700">
                                  <span className="text-green-600 mr-2">✓</span> แก้ไขข้อมูลพนักงาน
                                </p>
                                <p className="flex items-center text-gray-700">
                                  <span className="text-green-600 mr-2">✓</span> ดูรายงานแผนก
                                </p>
                                <p className="flex items-center text-gray-700">
                                  <span className="text-red-600 mr-2">✗</span> ลบพนักงาน
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
          
                      {/* <div className="items-center mt-8 p-6 bg-gray-50 rounded-lg">
                        <Link to="/" 
                          className="inline-flex items-center justify-center px-8 py-3 bg-green-300 
                            text-white font-semibold rounded-lg hover:bg-green-400 
                            transform hover:scale-105 transition-all duration-200">
                              กลับสู่หน้าหลัก
                        </Link>
                      </div> */}
                    </div>
                  </div>
                </div>
      );
  }

export default UserManage;