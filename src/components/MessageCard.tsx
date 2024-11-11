'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import dayjs from 'dayjs';
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger} from '@/components/ui/alert-dialog'
import {X} from 'lucide-react'
import { Button } from './ui/button'
import { Message } from '@/model/user.model'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
type MessageCardProps = {
    message : Message,
    onMesssageDelete  : (messageId : string) => void
}
const MessageCard = ({message,onMesssageDelete} : MessageCardProps) => {
    const {toast} = useToast()
    const handleDeleteConfirm = async () => {
      const response = await  axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
      toast({
        title : response.data.message,
        
      })
      onMesssageDelete(message._id) 
    }

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

export default MessageCard