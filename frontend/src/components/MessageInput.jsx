import { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { Image, Send, X } from 'lucide-react'
import toast from 'react-hot-toast'

const MessageInput = () => {
  const [text, setText] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputref = useRef(null)
  const {sendMessage} = useChatStore()

  const handelImageChange=(e)=>{
    const file=e.target.files[0]
    if(!file.type.startsWith("image/")){
      toast.error("Plese select an Image File")
      return;
    }
      const reader=new FileReader()
      reader.onloadend= ()=>{
        setImagePreview(reader.result)
      }

    reader.readAsDataURL(file)
  }
  const removeImage=()=>{
    setImagePreview(null)
    if(fileInputref.current) fileInputref.current.value="";
  }
  const handelSendMessage= async(e)=>{
     e.preventDefault();
     try {
        await sendMessage({
          text:text.trim(),
          image:imagePreview
        })
        setText("")
        setImagePreview(null)
        if(fileInputref.current) fileInputref.current.value=""

     } catch (error) {
      console.log("Failed to send Message",error);
      
     }
  }

  return (
    <div className='p-4 w-full'>
      {imagePreview && (
        <div className='mb-3 flex items-center gap-2'>
          <div className='relative'>
            <img src={imagePreview} 
            alt="preview"
            className='w-20 h-20 object-cover rounded-lg border border-zinc-700'
             />
             <button
              onClick={removeImage}
              className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center'
             >
              <X className='size-3'/>
             </button>
          </div>
        </div>
      )}
      <form onSubmit={handelSendMessage} className='flex items-center gap-2'>
        <div className='flex-1 flex gap-2'>
          <input
           type="text"
           className='w-full input input-bordered rounded-lg input-sm sm:input-md'
           placeholder='Type a message...'
           value={text}
           onChange={(e)=>setText(e.target.value)}
           />
           <input
            type="file"
            accept='image/*'
            className='hidden'
            ref={fileInputref}
            onChange={handelImageChange}
            />
            <button
            type='button'
            className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={()=>fileInputref.current?.click()}
            >
              <Image size={20}/>
            </button>
        </div>
        <button
         type='submit'
         className='btn btn-sm btn-circle'
         disabled={!text.trim() && !imagePreview}
        >
          <Send size={22}/>
        </button>
      </form>
    </div>
  )
}

export default MessageInput