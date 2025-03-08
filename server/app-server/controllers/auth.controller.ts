import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.util";
import validator from "validator"
import QueueService from "../services/queue.service";
import mailConfig from "../configs/mail.config.json";
import AuthService from "../services/auth.service";
import rabbitMQConfig from "../configs/queue.config.json";
import { apiResponse, asyncHandler, setCookie } from "../utils/request.util";
import { AuthorRequest } from "../../../models/author.model";

export const registerAuthor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return next(new AppError(400, "Please provide name, email and password"));
    }

    if (!validator.isEmail(req.body.email)) {
        return next(new AppError(400, "Please provide a valid email"));
    }

    const { author, token } = await AuthService.signUp(req.body);

    await QueueService.sendMessageToQueue(
        req.app.get("articleChannel"),
        rabbitMQConfig.EMAIL_MQ_NAME,
        {
            type: mailConfig.types.WELCOME.name,
            data: {
                email: author.email,
                name: author.name,
            }
        }
    );

    author.password = undefined as any;

    setCookie(res, "token", token);

    apiResponse(res, 201, "User Registered Successfully", { ...author, token });
});

export const loginAuthor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.email || !req.body.password) {
        return next(new AppError(400, "Please provide email and password"));
    }

    if (!validator.isEmail(req.body.email)) {
        return next(new AppError(400, "Please provide a valid email"));
    }

    const { author, token } = await AuthService.login(req.body);

    author.password = undefined as any;

    setCookie(res, "jwt", token);

    apiResponse(res, 200, "User Logged In Successfully", { ...author, token });
});

export const logoutAuthor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("jwt");
    apiResponse(res, 200, "User Logged Out Successfully", {});
});

export const isLoggedIn = asyncHandler(async (req: AuthorRequest, res: Response, next: NextFunction) => {
    if (!req.author) {
        return apiResponse(res, 401, "Unauthorized", {});
    }

    return apiResponse(res, 200, "User is logged in", { ...req.author });
});

