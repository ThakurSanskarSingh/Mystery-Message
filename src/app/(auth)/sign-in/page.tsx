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
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'
import { Input } from '@/components/ui/input'


const page = () => {
  
 
  
  const { toast } = useToast()
  const router = useRouter()

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues : {
      
      identifier : '',
    password : ''    }
  })

 

  const onSubmit = async (data : z.infer<typeof signInSchema>) => {
    
   const  result =await signIn('credentials',{
    redirect : false,
    identifier : data.identifier,
    password : data.password
   })
   if (result?.error) {
    if (result.error === 'CredentialsSignin') {
      toast({
        title: 'Login failed',
        description: 'Incorrect email or password',
        variant: 'destructive',
      });
    } else if (result.error === 'AccountNotVerified') {
      toast({
        title: 'Login failed',
        description: 'Please verify your account first',
        variant: 'destructive',
      });
      // router.replace(`/verify/${}`)
    } else {
      toast({
        title: 'Login failed',
        description: result.error,
        variant: 'destructive',
      });
    }
  }
   
  if(result?.url){
    router.replace('/dashboard')
  }
    }
  
  return (
    <div className=' flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xxl mb-6 '>
            Join Mystery Message 
          </h1>
          <p className='mb-4'>Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form  onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            
            <FormField 
            control={form.control}
            name='identifier'
            render={({field}) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <FormControl>
                  {/* //install input from shadcn  */}
                  <Input placeholder = 'email/username' {...field}
           
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
            <Button type='submit' >Sign in  </Button>
          </form>

        </Form>
        <div className='text-center mt-4'>
          <p>
            Not a member?{' '}
            <Link href='/sign-up' className='text-blue-600 hover:text-blue-900' >
              Sign up
            </Link>
          </p>
        </div>
      </div>

    </div>

  )
}

export default page