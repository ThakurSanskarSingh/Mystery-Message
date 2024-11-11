import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request){
    // if(request.method !== 'POST'){
    //     return Response.json({
    //         success : false,
    //         message : "Only Post method allowed"
    //     },{
    //         status : 405
    //     })
    // }
    await dbConnect()
    try {
       const{username , email, password} = await request.json()
       const existingUserVerifiedByUsername = await UserModel.findOne({
        username,
        isVerified : true,

       })
       if(existingUserVerifiedByUsername){
        return Response.json({
            success : false,
            message : "Username is already taken",
        },{status : 400})
       }
       const existingUserByEmail = await UserModel.findOne({
        email
       })
       const verifyCode = Math.floor(100000 + Math.random()*900000).toString()

       if(existingUserByEmail){
        if(existingUserByEmail.isVerified){
            return Response.json({
                success : false,
                message : "User already exist with this email",
            },{status : 400})
        } else {
            const hashedPassword = await bcrypt.hash(password,10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifycode = verifyCode;
            existingUserByEmail.veifyCodeExpiry  = new Date(Date.now() + 3600000)
        }
        await existingUserByEmail.save()
    } else{
        const hashedPassword = await bcrypt.hash(password,10);
        const expirydate = new Date()
        expirydate.setHours(expirydate.getHours() + 1)

     const newUser =    new UserModel({
            username,
   email ,
   password : hashedPassword,
   verifycode : verifyCode,
   veifyCodeExpiry : expirydate,
  isVerified : false,
   isAcceptingMessage : true,
   message : []
        })
        await newUser.save()

       }
       //send verificaion email
     const emailResponse =   await sendVerificationEmail(
        email,
        username,
        verifyCode
       )
       if(!emailResponse.success){
        return Response.json({
            success : false,
            message : emailResponse.message,
        },{status : 400})
       }
       return Response.json({
        success : true,
        message : "User registred successfully",
    },{status : 201})

    } catch (error) { 
        console.error("Error while registring user")
        return Response.json(
            {
                success : false,
                message : "Error registering user"
            },{
                status : 500
            }
        )
        
    }
}