import { Request, Response, NextFunction, CookieOptions } from "express";

const CookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
}

export const setCookie = (res: Response, name: string, value: string, options: CookieOptions = CookieOptions) => {
    res.cookie(name, value, options);
}

export const clearCookie = (res: Response, name: string) => {
    res.clearCookie(name);
}

export const apiResponse = (res: Response, statusCode: number, message: string, data: any) => {
    return res.status(statusCode).json({
        message,
        data
    });
}

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) =>
      fn(req, res, next).catch(next);
};
