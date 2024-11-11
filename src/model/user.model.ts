import mongoose ,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content : string;
    createdAt : Date;
    _id : string

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
   isAcceptingMessages : boolean,
   messages : Message[]

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
   isAcceptingMessages: {
    type :Boolean,
    default : true,
   },
   messages:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)
export default UserModel