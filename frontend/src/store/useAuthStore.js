import {create} from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast';
import {io} from 'socket.io-client'

const BASE_URL=import.meta.env.MODE === "development" ? 'http://localhost:5001' : "/"

export const useAuthStore= create((set,get)=> ({
    authUser:null,  
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    onlineUsers:[],
    socket:null,

    isCheckingAuth:true,

    checkAuth: async()=>{
        try {
            const res= await axiosInstance.get('/auth/check');
            set ({authUser:res.data})
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth",error);
            
        }finally{
            set({isCheckingAuth:false})
        }
    },
    signup:async(data)=>{
        set({isSigningUp:true});
        try {
            const res=await axiosInstance.post('/auth/signup',data)
            set({authUser:res.data})
            toast.success("Account created successfully")
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message||"Signup failed")
            
        }finally{
            set({isSigningUp:false  })
        }
    },
    login:async(data)=>{
        set({isLoggingIn:true})
        try {
            const res=await axiosInstance.post('/auth/login',data)
            set({authUser:res.data})
            toast.success("Login Successfully")
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message|| "Login failed")
        }finally{
            set({isLoggingIn:false })
        }
    },
    logout:async()=>{
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser:null})
            toast.success('Logged out Successfully')
            get().disConnectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    updateProfile: async(data)=>{
        set({isUpdatingProfile:true})
        try {
            const res=await axiosInstance.put("/auth/update-profile",data)
            set({authUser:res.data})
            toast.success("Updated profile Successfully")
        } catch (error) {
            console.log("'error in update ",error.message);
            
            toast.error(error.response.data.message)
        }finally{
            set({isUpdatingProfile:false})
        }
    },
    connectSocket: ()=>{
        const {authUser}=get()
        if(!authUser || get().socket?.connected) return;
        
        const socket= io(BASE_URL,{
            query:{
                userId:authUser._id,
            }
        })
        socket.connect()

        set({socket:socket})

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers: userIds})
    })
    },
    disConnectSocket: ()=>{
        if(get().socket?.connected) get().socket.disconnect();
    },
}) )