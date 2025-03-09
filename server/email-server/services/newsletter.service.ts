import prisma from "../configs/db.config";
import { Author } from "../../../models/author.model"
import { Subscriber } from "../../../models/subscriber.model"

class NewsletterService {
    static fetchNewsletterAuthor = async (newsletterId: number): Promise<Author> => {
        const newsletter = await prisma.newsletter.findUnique({
            where: {
                id: newsletterId
            }
        })

        if(!newsletter){
            throw new Error("Newsletter not Found!")
        }

        const author = await prisma.author.findUnique({
            where: {
                id: newsletter.authorId
            }
        })

        if(!author){
            throw new Error("Author not Found")
        }

        return author;
    }

    static fetchNewsletterSubscribers = async (newsletterId: number): Promise<Subscriber[]> => {
        const subscribers = await prisma.subscriber.findMany({
            where: {
                newsletterId
            }
        })

        return subscribers;
    }
}

export default NewsletterService;