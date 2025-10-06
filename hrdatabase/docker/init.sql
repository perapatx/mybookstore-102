-- 1. ตารางยูสเซอร์ (ต้องมาก่อนเพราะ FK)
CREATE TABLE UserAccount (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(10) DEFAULT 'Manager' -- แทน ENUM
);

-- 2. ตารางข้อมูลพนักงาน
CREATE TABLE Employee (
    EmployeeID SERIAL PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Gender VARCHAR(10), -- แทน ENUM('Male','Female','Other')
    BirthDate DATE,
    Address TEXT,
    Phone VARCHAR(20),
    Email VARCHAR(100) UNIQUE,
    DepartmentID VARCHAR(50),
    Position VARCHAR(100),
    HireDate DATE,
    Status VARCHAR(10) DEFAULT 'Active' -- แทน ENUM('Active','Resigned','Probation')
);

-- 3. ตารางวันลา
CREATE TABLE LeaveRecord (
    LeaveID SERIAL PRIMARY KEY,
    EmployeeID INT REFERENCES Employee(EmployeeID),
    LeaveType VARCHAR(20), -- แทน ENUM
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
    ContractType VARCHAR(10), -- แทน ENUM
    StartDate DATE NOT NULL,
    EndDate DATE,
    Salary DECIMAL(10,2),
    Status VARCHAR(10) -- แทน ENUM('Hired','Expired')
);

-- 6. ตารางภาษี
CREATE TABLE Tax (
    TaxID SERIAL PRIMARY KEY,
    EmployeeID INT REFERENCES Employee(EmployeeID),
    TaxYear INT NOT NULL, -- PostgreSQL ไม่มี YEAR type
    Salary DECIMAL(10,2),
    TaxPaid DECIMAL(10,2),
    Benefits DECIMAL(10,2),
    Status VARCHAR(20) -- แทน ENUM('Calculated','Incalculated')
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