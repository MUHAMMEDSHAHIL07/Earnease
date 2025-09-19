import { io } from "socket.io-client";
let socket
export const connectSocket = () => {
  if (socket) return
  const URL = import.meta.env.VITE_API_URL;
  socket = io(URL, {
    withCredentials: true,
  })
  socket.on('connect', () => {
  })
}
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
export const getSocket = () => socket