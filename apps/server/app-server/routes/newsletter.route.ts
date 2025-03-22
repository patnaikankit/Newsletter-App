import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { createNewsletter, fetchAllNewsletters, fetchUniqueNewsletter, subscribeNewsletter, unsubscribeNewsletter, createArticle, fetchAllArticlesUnderNewsletter, fetchUniqueArticleFromNewsletter } from "../controllers/app.controller";

const router = Router();

router.post("/create-newsletter", isAuthenticated, createNewsletter);
router.get("/fetch-newsletters", isAuthenticated, fetchAllNewsletters);
router.get("/fetch-newsletter/:newsletterId", isAuthenticated, fetchUniqueNewsletter);
router.post("/subscribe-newsletter/:newsletterId", isAuthenticated, subscribeNewsletter);
router.post("/unsubscribe-newsletter/:newsletterId", isAuthenticated, unsubscribeNewsletter);

router.post("/:newsletterId/create-article", isAuthenticated, createArticle);
router.get("/:newsletterId/fetch-articles", isAuthenticated, fetchAllArticlesUnderNewsletter);
router.get("/:newsletterId/fetch-article/:articleId", isAuthenticated, fetchUniqueArticleFromNewsletter);

export default router;
