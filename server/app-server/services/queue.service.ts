import amqplib from "amqplib";
import queueConfig from "../configs/queue.config.json";
import { log } from "console";
import { sleep } from "../utils/timeout.util"

class QueueService {
    static fetchRabbitMQConnection = async(): Promise<amqplib.Connection> {
        let retry: number = 0;
        while(retry < queueConfig.SERVER_OPTIONS.connRetries) {
            try{
                const conn = await amqplib.connect(process.env.RABBITMQ_URL!);
                log("Connected to RabbitMQ");
                return conn;
            }
            catch(error) {
                log(`Failed to connect to RabbitMQ: ${error}`);
                retry++;

                await sleep(queueConfig.SERVER_OPTIONS.connRetriesDelay);
            }
        }
        throw new Error("Failed to connect to RabbitMQ");
    }

    static createQChannel = async (conn: amqplib.Connection): Promise<amqplib.Channel> => {
        try{
            const channel = await conn.createChannel();
            return channel;
        }
        catch(error) {
            throw new Error(`Failed to create channel: ${error}`);
        }
    }

    static sendMessageToQueue = async (channel: amqplib.Channel, queueName: string, message: any) => {
        try{
            channel.assertQueue(queueName, {
                durable: true,
            });

            const msg = Buffer.from(message);

            channel.sendToQueue(queueName, msg, {
                persistent: true,
            });
        }
        catch(error){
            throw new Error(`Failed to send message to queue: ${error}`);
        }
    }
};

export default QueueService;