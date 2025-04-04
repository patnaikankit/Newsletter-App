import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import QueueService from "./services/queue.service"
import queueConfig from "./configs/queue.config.json"

import articleWorker from "./workers/article.worker"
import mailWorker from "./workers/mail.worker"
import cookieParser from "cookie-parser"
import { sleep } from "./utils/request.util"

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

(async () => {
    while (true) {
        try {
            if (!app.get("mqConnection")) {
                const mqConnection = await QueueService.fetchRabbitMQConnection();
                app.set("mqConnection", mqConnection);

                const articleChannel = await QueueService.createQChannel(mqConnection);
                const mailChannel = await QueueService.createQChannel(mqConnection);

                if (!articleChannel || !mailChannel) {
                    throw new Error("Channel creation failed");
                }

                app.set("articleChannel", articleChannel);
                app.set("emailChannel", mailChannel);

                articleWorker(articleChannel, queueConfig.ARTICLE_MQ_NAME, 1);
                mailWorker(mailChannel, queueConfig.EMAIL_MQ_NAME, 1);

                break;  
            }
        } catch (err: any) {
            console.error("RabbitMQ Connection Error:", err.message);
            await sleep(queueConfig.SERVER_OPTIONS.reInitConnDelay);
            console.log("Retrying to connect to RabbitMQ...");
        }
    }
})();



app.get("/", (req, res) => {
    res.send("Server is working!")
})

process.on("uncaughtException", (err: any) => {
    console.log("Uncaught Exception, shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
  });

  const server = app.listen(process.env.PORT || 5001, () => {
    console.log("Server is running on port 5001");
  });
  
  process.on("unhandledRejection", (err: any) => {
    console.log("Unhandled Rejection, shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });