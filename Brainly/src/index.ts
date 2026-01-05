import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import "./queue/emailQueue";
import { connectRedis } from "./config/redis";

//Routers
import userRoutes from "./routes/userRoutes";
import linkRoutes from "./routes/linkRoutes";
import workspaceRoutes from "./routes/workspaceRoutes";

dotenv.config();
connectDB();

const app=express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ],
  })
);


// allow prefligh


app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true}));

app.use("/health",(req,res)=>{
  res.send("HEALTHY");
})

//Routes
console.log("USER ROUTES LOADDED");
app.use("/api/v1/users",userRoutes);
app.use("/api/links",linkRoutes);
app.use("/api/workspaces",workspaceRoutes);


const PORT=process.env.PORT || 3000
const server=app.listen(PORT,async()=>{
    await connectRedis();
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