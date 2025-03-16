import ampqlib from "amqplib"
import queueConfig from "../configs/queue.config.json"
import { sleep } from "../utils/request.util";

class QueueService {
    static fetchRabbitMQConnection = async (): Promise<ampqlib.Connection> => {
        let retry: number = 0;
        while (retry < queueConfig.SERVER_OPTIONS.connRetries){
            try {
                const conn = await ampqlib.connect(process.env.RABBIT_MQ!)
                console.log(`Connected to RabbitMQ...`);

                conn.on("close", () => {
                  console.error("RabbitMQ connection closed. Exiting...");
                  process.exit(1);
                });

                return conn;
            }
            catch(err: any){
                console.log(`Could not connect to RabbitMQ...`);
                retry++;
                await sleep(queueConfig.SERVER_OPTIONS.connRetriesDelay);
            }
        }
        throw new Error("Unable to establish connection to RabbitMQ....")
    }

    static createQChannel = async (
        conn: ampqlib.Connection
    ): Promise<ampqlib.Channel> => {
        try {
          if (!conn){
            throw new Error("Connection is undefined, cannot create a channel");
          } 

        const channel = await conn.createChannel();

        console.log("Created a new MQ channel");

        return channel;
        } catch (err) {
        throw new Error("Unable to create a channel");
        }
    };

    static sendMQMessage = async (
        channel: ampqlib.Channel,
        queueName: string,
        message: any
      ) => {
        try {
          channel.assertQueue(queueName, {
            durable: true,
          });
    
          const msg = Buffer.from(JSON.stringify(message));
    
          channel.sendToQueue(queueName, msg, {
            persistent: true,
          });
        } catch (err) {
          console.log(err);
          throw new Error("Could not publish the message");
        }
      };
}

export default QueueService;