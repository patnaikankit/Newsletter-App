import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.util";
import { asyncHandler } from "../utils/request.util";
import { verifyToken } from "../utils/auth.util";
import AuthorService from "../services/author.service";

export const isAuthenticated = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.jwt;

    if(!token) {
        token = req.headers.authorization?.split(" ")[1];
    }

    if(!token) {
        return next(new AppError(401, "Unauthorized"));
    }

    const checkToken = verifyToken(token);

    if(!checkToken || typeof checkToken === 'string') {
        return next(new AppError(401, "Please login to continue"));
    }
    
    const author = await AuthorService.getAuthorById(checkToken.id);

    if(!author) {
        return next(new AppError(401, "User not found"));
    }

    req.author = checkToken;

    next();
})
