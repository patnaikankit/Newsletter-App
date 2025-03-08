import { Newsletter } from "../../../models/newsletter.model";
import { Subscriber } from "../../../models/subscriber.model";
import { Article } from "../../../models/article.model";
import prisma from "../configs/db.config";
import { AppError } from "../utils/error.util";

class NewsletterService {
    static createNewsletter = async (data: {
        name: string;
        authorId: number;
    }): Promise<Newsletter> => {
        const author = await prisma.author.findUnique({
            where: {
                id: data.authorId
            }
        });
        
        if (!author) {
            throw new AppError(404, "Author not found");
        }
        
        const newsletter = await prisma.newsletter.create({
            data: {
                name: data.name,
                authorId: data.authorId
            }
        });
        
        return newsletter;
    }

    static fetchAllNewsletters = async (): Promise<Newsletter[]> => {
        const newsletters = await prisma.newsletter.findMany();
        return newsletters;
    }

    static fetchUniqueNewsletter = async (id: number): Promise<Newsletter> => {
        const newsletter = await prisma.newsletter.findUnique({
            where: {
                id
            }
        });

        if (!newsletter) {
            throw new AppError(404, "Newsletter not found");
        }

        return newsletter;
    }

    static subscribeNewsletter = async (data: {
        email: string;
        newsletterId: number;
      }): Promise<Subscriber> => {
        const newsletter = await prisma.newsletter.findUnique({
            where: {
                id: data.newsletterId
            }
        });
        if(!newsletter) {
            throw new AppError(404, "Newsletter not found");
        }

        const subscriberExists = await prisma.subscriber.findFirst({
            where: {
                email: data.email,
                newsletterId: data.newsletterId
            }
        });

        if(subscriberExists) {
            throw new AppError(400, "You are already subscribed to this newsletter");
        }
        
        const newSubscriber = await prisma.subscriber.create({
            data: {
                email: data.email,
                newsletterId: data.newsletterId
            }
        });
        
        return newSubscriber;
    }

    static unsubscribeNewsletter = async (data: {
        email: string;
        newsletterId: number;
    }): Promise<Subscriber> => {
        const newsletter = await prisma.newsletter.findUnique({
            where: {
                id: data.newsletterId
            }
        });
        
        if(!newsletter) {
            throw new AppError(404, "Newsletter not found");
        }

        const subscriber = await prisma.subscriber.findFirst({
            where: {
                email: data.email,
                newsletterId: data.newsletterId
            }
        });

        if(!subscriber) {
            throw new AppError(404, "You are not subscribed to this newsletter");
        }

        const unsubscribedSubscriber = await prisma.subscriber.delete({
            where: {
                newsLetterId_email: {
                    email: data.email,
                    newsLetterId: data.newsletterId,
                  },
            }
        });
        
        return subscriber;
    }

    static createArticle = async (data: {
        title: string;
        content: string;
        newsletterId: number;
        authorId: number;
    }): Promise<Article> => {
        const newsletter = await prisma.newsletter.findUnique({
            where: {
                id: data.newsletterId
            }
        });
        
        if(!newsletter) {
            throw new AppError(404, "Newsletter not found");
        }

        const author = await prisma.author.findUnique({
            where: {
                id: data.authorId
            }
        }); 

        if(!author) {
            throw new AppError(404, "Author not found");
        }

        if(author.id !== newsletter.authorId) {
            throw new AppError(403, "You are not authorized to create an article for this newsletter");
        }

        const article = await prisma.article.create({
            data: {
                title: data.title,
                content: data.content,
                newsletterId: data.newsletterId,
                authorId: data.authorId
            }
        });

        if(!article) {
            throw new AppError(500, "Failed to create article");
        }

        return article;
    }

    static fetchAllArticlesUnderNewsletter = async (newsLetterId: number): Promise<Article[]> => {
        const newsletter = await prisma.newsletter.findUnique({
            where: {
                id: newsLetterId
            }
        });

        if(!newsletter) {
            throw new AppError(404, "Newsletter not found");
        }

        const articles = await prisma.article.findMany();
        return articles;
    }
    
    static fetchUniqueArticleFromNewsletter = async (newsLetterId: number, articleId: number): Promise<Article> => {
        const newsletter = await prisma.newsletter.findUnique({
            where: {
                id: newsLetterId
            }
        });

        if(!newsletter) {
            throw new AppError(404, "Newsletter not found");
        }
        
        const article = await prisma.article.findUnique({
            where: {
                id: articleId
            }
        });
        
        if(!article) {
            throw new AppError(404, "Article not found");
        }

        if(article.newsletterId !== newsLetterId) {
            throw new AppError(403, "You are not authorized to access this article");
        }

        return article;
    }


}

export default NewsletterService;

