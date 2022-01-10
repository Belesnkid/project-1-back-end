export default class AlreadyExists extends Error{
    constructor(message:string){
        super(message);
    }
}