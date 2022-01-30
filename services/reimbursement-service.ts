import ReimbursementDAO from "../daos/reimbursement-dao";
import ReimbursementRequest from "../entities/reimbursement-request";

export interface ReimbursementService{
    addNewRequest(request:ReimbursementRequest):Promise<ReimbursementRequest>
    retrieveAllRequests():Promise<ReimbursementRequest[]>
    retrieveRequestById(id:string):Promise<ReimbursementRequest>
    retrieveEmployeeRequests(id:string):Promise<ReimbursementRequest[]>
    updateReimburement(request:ReimbursementRequest):Promise<ReimbursementRequest>
    getPendingRequests(id?:string):Promise<ReimbursementRequest[]>
    getClosedRequests(id?:string):Promise<ReimbursementRequest[]>
}

export default class ReimbursementServices implements ReimbursementService{

    private reimbursementDao:ReimbursementDAO;

    constructor (reimbursementDao:ReimbursementDAO){
        this.reimbursementDao = reimbursementDao;
    }

    async addNewRequest(request: ReimbursementRequest): Promise<ReimbursementRequest> {
        return await this.reimbursementDao.createRequest(request);
    }

    async retrieveAllRequests(): Promise<ReimbursementRequest[]> {
        return await this.reimbursementDao.getAllRequests();
    }

    async retrieveRequestById(id: string): Promise<ReimbursementRequest> {
        return await this.reimbursementDao.getRequestById(id);
    }

    async retrieveEmployeeRequests(id: string): Promise<ReimbursementRequest[]> {
        return await this.reimbursementDao.getRequestsByEmployeeId(id);
    }

    async updateReimburement(request: ReimbursementRequest): Promise<ReimbursementRequest> {
        return await this.reimbursementDao.updateRequest(request);
    }

    async getPendingRequests(id?: string): Promise<ReimbursementRequest[]> {
        if(!id){
            const allRequests:ReimbursementRequest[] = await this.reimbursementDao.getAllRequests();
            const requests:ReimbursementRequest[] = [];
            for(let r of allRequests){
                if(r.pending === true){
                    requests.push(r);
                }
            }
            return requests;
        } else {
            const empRequests:ReimbursementRequest[] = await this.retrieveEmployeeRequests(id);
            const requests:ReimbursementRequest[] = [];
            for(let r of empRequests){
                if(r.pending === true){
                    requests.push(r);
                }
            }
            return requests;
        }
    }

    async getClosedRequests(id?: string): Promise<ReimbursementRequest[]> {
        if(!id){
            const allRequests:ReimbursementRequest[] = await this.reimbursementDao.getAllRequests();
            const requests:ReimbursementRequest[] = [];
            for(let r of allRequests){
                if(r.pending === false){
                    requests.push(r);
                }
            }
            return requests;
        } else {
            const empRequests:ReimbursementRequest[] = await this.retrieveEmployeeRequests(id);
            const requests:ReimbursementRequest[] = [];
            for(let r of empRequests){
                if(r.pending === false){
                    requests.push(r);
                }
            }
            return requests;
        }
    }
    
}