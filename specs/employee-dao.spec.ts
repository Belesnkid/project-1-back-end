import EmployeeDAO from "../daos/employee-dao";
import LocalEmployeeDAO from "../daos/local-employee-dao"
import Employee from "../entities/employee";
import ResourceNotFound from "../errors/resource-not-found";
import { readFile, writeFile } from "fs/promises";

describe("Tests for Employee Dao", ()=>{

    const employeeDao:EmployeeDAO = new LocalEmployeeDAO();

    // const EmployeeDaoStub:EmployeeDAO = {
    //     async getAllEmployees(): Promise<Employee[]> {
    //         const employeeData = await readFile('C:\\Users\\Daniel\\OneDrive\\Desktop\\Project-1\\project-1-back-end\\empty-database.json');
    //         const employees: Employee[] = JSON.parse(employeeData.toString());
    //         if(employees.length === 0){
    //             throw new ResourceNotFound("The Database must be Empty");
    //         }
    //         else{
    //             return employees;
    //         }
    //     },
    //     getEmployeeById: function (id: string): Promise<Employee> {
    //         throw new Error("Function not implemented.");
    //     },
    //     createEmployee: function (employee: Employee): Promise<Employee> {
    //         throw new Error("Function not implemented.");
    //     }
    // };

    let testEmployee:Employee;

    // it("Should crate an employee in the database", async ()=>{
    //     const employee:Employee = {id:"", fName:"Daniel", lName:"Belenski", uName:"Dragocon", pass:"Pa$$w0rd", isManager:true};
    //     testEmployee = await employeeDao.createEmployee(employee);
    //     expect(testEmployee.id).toBeTruthy();
    // })

    // it("Should get a specific employee from the database", async ()=>{
    //     const employee:Employee = await employeeDao.getEmployeeById(testEmployee.id);
    //     expect(employee.id).toBe(testEmployee.id);
    // })

    // it("Should get all emplyees from the database", async ()=>{
    //     const employees:Employee[] = await employeeDao.getAllEmployees();
    //     expect(employees.length).toBeGreaterThan(0);
    // })

    // it("Should throw an error when the database is empty", async ()=>{
    //     try{
    //         await EmployeeDaoStub.getAllEmployees();
    //         fail()
    //     }catch(error){
    //         console.log(error);
    //         expect(error instanceof ResourceNotFound).toBe(true);
    //     }
    // })

    // it("Should throw an error when asked for an employee that is not in the database", async ()=>{
    //     try{
    //         await employeeDao.getEmployeeById("foo");
    //     } catch(error){
    //         expect(error instanceof ResourceNotFound).toBe(true);
    //     }
    // })
})