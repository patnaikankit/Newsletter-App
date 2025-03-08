import prisma from "../configs/db.config";
import { Author } from "../../../models/author.model";

class AuthorService {
    static async getAuthorById(id: string): Promise<Author | null> {
        const author = await prisma.author.findUnique({
            where: { id }
        });

        return author;
    }
}

export default AuthorService;
