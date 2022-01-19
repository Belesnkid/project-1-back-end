import Express from "express";
import EmployeeDAO from "./daos/employee-dao";
import LocalEmployeeDAO from "./daos/local-employee-dao";
import Employee from "./entities/employee";
import errorHandler from "./errors/error-handler";
import EmployeeServices, { EmployeeService } from "./services/employee-service";
import cors from "cors";
import LoginServiceImpl, { Login } from "./services/login-service";
import ResourceNotFound from "./errors/resource-not-found";
import winston from 'winston';

const app = Express();
app.use(Express.json());
app.use(cors());
const port: number = 3001;

const employeeDao: EmployeeDAO = new LocalEmployeeDAO();
const employeeServices: EmployeeService = new EmployeeServices(employeeDao);
const loginService:Login = new LoginServiceImpl(employeeDao);
const date = new Date();

const levels = {
    levels: {
        error:0,
        http:1,
        info:2,
        verbose:3
    },
    colors: {
        error:'red',
        http:'blue',
        info:'green',
        verbose:'white'
    }
}

export const logger = winston.createLogger({
    levels:levels.levels,
    format:winston.format.json(),
    transports:[
        new winston.transports.File({filename:"./logs/error-log.txt", level:'error'}),
        new winston.transports.File({filename:"./logs/http-log.txt", level:'http'}),
        new winston.transports.File({filename:"./logs/info-log.txt", level:'info'}),
        new winston.transports.File({filename:"./logs/verbose-log.txt", level:'verbose'})
    ]
})

export function timestamp():String{
    const [month, day, year] = [(date.getMonth() + 1), date.getDate(), date.getFullYear()];
    const [hour, minute, second] = [date.getHours(), date.getMinutes(), date.getSeconds()];
    return `${month}/${day}/${year} ${hour}:${minute}:${second}`;
}

app.patch("/login", async (req,res)=>{
    try{
        logger.http(`${timestamp()} : Login Request`)
        logger.verbose(`${timestamp()} : Login Request`);
        const body:{ username:string, pass:string } = req.body;
        const employee:Employee = await loginService.login(body.username,body.pass);
        console.log("Logged in successfully.");
        logger.info(`${timestamp()} : ${employee.uName} successfully logged in`);
        logger.verbose(`${timestamp()} : ${employee.uName} successfully logged in`);
        res.status(201);
        res.send(employee);
    } catch (error) {
        if (error instanceof ResourceNotFound){
            console.log("Invalid Login Information");
            logger.error(`${timestamp()} : Invalid Login Attempt; Username:${req.body.username}`);
            logger.verbose(`${timestamp()} : Invalid Login Attempt; Username:${req.body.username}`);
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
        logger.http(`${timestamp()} : Request for all Employees`);
        const employees: Employee[] = await employeeServices.retrieveAllEmployees();
        console.log("Retrieved all Employees from Database");
        logger.info(`${timestamp()} : Got all Employees from the database`);
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