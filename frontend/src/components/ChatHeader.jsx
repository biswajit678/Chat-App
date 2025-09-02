import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'

const ChatHeader = () => {
    const {selectedUser}=useChatStore()
    const {onlineUsers}=useAuthStore()
  return (
    <div className='p-2.5 border-b border-base-300'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                {/*Avatar */}
                <div className='avatar  '>
                    <div className='size-10 rounded-full relative'>
                        <img src={selectedUser.profilePic || 'https://i.pinimg.com/originals/e3/4d/be/e34dbeca8a484c2d488db96eaaef09df.jpg'}
                         alt={selectedUser.fullname} />
                    </div>
                </div>
                {/*User Info */}
                <div>
                    <h1 className='font-medium'>{selectedUser.fullname}</h1>
                    <p className='text-sm text-base-content/70'>{onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatHeader