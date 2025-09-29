import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, MoreVertical, Send, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getSocket } from "../../socket/socket";
import GlobalLoader from "../../components/GlobalLoader";

const EmployerChatUI = ({ currentUser }) => {
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState("")
    const { chatRoomId } = useParams()
    const messagesEndRef = useRef(null)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const socket = getSocket()
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (!chatRoomId) return;

        const fetchMessages = async () => {
            try {
                setLoading(true)
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/chat/messages/${chatRoomId}`,
                    { withCredentials: true }
                )
                setMessages(res.data.data)
            } catch (err) {
                console.error("Error fetching messages:", err)
            }
            finally {
                setLoading(false)
            }
        };

        fetchMessages();
        if (socket) {
            socket.emit("joinRoom", chatRoomId);

            const handleReceiveMessage = (newMessage) => {
                setMessages((prev) => {
                    const exists = prev.find((msg) => msg._id === newMessage._id);
                    if (exists) return prev;
                    return [...prev, newMessage];
                });
            };

            socket.on("receiveMessage", handleReceiveMessage);
            return () => {
                if (socket) {
                    socket.off("receiveMessage", handleReceiveMessage);
                }
            };
        }
    }, [chatRoomId, socket]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/chat/sendMessage/${chatRoomId}`,
                { text: inputText },
                { withCredentials: true }
            );
            setInputText("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    const isCurrentUser = (msg) => {
        if (!msg || !msg.sender) return false;
        const senderId =
            msg.sender === msg.sender?._id
                ? msg.sender._id.toString()
                : msg.sender?.toString();
        return senderId === currentUser?._id?.toString();
    };

    return (
        <div className="h-screen w-screen bg-gray-100 flex flex-col">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between text-white shadow-md">
                <div className="flex items-center space-x-3">
                    <button className="p-1 hover:bg-white/20 rounded-full" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h3 className="font-semibold text-sm">Employer Chat</h3>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {
                    loading ? (
                        <GlobalLoader />
                    ) : (
                        messages && messages.length > 0 ? (
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
                                    );
                                })
                        ) : (
                            <p className="text-center text-gray-400">No messages yet</p>
                        )
                    )
                }

                <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-500 hover:bg-gray-700 rounded-full">
                        <Plus className="w-5 h-5" />
                    </button>
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
export default EmployerChatUI