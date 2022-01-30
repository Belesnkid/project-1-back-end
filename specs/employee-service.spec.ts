import AzureEmployeeDAO from "../daos/azure-employee-dao";
import EmployeeDAO from "../daos/employee-dao";
import Employee from "../entities/employee";
import AlreadyExists from "../errors/already-exists";
import ResourceNotFound from "../errors/resource-not-found";
import EmployeeServices from "../services/employee-service"

describe("Employee Service Tests", ()=>{
    const employeeDao:EmployeeDAO = new AzureEmployeeDAO();
    const employeeService:EmployeeServices = new EmployeeServices(employeeDao);
    let testEmployee:Employee;

    it("Should get all employees from the database", async ()=>{
        const employees:Employee[] = await employeeService.retrieveAllEmployees();
        expect(employees.length).toBeGreaterThan(0);
    });

    it("Should get a specific person from the database", async ()=>{
        const employee:Employee = await employeeService.retrieveEmployeeById("101");
        expect(employee.fName).toBe("test");
    })

    it("Should throw an error if employee is not in database", async ()=>{
        try{
            await employeeService.retrieveEmployeeById("0");
            fail();
        } catch(error){
            expect(error instanceof ResourceNotFound).toBe(true);
        }
    })

    it("Should add a new Employee", async ()=>{
        testEmployee = await employeeService.addEmployee({id:"", fName:"Robert", lName:"Irvine", uName:"RamsaySux", pass:"imeanit", isManager:false});
        expect(testEmployee.id).toBeTruthy();
    })

    it("Should throw an error if employee already exists", async ()=>{
        try{
            await employeeService.addEmployee(testEmployee);
        } catch(error){
            expect(error instanceof AlreadyExists).toBe(true);
        }
    })
})