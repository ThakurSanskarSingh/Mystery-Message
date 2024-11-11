'use client'
import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { useParams,useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { Form, FormControl,  FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {zodResolver} from '@hookform/resolvers/zod'


import React from 'react'
import { Button } from '@react-email/components'


const VerifyAccount = () => {
    const router = useRouter()
    const param = useParams<{username : string}>()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof verifySchema >>({
        resolver: zodResolver(verifySchema),
             })

             const onSubmit = async (data : z.infer<typeof verifySchema>) => {
            try {
         const response = await axios.post(`/api/verify-code`,{
            username : param.username,
                    code : data.code
                })

                toast({
        title : 'success',
        description : response.data.message
      })
      router.replace('/sign-in')
            } catch (error) {
                console.error("Error in signup of user")
                const axiosError = error as AxiosError<ApiResponse>;
          let errorMessage  = axiosError.response?.data.message
          toast({
            title : "signup failed",
            description : errorMessage,
            variant : 'destructive'
          })
            }
        }     
    

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
                <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xxl mb-6 '>Verify Your Account</h1>
                <p className='mb-4'>
                    Enter the Verification code sent to your email
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <FormField
                    control={form.control}
                    name='code'
                    render={({field}) => (
                        <FormItem>
                             <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  {/* //install input from shadcn  */}
                  <Input placeholder = 'code' {...field}
           
                  />
                </FormControl>
                        </FormItem>
                    )}
                    />
                    <Button type='submit'>Submit</Button>

                   
                </form>

            </Form>
        </div>
    </div>
  )
}

export default VerifyAccount