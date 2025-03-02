import { Request, Response, NextFunction } from "express";
import AppError from "../utils/error.util";
import validator from "validator"

export const registerAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.body.name || !req.body.email || !req.body.password) {
            return next(new AppError(400, "Please provide name, email and password"));
        }

        if(!validator.isEmail(req.body.email)) {
            return next(new AppError(400, "Please provide a valid email"));
        }

    } catch (error) {
        next(error);
    }
}

export const loginAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.body.email || !req.body.password) {
            return next(new AppError(400, "Please provide email and password"));
        }

        if(!validator.isEmail(req.body.email)) {
            return next(new AppError(400, "Please provide a valid email"));
        }
    }

    catch(error){
        next(error);
    }
}
