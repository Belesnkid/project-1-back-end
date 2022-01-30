import Express from "express";
import EmployeeDAO from "./daos/employee-dao";
import Employee from "./entities/employee";
import errorHandler from "./errors/error-handler";
import EmployeeServices, { EmployeeService } from "./services/employee-service";
import cors from "cors";
import LoginServiceImpl, { Login } from "./services/login-service";
import ResourceNotFound from "./errors/resource-not-found";
import winston from 'winston';
import ReimbursementServices, { ReimbursementService } from "./services/reimbursement-service";
import ReimbursementRequest from "./entities/reimbursement-request";
import ReimbursementDAO from "./daos/reimbursement-dao";
import AzureEmployeeDAO from "./daos/azure-employee-dao";
import AzureReimbursementDao from "./daos/azure-reimbursement-dao";

const app = Express();
app.use(Express.json());
app.use(cors());
const port: number = 3001;

const employeeDao: EmployeeDAO = new AzureEmployeeDAO();
const reimbursementDao: ReimbursementDAO = new AzureReimbursementDao();
const employeeServices: EmployeeService = new EmployeeServices(employeeDao);
const loginService: Login = new LoginServiceImpl(employeeDao);
const reimbursementServices: ReimbursementService = new ReimbursementServices(reimbursementDao);
const date = new Date();

const levels = {
    levels: {
        error: 0,
        http: 1,
        info: 2,
        verbose: 3
    },
    colors: {
        error: 'red',
        http: 'blue',
        info: 'green',
        verbose: 'white'
    }
}

export const logger = winston.createLogger({
    levels: levels.levels,
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "./logs/error-log.txt", level: 'error' }),
        new winston.transports.File({ filename: "./logs/http-log.txt", level: 'http' }),
        new winston.transports.File({ filename: "./logs/info-log.txt", level: 'info' }),
        new winston.transports.File({ filename: "./logs/verbose-log.txt", level: 'verbose' })
    ]
})

export function timestamp(): String {
    const [month, day, year] = [(date.getMonth() + 1), date.getDate(), date.getFullYear()];
    const [hour, minute, second] = [date.getHours(), date.getMinutes(), date.getSeconds()];
    return `${month}/${day}/${year} ${hour}:${minute}:${second}`;
}

app.patch("/login", async (req, res) => {
    try {
        logger.http(`${timestamp()} :Index: Login Request`)
        const body: { username: string, pass: string } = req.body;
        const employee: Employee = await loginService.login(body.username, body.pass);
        logger.info(`${timestamp()} :Index: ${employee.uName} successfully logged in`);
        res.status(201);
        res.send(employee);
    } catch (error) {
        if (error instanceof ResourceNotFound) {
            logger.error(`${timestamp()} :Index: Invalid Login Attempt, Username: ${req.body.username.toString()}`);
            res.status(401);
            res.send(JSON.stringify(error));
        }
        else {
            errorHandler(error, req, res)
        }
    }
})

