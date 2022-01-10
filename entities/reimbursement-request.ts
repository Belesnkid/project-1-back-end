export default interface ReimbursementRequest{
    id:string
    employeeId:string
    amount:number
    reason:string
    pending:boolean
}