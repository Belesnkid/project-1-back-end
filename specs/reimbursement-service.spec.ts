import LocalReimbursementDao from "../daos/local-reimbursement-dao"
import ReimbursementDAO from "../daos/reimbursement-dao"
import ReimbursementRequest from "../entities/reimbursement-request";
import ResourceNotFound from "../errors/resource-not-found";
import ReimbursementServices, { ReimbursementService } from "../services/reimbursement-service";

describe("Reimbursement Service Test Suite", () =>{

    const reimbursementDao:ReimbursementDAO = new LocalReimbursementDao();
    const reimbursementServices:ReimbursementService = new ReimbursementServices(reimbursementDao);
    
    it("Should get all pending requests", async ()=>{
        const allRequests:ReimbursementRequest[] = await reimbursementServices.retrieveAllRequests();
        const openRequests:ReimbursementRequest[] = await reimbursementServices.getPendingRequests();
        expect(openRequests.length).toBeLessThan(allRequests.length);
    })

    it("Should get all of an employees open requests", async ()=>{
        const openRequests:ReimbursementRequest[] = await reimbursementServices.getPendingRequests();
        const empRequests:ReimbursementRequest[] = await reimbursementServices.retrieveEmployeeRequests("101");
        const empOpenRequests:ReimbursementRequest[] = await reimbursementServices.getPendingRequests("101");

        expect(openRequests.length).toBeGreaterThan(empOpenRequests.length);
        expect(empRequests.length).toBeGreaterThan(empOpenRequests.length);
    })

    it("Should get all closed requests", async ()=>{
        const allRequests:ReimbursementRequest[] = await reimbursementServices.retrieveAllRequests();
        const closedRequests:ReimbursementRequest[] = await reimbursementServices.getClosedRequests();
        expect(closedRequests.length).toBeLessThan(allRequests.length);
    })

    it("Should get of an employees closed requests", async ()=>{
        const closedRequests:ReimbursementRequest[] = await reimbursementServices.getClosedRequests();
        const empRequests:ReimbursementRequest[] = await reimbursementServices.retrieveEmployeeRequests("101");
        const empClosedRequests:ReimbursementRequest[] = await reimbursementServices.getClosedRequests("101");

        expect(closedRequests.length).toBeGreaterThan(empClosedRequests.length);
        expect(empRequests.length).toBeGreaterThan(empClosedRequests.length);
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