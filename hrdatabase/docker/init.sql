-- ================================
-- CREATE TABLE SECTION
-- ================================

-- 1. ตารางยูสเซอร์ (ต้องมาก่อนเพราะ FK)
CREATE TABLE UserAccount (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(10) DEFAULT 'Manager'
);

-- 2. ตารางข้อมูลพนักงาน
CREATE TABLE Employee (
    EmployeeID SERIAL PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Gender VARCHAR(10),
    BirthDate DATE,
    Address TEXT,
    Phone VARCHAR(20),
    Email VARCHAR(100) UNIQUE,
    DepartmentID VARCHAR(50),
    Position VARCHAR(100),
    HireDate DATE,
    Status VARCHAR(10) DEFAULT 'Active'
);

-- 3. ตารางวันลา
CREATE TABLE LeaveRecord (
    LeaveID SERIAL PRIMARY KEY,
    EmployeeID INT REFERENCES Employee(EmployeeID),
    LeaveType VARCHAR(20),
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Reason VARCHAR(255),
    Status VARCHAR(10) DEFAULT 'Pending'
);

-- 4. ตารางวันหยุด
CREATE TABLE Holiday (
    HolidayID SERIAL PRIMARY KEY,
    HolidayName VARCHAR(100) NOT NULL,
    Date DATE NOT NULL,
    Description TEXT
);

-- 5. ตารางสัญญาจ้าง
CREATE TABLE Contract (
    ContractID SERIAL PRIMARY KEY,
    EmployeeID INT REFERENCES Employee(EmployeeID),
    ContractType VARCHAR(10),
    StartDate DATE NOT NULL,
    EndDate DATE,
    Salary DECIMAL(10,2),
    Status VARCHAR(10)
);

-- 6. ตารางภาษี
CREATE TABLE Tax (
    TaxID SERIAL PRIMARY KEY,
    EmployeeID INT REFERENCES Employee(EmployeeID),
    TaxYear INT NOT NULL,
    Salary DECIMAL(10,2),
    TaxPaid DECIMAL(10,2),
    Benefits DECIMAL(10,2),
    Status VARCHAR(20)
);

-- 7. ตารางแฟ้มรายงาน
CREATE TABLE ReportFile (
    ReportID SERIAL PRIMARY KEY,
    ReportType VARCHAR(100),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedBy INT REFERENCES UserAccount(UserID),
    FilePath VARCHAR(255)
);

-- 8. ตารางบันทึกการเข้าใช้งานระบบ
CREATE TABLE AccessLog (			
	LogID SERIAL PRIMARY KEY,
	UserID INT REFERENCES UserAccount(UserID),
	AccessTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	Action VARCHAR(255)
);

-- ================================
-- INSERT SAMPLE DATA SECTION
-- ================================

-- 1. UserAccount
-- 🧑‍💼 UserAccount (ผู้ใช้ระบบ)
INSERT INTO UserAccount (Username, PasswordHash, Role)
VALUES
('admin', 'hashed_admin_password', 'Admin'),
('hrmanager', 'hashed_hr_password', 'Manager'),
('employee1', 'hashed_emp1_password', 'Employee');


-- 👷 Employee (พนักงาน)
INSERT INTO Employee (
    FirstName, LastName, Gender, BirthDate, Address, Phone, Email, DepartmentID, Position, HireDate, Status
)
VALUES
('Somchai', 'Sukjai', 'Male', '1990-05-12', '123 Bangkok Rd', '0812345678', 'somchai@example.com', 'HR', 'HR Manager', '2020-01-10', 'Active'),
('Suda', 'Dee', 'Female', '1993-08-25', '456 Chiangmai St', '0823456789', 'suda@example.com', 'IT', 'Developer', '2021-03-15', 'Active'),
('Prasit', 'Thongdee', 'Male', '1988-11-30', '789 Phuket Ave', '0834567890', 'prasit@example.com', 'Finance', 'Accountant', '2019-07-01', 'Active');


-- 🏖️ Holiday (วันหยุด)
INSERT INTO Holiday (HolidayName, Date, Description)
VALUES
('New Year Day', '2025-01-01', 'วันปีใหม่'),
('Songkran Festival', '2025-04-13', 'วันสงกรานต์'),
('Labor Day', '2025-05-01', 'วันแรงงานแห่งชาติ');


-- 📄 Contract (สัญญาจ้าง)
INSERT INTO Contract (EmployeeID, ContractType, StartDate, EndDate, Salary, Status)
VALUES
(1, 'Fulltime', '2020-01-10', NULL, 50000.00, 'Hired'),
(2, 'Fulltime', '2021-03-15', NULL, 40000.00, 'Hired'),
(3, 'Parttime', '2019-07-01', NULL, 25000.00, 'Hired');


-- 🧾 Tax (ภาษี)
INSERT INTO Tax (EmployeeID, TaxYear, Salary, TaxPaid, Benefits, Status)
VALUES
(1, 2024, 600000.00, 45000.00, 20000.00, 'Calculated'),
(2, 2024, 480000.00, 30000.00, 15000.00, 'Calculated'),
(3, 2024, 300000.00, 15000.00, 10000.00, 'Calculated');


-- 🗓️ LeaveRecord (วันลา)
INSERT INTO LeaveRecord (EmployeeID, LeaveType, StartDate, EndDate, Reason, Status)
VALUES
(1, 'Annual', '2025-05-10', '2025-05-15', 'Vacation trip', 'Approved'),
(2, 'Sick', '2025-02-05', '2025-02-07', 'Flu', 'Approved'),
(3, 'Personal', '2025-03-12', '2025-03-13', 'Family matters', 'Pending');


-- 📂 ReportFile (แฟ้มรายงาน)
INSERT INTO ReportFile (ReportType, CreatedBy, FilePath)
VALUES
('Monthly Report', 1, '/reports/jan2025.pdf'),
('Employee Summary', 2, '/reports/employees2025.pdf');


-- 🧠 AccessLog (บันทึกการเข้าใช้งานระบบ)
INSERT INTO AccessLog (UserID, Action)
VALUES
(1, 'Logged in'),
(1, 'Viewed dashboard'),
(2, 'Added new employee'),
(3, 'Requested leave');
