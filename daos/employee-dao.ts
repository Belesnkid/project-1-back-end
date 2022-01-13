import Employee from "../entities/employee";
export default interface EmployeeDAO{
    getAllEmployees():Promise<Employee[]>
    getEmployeeById(id:string):Promise<Employee>
    getEmployeeByUsername(username:string):Promise<Employee>
    createEmployee(employee:Employee):Promise<Employee>
}