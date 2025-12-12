import mongoose,{Schema,Document} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    createdAt?:Date;
    updatedAt?:Date;
    comparePassword(candidate:string):Promise<boolean>;
}

const userSchema=new Schema<IUser>({
    name:{type:String,required:true},
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        index:true
    },
    password:{type:String,required:true,minLength:6},
},{timestamps:true});


//HASH PASSWORD BEFORE SAVING
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,12);
    next();
})

//THIS METHOD IS USED FOR COMPARE PASSWORD
userSchema.methods.comparePassword=async function (candidate:string){
    return bcrypt.compare(candidate,this.password);
}

export default mongoose.model<IUser>("User",userSchema);