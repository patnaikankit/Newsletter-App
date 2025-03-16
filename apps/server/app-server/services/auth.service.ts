import Prisma from "../configs/db.config";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.util";
import { Author } from "@repo/types/author";

class AuthService {
    static signUp = async (data: {name: string, email: string, password: string}): Promise<{author: Author, token: string}> => {
        const hashedPassword = await hashPassword(data.password);
        data.password = hashedPassword;
        
        const author = await Prisma.author.create({
            data
        })

        const token = generateToken({id: author.ID});
        return {author, token};
    }

    static login = async (data: {email: string, password: string}): Promise<{author: Author, token: string}> => {
        const author = await Prisma.author.findUnique({
            where: {
                email: data.email
            }
        })
        if(!author) {
            throw new Error("Invalid credentials");
        }

        const passwordCheck: Boolean = await comparePassword(author.password, data.password); 

        if(!passwordCheck) {
            throw new Error("Invalid credentials");
        }

        const token = generateToken({id: author.ID});
        return {author, token};
    }
}

export default AuthService;

