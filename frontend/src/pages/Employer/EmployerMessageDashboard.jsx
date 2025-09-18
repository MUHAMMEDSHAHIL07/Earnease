import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MessageCircle } from 'lucide-react';
import { useNavigate, Outlet, useParams } from 'react-router-dom';
import EmployerSidebar from './EmployerSidebar';

const EmployerMessagingDashboard = () => {
  const [conversations, setConversations] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showChatOnMobile, setShowChatOnMobile] = useState(false)
  const navigate = useNavigate()
  const { chatRoomId } = useParams()

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/employer/inbox`, { withCredentials: true })
        if (res.data.chatRooms) {
          const mapped = res.data.chatRooms.map((room) => ({
            id: room._id,
            student: {
              name: room.student.name,
              avatar: room.student.avatarUrl ? (
                <img src={room.student.avatarUrl} alt={room.student.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                  {room.student.name.charAt(0).toUpperCase()}
                </div>
              ),
            },
            lastMessage: room.lastMessage || 'No messages yet',
            timestamp: new Date(room.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));
          setConversations(mapped)
        }
      } catch (error) {
        console.error('Failed to fetch inbox', error)
      }
    }
    fetchInbox()
  }, [chatRoomId, navigate])

  useEffect(() => {
    if (chatRoomId) {
      setShowChatOnMobile(true)
    }
  }, [chatRoomId])

  const filteredConversations = conversations.filter(chat =>
    chat.student.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleConversationClick = (chatId) => {
    navigate(`/employer/inbox/${chatId}`)
    setShowChatOnMobile(true)
  }

  const handleBackToList = () => {
    setShowChatOnMobile(false)
    navigate('/employer/inbox')
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <EmployerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex overflow-hidden">
  
        <div className={`w-full lg:w-[380px] bg-white border-r border-gray-200 flex flex-col ${showChatOnMobile ? 'hidden lg:flex' : 'flex'}`}>
 
          <div className="p-6 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              </div>
            </div>
            <p className="text-sm text-gray-500">Manage conversations with candidates</p>
          </div>


          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleConversationClick(chat.id)}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50 ${
                    chatRoomId === chat.id ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      {chat.student.avatar}
                      {chat.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-900 text-sm truncate pr-2">
                          {chat.student.name}
                        </h3>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {chat.timestamp}
                          </span>
                          {chat.unread > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                              {chat.unread > 99 ? '99+' : chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate leading-relaxed">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm">No conversations found</p>
              </div>
            )}
          </div>
        </div>


        <div className={`flex-1 flex flex-col bg-white ${showChatOnMobile ? 'flex' : 'hidden lg:flex'}`}>
          {chatRoomId ? (
            <div className="flex-1 overflow-hidden">
              <Outlet context={{ handleBackToList }} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500 max-w-sm">
                  Choose from your existing conversations or start a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployerMessagingDashboard