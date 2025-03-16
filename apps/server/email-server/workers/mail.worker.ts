import amqplib from "amqplib"
import MailService from "../services/mail.service"
import mailConfig from "../configs/mail.config.json"

const mailWorker = async (
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

                const mail = JSON.parse(message.content.toString())

                console.log(`Mail Worker: `, worker);
                console.log(`Worker ${worker}: ${mail.type} and ${mail.data.email}`);
                
                let { subject, content } = mailConfig.types[mail.type as keyof typeof mailConfig.types]

                switch(mail.type){
                    case mailConfig.types.ARTICLE.name:
                        subject = subject.replace("{{author}}", mail.data.author)
                        content = content.replace("{{author}}", mail.data.author);
                        content = content.replace(
                            "{{url}}",
                            `${process.env.CLIENT_URL}/newsletter//${mail.data.newsletterId}/article/${mail.data.articleId}`
                        )
                        break;

                    case mailConfig.types.WELCOME.name:
                        subject = subject.replace("{{name}}", mail.data.name)
                        content = content.replace("{{name}}", mail.data.name)
                        break;
                    default:
                        break
                }

                await MailService.sendMail(mail.data.mail, subject, content);

                channel.ack(message);
            },
            {
                noAck: false
            }
        )
    }
}

export default mailWorker;