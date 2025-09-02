import User from "../models/user.model.js"
import Message from '../models/message.model.js'
import cloudinary from "../lib/cloudinary.js"
import {io, getReciverSocketId } from "../lib/socket.js"

export const getUsersForSidebar=async (req,res)=>{
    try {
        const loggedinUserId= req.user._id
        const filteredUsers=await User.find({_id:{$ne:loggedinUserId}}).select("-password")
         res.status(200).json(filteredUsers)
        
    } catch (error) {
        console.log("Error in getUsaerForSidebar",error);
        res.status(500).json({message:"Internal Server Error"})
          
    }
}

export const getMessages=async (req,res)=>{
    try {
        const {id: userToChatId}=req.params
        const myId=req.user._id
        const message=await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })
        res.status(200).json(message)
    } catch (error) {
        console.log("Error in getMessages",error.message)
        res.status(500).json({message:"Internal Server Error"});
        
    }
}

export const sendMessage=async(req,res)=>{
    try {
        
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id

        let imageUrl;
        if(image){
            const uplooadresponse=await cloudinary.uploader.upload(image)
            imageUrl=uplooadresponse.secure_url
        }
        
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        await newMessage.save()

        const receiverSocketId=getReciverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        
        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in SendMessage",error.message);
        res.status(500).json({message:"internal Server Error"})
        
    }
}