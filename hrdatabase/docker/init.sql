-- ================================
-- CREATE TABLE SECTION
-- ================================

-- 1. ตารางยูสเซอร์ (ต้องมาก่อนเพราะ FK)
CREATE TABLE IF NOT EXISTS UserAccount (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(10) DEFAULT 'Manager'
);

-- 2. ตารางข้อมูลพนักงาน
CREATE TABLE IF NOT EXISTS Employee (
    EmployeeID SERIAL PRIMARY KEY,
    ThaiFirstName VARCHAR(100) NOT NULL,
    ThaiLastName VARCHAR(100) NOT NULL,
    EngFirstName VARCHAR(100) NOT NULL,
    EngLastName VARCHAR(100) NOT NULL,
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
CREATE TABLE IF NOT EXISTS LeaveRecord (
    LeaveID SERIAL PRIMARY KEY,
    EmployeeID INT REFERENCES Employee(EmployeeID),
    LeaveType VARCHAR(20),
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Reason VARCHAR(255),
    Status VARCHAR(10) DEFAULT 'Pending'
);

-- 4. ตารางวันหยุด
CREATE TABLE IF NOT EXISTS Holiday (
    HolidayID SERIAL PRIMARY KEY,
    HolidayName VARCHAR(100) NOT NULL,
    Date DATE NOT NULL,
    Description TEXT,
    UNIQUE(HolidayName, Date)
);

-- 5. ตารางสัญญาจ้าง
CREATE TABLE IF NOT EXISTS Contract (
    ContractID SERIAL PRIMARY KEY,
    EmployeeID INT REFERENCES Employee(EmployeeID),
    ContractType VARCHAR(10),
    StartDate DATE NOT NULL,
    EndDate DATE,
    Salary DECIMAL(10,2),
    Status VARCHAR(10)
);

-- 6. ตารางภาษี
CREATE TABLE IF NOT EXISTS Tax (
    TaxID SERIAL PRIMARY KEY,
    EmployeeID INT REFERENCES Employee(EmployeeID),
    TaxYear INT NOT NULL,
    Salary DECIMAL(10,2),
    TaxPaid DECIMAL(10,2),
    Benefits DECIMAL(10,2),
    Status VARCHAR(20),
    UNIQUE(EmployeeID, TaxYear)
);

-- 7. ตารางแฟ้มรายงาน
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES Employee(EmployeeID) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    category VARCHAR(50),
    status VARCHAR(50) DEFAULT 'รอพิจารณา',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================
-- ตาราง Report Files
-- ============================
CREATE TABLE IF NOT EXISTS report_files (
    id SERIAL PRIMARY KEY,
    report_id INT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 8. ตารางบันทึกการเข้าใช้งานระบบ
CREATE TABLE IF NOT EXISTS AccessLog (			
    LogID SERIAL PRIMARY KEY,
    UserID INT REFERENCES UserAccount(UserID),
    AccessTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Action VARCHAR(255)
);

-- ================================
-- INSERT SAMPLE DATA SECTION
-- ================================

-- 1. UserAccount
INSERT INTO UserAccount (Username, PasswordHash, Role)
VALUES
('admin', 'hashed_admin_password', 'Admin'),
('hrmanager', 'hashed_hr_password', 'Manager'),
('employee1', 'hashed_emp1_password', 'Employee')
ON CONFLICT (Username) DO NOTHING;

-- 2. Employee
INSERT INTO Employee (
    ThaiFirstName, ThaiLastName, EngFirstName, EngLastName,
    Gender, BirthDate, Address, Phone, Email,
    DepartmentID, Position, HireDate, Status
)
VALUES
('สมชาย', 'สุขใจ', 'Somchai', 'Sukjai', 'ชาย', '1990-05-12', '123 ถนนบางกอก', '0812345678', 'somchai@example.com', 'HR', 'HR Manager', '2020-01-10', 'Active'),
('สุดา', 'ดี', 'Suda', 'Dee', 'หญิง', '1993-08-25', '456 ถนนเชียงใหม่', '0823456789', 'suda@example.com', 'IT', 'Developer', '2021-03-15', 'Active'),
('ประสิทธิ์', 'ทองดี', 'Prasit', 'Thongdee', 'ชาย', '1988-11-30', '789 ถนนภูเก็ต', '0834567890', 'prasit@example.com', 'Finance', 'Accountant', '2019-07-01', 'Active')
ON CONFLICT (Email) DO NOTHING;

-- 3. Holiday
INSERT INTO Holiday (HolidayName, Date, Description)
VALUES
('New Year Day', '2025-01-01', 'วันปีใหม่'),
('Songkran Festival', '2025-04-13', 'วันสงกรานต์'),
('Labor Day', '2025-05-01', 'วันแรงงานแห่งชาติ')
ON CONFLICT (HolidayName, Date) DO NOTHING;

-- 4. Contract
INSERT INTO Contract (EmployeeID, ContractType, StartDate, EndDate, Salary, Status)
VALUES
(1, 'Fulltime', '2020-01-10', '2020-01-12', 50000.00, 'Hired'),
(2, 'Fulltime', '2021-03-15', '2020-01-12', 40000.00, 'Hired'),
(3, 'Parttime', '2019-07-01', '2020-01-12', 25000.00, 'Hired')
ON CONFLICT DO NOTHING;

-- 5. Tax
INSERT INTO Tax (EmployeeID, TaxYear, Salary, TaxPaid, Benefits, Status)
VALUES
(1, 2024, 600000.00, 45000.00, 20000.00, 'Calculated'),
(2, 2024, 480000.00, 30000.00, 15000.00, 'Calculated'),
(3, 2024, 300000.00, 15000.00, 10000.00, 'Calculated')
ON CONFLICT (EmployeeID, TaxYear) DO NOTHING;

-- 6. LeaveRecord
INSERT INTO LeaveRecord (EmployeeID, LeaveType, StartDate, EndDate, Reason, Status)
VALUES
(1, 'ลาพักร้อน', '2025-05-10', '2025-05-15', 'ท่องเที่ยว', 'อนุมัติ'),
(2, 'ลาป่วย', '2025-02-05', '2025-02-07', 'ไข้หวัด', 'อนุมัติ'),
(3, 'ลากิจ', '2025-03-12', '2025-03-13', 'อยู่กับครอบครัว', 'รอพิจารณา')
ON CONFLICT DO NOTHING;

-- 7. ReportFile
INSERT INTO reports (employee_id, name, description, date, category, status)
VALUES
(1, 'รายงานประจำเดือนกันยายน', 'สรุปงานและผลการดำเนินงานของเดือนกันยายน', '2025-09-30', 'รายงานประจำเดือน', 'รอพิจารณา'),
(2, 'รายงานโครงการ A', 'รายละเอียดการดำเนินโครงการ A', '2025-10-05', 'รายงานโครงการ', 'อนุมัติแล้ว'),
(3, 'รายงานการประชุม', 'สรุปผลการประชุมทีมงาน', '2025-10-08', 'รายงานการประชุม', 'ไม่อนุมัติ');

-- ============================
-- Insert ตัวอย่าง Report Files
-- ============================
INSERT INTO report_files (report_id, file_path)
VALUES
(1, '/files/report_september_summary.pdf'),
(1, '/files/attendance_september.xlsx'),
(2, '/files/project_A_plan.docx'),
(3, '/files/meeting_minutes.pdf');
-- 8. AccessLog
INSERT INTO AccessLog (UserID, Action)
VALUES
(1, 'Logged in'),
(1, 'Viewed dashboard'),
(2, 'Added new employee'),
(3, 'Requested leave')
ON CONFLICT DO NOTHING;
