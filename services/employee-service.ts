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

    //takes in an EmployeeDAO so I can easily swap my implementation for the azure based dao or the local dao
    constructor(employeeDao: EmployeeDAO) {
        this.employeeDao = employeeDao;
    }

    //gets all employees from the dao
    async retrieveAllEmployees(): Promise<Employee[]> {
        return await this.employeeDao.getAllEmployees();
    }

    //get a specific employee with matching ID from the dao
    async retrieveEmployeeById(id: string): Promise<Employee> {
        return await this.employeeDao.getEmployeeById(id);
    }

    //checks if the employee to be created exists or not before giving employee record to the dao for creation
    async addEmployee(employee: Employee): Promise<Employee> {
        const newEmployee: Employee = await this.employeeDao.createEmployee(employee);
        return newEmployee;
    }

    async retrieveEmployeeByUsername(username:string):Promise<Employee>{
        const employee:Employee = await this.employeeDao.getEmployeeByUsername(username);
        return employee;
    }

}