import amqplib from "amqplib"
import QueueService from "../services/queue.service"
import queueConfig from "../configs/queue.config.json"
import mailConfig from "../configs/mail.config.json"
import NewsletterService from "../services/newsletter.service"

const articleWorker = async(
    channel: amqplib.Channel,
    queueName: string,
    numOfWorkers = 1
) => {
    for (let worker = 1;  worker <= numOfWorkers; worker++){
        channel.assertQueue(queueName, {durable: true})

        channel.consume(
            queueName, 
            async (message) => {
                if(!message){
                    return ;
                }

                const article = JSON.parse(message.content.toString())

                const subscribers = await NewsletterService.fetchNewsletterSubscribers(article.newsletterId)

                const author = await NewsletterService.fetchNewsletterAuthor(article.newsletterId)

                subscribers.forEach(async (subscriber) => {
                    await QueueService.sendMQMessage(
                        channel,
                        queueConfig.EMAIL_MQ_NAME,
                        {
                            type: mailConfig.types.ARTICLE,
                            data: {
                                ...article,
                                email: subscriber.email,
                                author: author.name
                            }
                        }
                    )
                })

                console.log(`New Article Published: ${article.articleId}`);

                channel.ack(message);
            },
            {
                noAck: false
            }
        )
    }
}

export default articleWorker;