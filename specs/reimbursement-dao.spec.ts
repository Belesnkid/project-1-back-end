import LocalReimbursementDao from "../daos/local-reimbursement-dao"
import ReimbursementDAO from "../daos/reimbursement-dao"
import ReimbursementRequest from "../entities/reimbursement-request";
import ResourceNotFound from "../errors/resource-not-found";
import { readFile } from 'fs/promises';

describe("Test Suite for the Reimbursement DAO", () => {
    const reimbursementDao:ReimbursementDAO = new LocalReimbursementDao();
    let testRequest:ReimbursementRequest;

    const daoStub:ReimbursementDAO = {
        createRequest: function (request: ReimbursementRequest): Promise<ReimbursementRequest> {
            throw new Error("Function not implemented.");
        },
        async getAllRequests(): Promise<ReimbursementRequest[]> {
            const requestData = await readFile('empty-database.json');
            const requests:ReimbursementRequest[] = JSON.parse(requestData.toString());
            if(requests.length === 0){
                throw new ResourceNotFound("The database is empty","");    
            }
            return requests;
        },
        getRequestById: function (id: string): Promise<ReimbursementRequest> {
            throw new Error("Function not implemented.");
        },
        getRequestsByEmployeeId: function (id: string): Promise<ReimbursementRequest[]> {
            throw new Error("Function not implemented.");
        },
        updateRequest: function (request: ReimbursementRequest): Promise<ReimbursementRequest> {
            throw new Error("Function not implemented.");
        }
    };
    
    it("Should create a Reimbursement Request", async ()=>{
        const request:ReimbursementRequest = {id:"", employeeId:"101", amount:100, pending:true, empReason:"Donuts"};
        testRequest = await reimbursementDao.createRequest(request);
        expect(testRequest.id).toBeTruthy();
    })

    it("Should get all reimbursement requests", async ()=>{
        const newRequests:ReimbursementRequest[] = [
            {id:"", employeeId:"101", amount:10, pending:true, empReason:"Office Supplies"},
            {id:"", employeeId:"202", amount:100, pending:true},
            {id:"", employeeId:"303", amount:1000, pending:true, empReason:"GPU"}
        ];
        for (let r of newRequests){
            await reimbursementDao.createRequest(r);
        }
        const requests:ReimbursementRequest[] = await reimbursementDao.getAllRequests();
        expect(requests.length).toBeGreaterThanOrEqual(4);
    })

    it("Should get a specific request", async ()=>{
        const target:ReimbursementRequest = await reimbursementDao.getRequestById(testRequest.id);
        expect(target.id).toBe(testRequest.id);
    })

    it("Should get all requests with the same Employee ID", async ()=>{
        const requests:ReimbursementRequest[] = await reimbursementDao.getRequestsByEmployeeId(testRequest.employeeId);
        expect(requests.length).toBeGreaterThanOrEqual(2);
    })

    it("Should update information in a specific request", async ()=>{
        const newAmt = 18;
        testRequest.amount = newAmt;
        const updatedRequest:ReimbursementRequest = await reimbursementDao.updateRequest(testRequest);
        expect(updatedRequest.amount).toBe(newAmt);
    })

    it("Should throw an error if the database is empty", async ()=>{
        try{
            await daoStub.getAllRequests();
            fail();
        } catch (error){
            expect(error instanceof ResourceNotFound).toBe(true);
        }
    })

    it("Should throw an error if given an ID not in the database", async ()=>{
        try{
            await reimbursementDao.getRequestById("foo");
            fail();
        } catch (error){
            expect(error instanceof ResourceNotFound).toBe(true);
        }
    })

    it("Should throw an error if there is no matching Employee ID in the database", async ()=>{
        try{
            await reimbursementDao.getRequestsByEmployeeId("foo");
            fail();
        } catch (error){
            expect(error instanceof ResourceNotFound).toBe(true);
        }
    })

    it("Should throw an error if no matching request id was found", async ()=>{
        testRequest.id = "foo";
        try{
            await reimbursementDao.updateRequest(testRequest);
            fail();
        } catch (error){
            expect(error instanceof ResourceNotFound).toBe(true);
        }
    })
})
