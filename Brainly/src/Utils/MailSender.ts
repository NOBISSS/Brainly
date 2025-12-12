import nodemailer from "nodemailer";

interface emailProps{
    email:string;
    title:string;
    body:string;
}

export const mailSender=async(email,title,body)=>{
    try{
        console.log("ENTERED IN MAILSENDER API");
        const transportor=nodemailer.createTransport({
            host:"parthchauhan220@gmail.com",
            service:"gmail",
            auth:{
                user:"parthchauhan220@gmail.com",
                pass:"tbcr mvuz njma vfiw"
            }
        })

        let info=await transportor.sendMail({
            from:"Brainly",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })

        return info;
    }catch(error:any){
        console.log("Error occured while sending mail to user",error.message);
    }
}