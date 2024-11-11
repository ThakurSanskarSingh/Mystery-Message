import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {z} from 'zod'
import { UsernameValidation } from "@/schemas/signUpSchema";
const UsernameQuerySchema = z.object({
    username : UsernameValidation
})
export async function GET(request : Request){
    // if(request.method !== 'GET'){
    //     return Response.json({
    //         success : false,
    //         message : "Only get method allowed"
    //     },{
    //         status : 405
    //     })
    // }
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username : searchParams.get('username')
        }
        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result) //remove it later
        if(!result.success){
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success : false,
                message : usernameError?.length > 0 ? usernameError.join(',') : 'Invalid Parameter'
            })
        }

        const {username} = result.data
      const existingVerifiedUser =  await UserModel.findOne({username , isVerified : true})
      if(existingVerifiedUser){
        return Response.json({
            success : false,
            message : "username is alreay taken"
        },{
            status : 400
        })
    }
        return Response.json({
            success : true,
            message : "username is unique"
        },{
            status : 200
        })

      
    } catch (error) {
        console.error("Error checking username",error)
        return Response.json({
            success : false,
            message : "Error checking usesrname"
        },{
            status : 500
        })
    }
}