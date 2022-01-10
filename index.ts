import Express from "express";
import EmployeeDAO from "./daos/employee-dao";
import LocalEmployeeDAO from "./daos/local-employee-dao";
import Employee from "./entities/employee";
import errorHandler from "./errors/error-handler";
import EmployeeServices, { EmployeeService } from "./services/employee-service";

const app = Express();
app.use(Express.json());

const employeeDao: EmployeeDAO = new LocalEmployeeDAO();
const employeeServices: EmployeeService = new EmployeeServices(employeeDao);

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

app.post("/employees", async (req, res) => {
    try{
        const employeeData:Employee = req.body;
        const employee = await employeeServices.addEmployee(employeeData);
        console.log("Employee was created successfully");
        console.log(employee);
        res.status(201);
        res.send(employee);
    } catch (error) {
        errorHandler(error, req, res);
    }
})

app.listen(3001, () => { console.log("The server has started") });