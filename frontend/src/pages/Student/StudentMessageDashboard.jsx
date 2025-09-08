import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import { useNavigate, Outlet, useParams } from 'react-router-dom';

const StudentMessagingDashboard = () => {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const { chatRoomId } = useParams();
  console.log(conversations)


  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/student/inbox', { withCredentials: true });
        if (res.data.chatRooms) {
          const mapped = res.data.chatRooms.map((room) => ({
            id: room._id,
            employer: {
              name: room.employer.companyname,
              avatar: room.employer.avatarUrl ? (
                <img src={room.employer.avatarUrl} alt={room.employer.companyname} className="w-12 h-12 rounded-full object-cover" />
              ) : room.employer.name.charAt(0).toUpperCase(),
            },
            lastMessage: room.lastMessage || '',
            timestamp: new Date(room.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: room.unreadCount,
          }));
          setConversations(mapped)
        }
      } catch (error) {
        console.error('Failed to fetch inbox', error)
      }
    };
    fetchInbox()
  }, [chatRoomId, navigate])

  return (
    <div className="h-screen bg-gray-50 flex">
      <div className="w-[30%] bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-blue-600">
          <h2 className="text-white font-semibold text-lg">Employer Messages</h2>
          <p className="text-blue-100 text-sm">Manage your applications messages</p>
        </div>

        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/student/inbox/${chat.id}`)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-blue-50 ${
                chatRoomId === chat.id ? 'bg-blue-100 border-r-4 border-r-blue-600' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                   <div>
                      {chat.employer.avatar}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{chat.employer.name}</h3>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      {chat.unread > 0 && (
                        <span className="mt-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[70%] flex flex-col bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentMessagingDashboard