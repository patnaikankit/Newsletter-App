import Prisma from "../configs/db.config";
import { Author } from "@repo/types/author";

class AuthorService {
    static async getAuthorById(ID: number): Promise<Author | null> {
        const author = await Prisma.author.findUnique({
            where: { ID }
        });

        return author;
    }
}

export default AuthorService;
