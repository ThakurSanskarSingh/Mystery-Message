import mongoose ,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content : string;
    createdAt : Date;

}
const MessageSchema : Schema<Message> = new Schema({
    content : {
        type : String,
        required : true

    },
    createdAt: {
        type: Date,
        required : true,
        default : Date.now
    }
},{timestamps: true})

export interface User extends Document{
    username : string,
   email : string,
   password : string,
   verifycode : string,
   veifyCodeExpiry : Date,
  isVerified : boolean,
   isAcceptingMessage : boolean,
   message : Message[]

}

const UserSchema : Schema<User> = new Schema({
   username: {
    type : String,
    required : [true,"Username is required"],
    trim : true,
    unique : true
   },
   email: {
    type : String,
    required : [true,"email is required"],
    match : [/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,'please provied a valid email'],
        unique : true
   },
   password:{
    type : String,
    required : [true,"verify code is required"]
    
   },
   verifycode:{
    type : String,
    required : true,

   },
   veifyCodeExpiry:{
    type : Date,
    required : true,

   },
   isVerified : {
    type : Boolean,
    default : false
   },
   isAcceptingMessage: {
    type :Boolean,
    default : true,
   },
   message:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)
export default UserModel