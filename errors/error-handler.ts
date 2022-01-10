import {Response, Request} from "express";
import ResourceNotFound from "./resource-not-found";
import AlreadyExists from "./already-exists";

export default function errorHandler(error: Error | unknown, req: Request, res: Response){
    if(error instanceof ResourceNotFound){
        console.log("Resource Could not be Found.");
        res.status(404);
        res.send(error.message);
    }
    else if(error instanceof AlreadyExists){
        console.log("Resource Already Exists");
        res.status(409);
        res.send(error.message);
    }
    else{
        res.status(500);
        res.send("An Unknown Error has Occured");
    }
}