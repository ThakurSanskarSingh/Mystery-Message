import {z} from 'zod'
export const UsernameValidation = z
.string()
.min(2,"Username must be of atleast 2 characters")
.max(20,"Username must be atmost 20 chracters")
// .regex(/^[a-zA-Z0-9]$/,"username must not contain special char")


export const signUpSchema = z.object({
    username : UsernameValidation,
    email : z.string().email({message: "Invalid email"}),
    password : z.string()
})