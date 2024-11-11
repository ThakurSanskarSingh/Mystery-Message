'use client'
import React, { useEffect, useState } from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import Link from 'next/link'
import * as z from 'zod'
import {useDebounceCallback} from 'usehooks-ts'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import Loader from '@radix-ui/react-icons'
import { Input } from '@/components/ui/input'
import { Divide, Loader2 } from 'lucide-react'

const page = () => {
  const[username,setUsername] = useState('')
  const [usernameMessage,setUsernameMessage]  = useState('')
  const[isCheckingUsername,setisCheckingUsername] = useState(false)
  const[isSubmitting , setIsSubmitting] = useState(false)
  const debounce =  useDebounceCallback(setUsername,300)
  const { toast } = useToast()
  const router = useRouter()

  //zod implementation
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues : {
      username : "",
      email : '',
    password : ''    }
  })

  useEffect(() => {
    const checkUsernameUnique  = async () => {
      if(username){
      setisCheckingUsername(true)
      setUsernameMessage('')
      try {
      const response=   await axios.get(`/api/check-username-unique?username=${username}`)
      let message = response.data.message
      setUsernameMessage(message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(axiosError.response?.data.message ?? "Error checkin username")

      } finally {
        setisCheckingUsername(false)
      }
    }
    }
    checkUsernameUnique()
  },[username])

  const onSubmit = async (data : z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response  = axios.post<ApiResponse>('/api/sign-up' , data)
      toast({
        title : 'success',
        description :(await response).data.message
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error in signup of user")
      const axiosError = error as AxiosError<ApiResponse>;
let errorMessage  = axiosError.response?.data.message
toast({
  title : "signup failed",
  description : errorMessage,
  variant : 'destructive'
})
setIsSubmitting(false)
    }
  }
  return (
    <div className=' flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xxl mb-6 '>
            Join Mystery Message 
          </h1>
          <p className='mb-4'>Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form  onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField 
            control={form.control}
            name='username'
            render={({field}) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  
                  <Input placeholder = 'username' {...field}
                  onChange ={(e) => {
                    field.onChange(e) 
                     debounce(e.target.value)                  }}
                  />
                 
                </FormControl>
               {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
               
              </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name='email'
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  
                  <Input placeholder = 'username' {...field}
           
                  />
                </FormControl>
               
              </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name='password'
            render={({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  {/* //install input from shadcn  */}
                  <Input type = 'password' placeholder = 'password' {...field}
           
                  />
                </FormControl>
               
              </FormItem>
            )}
            />
            <Button type='submit' disabled= {isSubmitting}>{
              isSubmitting ? ( 
                <>
                Please Wait
                </>
              ) : ('Signup')
             }</Button>
          </form>

        </Form>
        <div className='text-center mt-4'>
          <p>
            Already a member?{' '}
            <Link href='/sign-in' className='text-blue-600 hover:text-blue-900' >
              Sign in
            </Link>
          </p>
        </div>
      </div>

    </div>

  )
}

export default page