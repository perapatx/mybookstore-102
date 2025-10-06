package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

// ==================== Structs ====================
type Employee struct {
	ID           int       `json:"id"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Gender       string    `json:"gender"`
	BirthDate    string    `json:"birth_date"`
	Address      string    `json:"address"`
	Phone        string    `json:"phone"`
	Email        string    `json:"email"`
	DepartmentID string    `json:"department_id"`
	Position     string    `json:"position"`
	HireDate     string    `json:"hire_date"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type LeaveRecord struct {
	ID         int    `json:"id"`
	EmployeeID int    `json:"employee_id"`
	LeaveType  string `json:"leave_type"`
	StartDate  string `json:"start_date"`
	EndDate    string `json:"end_date"`
	Reason     string `json:"reason"`
	Status     string `json:"status"`
}

type Contract struct {
	ID         int     `json:"id"`
	EmployeeID int     `json:"employee_id"`
	Type       string  `json:"type"`
	StartDate  string  `json:"start_date"`
	EndDate    string  `json:"end_date"`
	Salary     float64 `json:"salary"`
	Status     string  `json:"status"`
}

type Tax struct {
	ID         int     `json:"id"`
	EmployeeID int     `json:"employee_id"`
	TaxYear    int     `json:"tax_year"`
	Salary     float64 `json:"salary"`
	TaxPaid    float64 `json:"tax_paid"`
	Benefits   float64 `json:"benefits"`
	Status     string  `json:"status"`
}

type ReportFile struct {
	ID         int    `json:"id"`
	ReportType string `json:"report_type"`
	CreatedBy  int    `json:"created_by"`
	FilePath   string `json:"file_path"`
	CreatedAt  string `json:"created_at"`
}

// ==================== Database ====================
var db *sql.DB

func getEnv(key, defaultValue string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return defaultValue
}

func initDB() {
	var err error

	host := getEnv("DB_HOST", "localhost")
	port := getEnv("POSTGRES_PORT", "5432")
	user := getEnv("POSTGRES_USER", "hr_user")
	password := getEnv("POSTGRES_PASSWORD", "hr_mok23")
	dbname := getEnv("POSTGRES_DB", "hr")
	if host == "" || port == "" || user == "" || password == "" || dbname == "" {
		log.Fatal("Database environment variables not set properly")
	}

	fmt.Println("DB_HOST:", host)
	fmt.Println("DB_NAME:", dbname)
	fmt.Println("DB_USER:", user)
	fmt.Println("DB_PASSWORD:", password)
	fmt.Println("DB_PORT:", port)

	connStr := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)
	
	fmt.Println(connStr)
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to open database:", err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	log.Println("Successfully connected to database")
}

// ==================== Employee Handlers ====================
func getAllEmployees(c *gin.Context) {
	rows, err := db.Query("SELECT employeeid, firstname, lastname, gender, birthdate, address, phone, email, departmentid, position, hiredate, status FROM employee")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var employees []Employee
	for rows.Next() {
		var e Employee
		if err := rows.Scan(&e.ID, &e.FirstName, &e.LastName, &e.Gender, &e.BirthDate, &e.Address, &e.Phone, &e.Email, &e.DepartmentID, &e.Position, &e.HireDate, &e.Status); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		employees = append(employees, e)
	}
	c.JSON(http.StatusOK, employees)
}

func getEmployee(c *gin.Context) {
	id := c.Param("id")
	var e Employee
	err := db.QueryRow("SELECT employeeid, firstname, lastname, gender, birthdate, address, phone, email, departmentid, position, hiredate, status FROM employee WHERE employeeid=$1", id).
		Scan(&e.ID, &e.FirstName, &e.LastName, &e.Gender, &e.BirthDate, &e.Address, &e.Phone, &e.Email, &e.DepartmentID, &e.Position, &e.HireDate, &e.Status)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, e)
}

func createEmployee(c *gin.Context) {
	var e Employee
	if err := c.ShouldBindJSON(&e); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := db.QueryRow(
		`INSERT INTO employee (firstname, lastname, gender, birthdate, address, phone, email, departmentid, position, hiredate, status)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING employeeid`,
		e.FirstName, e.LastName, e.Gender, e.BirthDate, e.Address, e.Phone, e.Email, e.DepartmentID, e.Position, e.HireDate, e.Status,
	).Scan(&e.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, e)
}

// ==================== LeaveRecord Handlers ====================
func getAllLeaves(c *gin.Context) {
	rows, err := db.Query("SELECT leaveid, employeeid, leavetype, startdate, enddate, reason, status FROM leaverecord")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var leaves []LeaveRecord
	for rows.Next() {
		var l LeaveRecord
		if err := rows.Scan(&l.ID, &l.EmployeeID, &l.LeaveType, &l.StartDate, &l.EndDate, &l.Reason, &l.Status); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		leaves = append(leaves, l)
	}
	c.JSON(http.StatusOK, leaves)
}

func createLeave(c *gin.Context) {
	var l LeaveRecord
	if err := c.ShouldBindJSON(&l); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := db.QueryRow(
		`INSERT INTO leaverecord (employeeid, leavetype, startdate, enddate, reason, status)
		 VALUES ($1,$2,$3,$4,$5,$6) RETURNING leaveid`,
		l.EmployeeID, l.LeaveType, l.StartDate, l.EndDate, l.Reason, l.Status,
	).Scan(&l.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, l)
}

// ==================== Contract Handlers ====================
func getAllContracts(c *gin.Context) {
	rows, err := db.Query("SELECT contractid, employeeid, contracttype, startdate, enddate, salary, status FROM contract")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var contracts []Contract
	for rows.Next() {
		var co Contract
		if err := rows.Scan(&co.ID, &co.EmployeeID, &co.Type, &co.StartDate, &co.EndDate, &co.Salary, &co.Status); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		contracts = append(contracts, co)
	}
	c.JSON(http.StatusOK, contracts)
}

// ==================== Tax Handlers ====================
func getAllTaxes(c *gin.Context) {
	rows, err := db.Query("SELECT taxid, employeeid, taxyear, salary, taxpaid, benefits, status FROM tax")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var taxes []Tax
	for rows.Next() {
		var t Tax
		if err := rows.Scan(&t.ID, &t.EmployeeID, &t.TaxYear, &t.Salary, &t.TaxPaid, &t.Benefits, &t.Status); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		taxes = append(taxes, t)
	}
	c.JSON(http.StatusOK, taxes)
}

// ==================== ReportFile Handlers ====================
func getAllReports(c *gin.Context) {
	rows, err := db.Query("SELECT reportid, reporttype, createdby, filepath, createddate FROM reportfile")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var reports []ReportFile
	for rows.Next() {
		var r ReportFile
		if err := rows.Scan(&r.ID, &r.ReportType, &r.CreatedBy, &r.FilePath, &r.CreatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		reports = append(reports, r)
	}
	c.JSON(http.StatusOK, reports)
}

// ==================== Main ====================
func main() {
	initDB()
	defer db.Close()

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		if err := db.Ping(); err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"message": "unhealthy", "error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "healthy"})
	})

	api := r.Group("/api/v1")
	{
		// Employee
		api.GET("/employees", getAllEmployees)
		api.GET("/employees/:id", getEmployee)
		api.POST("/employees", createEmployee)

		// Leave
		api.GET("/leaves", getAllLeaves)
		api.POST("/leaves", createLeave)

		// Contract
		api.GET("/contracts", getAllContracts)

		// Tax
		api.GET("/taxes", getAllTaxes)

		// ReportFile
		api.GET("/reports", getAllReports)
	}

	r.Run(":8080")
}
