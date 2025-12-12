import {Queue,Worker} from "bullmq";
import redis from "../Config/redis";
import { mailSender } from "../Utils/MailSender";
import {OtpTemp} from "../mail/templates/OTPTemplate";

export const emailQueue=new Queue("email-queue",{
    connection:redis,
    defaultJobOptions:{
        attempts:3,
        backoff:{type:"exponential",delay:5000},
        removeOnComplete:true,
        removeOnFail:false,
    }
});

new Worker(
    "email-queue",
    async(job)=>{
        const {email,otp}=job.data;
        const html=OtpTemp(otp);
        await mailSender(email,"Your Brainly OTP Code",html);
        console.log(`OTP email sent to ${email}`);
    },
    {
        connection:redis,
        concurrency:10
    }
);

process.on("SIGINT",async()=>{
    await emailQueue.close();
    process.exit();
})

