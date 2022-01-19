import ReimbursementRequest from "../entities/reimbursement-request";

export default interface ReimbursementDAO{
    createRequest(request:ReimbursementRequest):Promise<ReimbursementRequest>
    getAllRequests():Promise<ReimbursementRequest[]>
    getRequestById(id:string):Promise<ReimbursementRequest>
    getRequestsByEmployeeId(id:string):Promise<ReimbursementRequest[]>
    updateRequest(request:ReimbursementRequest):Promise<ReimbursementRequest>
}