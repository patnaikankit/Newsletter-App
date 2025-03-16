import { Newsletter } from "@repo/types/newsletter";
import { Subscriber } from "@repo/types/subscriber";
import { Article } from "@repo/types/article";
import Prisma from "../configs/db.config";
import { AppError } from "../utils/error.util";

class NewsletterService {
    static createNewsletter = async (data: {
        name: string;
        authorId: number;
    }): Promise<Newsletter> => {
        const author = await Prisma.author.findUnique({
            where: {
                ID: data.authorId
            }
        });
        
        if (!author) {
            throw new AppError(404, "Author not found");
        }
        
        const newsletter = await Prisma.newsLetter.create({
            data: {
                name: data.name,
                authorID: data.authorId
            }
        });
        
        return newsletter;
    }

    static fetchAllNewsletters = async (): Promise<Newsletter[]> => {
        const newsletters = await Prisma.newsLetter.findMany();
        return newsletters;
    }

    static fetchUniqueNewsletter = async (ID: number): Promise<Newsletter> => {
        const newsletter = await Prisma.newsLetter.findUnique({
            where: {
                ID
            }
        });

        if (!newsletter) {
            throw new AppError(404, "Newsletter not found");
        }

        return newsletter;
    }

    static subscribeNewsletter = async (data: {
        email: string;
        newsLetterID: number;
      }): Promise<Subscriber> => {
        const newsletter = await Prisma.newsLetter.findUnique({
            where: {
                ID: data.newsLetterID
            }
        });
        if(!newsletter) {
            throw new AppError(404, "Newsletter not found");
        }

        const subscriberExists = await Prisma.subscriber.findFirst({
            where: {
                email: data.email,
                newsLetterID: data.newsLetterID
            }
        });

        if(subscriberExists) {
            throw new AppError(400, "You are already subscribed to this newsletter");
        }
        
        const newSubscriber = await Prisma.subscriber.create({
            data: {
                email: data.email,
                newsLetterID: data.newsLetterID
            }
        });
        
        return newSubscriber;
    }

    static unsubscribeNewsletter = async (data: {
        email: string;
        newsLetterID: number;
    }): Promise<Subscriber> => {
        const newsletter = await Prisma.newsLetter.findUnique({
            where: {
                ID: data.newsLetterID
            }
        });
        
        if(!newsletter) {
            throw new AppError(404, "Newsletter not found");
        }

        const subscriber = await Prisma.subscriber.findFirst({
            where: {
                email: data.email,
                newsLetterID: data.newsLetterID
            }
        });

        if(!subscriber) {
            throw new AppError(404, "You are not subscribed to this newsletter");
        }

        const unsubscribedSubscriber = await Prisma.subscriber.delete({
            where: {
                newsLetterID_email: {
                    email: data.email,
                    newsLetterID: data.newsLetterID,
                  },
            }
        });
        
        return unsubscribedSubscriber;
    }

    static createArticle = async (data: {
        title: string;
        content: string;
        newsLetterID: number;
        authorId: number;
    }): Promise<Article> => {
        const newsletter = await Prisma.newsLetter.findUnique({
            where: {
                ID: data.newsLetterID
            }
        });
        
        if(!newsletter) {
            throw new AppError(404, "Newsletter not found");
        }

        const author = await Prisma.author.findUnique({
            where: {
                ID: data.authorId
            }
        }); 

        if(!author) {
            throw new AppError(404, "Author not found");
        }

        if(author.ID !== newsletter.authorID) {
            throw new AppError(403, "You are not authorized to create an article for this newsletter");
        }

        const article = await Prisma.article.create({
            data: {
                title: data.title,
                body: data.content,
                newsLetterID: data.newsLetterID,
                authorID: data.authorId
            }
        });

        if(!article) {
            throw new AppError(500, "Failed to create article");
        }

        return article;
    }

    static fetchAllArticlesUnderNewsletter = async (newsLetterId: number): Promise<Article[]> => {
        const newsletter = await Prisma.newsLetter.findUnique({
            where: {
                ID: newsLetterId
            }
        });

        if(!newsletter) {
            throw new AppError(404, "Newsletter not found");
        }

        const articles = await Prisma.article.findMany();
        return articles;
    }
    
    static fetchUniqueArticleFromNewsletter = async (newsLetterId: number, articleId: number): Promise<Article> => {
        const newsletter = await Prisma.newsLetter.findUnique({
            where: {
                ID: newsLetterId
            }
        });

        if(!newsletter) {
            throw new AppError(404, "Newsletter not found");
        }
        
        const article = await Prisma.article.findUnique({
            where: {
                ID: articleId
            }
        });
        
        if(!article) {
            throw new AppError(404, "Article not found");
        }

        if(article.newsLetterID !== newsLetterId) {
            throw new AppError(403, "You are not authorized to access this article");
        }

        return article;
    }


}

export default NewsletterService;

