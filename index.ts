import Express from "express";
import EmployeeDAO from "./daos/employee-dao";
import LocalEmployeeDAO from "./daos/local-employee-dao";
import Employee from "./entities/employee";
import errorHandler from "./errors/error-handler";
import EmployeeServices, { EmployeeService } from "./services/employee-service";
import cors from "cors";
import LoginServiceImpl, { Login } from "./services/login-service";
import ResourceNotFound from "./errors/resource-not-found";

const app = Express();
app.use(Express.json());
app.use(cors());
const port: number = 3001;

const employeeDao: EmployeeDAO = new LocalEmployeeDAO();
const employeeServices: EmployeeService = new EmployeeServices(employeeDao);
const loginService:Login = new LoginServiceImpl(employeeDao);

app.patch("/login", async (req,res)=>{
    try{
        const body:{ username:string, pass:string } = req.body;
        const employee:Employee = await loginService.login(body.username,body.pass);
        console.log("Logged in successfully.");
        res.status(201);
        res.send(employee);
    } catch (error) {
        if (error instanceof ResourceNotFound){
            console.log(true);
            console.log("Invalid Login Information");
            res.status(401);
            res.send(error.message);
        }
        else{
            errorHandler(error, req, res)
        }
    }
})

//gets a list of all employees
app.get("/employees", async (req, res) => {
    try {
        const employees: Employee[] = await employeeServices.retrieveAllEmployees();
        console.log("Retrieved all Employees from Database");
        res.status(200);
        res.send(employees);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

//gets an employee record by its ID
app.get("/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const employee: Employee = await employeeServices.retrieveEmployeeById(id);
        console.log(`retrieved employee ${employee.fName} by their ID`);
        res.status(200);
        res.send(employee);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

//creates an employee record
app.post("/employees", async (req, res) => {
    try {
        const employeeData: Employee = req.body;
        const employee = await employeeServices.addEmployee(employeeData);
        console.log("Employee was created successfully");
        console.log(employee);
        res.status(201);
        res.send(employee);
    } catch (error) {
        errorHandler(error, req, res);
    }
})

app.listen(port, () => { console.log("The server has started on port " + String(port)) });