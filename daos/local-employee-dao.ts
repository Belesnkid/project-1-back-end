import { v4 } from "uuid";
import employee from "../entities/employee";
import EmployeeDAO from "./employee-dao";
import { readFile, writeFile } from "fs/promises";
import Employee from "../entities/employee";
import ResourceNotFound from "../errors/resource-not-found";

export default class LocalEmployeeDAO implements EmployeeDAO {
    async getAllEmployees(): Promise<Employee[]> {
        const employeeData = await readFile('C:\\Users\\Daniel\\OneDrive\\Desktop\\Project-1\\project-1-back-end\\local-employees.json');
        const employees: Employee[] = JSON.parse(employeeData.toString());
        if(employees.length === 0){
            throw new ResourceNotFound("The Database must be Empty")
        }
        else{
            return employees;
        }
    }

    async getEmployeeById(id: string): Promise<Employee> {
        const employeeData = await readFile('C:\\Users\\Daniel\\OneDrive\\Desktop\\Project-1\\project-1-back-end\\local-employees.json');
        const employees: Employee[] = JSON.parse(employeeData.toString());
        const employee = employees.find(e => e.id === id);
        if(!employee){
            throw new ResourceNotFound(`Employee with ID ${id} could not be found.`);
        }
        else{
            return employee;
        }
    }

    async createEmployee(employee: employee): Promise<Employee> {
        const employeeData = await readFile('C:\\Users\\Daniel\\OneDrive\\Desktop\\Project-1\\project-1-back-end\\local-employees.json');
        const employees: Employee[] = JSON.parse(employeeData.toString());
        employee.id = v4();
        employees.push(employee);
        await writeFile('C:\\Users\\Daniel\\OneDrive\\Desktop\\Project-1\\project-1-back-end\\local-employees.json', JSON.stringify(employees));
        console.log(employee);
        return employee;
    }
}