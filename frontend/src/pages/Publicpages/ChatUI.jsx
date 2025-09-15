import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, MoreVertical, Smile, Send, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import socket from "../../socket/socket";

const ChatUI = ({ currentUser }) => {
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState("")
    const { chatRoomId } = useParams()
    const messagesEndRef = useRef(null)
    const navigate = useNavigate()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messages])

    useEffect(() => {
        if (!chatRoomId) return

        const fetchMessages = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/chat/messages/${chatRoomId}`,
                    { withCredentials: true }
                )
                setMessages(res.data.data)
            } catch (err) {
                console.error("Error fetching messages:", err)
            }
        };

        fetchMessages()

        socket.emit("joinRoom", chatRoomId)

        socket.on("receiveMessage", (newMessage) => {
            setMessages((prev) => {
                const exists = prev.find((msg) => msg._id === newMessage._id)
                if (exists) return prev
                return [...prev, newMessage]
            })
        })

        return () => {
            socket.off("receiveMessage")
        }
    }, [chatRoomId])

    const handleSendMessage = async () => {
        if (!inputText.trim()) return
        try {
            await axios.post(
                `http://localhost:5000/api/chat/sendMessage/${chatRoomId}`,
                { text: inputText },
                { withCredentials: true }
            );
            setInputText("")
        } catch (err) {
            console.error("Error sending message:", err)
        }
    };
    const isCurrentUser = (msg) => {
        if (!msg || !msg.sender) return false
        const senderId =
            msg.sender === msg.sender?._id
                ? msg.sender._id.toString()
                : msg.sender?.toString()
        return senderId === currentUser?._id?.toString()
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="h-screen w-screen bg-gray-100 flex flex-col">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between text-white shadow-md">
                <div className="flex items-center space-x-3">
                    <button className="p-1 hover:bg-white/20 rounded-full">
                        <ArrowLeft className="w-6 h-6" onClick={() => navigate(-1)} />
                    </button>
                    <div>
                        <h3 className="font-semibold text-sm">Chat Room</h3>
                    </div>
                </div>
                <MoreVertical className="w-5 h-5" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages && messages.length > 0 ? (
                    messages
                        .filter((msg) => msg && msg.text)
                        .map((msg, idx) => {
                            const currentUser = isCurrentUser(msg);
                            return (
                                <div
                                    key={msg._id || idx}
                                    className={`flex ${currentUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-sm text-sm ${currentUser
                                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                                            : "bg-white text-gray-800 rounded-bl-md border"
                                            }`}
                                    >
                                        <p>{msg.text}</p>
                                        <span
                                            className={`text-[10px] block mt-1 ${currentUser ? "text-blue-100" : "text-gray-500"
                                                }`}
                                        >
                                            {msg.createdAt
                                                ? new Date(msg.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : ""}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                ) : (
                    <p className="text-center text-gray-400">No messages yet</p>
                )}
                <div ref={messagesEndRef} />
            </div>


            <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message..."
                            className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim()}
                        className={`p-3 rounded-full shadow-md ${inputText.trim()
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatUI