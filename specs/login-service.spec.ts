import EmployeeDAO from "../daos/employee-dao";
import LocalEmployeeDAO from "../daos/local-employee-dao";
import Employee from "../entities/employee";
import LoginError from "../errors/login";
import LoginServiceImpl, { Login } from "../services/login-service"

describe("Login Service Tests", ()=>{
    const employeeDAO:EmployeeDAO = new LocalEmployeeDAO();
    const loginService:Login = new LoginServiceImpl(employeeDAO);
    const employeeLogin = {uName:"JTest", pass:"T35t"};
    const managerLogin = {uName:"Dragocon", pass:"Pa$$w0rd"};

    // it("Should return a valid employee from the database using their valid login (Employee)", async ()=>{
    //     const employee:Employee = await loginService.login(employeeLogin.uName, employeeLogin.pass);
    //     expect (employee.id).not.toBeFalsy();
    // })

    // it("Should return a valid employee from the database using their valid login (Manager)", async ()=>{
    //     const manager:Employee = await loginService.login(managerLogin.uName, managerLogin.pass);
    //     expect (manager.id).not.toBeFalsy();
    // })

    // it("Should throw an error on an invalid login", async ()=>{
    //     try{
    //         await loginService.login(employeeLogin.uName, managerLogin.pass)
    //     } catch (error) {
    //         expect(error instanceof LoginError).toBe(true);
    //     }
    // })
})