//gets a list of all employees
app.get("/employees", async (req, res) => {
    try {
        logger.http(`${timestamp()} :Index: Request for all Employees`);
        const employees: Employee[] = await employeeServices.retrieveAllEmployees();
        logger.info(`${timestamp()} :EmployeeDAO: Got all Employees`);
        res.status(200);
        res.send(employees);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

//gets an employee record by its ID
app.get("/employees/:id", async (req, res) => {
    try {
        logger.http(`${timestamp()} :Index: Request for Employee with id ${req.params.id}`);
        const { id } = req.params;
        const employee: Employee = await employeeServices.retrieveEmployeeById(id);
        logger.info(`${timestamp()} :EmployeeDAO: Found Employee with ID ${id}`);
        res.status(200);
        res.send(employee);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

//creates an employee record
app.post("/employees", async (req, res) => {
    try {
        logger.http(`${timestamp()} :Index: Post to create an employee`);
        const employeeData: Employee = req.body;
        const employee: Employee = await employeeServices.addEmployee(employeeData);
        logger.info(`${timestamp()} :EmployeeDao: Employee was Created Successfully ${employee.id}`);
        res.status(201);
        res.send(employee);
    } catch (error) {
        errorHandler(error, req, res);
    }
})

//get all Reimbursement Requests
app.get('/reimbursements', async (req, res) => {
    try {
        logger.http(`${timestamp()} :Index: Get all Reimbursement Requests`);
        const requests: ReimbursementRequest[] = await reimbursementServices.retrieveAllRequests();
        logger.info(`${timestamp} :ReimbursementDAO: got all requests: ${requests.length}`);
        res.status(200);
        res.send(requests);
    } catch (error) {
        errorHandler(error, req, res);
    }
})

//Get an Employees Requests
app.get('/reimbursements/employee/:id', async (req, res) => {
    try {
        logger.http(`${timestamp()} :Index: Get all Reimbursement Requests for Employee ${req.params.id}`);
        const requests: ReimbursementRequest[] = await reimbursementServices.retrieveEmployeeRequests(req.params.id);
        logger.info(`${timestamp} :ReimbursementDAO: got request with Employee ID ${req.params.id}`);
        res.status(200);
        res.send(requests);
    } catch (error) {
        errorHandler(error, req, res);
    }
})

//Get all Open Requests
app.get('/reimbursements/open', async (req, res) => {
    try {
        logger.http(`${timestamp()} :Index: Get All Open Requests`);
        const requests: ReimbursementRequest[] = await reimbursementServices.getPendingRequests();
        res.status(200);
        res.send(requests);
    } catch (error) {
        errorHandler(error, req, res);
    }
})

//Get all Closed Requests
app.get('/reimbursements/closed', async (req, res) => {
    try {
        logger.http(`${timestamp()} :Index: Get All Closed Requests`);
        const requests: ReimbursementRequest[] = await reimbursementServices.getClosedRequests();
        res.status(200);
        res.send(requests);
    } catch (error) {
        errorHandler(error, req, res);
    }
})

//Get all of an Employees Open Requests
app.get('/reimbursements/open/:id', async (req, res) => {
    try {
        logger.http(`${timestamp()} :Index: Get All Open Requests for Employee ${req.params.id}`);
        const requests: ReimbursementRequest[] = await reimbursementServices.getPendingRequests(req.params.id);
        logger.info(`${timestamp} :ReimbursementDAO: got request with Employee ID ${req.params.id}`);
        res.status(200);
        res.send(requests);
    } catch (error) {
        errorHandler(error, req, res);
    }
})

//Get all of an Employees Closed Requests
app.get('/reimbursements/closed/:id', async (req, res) => {
    try {
        logger.http(`${timestamp()} :Index: Get All Closed Requests for Employee ${req.params.id}`);
        const requests: ReimbursementRequest[] = await reimbursementServices.getClosedRequests(req.params.id);
        logger.info(`${timestamp} :ReimbursementDAO: got request with Employee ID ${req.params.id}`);
        res.status(200);
        res.send(requests);
    } catch (error) {
        errorHandler(error, req, res);
    }
})

//Get a specific Reimbursement Request
app.get('/reimbursements/:id', async (req, res) => {
    try {
        logger.http(`${timestamp()} :Index: Get a Requests by ID ${req.params.id}`);
        const requests: ReimbursementRequest = await reimbursementServices.retrieveRequestById(req.params.id);
        logger.info(`${timestamp} :ReimbursementDAO: got request with ID ${req.params.id}`);
        res.status(200);
        res.send(requests);
    } catch (error) {
        errorHandler(error, req, res);
    }
})

//Create a new Reimbursement Request
app.post('/reimbursements', async (req, res) => {
    try {
        logger.http(`${timestamp()} :Index: Post to Create a new Reimbursement Request`);
        const newRequest: ReimbursementRequest = req.body;
        const createdRequest: ReimbursementRequest = await reimbursementServices.addNewRequest(newRequest);
        logger.info(`${timestamp()} :ReimbursementDAO: new request created successfully, ${createdRequest.id}`);
        res.status(201);
        res.send(createdRequest);
    } catch (error) {
        errorHandler(error, req, res);
    }
})

//Update an existing Reimbursement Request
app.patch('/reimbursements', async (req, res) => {
    try {
        const updateRequest: ReimbursementRequest = req.body;
        logger.http(`${timestamp()} :Index: Patch to Update Request with ID ${updateRequest.id}`);
        const updatedRequest: ReimbursementRequest = await reimbursementServices.updateReimburement(updateRequest);
        logger.info(`${timestamp} :ReimbursementDAO: updated Request with ID ${req.body.id}`);
        res.status(200);
        res.send(updatedRequest);
    } catch (error) {
        errorHandler(error, req, res);
    }
})

app.listen(process.env.PORT ?? port, () => {
    logger.verbose("The server has started on port " + String(port));
    console.log("The server has started on port " + String(port))
});