import { CosmosClient } from "@azure/cosmos";
import { v4 } from "uuid";
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
                return employees;
            }
    }

    async getEmployeeById(id: string): Promise<employee> {
        const response = await container.item(id,id).read<Employee>();
        if(!response.resource){
            throw new ResourceNotFound(`Employee with ID ${id} could not be found.`, id);
        }
        else{
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
            return employee;
        }
    }

    async createEmployee(employee: employee): Promise<Employee> {
        employee.id = v4();
        const response = await container.items.create(employee);
        return response.resource;
    }
    
}