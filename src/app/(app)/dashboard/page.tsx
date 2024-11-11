'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

import { Message } from '@/model/user.model'
import { acceptMessageSchme } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Switch } from "@/components/ui/switch"

import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw,Clipboard,CheckCircle } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Separator } from "@/components/ui/separator"
import { useRouter } from 'next/navigation'




const Page = () => {
    
  
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  
    const { toast } = useToast();
  
    const handleDeleteMessage = (messageId: string) => {
      setMessages(messages.filter((message) => message._id !== messageId));
    };
  
    const { data: session } = useSession();
  
    const form = useForm({
      resolver: zodResolver(acceptMessageSchme),
    });
  
    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');
  
    const fetchAcceptMessages = useCallback(async () => {
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/accept-messages');
        setValue('acceptMessages', response.data.isAcceptingMessages);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ??
            'Failed to fetch message settings',
          variant: 'destructive',
        });
      } finally {
        setIsSwitchLoading(false);
      }
    }, [setValue, toast]);
  
    const fetchMessages = useCallback(
      async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(false);
        try {
          const response = await axios.get<ApiResponse>('/api/get-messages');
          setMessages(response.data.messages || []);
          if (refresh) {
            toast({
              title: 'Refreshed Messages',
              description: 'Showing latest messages',
            });
          }
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast({
            title: 'Error',
            description:
              axiosError.response?.data.message ?? 'Failed to fetch messages',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
          setIsSwitchLoading(false);
        }
      },
      [setIsLoading, setMessages, toast]
    );
  
    // Fetch initial state from the server
    useEffect(() => {
      if (!session || !session.user) return;
  
      fetchMessages();
  
      fetchAcceptMessages();
    }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);
  
    // Handle switch change
    const handleSwitchChange = async () => {
      try {
        const response = await axios.post<ApiResponse>('/api/accept-messages', {
          acceptMessages: !acceptMessages,
        });
        setValue('acceptMessages', !acceptMessages);
        toast({
          title: response.data.message,
          variant: 'default',
        });
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ??
            'Failed to update message settings',
          variant: 'destructive',
        });
      }
    };
  
    if (!session || !session.user) {
      return <div></div>;
    }
  
    const { username } = session.user as User;
  
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;
  
    const copyToClipboard = () => {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: 'URL Copied!',
        description: 'Profile URL has been copied to clipboard.',
      });
    };
  
    return (
        <div className="min-h-screen bg-black text-white pt-20 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
               
                <div className="bg-gray-900 rounded-lg shadow-xl p-6 mb-8">
                    <h1 className="text-4xl flex justify-center text-center font-bold bg-gradient-to-r from-[#00DF9A] to-green-400 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                </div>

                
                <div className="bg-gray-900 rounded-lg shadow-xl p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-[#00DF9A] mb-4">
                        Your Profile Link
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={profileUrl}
                            disabled
                            className="flex-1 bg-gray-800 text-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00DF9A] focus:outline-none"
                        />
                        <Button
                            onClick={copyToClipboard}
                            className="bg-[#00DF9A] hover:bg-green-400 text-black font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Clipboard className="h-4 w-4" />
                            Copy Link
                        </Button>
                    </div>
                </div>

                {/* Settings Section */}
                <div className="bg-gray-900 rounded-lg shadow-xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Switch
                                {...register('acceptMessages')}
                                checked={acceptMessages}
                                onCheckedChange={handleSwitchChange}
                                disabled={isSwitchLoading}
                                className="data-[state=checked]:bg-[#00DF9A]"
                            />
                            <span className="text-lg font-medium">
                                Accept Messages {acceptMessages ? 
                                    <span className="text-[#00DF9A]">(Active)</span> : 
                                    <span className="text-gray-400">(Inactive)</span>
                                }
                            </span>
                        </div>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                fetchMessages(true);
                            }}
                            className="bg-gray-800 hover:bg-gray-700 text-[#00DF9A] p-2 rounded-lg transition-colors"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <RefreshCcw className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Messages Grid */}
                <div className="bg-gray-900 rounded-lg shadow-xl p-6">
                    <h2 className="text-2xl font-semibold text-[#00DF9A] mb-6">
                        Messages
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {messages.length > 0 ? (
                            messages.map((message) => (
                                <MessageCard
                                    key={message._id}
                                    message={message}
                                    onMesssageDelete={handleDeleteMessage}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-400">
                                <div className="flex flex-col items-center gap-3">
                                    <CheckCircle className="h-12 w-12 text-gray-600" />
                                    <p className="text-lg">No messages to display</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;