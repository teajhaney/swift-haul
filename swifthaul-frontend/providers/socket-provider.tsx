'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { NotificationText } from '@/components/notifications/notification-text';
import type { ApiNotification } from '@/types/notification';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Only connect if user is authenticated
    if (!user?.id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    
    const socketInstance = io(`${backendUrl}/notifications`, {
      query: { userId: user.id },
      withCredentials: true,
      transports: ['websocket', 'polling'], // Fallback if WS fails
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to notifications gateway');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from notifications gateway');
    });

    socketInstance.on('notification', (n: ApiNotification) => {
      console.log('New real-time notification:', n);
      
      // 1. Show toast alert
      toast.info(n.title, {
        description: <NotificationText text={n.body} />,
        action: n.orderReferenceId ? {
          label: 'View Order',
          onClick: () => window.location.href = `/orders/${n.orderReferenceId}`
        } : undefined
      });

      // 2. Invalidate notification queries to refresh the bell and page
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.id, queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
