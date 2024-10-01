import { NextAuthOptions } from "next-auth";
// import Credentials, { CredentialsProvider } from "next-auth/providers/credentials";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { any } from "zod";

export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          id: "credentials",
          name: "Credentials",
          // `credentials` is used to generate a form on the sign in page.
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            email: { label: "Email", type: "text"},
            password: { label: "Password", type: "password"}
          },
          async authorize(credentials: any) :Promise<any> {
            await dbConnect();
            try {
             const user =    await UserModel.findOne({
                    $or: [{email : credentials.identifier},
                    {password: credentials.identifier}
                ]
                })
                if(!user){
                    throw new Error("No user fouund with this email")
                }
                if(user.isVerified){
                    throw new Error("Please verify your account first")
                }
              const isPasswordCorrect =  await bcrypt.compare(credentials.password,user.password)
              if(isPasswordCorrect){
                return user
              } else {
                throw new Error("Incorrect password")
              }
                
                
            } catch (error:any) {
                throw new Error(error)
            }
            // Add logic here to look up the user from the credentials supplied
            const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
      
            if (user) {
              // Any object returned will be saved in `user` property of the JWT
              return user
            } else {
              // If you return null then an error will be displayed advising the user to check their details.
              return null
      
              // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
            }
          }
        })
      ],
      callbacks:{
        async jwt({token,user}){
          if(user){
            token._id = user._id?.toString();
            token.isVerified = user.isVerified;
            token.isAcceptingMessages =  user.isAcceptingMessage
            token.username = user.username
          }
          return token
        },
        async session({session,token}){
          if(token){
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessage = token.isAcceptingMessage
            session.user.username = token.username
          }
          return session
        }

      },
      pages : {
        signIn : '/sign-in'
      },
      session : {
        strategy : 'jwt'
      },
      secret : process.env.NEXTAUTH_SECRET
}

