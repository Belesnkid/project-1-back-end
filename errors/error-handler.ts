import {Response, Request} from "express";
import ResourceNotFound from "./resource-not-found";
import AlreadyExists from "./already-exists";
import LoginError from "./login";
import { logger, timestamp } from "..";

export default function errorHandler(error: Error | unknown, req: Request, res: Response){
    if(error instanceof ResourceNotFound){
        console.log("Resource Could not be Found.");
        logger.error(`${timestamp()} :ErrorHandler: Resource Could not be Found, ${error.resourceId}`);
        res.status(404);
        res.send(error.message);
    }
    else if(error instanceof AlreadyExists){
        console.log("Resource Already Exists");
        logger.error(`${timestamp()} :ErrorHandler: Resource Already Exists, ${error.resourceId}`);
        res.status(409);
        res.send(error.message);
    }
    else if (error instanceof LoginError){
        console.log("Invalid Login Information");
        logger.error(`${timestamp()} :ErrorHandler: Invalid Login Provided, ${error.resourceId}`);
        res.status(401);
        res.send(error.message);
    }
    else{
        logger.error(`${timestamp()} :ErrorHandler: An Unknown Error has Occured`);
        res.status(500);
        res.send("An Unknown Error has Occured");
    }
}