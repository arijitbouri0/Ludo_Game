import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = Socket | null;

const SocketContext = createContext<SocketContextType>(null);

export const useSocket = (): SocketContextType => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
   const socketUrl = import.meta.env.VITE_SERVER; 
    // Create socket instance and memoize it
    const socket = useMemo(() => io(socketUrl, {
        withCredentials: true,
    }), []);  // Empty array ensures it's only created once

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
