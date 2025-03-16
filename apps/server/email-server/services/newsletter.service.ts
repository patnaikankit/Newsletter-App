import prisma from "../configs/db.config";
import { Author } from "@repo/types/author"
import { Subscriber } from "@repo/types/subscriber"

class NewsletterService {
    static fetchNewsletterAuthor = async (newsletterId: number): Promise<Author> => {
        const newsletter = await prisma.newsLetter.findUnique({
            where: {
                ID: newsletterId
            }
        })

        if(!newsletter){
            throw new Error("Newsletter not Found!")
        }

        const author = await prisma.author.findUnique({
            where: {
                ID: newsletter.authorID
            }
        })

        if(!author){
            throw new Error("Author not Found")
        }

        return author;
    }

    static fetchNewsletterSubscribers = async (newsLetterID: number): Promise<Subscriber[]> => {
        const subscribers = await prisma.subscriber.findMany({
            where: {
                newsLetterID
            }
        })

        return subscribers;
    }
}

export default NewsletterService;