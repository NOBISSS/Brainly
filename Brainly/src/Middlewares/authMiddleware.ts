import {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";
import User from "../Models/userModel";
import { env } from "process";

export interface AuthRequest extends Request{
    user?:{
        _id:string;
        name:string;
        email:string;
    };
}

const JWT_SECRET=env.JWT_SECRET || "BRAINLY";
if(!JWT_SECRET){
    console.error("FATAL ERROR:JWT_SECRET is not defined in .env");
    process.exit(1);
}

import redis from "../Config/redis";

export const protect=async(
    req:AuthRequest,
    res:Response,
    next:NextFunction
)=>{
    let token:string | undefined;

    //1.Checking for token in headers
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        console.log("CONIDTION TRUEE");
        console.log(req.headers.authorization.split(" ")[1]);
        token=req.headers.authorization.split(" ")[1];
    }

    //2.IT IS OPTIONAL BUT CHECKING
    else if(req.cookies?.token){
        console.log("COKKIE TRUEE");
        token=req.cookies.token;
    }
    console.log("TOKEN FOUND:",token);
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Not Authorized,no token",
        });
    }

    try{
        const isBlacklisted=await redis.get(`blacklist:${token}`);
        if(isBlacklisted){
            return res.status(401).json({
                success:false,
                message:"Token Expired or invalid",
            });
        }
        
        const decoded=jwt.verify(token,JWT_SECRET) as {id:string};

        const user=await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User no longer exists"
            })
        }

        req.user=user;
        next();
    }catch(error){
        console.error("Auth Middlware Error:",error);
        return res.status(401).json({
            success:false,
            message:"Not Authorized,token failed",
        });
    }
};

export const logout=async(req:AuthRequest,res:Response)=>{
    const token=req.headers.authorization?.split(" ")[1];

    if(token){
        await redis.set(`blacklist:${token}`,"true","EX",7*24*60*60);
    }

    res.status(200).json({success:true,message:"Logged Out Successfully"});
}