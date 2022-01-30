import { CosmosClient } from "@azure/cosmos";
import { v4 } from "uuid";
import reimbursementRequest from "../entities/reimbursement-request";
import ResourceNotFound from "../errors/resource-not-found";
import ReimbursementDAO from "./reimbursement-dao";

const myClient = new CosmosClient(process.env.P1Conn);
const db = myClient.database('Reimburesement-DB');
const container = db.container('Reimbursement-Request');

export default class AzureReimbursementDao implements ReimbursementDAO{
    async createRequest(request: reimbursementRequest): Promise<reimbursementRequest> {
        request.id = v4();
        const response = await container.items.create(request);
        return response.resource;
    }
    async getAllRequests(): Promise<reimbursementRequest[]> {
        const response = await container.items.readAll<reimbursementRequest>().fetchAll();
        const requests:reimbursementRequest[] = response.resources.map(r => ({...r}));
        if (requests.length === 0){
            throw new ResourceNotFound("Database is Empty","");
        }
        else{
            return requests;
        }
    }
    async getRequestById(id: string): Promise<reimbursementRequest> {
        const response = await container.item(id,id).read<reimbursementRequest>();
        if(!response.resource){
            throw new ResourceNotFound(`Request with ID ${id} could not be found`, id);
        }
        else{
            return response.resource;
        }
    }
    async getRequestsByEmployeeId(id: string): Promise<reimbursementRequest[]> {
        const requests = await this.getAllRequests();
        let targets = [];
        for(let r of requests){
            if(r.employeeId === id){
                targets.push(r);
            }
        }
        if(targets.length === 0){
            throw new ResourceNotFound(`No Requests found for employee with ID ${id}`,id);
        }
        else{
            return targets;
        }
    }
    async updateRequest(request: reimbursementRequest): Promise<reimbursementRequest> {
        const response = await container.items.upsert<reimbursementRequest>(request);
        if(!response.resource){
            throw new ResourceNotFound(`Request was not able to be updated`, request.id);
        }
        else{
            return response.resource;
        }
    }
    
}