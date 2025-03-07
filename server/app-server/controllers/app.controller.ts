import { NextFunction, Response } from "express";
import { apiResponse, asyncHandler } from "../utils/request.util";
import { AppError } from "../utils/error.util";
import NewsletterService from "../services/newsletter.service";
import { AuthorRequest } from "../../../models/author";
import validator from "validator";
import QueueService from "../services/queue.service";
import rabbitMQConfig from "../configs/queue.config.json";
import mailConfig from "../configs/mail.config.json";

export const createNewsletter = asyncHandler(async (req: AuthorRequest, res: Response, next: NextFunction) => {
    const { name } = req.body;

    if (!name) {
        return next(new AppError(400, "Please provide title"));
    }

    const newsletter = await NewsletterService.createNewsletter({
        name,
        authorId: req.author.id
    });
    
    if(!newsletter) {
        return next(new AppError(400, "Failed to create newsletter"));
    }

    const redisClient = req.app.get("redisClient");
    const cacheKey = `newsletter:${newsletter.id}`;
    redisClient.del(cacheKey);
    apiResponse(res, 201, "Newsletter created successfully", newsletter);
});

export const fetchAllNewsletters = asyncHandler(async (req: AuthorRequest, res: Response, next: NextFunction) => {
    const redisClient = req.app.get("redisClient");
    const cacheKey = `newsletters`;

    const cachedNewsletters = await redisClient.get(cacheKey);
    if(cachedNewsletters) {
        return apiResponse(res, 200, "Newsletters fetched successfully", JSON.parse(cachedNewsletters));
    }

    const newsletters = await NewsletterService.fetchAllNewsletters();

    redisClient.set(cacheKey, JSON.stringify(newsletters));
    redisClient.expire(cacheKey, 60 * 60 * 24);

    apiResponse(res, 200, "Newsletters fetched successfully", newsletters);
})

export const fetchUniqueNewsletter = asyncHandler(async (req: AuthorRequest, res: Response, next: NextFunction) => {
    const { newsletterId } = req.params;

    const redisClient = req.app.get("redisClient");
    const cacheKey = `newsletter:${newsletterId}`;

    const cachedNewsletter = await redisClient.get(cacheKey);

    if(cachedNewsletter) {
        return apiResponse(res, 200, "Newsletter fetched successfully", JSON.parse(cachedNewsletter));
    }

    const newsletter = await NewsletterService.fetchUniqueNewsletter(parseInt(newsletterId));

    redisClient.set(cacheKey, JSON.stringify(newsletter));
    redisClient.expire(cacheKey, 60 * 60 * 24);

    apiResponse(res, 200, "Newsletter fetched successfully", newsletter);
})


export const subscribeNewsletter = asyncHandler(async (req: AuthorRequest, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const { newsletterId } = req.params;

    if(!email) {
        return next(new AppError(400, "Please provide email"));
    }

    if(!validator.isEmail(email)) {
        return next(new AppError(400, "Please provide a valid email"));
    }

    const subscriber = await NewsletterService.subscribeNewsletter({
        email,
        newsletterId: parseInt(newsletterId)
    })

    if(!subscriber) {
        return next(new AppError(400, "Failed to subscribe to newsletter"));
    }

    apiResponse(res, 201, "Newsletter subscribed successfully", subscriber);
})

export const unsubscribeNewsletter = asyncHandler(async (req: AuthorRequest, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const { newsletterId } = req.params;
    
    if(!email) {
        return next(new AppError(400, "Please provide email"));
    }

    if(!validator.isEmail(email)) {
        return next(new AppError(400, "Please provide a valid email"));
    }

    const subscriber = await NewsletterService.unsubscribeNewsletter({
        email,
        newsletterId: parseInt(newsletterId)
    })
    
    if(!subscriber) {
        return next(new AppError(400, "Failed to unsubscribe from newsletter"));
    }

    apiResponse(res, 200, "Newsletter unsubscribed successfully", subscriber);
})

export const createArticle = asyncHandler(async (req: AuthorRequest, res: Response, next: NextFunction) => {
    const { title, content } = req.body;
    const { newsletterId } = req.params;

    if(!title || !content) {
        return next(new AppError(400, "Please provide title and content"));
    }

    const article = await NewsletterService.createArticle({
        title,
        content,
        newsletterId: parseInt(newsletterId),
        authorId: req.author.id
    })
    
    if(!article) {
        return next(new AppError(400, "Failed to create article"));
    }

    await QueueService.sendMessageToQueue(
        req.app.get("articleChannel"),
        rabbitMQConfig.EMAIL_MQ_NAME,
        {
            type: mailConfig.types.WELCOME.name,
            data: {
                articleId: article.id,
                newsletterId: article.newsLetterId,
            }
        }
    )
    
    const redisClient = req.app.get("redisClient");
    const cacheKey = `articles:${newsletterId}`;

    redisClient.del(cacheKey);

    apiResponse(res, 201, "Article created successfully", article);
})

export const fetchAllArticlesUnderNewsletter = asyncHandler(async (req: AuthorRequest, res: Response, next: NextFunction) => {
    const { newsletterId } = req.params;

    const redisClient = req.app.get("redisClient");
    const cacheKey = `articles:${newsletterId}`;

    const cachedArticles = await redisClient.get(cacheKey);

    if(cachedArticles) {
        return apiResponse(res, 200, "Articles fetched successfully", JSON.parse(cachedArticles));
    }

    const articles = await NewsletterService.fetchAllArticlesUnderNewsletter(parseInt(newsletterId));

    redisClient.set(cacheKey, JSON.stringify(articles));
    redisClient.expire(cacheKey, 60 * 60 * 2);

    apiResponse(res, 200, "Articles fetched successfully", articles);
})

export const fetchUniqueArticleFromNewsletter = asyncHandler(async (req: AuthorRequest, res: Response, next: NextFunction) => {
    const { articleId, newsletterId } = req.params;

    const redisClient = req.app.get("redisClient");
    const cacheKey = `article:${articleId}:${newsletterId}`;

    const cachedArticle = await redisClient.get(cacheKey);

    if(cachedArticle) {
        return apiResponse(res, 200, "Article fetched successfully", JSON.parse(cachedArticle));
    }

    const article = await NewsletterService.fetchUniqueArticleFromNewsletter(parseInt(newsletterId), parseInt(articleId));

    redisClient.set(cacheKey, JSON.stringify(article));
    redisClient.expire(cacheKey, 60 * 60 * 2);

    apiResponse(res, 200, "Article fetched successfully", article);
})

