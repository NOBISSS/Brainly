import dotenv from "dotenv";
dotenv.config();

interface Env{
    PORT:number;
    MONGO_URI:string;
    JWT_SECRET:string;
    NODE_ENV:"devlopment" | "production"
}

const getEnv=():Env=>{
    const PORT=Number(process.env.PORT) || 5000;
    const MONGO_URI=process.env.MONGO_URI;
    const JWT_SECRET=process.env.JWT_SECRET;
    const NODE_ENV=process.env.NODE_ENV as "devlopment" | "production"


    if(!MONGO_URI || !JWT_SECRET){
        throw new Error("Missing Required Environment Variables");
    }
    return {PORT,MONGO_URI,JWT_SECRET,NODE_ENV}
};

export const env=getEnv();