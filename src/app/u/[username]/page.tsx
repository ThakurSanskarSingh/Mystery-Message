'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
// import { useCompletion } from 'ai/react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
// import { toast } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast'
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const {toast} = useToast()

  const defaultMessages = [
    "What's your favorite movie?",
    "Do you have any pets?",
    "What's your dream job?",
    "What's the best book you've read recently?",
    "Where would you love to travel next?",
    "What's your favorite way to spend weekends?",
    "What's the best advice you've ever received?",
    "What's your favorite childhood memory?",
    "whats the most hidden place of campus",
    "What's your biggest goal for this year?"
  ];

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data : z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {

      const acceptCheckResponse = await axios.get(`/api/accept-messages?username=${username}`);
      console.log(acceptCheckResponse)

        if (!acceptCheckResponse.data.
          isAcceptingMessages) {
            // If the user isn't accepting messages, show error toast and return early
            toast({
                title: 'Error',
                description: "User is not accepting messages.",
                variant: 'destructive',
            });
            return; // Prevents message from being sent
        }

      const response = await axios.post('/api/send-messaage', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
    console.log(axiosError)
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container max-w-2xl mx-auto p-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[#00DF9A]">
            Send Anonymous Message
          </h1>
          <h2 className="text-2xl font-semibold mb-2 text-white">
            to @{username}
          </h2>
          <p className="text-gray-400 text-lg">
            Share your thoughts freely - they won't know who sent it!
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here..."
                      className="resize-none bg-gray-900 border-[#00DF9A] hover:border-[#00DF9A] focus:border-[#00DF9A] text-white h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled className="bg-gray-700 text-white">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isLoading || !messageContent}
                  className="bg-[#00DF9A] text-black hover:bg-[#00DF9A]/80 px-8 py-3 rounded-lg font-bold"
                >
                  Send Message
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="space-y-6 my-12">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <h3 className="text-2xl font-semibold text-[#00DF9A]">Suggested Messages</h3>
              <p className="text-gray-400">Click on any message to use it:</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {defaultMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleMessageClick(message)}
                  className="bg-gray-800 border-[#00DF9A] text-white hover:bg-[#00DF9A] hover:text-black transition-colors duration-300 text-left h-auto py-3"
                >
                  {message}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8 bg-gray-800" />
        
        <div className="text-center space-y-6">
          <div className="text-xl text-[#00DF9A]">Want Your Own Message Board?</div>
          <Link href={'/sign-up'}>
            <Button className="bg-[#00DF9A] text-black hover:bg-[#00DF9A]/80 px-8 py-3 rounded-lg font-bold">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}