import ReimbursementRequest from "../entities/reimbursement-request";

export default interface ReimbursementDAO{
    createRequest(request:ReimbursementRequest):Promise<ReimbursementRequest>
    getAllRequests():Promise<ReimbursementRequest[]>
    getRequestById(id:string):Promise<ReimbursementRequest>
    getRequestsByEmployeeId(id:string):Promise<ReimbursementRequest[]>
    getOpenRequests():Promise<ReimbursementRequest[]>
    getClosedRequests():Promise<ReimbursementRequest[]>
}