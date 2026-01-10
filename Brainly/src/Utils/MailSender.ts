import nodemailer from "nodemailer";

interface emailProps {
    email: string;
    title: string;
    body: string;
}

const MAIL_USER=process.env.MAIL_USER;
const MAIL_PASS=process.env.MAIL_PASS;
export const mailSender = async ({ email, title, body }: emailProps) => {
    try {
        console.log("ENTERED IN MAILSENDER API");
        const transportor = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            service: "gmail",
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASS
            }
        })

        let info = await transportor.sendMail({
            from: "Brainly",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        return info;
    } catch (error: any) {
        console.log("Error occured while sending mail to user", error.message);
        throw error;
    }
}