import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {
            status: 401
        });
    }

    const user: User = session.user as User;
    const userId = user._id;
    
    
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                
                isAcceptingMessages: acceptMessages
            },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            }, {
                status: 404 
            });
        }

        return Response.json({
            success: true,
            message: "Messages acceptance status updated successfully",
            isAcceptingMessages: updatedUser.isAcceptingMessages
        }, {
            status: 200
        });
    } catch (error) {
        console.error("Failed to update user status to accept messages:", error);
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, {
            status: 500
        });
    }
}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    // 4. Fixed authentication check
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {
            status: 401
        });
    }

    const user: User = session.user as User;
    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "Failed to find user"
            }, {
                status: 404
            });
        }

        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, {
            status: 200  
        });
    } catch (error) {
        console.error("Failed to get message acceptance status:", error);
        return Response.json({
            success: false,
            message: "Error in getting message acceptance status"
        }, {
            status: 500
        });
    }
}