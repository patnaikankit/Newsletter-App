import prisma from "../configs/db.config";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.util";

export type Author = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

class AuthService {
    static signUp = async (payload: {name: string, email: string, password: string}): Promise<{author: Author, token: string}> => {
        const hashedPassword = await hashPassword(payload.password);
        payload.password = hashedPassword;
        
        const author = await prisma.author.create({
            payload
        })

        const token = generateToken({id: author.id});
        return {author, token};
    }

    static login = async (payload: {email: string, password: string}): Promise<{author: Author, token: string}> => {
        const author = await prisma.author.findUnique({
            where: {
                email: payload.email
            }
        })
        if(!author) {
            throw new Error("Invalid credentials");
        }

        const passwordCheck: Boolean = await comparePassword(author.password, payload.password); 

        if(!passwordCheck) {
            throw new Error("Invalid credentials");
        }

        const token = generateToken({id: author.id});
        return {author, token};
    }
}

export default AuthService;

