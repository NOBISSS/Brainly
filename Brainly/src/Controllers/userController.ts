import { Request, Response } from "express";
import User from "../Models/userModel"
import { AuthRequest } from "../Middlewares/authMiddleware";
import { GenerateToken } from "../Utils/generateToken";
import OTPMODAL from "../Models/OTP-MODAL";
import userModel from "../Models/userModel";
import otpGenerator from "otp-generator";
import { emailQueue } from "../queue/emailQueue";

const JWT_SECRET = process.env.JWT_SECRET;

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
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "User Already Registered"
            });
        }

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

//REGISTER USER
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, otp } = req.body;
        console.log(req.body);
        if (!name || !email || !password || !otp)
            return res.status(400).json({ success: false, message: "All Fields are required" });

        const recentOTP = await OTPMODAL.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (!recentOTP.length || recentOTP[0].otp !== 0) {
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

        res.cookie("token",token,{
            httpOnly:true,
            secure:"production",
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })
        //success/failure response
        return res.json({
            success: true,
            message: "Login Successful",
            data: { user: { name: user.name, email: user.email }, token }
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