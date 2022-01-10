import EmployeeDAO from "../daos/employee-dao";
import Employee from "../entities/employee";
import AlreadyExists from "../errors/already-exists";

export interface EmployeeService {
    retrieveAllEmployees(): Promise<Employee[]>
    retrieveEmployeeById(id: string): Promise<Employee>
    addEmployee(employee: Employee): Promise<Employee>
}

export default class EmployeeServices implements EmployeeService {

    private employeeDao: EmployeeDAO;

    constructor(employeeDao: EmployeeDAO) {
        this.employeeDao = employeeDao;
    }

    async retrieveAllEmployees(): Promise<Employee[]> {
        return await this.employeeDao.getAllEmployees();
    }
    async retrieveEmployeeById(id: string): Promise<Employee> {
        return await this.employeeDao.getEmployeeById(id);
    }
    async addEmployee(employee: Employee): Promise<Employee> {
        const employees: Employee[] = await this.employeeDao.getAllEmployees();
        for (let e of employees) {
            if (e.fName === employee.fName && e.lName === employee.lName) {
                throw new AlreadyExists(`Employee already exists`);
            }
        }
        const newEmployee:Employee = await this.employeeDao.createEmployee(employee);
        console.log(newEmployee);
        return newEmployee;
    }

}