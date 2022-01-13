import EmployeeDAO from "../daos/employee-dao";
import Employee from "../entities/employee";
import LoginError from "../errors/login";

export interface Login{
    login(username:string, password:string):Promise<Employee>
}

export default class LoginServiceImpl implements Login{
    
    private employeeDao:EmployeeDAO

    constructor(employeeDao:EmployeeDAO){
        this.employeeDao = employeeDao;
    }

    async login(username: string, password: string): Promise<Employee> {
        const employee:Employee = await this.employeeDao.getEmployeeByUsername(username);
        if (employee.pass !== password){
            throw new LoginError("Username and Password do not match.");
        }
        else{
            return employee;
        }
    }
}