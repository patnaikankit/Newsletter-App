import nodemailer from "nodemailer"
import fs from "fs"
import handlebars from "handlebars"

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASSWORD 
    }
});

class MailService {
    static sendMail = async (to: string, subject: string, body: string) => {
        const template = fs.readFileSync(
            "src/assets/emailTemplates/base.html",
            "utf-8"
        )

        const compileTemplate = handlebars.compile(template);
        const content = compileTemplate({ body })

        const info = await transporter.sendMail({
            from: '"Newsletter Platform " <ankit.123patnaik123@gmail.com>',
            to: to,
            subject: subject,
            html: content,
          });
      
        console.log("Message sent to %s: %s", to, info.messageId);
    };
}

export default MailService;