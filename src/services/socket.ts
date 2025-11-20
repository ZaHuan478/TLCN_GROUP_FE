import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';

export const connectSocket = (userId: string) => {
  if (socket) return socket;
  const base = getBaseUrl();
  socket = io(base, { withCredentials: true });

  socket.on('connect', () => {
    console.log('Socket connected', socket?.id);
    if (userId) socket?.emit('join', { userId });
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected', reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (!socket) return;
  try {
    socket.disconnect();
  } finally {
    socket = null;
  }
};

export const joinConversationRoom = (conversationId: string) => {
  if (!socket) return;
  socket.emit('join_conversation', conversationId);
};

export const leaveConversationRoom = (conversationId: string) => {
  if (!socket) return;
  socket.emit('leave_conversation', conversationId);
};

export const onNewMessage = (cb: (payload: any) => void) => {
  if (!socket) return;
  socket.on('new_message', cb);
  return () => socket?.off('new_message', cb);
};

export default {
  connectSocket,
  disconnectSocket,
  joinConversationRoom,
  leaveConversationRoom,
  onNewMessage,
};
