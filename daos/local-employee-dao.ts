import { v4 } from "uuid";
import employee from "../entities/employee";
import EmployeeDAO from "./employee-dao";
import { readFile, writeFile } from "fs/promises";
import Employee from "../entities/employee";
import ResourceNotFound from "../errors/resource-not-found";
import { logger, timestamp } from '..';

export default class LocalEmployeeDAO implements EmployeeDAO {
    async getAllEmployees(): Promise<Employee[]> {
        const employeeData = await readFile('local-employees.json');
        const employees: Employee[] = JSON.parse(employeeData.toString());
        if(employees.length === 0){
            throw new ResourceNotFound("The Database must be Empty", "")
        }
        else{
            logger.info(`${timestamp()} :EmployeeDAO: Got all Employees`);
            return employees;
        }
    }

    async getEmployeeById(id: string): Promise<Employee> {
        const employeeData = await readFile('local-employees.json');
        const employees: Employee[] = JSON.parse(employeeData.toString());
        const employee = employees.find(e => e.id === id);
        if(!employee){
            throw new ResourceNotFound(`Employee with ID ${id} could not be found.`, id);
        }
        else{
            logger.info(`${timestamp()} :EmployeeDAO: Found Employee with ID ${id}`);
            return employee;
        }
    }

    async createEmployee(employee: employee): Promise<Employee> {
        const employeeData = await readFile('local-employees.json');
        const employees: Employee[] = JSON.parse(employeeData.toString());
        employee.id = v4();
        employees.push(employee);
        await writeFile('local-employees.json', JSON.stringify(employees));
        logger.info(`${timestamp()} :EmployeeDAO: Employee Created ${employee}`)
        return employee;
    }

    async getEmployeeByUsername(username: string): Promise<employee> {
        const employeeData = await readFile('local-employees.json');
        const employees: Employee[] = JSON.parse(employeeData.toString());
        const employee = employees.find(e => e.uName === username);
        if(!employee){
            throw new ResourceNotFound(`Employee with Username ${username} could not be found.`, username);
        }
        else{
            logger.info(`${timestamp()} :EmployeeDAO: Found Employee with Username ${username}`);
            return employee;
        }
    }
}