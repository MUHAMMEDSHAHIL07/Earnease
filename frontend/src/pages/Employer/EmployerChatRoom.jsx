import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Send } from "lucide-react";
import socket from "../../socket/socket";

const EmployerChatRoom = ({ currentUser }) => {
  const { chatRoomId } = useParams()
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState("")
  const [studentInfo, setStudentInfo] = useState({ name: "", avatarUrl: "" })
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!chatRoomId) return
    
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employer/chats", { withCredentials: true })
        if (res.data.data) {
          const chatRoom = res.data.data.find(room => room._id === chatRoomId)
          if (chatRoom && chatRoom.student) {
            setStudentInfo({
              name: chatRoom.student.name,
              avatarUrl: chatRoom.student.avatarUrl,
            })
          } else {
            setStudentInfo({ name: "", avatarUrl: "" })
          }
        }
      } catch (error) {
        console.error("Failed to fetch user details", error)
      }
    };

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/messages/${chatRoomId}`,
          { withCredentials: true }
        );
        setMessages(res.data.data)
      } catch (err) {
        console.error("Error fetching messages:", err)
      }
    };

    fetchUserDetails()
    fetchMessages()

    socket.emit("joinRoom", chatRoomId)

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => {
        const exists = prev.find((msg) => msg._id === newMessage._id)
        if (exists) return prev
        return [...prev, newMessage]
      })
    })

    return () => socket.off("receiveMessage");
  }, [chatRoomId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputText.trim()) return
    
    try {
      await axios.post(
        `http://localhost:5000/api/chat/sendMessage/${chatRoomId}`,
        { text: inputText },
        { withCredentials: true }
      )
      setInputText("")
      inputRef.current?.focus()
    } catch (err) {
      console.error("Error sending message", err)
    }
  }

  const isCurrentUser = (msg) => {
    if (!msg || !msg.sender) return false
    const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender
    return senderId?.toString() === currentUser?._id?.toString();
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            {studentInfo.avatarUrl ? (
              <img
                src={studentInfo.avatarUrl}
                alt={studentInfo.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                {studentInfo.name.charAt(0).toUpperCase() || "S"}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{studentInfo.name}</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages && messages.length > 0 ? (
            messages
              .filter((msg) => msg && msg.text)
              .map((msg, idx) => {
                const isCurrent = isCurrentUser(msg);
                return (
                  <div
                    key={msg._id || idx}
                    className={`flex ${isCurrent ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-end gap-2 max-w-xs md:max-w-md ${isCurrent ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isCurrent && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
                          {studentInfo.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-sm ${
                          isCurrent
                            ? "bg-blue-500 text-white rounded-br-md"
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <div
                          className={`text-xs mt-1 ${
                            isCurrent ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm">No messages yet</p>
              <p className="text-xs text-gray-400 mt-1">Start a conversation!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                maxLength={1000}
              />
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={`p-3 rounded-xl transition-all shadow-sm ${
              inputText.trim()
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmployerChatRoom