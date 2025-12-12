import mongoose, { model, Schema } from "mongoose";

export const connectDB=async()=>{
    try{
        //@ts-ignore
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    }catch(err){
        console.error("MongoDB Connection Error:",err)
        process.exit(1);
    }
}

// const UserSchema=new mongoose.Schema({
//     username:{type:String,unique:true},
//     password:String
// })

// export const UserModel=mongoose.model("UserModel",UserSchema)

// const ContentSchema=new mongoose.Schema({
//     title:String,
//     link:String,
//     tags:[
//         {
//             type:mongoose.Types.ObjectId,
//             ref:'Tag'
//         }
//     ],
//     userId:{
//         type:mongoose.Types.ObjectId,
//         ref:'UserModel',
//         required:true
//     }
// })

// export const ContentModel=model("Content",ContentSchema)