import ReimbursementRequest from "../entities/reimbursement-request";
import ReimbursementDAO from "./reimbursement-dao";
import { readFile, writeFile } from "fs/promises";
import { v4 } from "uuid";
import { logger, timestamp } from '..';
import ResourceNotFound from "../errors/resource-not-found";

export default class LocalReimbursementDao implements ReimbursementDAO{
    async createRequest(request: ReimbursementRequest): Promise<ReimbursementRequest> {
        const requestData = await readFile('local-reimbursement-requests.json');
        const requests:ReimbursementRequest[] = JSON.parse(requestData.toString());
        request.id = v4();
        requests.push(request);
        await writeFile('local-reimbursement-requests.json', JSON.stringify(requests));
        logger.info(`${timestamp()} :ReimbursementDAO: Reimbursement Created : ${request}`);
        return request;
    }
    async getAllRequests(): Promise<ReimbursementRequest[]> {
        const requestData = await readFile('local-reimbursement-requests.json');
        const requests:ReimbursementRequest[] = JSON.parse(requestData.toString());
        return requests;
    }
    async getRequestById(id: string): Promise<ReimbursementRequest> {
        const requestData = await readFile('local-reimbursement-requests.json');
        const requests:ReimbursementRequest[] = JSON.parse(requestData.toString());
        const target:ReimbursementRequest = requests.find(r => r.id === id);
        if (!target){
            throw new ResourceNotFound(`Reimbusement Request with ID ${id} could not be found`, id);
        } else {
            return target;
        }
    }
    async getRequestsByEmployeeId(id: string): Promise<ReimbursementRequest[]> {
        const requestData = await readFile('local-reimbursement-requests.json');
        const requests:ReimbursementRequest[] = JSON.parse(requestData.toString());
        const empRequests:ReimbursementRequest[] = requests.filter(r => r.employeeId === id);
        if (empRequests.length === 0){
            throw new ResourceNotFound(`Resource with ID ${id} coud not be found`, id);
        } else {
            return empRequests;
        }
    }
    async updateRequest(request: ReimbursementRequest): Promise<ReimbursementRequest> {
        const requestData = await readFile('local-reimbursement-requests.json');
        const requests:ReimbursementRequest[] = JSON.parse(requestData.toString());
        let found = false;
        for(let r of requests){
            if(r.id === request.id){
                r = request;
                found = true;
            }
        }
        if (found){        
            await writeFile('local-reimbursement-requests.json', JSON.stringify(requests));
            logger.info(`${timestamp()} :ReimbursementDAO: Request with ID ${request.id} Updated Successfully`);
            return request;
        } else {
            throw new ResourceNotFound(`Resource with ID ${request.id} Could not be Found`, request.id);            
        }
    }
    
}