// import { useState, useEffect, useCallback } from 'react';


// // WebSocket connection status
// export type ConnectionStatus = 'connecting' | 'open' | 'closed' | 'error';

// // Define the different message types we'll receive from the server
// export type WebSocketMessage =
//   | { type: 'batteries', data: any[] }
//   | { type: 'battery_update', data: { battery: any, history: any } }
//   | { type: 'recommendation', data: any };

// /**
//  * Custom hook for WebSocket connections
//  * Provides realtime updates for battery data
//  */
// export function useWebSocket() {
//   const [socket, setSocket] = useState<WebSocket | null>(null);
//   const [status, setStatus] = useState<ConnectionStatus>('connecting');
//   const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

//   // Connect to the WebSocket server
//   useEffect(() => {
//     const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
//     const wsUrl = `${protocol}//${window.location.host}/ws`;

//     console.log(`Connecting to WebSocket at ${wsUrl}`);
//     const ws = new WebSocket(wsUrl);

//     ws.onopen = () => {
//       console.log('WebSocket connection established');
//       setStatus('open');

//       // Subscribe to battery updates
//       ws.send(JSON.stringify({
//         type: 'subscribe',
//         entity: 'batteries'
//       }));
//     };

//     ws.onmessage = (event) => {
//       try {
//         const message = JSON.parse(event.data) as WebSocketMessage;
//         console.log('Received WebSocket message:', message);
//         setLastMessage(message);
//       } catch (error) {
//         console.error('Error parsing WebSocket message:', error);
//       }
//     };

//     ws.onclose = () => {
//       console.log('WebSocket connection closed');
//       setStatus('closed');
//     };

//     ws.onerror = (error) => {
//       console.error('WebSocket error:', error);
//       setStatus('error');
//     };

//     setSocket(ws);

//     // Clean up on unmount
//     return () => {
//       ws.close();
//     };
//   }, []);

//   // Send a message to the server
//   const sendMessage = useCallback((message: any) => {
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       socket.send(JSON.stringify(message));
//     } else {
//       console.warn('Cannot send message, WebSocket is not open');
//     }
//   }, [socket]);

//   return {
//     socket,
//     status,
//     lastMessage,
//     sendMessage
//   };
// }








// new code for deploy 


// import { useState, useEffect, useCallback } from 'react';
// import { WS_BASE_URL } from '../lib/apiConfig';

// // WebSocket connection status
// export type ConnectionStatus = 'connecting' | 'open' | 'closed' | 'error';

// // Define the different message types we'll receive from the server
// export type WebSocketMessage =
//   | { type: 'batteries', data: any[] }
//   | { type: 'battery_update', data: { battery: any, history: any } }
//   | { type: 'recommendation', data: any };

// /**
//  * Custom hook for WebSocket connections
//  * Provides realtime updates for battery data
//  */
// export function useWebSocket() {
//   const [socket, setSocket] = useState<WebSocket | null>(null);
//   const [status, setStatus] = useState<ConnectionStatus>('connecting');
//   const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

//   // Connect to the WebSocket server
//   useEffect(() => {
//     // Use the WebSocket URL from our configuration
//     console.log(`Connecting to WebSocket at ${WS_BASE_URL}`);

//     const ws = new WebSocket(WS_BASE_URL);

//     ws.onopen = () => {
//       console.log('WebSocket connection established');
//       setStatus('open');

//       // Subscribe to battery updates
//       ws.send(JSON.stringify({
//         type: 'subscribe',
//         entity: 'batteries'
//       }));
//     };

//     ws.onmessage = (event) => {
//       try {
//         const message = JSON.parse(event.data) as WebSocketMessage;
//         console.log('Received WebSocket message:', message);
//         setLastMessage(message);
//       } catch (error) {
//         console.error('Error parsing WebSocket message:', error);
//       }
//     };

//     ws.onclose = () => {
//       console.log('WebSocket connection closed');
//       setStatus('closed');
//     };

//     ws.onerror = (error) => {
//       console.error('WebSocket error:', error);
//       setStatus('error');
//     };

//     setSocket(ws);

//     // Clean up on unmount
//     return () => {
//       ws.close();
//     };
//   }, []);

//   // Send a message to the server
//   const sendMessage = useCallback((message: any) => {
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       socket.send(JSON.stringify(message));
//     } else {
//       console.warn('Cannot send message, WebSocket is not open');
//     }
//   }, [socket]);

//   return {
//     socket,
//     status,
//     lastMessage,
//     sendMessage
//   };
// }



import { useState, useEffect, useCallback } from 'react';

// WebSocket connection status
export type ConnectionStatus = 'connecting' | 'open' | 'closed' | 'error';

// Define the different message types we'll receive from the server
export type WebSocketMessage =
  | { type: 'batteries', data: any[] }
  | { type: 'battery_update', data: { battery: any, history: any } }
  | { type: 'recommendation', data: any };

/**
 * Custom hook for WebSocket connections
 * Provides realtime updates for battery data
 */
export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  // Connect to the WebSocket server
  useEffect(() => {
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

        // Apply dramatic cycle count changes directly in the frontend
        if (message.type === 'battery_update' && message.data && message.data.battery) {
          // Clone the battery object to avoid mutation issues
          const dramaticBattery = { ...message.data.battery };

          // Generate a big jump in cycle count (2000-4000 range)
          const direction = Math.random() > 0.5 ? 1 : -1;
          const jumpAmount = Math.floor(Math.random() * 2001) + 2000; // 2000-4000 range

          // Calculate the new cycle count with the dramatic jump
          const originalCycleCount = dramaticBattery.cycleCount;
          let newCycleCount;

          // Ensure we don't go below 0
          if (direction === -1 && originalCycleCount < jumpAmount) {
            newCycleCount = originalCycleCount + jumpAmount; // Add instead if we can't subtract
          } else {
            newCycleCount = originalCycleCount + (direction * jumpAmount);
          }

          // Update the cycle count with the dramatic change
          dramaticBattery.cycleCount = newCycleCount;

          // Log the dramatic change
          console.log(`DRAMATIC CYCLE JUMP: ${originalCycleCount} → ${newCycleCount} (${direction > 0 ? '+' : '-'}${jumpAmount})`);

          // Replace the battery in the message with our dramatic version
          message.data.battery = dramaticBattery;
        }

        console.log('Received WebSocket message:', message);
        setLastMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setStatus('closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('error');
    };

    setSocket(ws);

    // Clean up on unmount
    return () => {
      ws.close();
    };
  }, []);

  // Send a message to the server
  const sendMessage = useCallback((message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message, WebSocket is not open');
    }
  }, [socket]);

  return {
    socket,
    status,
    lastMessage,
    sendMessage
  };
}