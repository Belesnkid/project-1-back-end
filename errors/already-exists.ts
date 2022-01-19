export default class AlreadyExists extends Error{
    resourceId:string;
    constructor(message:string, resourceId:string){
        super(message);
        this.resourceId = resourceId;
    }
}