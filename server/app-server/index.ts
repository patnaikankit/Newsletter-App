import dotenv from "dotenv"
import express, { Request, Response } from "express";
import cors from "cors";
import rabbitMQConfig from "./configs/queue.config.json";
import QueueService from "./services/queue.service";
import { sleep } from "./utils/timeout.util";
import RedisConfig from "./configs/redis.config";

import authorRoutes from "./routes/author.route";
import newsletterRoutes from "./routes/newsletter.route";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());

(async () => {
    const redisClient = await RedisConfig.connect();
    app.set("redisClient", redisClient);
})();

(async () => {
    while(true) {
        try {
            const conn = await QueueService.fetchRabbitMQConnection();
            const channel = await QueueService.createQChannel(conn);

            app.set("articleChannel", channel);

            break;
        }
        catch(error) {
            console.log(`Failed to connect to RabbitMQ: ${error}`);
            await sleep(rabbitMQConfig.SERVER_OPTIONS.reInitConnDelay);
            console.log(`Trying to reconnect to RabbitMQ`);
        }
    }
})();

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running");
})

app.use("/api/v1/author", authorRoutes);
app.use("/api/v1/newsletter", newsletterRoutes);


process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception:", error);
    process.exit(1);
});

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
    server.close(() => {
        process.exit(1);
      });
});
