import AzureReimbursementDao from "../daos/azure-reimbursement-dao";
import ReimbursementDAO from "../daos/reimbursement-dao"
import ReimbursementRequest from "../entities/reimbursement-request";
import ResourceNotFound from "../errors/resource-not-found";
import ReimbursementServices, { ReimbursementService } from "../services/reimbursement-service";

describe("Reimbursement Service Test Suite", () =>{

    const reimbursementDao:ReimbursementDAO = new AzureReimbursementDao();
    const reimbursementServices:ReimbursementService = new ReimbursementServices(reimbursementDao);
    
    it("Should get all pending requests", async ()=>{
        const openRequests:ReimbursementRequest[] = await reimbursementServices.getPendingRequests();
        expect(openRequests.length).toBeGreaterThan(0);
    })

    it("Should get all of an employees open requests", async ()=>{
        const empOpenRequests:ReimbursementRequest[] = await reimbursementServices.getPendingRequests("101");

        expect(empOpenRequests.length).toBeGreaterThan(0)
    })

    it("Should get all closed requests", async ()=>{
        const allRequests:ReimbursementRequest[] = await reimbursementServices.retrieveAllRequests();
        const closedRequests:ReimbursementRequest[] = await reimbursementServices.getClosedRequests();
        expect(closedRequests.length).toBeLessThanOrEqual(allRequests.length);
    })

    it("Should get of an employees closed requests", async ()=>{
        const empClosedRequests:ReimbursementRequest[] = await reimbursementServices.getClosedRequests("101");

        expect(empClosedRequests.length).toBeGreaterThanOrEqual(0);
    })

    it("Should throw an error when the passed ID isnt in the database", async () =>{
        try{
            await reimbursementServices.getPendingRequests("foo");
            fail();
        } catch (error){
            expect(error instanceof ResourceNotFound).toBe(true);
        }
        finally{
            try{
                await reimbursementServices.getClosedRequests("foo");
                fail();
            } catch (error) {
                expect(error instanceof ResourceNotFound).toBe(true);
            }
        }
    })
})