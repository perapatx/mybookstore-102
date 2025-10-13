package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
	"path/filepath"
	"github.com/gin-contrib/cors"
	"strconv" 
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)
const UploadDir = "./uploads"

func init() {
    if _, err := os.Stat(UploadDir); os.IsNotExist(err) {
        os.MkdirAll(UploadDir, os.ModePerm)
    }
}
// ==================== Structs ====================
// ==================== Employee Handlers ====================
type Employee struct {
	ID           int       `json:"id"`
	ThaiFirstName string   `json:"thai_first_name"`
	ThaiLastName  string   `json:"thai_last_name"`
	EngFirstName  string   `json:"eng_first_name"`
	EngLastName   string   `json:"eng_last_name"`
	Gender        string   `json:"gender"`
	BirthDate     string   `json:"birth_date"`
	Address       string   `json:"address"`
	Phone         string   `json:"phone"`
	Email         string   `json:"email"`
	DepartmentID  string   `json:"department_id"`
	Position      string   `json:"position"`
	HireDate      string   `json:"hire_date"`
	Status        string   `json:"status"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type Holiday struct {
    HolidayID   int    `json:"holiday_id"`
    HolidayName string `json:"holiday_name"`
    Date        string `json:"date"`
    Description string `json:"description"`
}

type LeaveRecord struct {
	ID             int    `json:"id"`
	EmployeeID     int    `json:"employee_id"`
	ThaiFirstName  string `json:"thai_first_name"`
	ThaiLastName   string `json:"thai_last_name"`
	LeaveType      string `json:"leave_type"`
	StartDate      string `json:"start_date"`
	EndDate        string `json:"end_date"`
	Reason         string `json:"reason"`
	Status         string `json:"status"`
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

type Report struct {
    ID           int       `json:"id"`
    EmployeeID   string    `json:"employee_id"`
    EmployeeName string    `json:"employee_name"`
    Name         string    `json:"name"`
    Description  string    `json:"description"`
    Date         string    `json:"date"`
    Category     string    `json:"category"`
    Status       string    `json:"status"`
    CreatedAt    string    `json:"created_at"`
    Files        []ReportFile `json:"files,omitempty"`
}

type ReportFile struct {
    ID       int    `json:"id"`
    ReportID int    `json:"report_id"`
    FilePath string `json:"file_path"`
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
	rows, err := db.Query(`
		SELECT employeeid,
			   coalesce(thaifirstname,'') as thai_first_name,
			   coalesce(thailastname,'') as thai_last_name,
			   coalesce(engfirstname,'') as eng_first_name,
			   coalesce(englastname,'') as eng_last_name,
			   coalesce(gender,'') as gender,
			   coalesce(birthdate::text,'') as birth_date,
			   coalesce(address,'') as address,
			   coalesce(phone,'') as phone,
			   coalesce(email,'') as email,
			   coalesce(departmentid,'') as department_id,
			   coalesce(position,'') as position,
			   coalesce(hiredate::text,'') as hire_date,
			   coalesce(status,'Active') as status
		FROM employee
		ORDER BY employeeid`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var employees []Employee
	for rows.Next() {
		var e Employee
		if err := rows.Scan(
			&e.ID, &e.ThaiFirstName, &e.ThaiLastName, &e.EngFirstName, &e.EngLastName,
			&e.Gender, &e.BirthDate, &e.Address, &e.Phone, &e.Email,
			&e.DepartmentID, &e.Position, &e.HireDate, &e.Status,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		employees = append(employees, e)
	}
	c.JSON(http.StatusOK, employees)
}

func getEmployeeByID(c *gin.Context) {
	id := c.Param("id")
	var e Employee
	err := db.QueryRow(`
		SELECT employeeid,
			   coalesce(thaifirstname,'') as thai_first_name,
			   coalesce(thailastname,'') as thai_last_name,
			   coalesce(engfirstname,'') as eng_first_name,
			   coalesce(englastname,'') as eng_last_name,
			   coalesce(gender,'') as gender,
			   coalesce(birthdate::text,'') as birth_date,
			   coalesce(address,'') as address,
			   coalesce(phone,'') as phone,
			   coalesce(email,'') as email,
			   coalesce(departmentid,'') as department_id,
			   coalesce(position,'') as position,
			   coalesce(hiredate::text,'') as hire_date,
			   coalesce(status,'Active') as status
		FROM employee
		WHERE employeeid=$1`, id).
		Scan(
			&e.ID, &e.ThaiFirstName, &e.ThaiLastName, &e.EngFirstName, &e.EngLastName,
			&e.Gender, &e.BirthDate, &e.Address, &e.Phone, &e.Email,
			&e.DepartmentID, &e.Position, &e.HireDate, &e.Status,
		)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, e)
}

func addEmployee(c *gin.Context) {
	var e Employee
	if err := c.ShouldBindJSON(&e); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := db.QueryRow(`
		INSERT INTO employee (thaifirstname, thailastname, engfirstname, englastname, gender, birthdate, address, phone, email, departmentid, position, hiredate, status)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
		RETURNING employeeid`,
		e.ThaiFirstName, e.ThaiLastName, e.EngFirstName, e.EngLastName,
		e.Gender, e.BirthDate, e.Address, e.Phone, e.Email, e.DepartmentID, e.Position, e.HireDate, e.Status,
	).Scan(&e.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, e)
}

func updateEmployee(c *gin.Context) {
	id := c.Param("id")
	var e Employee
	if err := c.ShouldBindJSON(&e); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := db.Exec(`
		UPDATE employee
		SET thaifirstname=$1, thailastname=$2, engfirstname=$3, englastname=$4,
		    gender=$5, birthdate=$6, address=$7, phone=$8, email=$9,
		    departmentid=$10, position=$11, hiredate=$12, status=$13
		WHERE employeeid=$14`,
		e.ThaiFirstName, e.ThaiLastName, e.EngFirstName, e.EngLastName,
		e.Gender, e.BirthDate, e.Address, e.Phone, e.Email,
		e.DepartmentID, e.Position, e.HireDate, e.Status, id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	e.ID, _ = strconv.Atoi(id)
	c.JSON(http.StatusOK, e)
}
func deleteEmployee(c *gin.Context) {
	id := c.Param("id")
	_, err := db.Exec(`DELETE FROM employee WHERE employeeid=$1`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}



// ==================== LeaveRecord Handlers ====================
func getAllLeaves(c *gin.Context) {
	query := `
		SELECT 
			l.leaveid, 
			l.employeeid, 
			e.thaifirstname, 
			e.thailastname, 
			l.leavetype, 
			l.startdate, 
			l.enddate, 
			l.reason, 
			l.status
		FROM leaverecord l
		JOIN employee e ON l.employeeid = e.employeeid
		ORDER BY l.leaveid;
	`

	rows, err := db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var leaves []LeaveRecord
	for rows.Next() {
		var l LeaveRecord
		if err := rows.Scan(
			&l.ID, &l.EmployeeID, &l.ThaiFirstName, &l.ThaiLastName,
			&l.LeaveType, &l.StartDate, &l.EndDate, &l.Reason, &l.Status,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		leaves = append(leaves, l)
	}

	c.JSON(http.StatusOK, leaves)
}


// func createLeave(c *gin.Context) {
// 	var l LeaveRecord
// 	if err := c.ShouldBindJSON(&l); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	err := db.QueryRow(
// 		`INSERT INTO leaverecord (employeeid, leavetype, startdate, enddate, reason, status)
// 		 VALUES ($1,$2,$3,$4,$5,$6) RETURNING leaveid`,
// 		l.EmployeeID, l.LeaveType, l.StartDate, l.EndDate, l.Reason, l.Status,
// 	).Scan(&l.ID)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusCreated, l)
// }
// ==================Holiday===========================
func getAllHolidays(c *gin.Context) {
    rows, err := db.Query("SELECT HolidayID, HolidayName, Date, Description FROM Holiday ORDER BY Date ASC")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    var holidays []Holiday
    for rows.Next() {
        var h Holiday
        err := rows.Scan(&h.HolidayID, &h.HolidayName, &h.Date, &h.Description)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        holidays = append(holidays, h)
    }

    c.JSON(http.StatusOK, holidays)
}

func createHoliday(c *gin.Context) {
    var newHoliday Holiday
    if err := c.ShouldBindJSON(&newHoliday); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    query := `INSERT INTO Holiday (HolidayName, Date, Description) VALUES ($1, $2, $3) RETURNING HolidayID`
    err := db.QueryRow(query, newHoliday.HolidayName, newHoliday.Date, newHoliday.Description).Scan(&newHoliday.HolidayID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": "Holiday created successfully",
        "data":    newHoliday,
    })
}
func deleteHoliday(c *gin.Context) {
    id := c.Param("id")

    result, err := db.Exec("DELETE FROM Holiday WHERE HolidayID = $1", id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    rowsAffected, _ := result.RowsAffected()
    if rowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"message": "Holiday not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Holiday deleted successfully"})
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

