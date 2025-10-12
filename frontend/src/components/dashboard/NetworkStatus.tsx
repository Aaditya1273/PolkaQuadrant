'use client';

import { motion } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';

interface NetworkStatusProps {
  isConnected: boolean;
}

export default function NetworkStatus({ isConnected }: NetworkStatusProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center space-x-2"
    >
      {isConnected ? (
        <>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 bg-green-500 rounded-full"
          />
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">
              Connected
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <WifiOff className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-700 dark:text-red-300">
              Disconnected
            </span>
          </div>
        </>
      )}
    </motion.div>
  );
}
