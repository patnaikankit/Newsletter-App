import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: any) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    const expiresIn: number | string = process.env.JWT_EXPIRES_IN || "1h";

    return jwt.sign(payload, process.env.JWT_SECRET);
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!);
};