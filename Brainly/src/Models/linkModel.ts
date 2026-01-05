import mongoose, { Schema } from "mongoose";

export interface ILink extends Document{
    user:mongoose.Schema.Types.ObjectId;
    title:string;
    url:string;
    category:"YOUTUBE" | "TWEET" | "DOC" | "ARTICLE" | "GENERAL" | "CANVA";//YT,TWEET,DOC
    thumbnail:string;
    tags?:string[];
    workspace?:mongoose.Schema.Types.ObjectId | null;
    createdAt?:Date;
    updatedAt?:Date;
}

const linkSchema=new Schema<ILink>({
    user:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true},
    title:{type:String,required:true,trim:true},
    url:{type:String,required:true,unique:true},
    thumbnail:{
        type:String,
        default:"https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=500"
    },
    category:{
        type:String,
        default:"GENERAL",
        enum:["YOUTUBE","TWEET","DOC","ARTICLE","GENERAL","CANVA"]
    },
    tags:{type:[String],default:[]},
    workspace:{type:Schema.Types.ObjectId,ref:"Workspace",index:true},
},{timestamps:true}
)

linkSchema.index({user:1,createdAt:-1});
linkSchema.index({workspace:1});
linkSchema.index({tags:1});
linkSchema.index({url:1});

export default mongoose.model<ILink>("Link",linkSchema);