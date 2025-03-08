import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            author?: JwtPayload;
        }
    }
} 