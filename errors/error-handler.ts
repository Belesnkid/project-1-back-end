import {Response, Request} from "express";
import ResourceNotFound from "./resource-not-found";
import AlreadyExists from "./already-exists";
import LoginError from "./login";
import { logger, timestamp } from "..";

export default function errorHandler(error: Error | unknown, req: Request, res: Response){
    if(error instanceof ResourceNotFound){
        console.log("Resource Could not be Found.");
        logger.error(`${timestamp()} : Resource Could not be Found`);
        logger.verbose(`${timestamp()} : Resource Could not be Found`);
        res.status(404);
        res.send(error.message);
    }
    else if(error instanceof AlreadyExists){
        console.log("Resource Already Exists");
        logger.error(`${timestamp()} : Resource Already Exists`);
        logger.verbose(`${timestamp()} : Resource Already Exists`);
        res.status(409);
        res.send(error.message);
    }
    else if (error instanceof LoginError){
        console.log("Invalid Login Information");
        logger.error(`${timestamp()} : Invalid Login Provided`);
        logger.verbose(`${timestamp()} : Invalid Login Provided`);
        res.status(401);
        res.send(error.message);
    }
    else{
        logger.error(`${timestamp()} : An Unknown Error has Occured`);
        logger.verbose(`${timestamp()} : An Unknown Error has Occured`);
        res.status(500);
        res.send("An Unknown Error has Occured");
    }
}