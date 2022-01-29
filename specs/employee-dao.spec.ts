import EmployeeDAO from "../daos/employee-dao";
import Employee from "../entities/employee";
import ResourceNotFound from "../errors/resource-not-found";
import AzureEmployeeDAO from "../daos/azure-employee-dao";

describe("Tests for Employee Dao", () => {

    const employeeDao: EmployeeDAO = new AzureEmployeeDAO();

    let testEmployee: Employee;

    it("Should crate an employee in the database", async ()=>{
        const employee:Employee = {id:"", fName:"Daniel", lName:"Belenski", uName:"Dragocon", pass:"Pa$$w0rd", isManager:true};
        testEmployee = await employeeDao.createEmployee(employee);
        expect(testEmployee.id).toBeTruthy();
    })

    it("Should get a specific employee from the database", async ()=>{
        const employee:Employee = await employeeDao.getEmployeeById(testEmployee.id);
        expect(employee.id).toBe(testEmployee.id);
    })

    it("Should get all emplyees from the database", async ()=>{
        const employees:Employee[] = await employeeDao.getAllEmployees();
        expect(employees.length).toBeGreaterThan(0);
    })

    it("Should throw an error when asked for an employee that is not in the database", async ()=>{
        try{
            await employeeDao.getEmployeeById("foo");
            fail();
        } catch(error){
            expect(error instanceof ResourceNotFound).toBe(true);
        }
    })

})