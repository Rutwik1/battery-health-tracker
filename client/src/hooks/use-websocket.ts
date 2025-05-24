
import { useState, useEffect, useCallback, useRef } from 'react';

// WebSocket connection status
export type ConnectionStatus = 'connecting' | 'open' | 'closed' | 'error';
// newly added
import type { Battery } from "@shared/schema";

// Define the different message types we'll receive from the server
export type WebSocketMessage =
  // | { type: 'batteries', data: any[] }
  // | { type: 'battery_update', data: { battery: any, history: any } }
  | { type: 'batteries', data: Battery[] }
  | { type: 'battery_update', data: { battery: Battery, history: any } }
  | { type: 'battery_added', data: Battery }
  | { type: 'recommendation', data: any };

/**
 * Custom hook for WebSocket connections with performance optimizations
 * Provides realtime updates for battery data
 */
export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  // Use refs to reduce re-renders and improve performance
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const messageQueueRef = useRef<WebSocketMessage[]>([]);
  const processingRef = useRef<boolean>(false);
  const lastProcessTimeRef = useRef<number>(0);

  // Throttle update frequency (process at most once every 1000ms)
  const THROTTLE_MS = 1000;

  // Configuration for dramatic cycle jumps
  const MIN_JUMP = 2000;
  const MAX_JUMP = 4000;
  const JUMP_RANGE = MAX_JUMP - MIN_JUMP;

  // Process message queue with throttling
  const processMessageQueue = useCallback(() => {
    if (processingRef.current) return;

    const now = Date.now();
    const timeElapsed = now - lastProcessTimeRef.current;

    if (timeElapsed < THROTTLE_MS) {
      // Schedule processing for later if we're throttling
      setTimeout(processMessageQueue, THROTTLE_MS - timeElapsed);
      return;
    }

    processingRef.current = true;

    try {
      // Take the most recent message for each battery ID to reduce processing
      const batteryUpdates = new Map<number, WebSocketMessage>();

      // Process message queue
      while (messageQueueRef.current.length > 0) {
        const message = messageQueueRef.current.shift();
        if (!message) continue;

        if (message.type === 'battery_update' && message.data && message.data.battery) {
          const batteryId = message.data.battery.id;
          batteryUpdates.set(batteryId, message);
        } else {
          // For non-battery updates, process immediately
          setLastMessage(message);
        }
      }

      // Process each battery's most recent update
      batteryUpdates.forEach((message) => {
        if (message.type === 'battery_update' && message.data && message.data.battery) {
          // Apply dramatic cycle count changes efficiently
          const dramaticBattery = { ...message.data.battery };

          // Generate optimized dramatic jump (2000-4000 range)
          const direction = Math.random() > 0.5 ? 1 : -1;
          // Bitwise operations for faster random calculations
          const jumpAmount = MIN_JUMP + (Math.random() * JUMP_RANGE | 0);

          // Fast calculation for new cycle count
          const originalCycleCount = dramaticBattery.cycleCount;
          let newCycleCount = originalCycleCount + (direction * jumpAmount);

          // Ensure we don't go below 0 (only check when necessary)
          if (newCycleCount < 0) {
            newCycleCount = originalCycleCount + jumpAmount;
          }

          // Update the cycle count with the dramatic change
          dramaticBattery.cycleCount = newCycleCount;

          // Log the dramatic change (only in development for performance)
          if (process.env.NODE_ENV !== 'production') {
            console.log(`DRAMATIC CYCLE JUMP: ${originalCycleCount} → ${newCycleCount} (${direction > 0 ? '+' : '-'}${jumpAmount})`);
          }

          // Replace the battery in the message
          message.data.battery = dramaticBattery;

          // Update state with processed message
          setLastMessage(message);
        }
      });

      lastProcessTimeRef.current = now;
    } finally {
      processingRef.current = false;
    }
  }, []);

  // Connect to the WebSocket server
  useEffect(() => {
    const connectWebSocket = () => {
      // Clear any existing reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Determine if we're in development or production
      const isLocalhost = window.location.hostname === 'localhost';

      // Use the appropriate WebSocket URL
      let wsUrl;
      if (isLocalhost) {
        // In development, use local WebSocket
        wsUrl = 'ws://localhost:5000/ws';
      } else if (window.location.hostname.includes('render.com')) {
        // On Render's deployment platform
        wsUrl = 'wss://battery-health-tracker-backend.onrender.com/ws';
      } else {
        // In other production environments, use relative path
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        wsUrl = `${protocol}//${window.location.host}/ws`;
      }

      console.log(`Connecting to WebSocket at ${wsUrl}`);
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established');
        setStatus('open');

        // Subscribe to battery updates
        ws.send(JSON.stringify({
          type: 'subscribe',
          entity: 'batteries'
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;

          // Queue message for processing instead of processing immediately
          messageQueueRef.current.push(message);

          // Trigger processing of queue
          processMessageQueue();
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setStatus('closed');

        // Attempt to reconnect after a delay
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          connectWebSocket();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('error');
      };

      setSocket(ws);
    };

    // Initial connection
    connectWebSocket();

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [processMessageQueue]);

  // Send a message to the server
  const sendMessage = useCallback((message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message, WebSocket is not open');
    }
  }, []);

  return {
    socket,
    status,
    lastMessage,
    sendMessage
  };
}
