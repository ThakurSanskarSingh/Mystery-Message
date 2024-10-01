import {z} from "zod"
export const messageSchema =z.object({
    content : z.string()
    .min(10,{message : " Mesage must contain atleast 10 char"})
    
})

