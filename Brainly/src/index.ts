import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./Config/db";


import "./queue/emailQueue";


//Routers
import userRoutes from "./Routes/userRoutes";
import linkRoutes from "./Routes/linkRoutes";
import workspaceRoutes from "./Routes/workspaceRoutes";

dotenv.config();

connectDB();

const app=express();

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true}));
app.use(cors())
// app.use(cors({
//     origin:process.env.CLIENT_URL || "http://localhost:3000",
//     credentials:true
// }));

//Routes
app.use("/api/v1/users",userRoutes);
app.use("/api/links",linkRoutes);
app.use("/api/workspaces",workspaceRoutes);
// app.post("/api/v1/signup",async (req,res)=>{
//     //TODO HASH PASS //Zod Validation
//     const username=req.body.username;
//     const password=req.body.password;
//     try{
//     await UserModel.create({
//         username:username,
//         password:password
//     })
    
//     res.json({
//         message:"User Signed Up"
//     })
//     }catch(e){
//         res.status(411).json({
//             message:`User Already Exists:${e}`
//         })
// }
// })

// app.post("/api/v1/signin",async(req,res)=>{
//     const {username,password}=req.body;
//     try{
//     const existingUser=await UserModel.findOne(req.body)
//     if(!existingUser){
//         return res.status(404).json({
//             message:"User is not found please try to enter valid credentials"
//         })
//     }
//     const token=jwt.sign({
//         id:existingUser._id,
//     },JWT_SECRET)
//     return res.status(200).json({
//             message:"Successfully Logged In",
//             "TOKEN":token
//         })
//     }catch(e){
//         res.status(500).json({
//             message:"Error Occured While Login User"
//         })
//     }
// })

// app.post("/api/v1/content",userMiddlware,async (req,res)=>{
//     const {link,type}=req.body;
//     ContentModel.create({
//         link,
//         type,
//         //@ts-ignore
//         userId:req.userId,
//         tags:[]
//     }
//     )

//     return res.json({
//         message:"Content Added"
//     })
// })

// app.get("/api/v1/brain/content",userMiddlware,async(req,res)=>{
//     //@ts-ignore
//     const userId=req.userId;
//     const content=await ContentModel.find({userId:userId}).populate("userId", "username")
//     res.json({
//         message:"Content Fetched Successfully",
//         "CONTENT":content
//     })
// })

// app.delete("/api/v1/content",userMiddlware,async(req,res)=>{
//     //@ts-ignore
//     const contentId=req.body.contentId;
//     console.log("CONTENT ID ",contentId);
//     //@ts-ignore
//     console.log("user ID ",req.userId);
//     try{

//     const deletedContent=await ContentModel.findOneAndDelete({
//         _id:contentId,
//         //@ts-ignore
//         userId:req.userId
//     })  
//     console.log("DELETED CONTENT:",deletedContent);
//     res.status(200).json({
//         message:"Content Deleted Successfully"
//     })
// }catch(error){
//     return res.status(500).json({
//         message:"FAILED TO DELETE THE CONTENT",
//         error
//     })
// }
    

// })

// app.post("/api/v1/brain/share",(req,res)=>{
    
// })

// app.post("/api/v1/brain/:shareLink",(req,res)=>{
    
// })

// app.get("/",(req,res)=>{
//     res.send("GET REQUESTED");
// })

app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:`Route ${req.originUrl} not found`,
    });
});


const PORT=process.env.PORT || 5000
const server=app.listen(PORT,()=>{
    console.log(`🚀 Server running on PORT ${PORT}`)
});

process.on("SIGTERM",gracefulShutdown);
process.on("SIGINT",gracefulShutdown);

async function gracefulShutdown(){
    console.log("\nShutting Down Gracefully");

    server.close(()=>{
        console.log("Closed all HTTP connections");
    })

    setTimeout(()=>{
        console.log("Forcing Exit...");
        process.exit(1);
    },10_000);
}