import express from "express";
import { registerUser,loginUser,getProfile, sendOTP } from "../Controllers/userController";
import { protect } from "../Middlewares/authMiddleware";
//import passport from "passport";
import { ensureAuthenticated } from "../Middlewares/ensureAuthenticated";

const router=express.Router();

router.post("/sendotp",sendOTP);
router.post("/register",registerUser);  
// router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));

// router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/'}),(req,res)=>{
//     res.redirect('/');
// });

router.get('/profile',(req,res)=>{
    res.send("This is your profile page");
})
router.post("/login",loginUser);
router.get("/profile",protect,getProfile)

export default router;