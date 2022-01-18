import reimbursementRequest from "../entities/reimbursement-request";
import ReimbursementDAO from "./reimbursement-dao";

export default class LocalReimbursementDao implements ReimbursementDAO{
    createRequest(request: reimbursementRequest): Promise<reimbursementRequest> {
        throw new Error("Method not implemented.");
    }
    getAllRequests(): Promise<reimbursementRequest[]> {
        throw new Error("Method not implemented.");
    }
    getRequestById(id: string): Promise<reimbursementRequest> {
        throw new Error("Method not implemented.");
    }
    getRequestsByEmployeeId(id: string): Promise<reimbursementRequest[]> {
        throw new Error("Method not implemented.");
    }
    getOpenRequests(): Promise<reimbursementRequest[]> {
        throw new Error("Method not implemented.");
    }
    getClosedRequests(): Promise<reimbursementRequest[]> {
        throw new Error("Method not implemented.");
    }
    
}