// อ่านรายบุคคล
func getTaxByID(c *gin.Context) {
	id := c.Param("id")
	var t Tax
	err := db.QueryRow(
		"SELECT taxid, employeeid, taxyear, salary, taxpaid, benefits, status FROM tax WHERE taxid=$1", 
		id,
	).Scan(&t.ID, &t.EmployeeID, &t.TaxYear, &t.Salary, &t.TaxPaid, &t.Benefits, &t.Status)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tax record not found"})
		return
	}
	c.JSON(http.StatusOK, t)
}
// เพิ่มข้อมูลใหม่
func createTax(c *gin.Context) {
	var t Tax
	if err := c.ShouldBindJSON(&t); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := db.QueryRow(
		`INSERT INTO tax (employeeid, taxyear, salary, taxpaid, benefits, status) 
		 VALUES ($1,$2,$3,$4,$5,$6) RETURNING taxid`,
		t.EmployeeID, t.TaxYear, t.Salary, t.TaxPaid, t.Benefits, t.Status,
	).Scan(&t.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, t)
}
// แก้ไขข้อมูล
func updateTax(c *gin.Context) {
	id := c.Param("id")
	var t Tax
	if err := c.ShouldBindJSON(&t); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := db.Exec(
		`UPDATE tax SET taxyear=$1, salary=$2, taxpaid=$3, benefits=$4, status=$5 WHERE taxid=$6`,
		t.TaxYear, t.Salary, t.TaxPaid, t.Benefits, t.Status, id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tax record not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tax record updated"})
}
// ลบข้อมูล
func deleteTax(c *gin.Context) {
	id := c.Param("id")
	res, err := db.Exec("DELETE FROM tax WHERE taxid=$1", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tax record not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tax record deleted"})
}

// ==================== ReportFile Handlers ====================
func getAllReports(c *gin.Context) {
    query := `
        SELECT 
            r.id, r.employee_id, r.name, r.description, r.date, r.category, r.status, r.created_at,
            e.ThaiFirstName, e.ThaiLastName, e.Position, e.DepartmentID
        FROM reports r
        JOIN Employee e ON r.employee_id = e.EmployeeID
        ORDER BY r.id DESC
    `
    rows, err := db.Query(query)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    reports := []Report{}
    for rows.Next() {
        var r Report
        var date time.Time
        var createdAt time.Time
        var firstName, lastName, position, department string

        if err := rows.Scan(
            &r.ID, &r.EmployeeID, &r.Name, &r.Description, &date, &r.Category, &r.Status, &createdAt,
            &firstName, &lastName, &position, &department,
        ); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        r.Date = date.Format("2006-01-02")
        r.CreatedAt = createdAt.Format("2006-01-02 15:04")
        r.EmployeeName = fmt.Sprintf("%s %s (%s)", firstName, lastName, position)

        // ดึงไฟล์ของ report นี้
        fileRows, _ := db.Query("SELECT id, report_id, file_path FROM report_files WHERE report_id=$1", r.ID)
        var files []ReportFile
        for fileRows.Next() {
            var f ReportFile
            fileRows.Scan(&f.ID, &f.ReportID, &f.FilePath)
            files = append(files, f)
        }
        fileRows.Close()
        r.Files = files

        reports = append(reports, r)
    }

    c.JSON(http.StatusOK, reports)
}

// =============================
// CREATE report พร้อมไฟล์
// =============================
func createReportWithFiles(c *gin.Context) {
    employeeID := c.PostForm("employee_id")
    name := c.PostForm("name")
    description := c.PostForm("description")
    date := c.PostForm("date")
    category := c.PostForm("category")

    var reportID int
    err := db.QueryRow(
        "INSERT INTO reports (employee_id, name, description, date, category) VALUES ($1,$2,$3,$4,$5) RETURNING id",
        employeeID, name, description, date, category,
    ).Scan(&reportID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // บันทึกไฟล์
    form, _ := c.MultipartForm()
    files := form.File["files"]
    for _, file := range files {
        filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), filepath.Base(file.Filename))
        savePath := filepath.Join("uploads", filename)
        c.SaveUploadedFile(file, savePath)

        db.Exec("INSERT INTO report_files (report_id, file_path) VALUES ($1, $2)", reportID, "/uploads/"+filename)
    }

    c.JSON(http.StatusOK, gin.H{"message": "created", "report_id": reportID})
}

func deleteReport(c *gin.Context) {
    id := c.Param("id")
    _, err := db.Exec("DELETE FROM reports WHERE id=$1", id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
func updateReportStatus(c *gin.Context) {
    reportID := c.Param("id")
    newStatus := c.PostForm("status") // รอพิจารณา, อนุมัติแล้ว, ไม่อนุมัติ

    _, err := db.Exec("UPDATE reports SET status=$1 WHERE id=$2", newStatus, reportID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Status updated"})
}
// ==================== Main ====================
func main() {
	initDB()
	defer db.Close()
	os.MkdirAll("./uploads", os.ModePerm)
	r := gin.Default()
	r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"*"}, // หรือ ["*"] สำหรับ dev
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
        AllowHeaders:     []string{"Origin", "Content-Type"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge: 12 * time.Hour,
    }))
	r.GET("/health", func(c *gin.Context) {
		if err := db.Ping(); err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"message": "unhealthy", "error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "healthy"})
	})
	r.Static("/uploads", "./uploads")


	api := r.Group("/api/v1")
	{
		// Employee
		api.GET("/employees", getAllEmployees)
		api.GET("/employees/:id", getEmployeeByID)
		api.POST("/employees", addEmployee)
		api.PUT("/employees/:id", updateEmployee)
		api.DELETE("/employees/:id", deleteEmployee)

		// Leave
		api.GET("/leaves", getAllLeaves)

		// Holiday 
		api.GET("/holiday", getAllHolidays)
		api.POST("/holidays", createHoliday)
		api.DELETE("/holidays/:id", deleteHoliday)

		// Contract
		api.GET("/contracts", getAllContracts)

		// Tax
		api.GET("/taxes", getAllTaxes)
		api.GET("/taxes/:id", getTaxByID)    // อ่านรายบุคคล
		api.POST("/taxes", createTax)        // เพิ่มข้อมูลใหม่
		api.PUT("/taxes/:id", updateTax)     // แก้ไขข้อมูล
		api.DELETE("/taxes/:id", deleteTax)  // ลบข้อมูล

		// ReportFile
   		api.GET("/reports", getAllReports)
   		api.POST("/reports", createReportWithFiles)
    	api.DELETE("/reports/:id", deleteReport)

		api.POST("/reports/:id/status", updateReportStatus)
	}

	r.Run(":8080")
}
