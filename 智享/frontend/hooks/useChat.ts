import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { Message } from '../types'; // Ensure this path is correct and the file exists

const socket = io('http://<0306>-5000.app.github.dev'); // 替换为你的后端 URL

export const useChat = (userId: number) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('join', userId);
    });

    socket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('message');
      socket.off('connect');
    };
  }, [userId]);

  const sendMessage = (content: string, receiverId: number) => {
    socket.emit('message', { content, senderId: userId, receiverId });
  };

  return { messages, sendMessage };
};