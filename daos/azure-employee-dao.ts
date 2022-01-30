import { CosmosClient } from "@azure/cosmos";
import { v4 } from "uuid";
import { logger, timestamp } from "..";
import Employee from "../entities/employee";
import employee from "../entities/employee";
import ResourceNotFound from "../errors/resource-not-found";
import EmployeeDAO from "./employee-dao";


const myClient = new CosmosClient(process.env.P1Conn);
const db = myClient.database('Reimburesement-DB');
const container = db.container('Employee');

export default class AzureEmployeeDAO implements EmployeeDAO{


    async getAllEmployees(): Promise<employee[]> {
            const response = await container.items.readAll<Employee>().fetchAll();
            const employees:Employee[] = response.resources.map(e => ({...e}));
            if(employees.length === 0){
                throw new ResourceNotFound("The Database must be Empty", "")
            }
            else{
                logger.info(`${timestamp()} :EmployeeDAO: Got all Employees`);
                return employees;
            }
    }

    async getEmployeeById(id: string): Promise<employee> {
        const response = await container.item(id,id).read<Employee>();
        if(!response.resource){
            throw new ResourceNotFound(`Employee with ID ${id} could not be found.`, id);
        }
        else{
            logger.info(`${timestamp()} :EmployeeDAO: Found Employee with ID ${id}`);
            return response.resource;
        }
    }

    async getEmployeeByUsername(username: string): Promise<Employee> {
        const response = await container.items.readAll<Employee>().fetchAll();
        const employees:Employee[] = response.resources.map(e => ({...e}));
        const employee = employees.find(e => e.uName === username);
        if(!employee){
            throw new ResourceNotFound(`Employee with Username ${username} could not be found.`, username);
        }
        else{
            logger.info(`${timestamp()} :EmployeeDAO: Found Employee with Username ${username}`);
            return employee;
        }
    }

    async createEmployee(employee: employee): Promise<Employee> {
        employee.id = v4();
        const response = await container.items.create(employee);
        logger.info(`${timestamp()} :EmployeeDao: Employee was Created Successfully ${response.resource.id}`);
        return response.resource;
    }
    
}