import { Request, Response } from "express";
import User from "../models/userModel"
import { AuthRequest } from "../middlewares/authMiddleware";
import { GenerateToken } from "../utils/generateToken";
import OTPMODAL from "../models/OTP-MODAL";
import otpGenerator from "otp-generator";
import { emailQueue } from "../queue/emailQueue";
import { oAuth2Client } from "../config/OAuth2Client";
import axios from "axios";

export const sendOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Valid Email Required"
            })
        }

        //checking existance
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "User Already Registered"
            });
        }

        //sending otp here
        let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

        await OTPMODAL.deleteMany({ email });
        await OTPMODAL.create({ email, otp, });

        await emailQueue.add("send-otp-email", { email, otp })

        res.status(200).json({
            success: true,
            message: "OTP Sent Successfully",
        });
    } catch (error: any) {
        console.log("Error Occured WHile Sending OTP", error.message);
        res.status(500).json({
            success: false,
            message: error.message || error
        });
    }
}

//google sign in
export const googleSignin= async (req:Request, res:Response) => {
  try {
    const code = req.query.code;

    if(!req.query.code){
        return res.status(400).json({message:"Authorization Code Missing"});
    }

    const googleResponse = await oAuth2Client.getToken(code as string);
    oAuth2Client.setCredentials(googleResponse.tokens);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`
    );

    let user = await User.findOne({ email: userRes.data.email });
    if (!user) {
      user = await User.create({
        username: userRes.data.name,
        email: userRes.data.email,
        method: "oauth",
      });
    }
    const accessToken = GenerateToken(user._id.toString());
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV==="production",
      sameSite: <"none">"none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };
    res
      .status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .json({ message: "signin successfull", user });
    return;
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || "Something went wrong from ourside" });
  }
};


//REGISTER USER
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, otp } = req.body;
        
        console.log(req.body);
        if (!name || !email || !password || !otp)
            return res.status(400).json({ success: false, message: "All Fields are required" });

        const exists=await User.findOne({email});
        if(exists){
            return res.status(409).json({message:"User Already Exists"});
        }
        //test here
        const recentOTP = await OTPMODAL.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (!recentOTP.length || recentOTP[0].otp.length==0) {
            return res.status(400).json({ success: false, message: "Invalid or Expired OTP" });
        }

        const user = await User.create({ name, email: email.toLowerCase(), password });        //@ts-ignore
        const token = GenerateToken(user._id.toString());
        await OTPMODAL.deleteMany({ email });

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            data: { user: { name: user.name, email: user.email, token } }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error Registering User", err })
    }
}


//LOGIN USER
export const loginUser = async (req: Request, res: Response) => {
    try {
        //get Details from body
        const { email, password } = req.body;

        //Validate
        if (!email || !password)
            return res.status(400).json({ success: false, message: "All Fields are required" });

        //Verify
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Please Enter Valid Credentials"
            })
        }

        //@ts-ignore
        const token = GenerateToken(user._id.toString());

        res.cookie("accessToken",token,{
            httpOnly:true,
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })
        //success/failure response
        return res.json({
            success: true,
            message: "Login Successful",
            data: { user: { name: user.name, email: user.email } }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Error Logging in",
            err
        });
    }
}


//Get Current User Profile
export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        return res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({
            message: "Error Fetching Profile", err
        })
    }
}