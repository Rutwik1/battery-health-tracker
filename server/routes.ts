// import type { Express, Request, Response } from "express";
// import { createServer, type Server } from "http";
// import { storage } from "./storage";
// import { WebSocketServer, WebSocket } from 'ws';
// import { z } from "zod";
// import { supabase } from "./supabase";
// import {
//   insertBatterySchema,
//   insertBatteryHistorySchema,
//   insertUsagePatternSchema,
//   insertRecommendationSchema
// } from '../shared/schema';

// export async function registerRoutes(app: Express): Promise<Server> {
//   // Helper function to determine battery status based on health percentage
//   function getHealthStatus(healthPercentage: number): string {
//     if (healthPercentage >= 90) return "Excellent";
//     if (healthPercentage >= 80) return "Good";
//     if (healthPercentage >= 70) return "Fair";
//     return "Poor";
//   }

//   // Get all batteries
//   app.get("/api/batteries", async (req: Request, res: Response) => {
//     try {

//       // HARDCODED RESPONSE - Force all 4 batteries to appear on dashboard
//       const batteries = [
//         {
//           id: 1,
//           name: "Battery #1",
//           serialNumber: "BAT-001",
//           initialCapacity: 4000,
//           currentCapacity: 3800,
//           healthPercentage: 95,
//           cycleCount: 112,
//           expectedCycles: 1000,
//           status: "Excellent",
//           initialDate: "2023-05-12T00:00:00.000Z",
//           lastUpdated: new Date().toISOString(),
//           degradationRate: 0.5,
//           userId: null
//         },
//         {
//           id: 2,
//           name: "Battery #2",
//           serialNumber: "BAT-002",
//           initialCapacity: 4000,
//           currentCapacity: 3500,
//           healthPercentage: 87,
//           cycleCount: 320,
//           expectedCycles: 1000,
//           status: "Good",
//           initialDate: "2023-03-24T00:00:00.000Z",
//           lastUpdated: new Date().toISOString(),
//           degradationRate: 0.7,
//           userId: null
//         },
//         {
//           id: 3,
//           name: "Battery #3",
//           serialNumber: "BAT-003",
//           initialCapacity: 4000,
//           currentCapacity: 2900,
//           healthPercentage: 72,
//           cycleCount: 520,
//           expectedCycles: 1000,
//           status: "Fair",
//           initialDate: "2022-10-18T00:00:00.000Z",
//           lastUpdated: new Date().toISOString(),
//           degradationRate: 1.3,
//           userId: null
//         },
//         {
//           id: 4,
//           name: "Battery #4",
//           serialNumber: "BAT-004",
//           initialCapacity: 4000,
//           currentCapacity: 2300,
//           healthPercentage: 57,
//           cycleCount: 880,
//           expectedCycles: 1000,
//           status: "Poor",
//           initialDate: "2021-11-05T00:00:00.000Z",
//           lastUpdated: new Date().toISOString(),
//           degradationRate: 2.1,
//           userId: null
//         }
//       ];

//       // Still update the database for consistency
//       try {
//         const { data, error } = await supabase
//           .from('batteries')
//           .select('*')
//           .order('id', { ascending: true });

//         if (!error && data && data.length > 0) {
//           console.log(`Found ${data.length} batteries in database`);

//           // Merge any realtime data with our fixed response
//           data.forEach((dbBattery: any) => {
//             const matchingBattery = batteries.find(b => b.id === dbBattery.id);
//             if (matchingBattery) {
//               // Update with latest data from DB
//               matchingBattery.currentCapacity = dbBattery.current_capacity;
//               matchingBattery.healthPercentage = dbBattery.health_percentage;
//               matchingBattery.cycleCount = dbBattery.cycle_count;
//               matchingBattery.lastUpdated = dbBattery.last_updated;

//               // Update status based on health percentage using our helper function
//               matchingBattery.status = getHealthStatus(matchingBattery.healthPercentage);
//             }
//           });
//         }
//       } catch (dbError) {
//         console.log('Error getting DB data, using hardcoded values only');
//       }

//       res.json(batteries);
//     } catch (error) {
//       console.error('Error in GET /api/batteries:', error);
//       res.status(500).json({ message: "Failed to fetch batteries" });
//     }
//   });

//   // Get a single battery by ID
//   app.get("/api/batteries/:id", async (req: Request, res: Response) => {
//     try {
//       const id = parseInt(req.params.id);
//       if (isNaN(id)) {
//         return res.status(400).json({ message: "Invalid battery ID" });
//       }

//       const battery = await storage.getBattery(id);
//       if (!battery) {
//         return res.status(404).json({ message: "Battery not found" });
//       }

//       res.json(battery);
//     } catch (error) {
//       res.status(500).json({ message: "Failed to fetch battery" });
//     }
//   });

//   // Create a new battery
//   app.post("/api/batteries", async (req: Request, res: Response) => {
//     try {
//       // Convert ISO date strings to Date objects before validation
//       const requestData = {
//         ...req.body,
//         initialDate: req.body.initialDate ? new Date(req.body.initialDate) : undefined,
//         lastUpdated: req.body.lastUpdated ? new Date(req.body.lastUpdated) : new Date()
//       };

//       console.log('Processing battery data:', requestData);

//       // Validate the processed data
//       const validatedData = insertBatterySchema.parse(requestData);
//       const battery = await storage.createBattery(validatedData);
//       res.status(201).json(battery);
//     } catch (error) {
//       console.error('Error creating battery:', error);
//       if (error instanceof z.ZodError) {
//         return res.status(400).json({ message: "Invalid battery data", errors: error.errors });
//       }
//       res.status(500).json({ message: "Failed to create battery" });
//     }
//   });

//   // Update a battery
//   app.patch("/api/batteries/:id", async (req: Request, res: Response) => {
//     try {
//       const id = parseInt(req.params.id);
//       if (isNaN(id)) {
//         return res.status(400).json({ message: "Invalid battery ID" });
//       }

//       // Partial validation of the update data
//       const validatedData = insertBatterySchema.partial().parse(req.body);

//       const updatedBattery = await storage.updateBattery(id, validatedData);
//       if (!updatedBattery) {
//         return res.status(404).json({ message: "Battery not found" });
//       }

//       res.json(updatedBattery);
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return res.status(400).json({ message: "Invalid battery data", errors: error.errors });
//       }
//       res.status(500).json({ message: "Failed to update battery" });
//     }
//   });

//   // Delete a battery
//   app.delete("/api/batteries/:id", async (req: Request, res: Response) => {
//     try {
//       const id = parseInt(req.params.id);
//       if (isNaN(id)) {
//         return res.status(400).json({ message: "Invalid battery ID" });
//       }

//       const success = await storage.deleteBattery(id);
//       if (!success) {
//         return res.status(404).json({ message: "Battery not found" });
//       }

//       res.status(204).end();
//     } catch (error) {
//       res.status(500).json({ message: "Failed to delete battery" });
//     }
//   });

//   // Get battery history
//   app.get("/api/batteries/:id/history", async (req: Request, res: Response) => {
//     try {
//       const id = parseInt(req.params.id);
//       if (isNaN(id)) {
//         return res.status(400).json({ message: "Invalid battery ID" });
//       }

//       const { startDate, endDate } = req.query;

//       let batteryHistory;
//       if (startDate && endDate) {
//         const start = new Date(startDate as string);
//         const end = new Date(endDate as string);

//         if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//           return res.status(400).json({ message: "Invalid date format" });
//         }

//         batteryHistory = await storage.getBatteryHistoryFiltered(id, start, end);
//       } else {
//         batteryHistory = await storage.getBatteryHistory(id);
//       }

//       res.json(batteryHistory);
//     } catch (error) {
//       res.status(500).json({ message: "Failed to fetch battery history" });
//     }
//   });

//   // Add battery history
//   app.post("/api/batteries/:id/history", async (req: Request, res: Response) => {
//     try {
//       const batteryId = parseInt(req.params.id);
//       if (isNaN(batteryId)) {
//         return res.status(400).json({ message: "Invalid battery ID" });
//       }

//       // Check if battery exists
//       const battery = await storage.getBattery(batteryId);
//       if (!battery) {
//         return res.status(404).json({ message: "Battery not found" });
//       }

//       // Ensure the batteryId in the body matches the URL parameter
//       const data = { ...req.body, batteryId };

//       const validatedData = insertBatteryHistorySchema.parse(data);
//       const history = await storage.createBatteryHistory(validatedData);

//       res.status(201).json(history);
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return res.status(400).json({ message: "Invalid history data", errors: error.errors });
//       }
//       res.status(500).json({ message: "Failed to create battery history" });
//     }
//   });

//   // Get usage pattern for a battery
//   app.get("/api/batteries/:id/usage", async (req: Request, res: Response) => {
//     try {
//       const id = parseInt(req.params.id);
//       if (isNaN(id)) {
//         return res.status(400).json({ message: "Invalid battery ID" });
//       }

//       const usagePattern = await storage.getUsagePattern(id);
//       if (!usagePattern) {
//         return res.status(404).json({ message: "Usage pattern not found" });
//       }

//       res.json(usagePattern);
//     } catch (error) {
//       res.status(500).json({ message: "Failed to fetch usage pattern" });
//     }
//   });

//   // Create or update usage pattern
//   app.post("/api/batteries/:id/usage", async (req: Request, res: Response) => {
//     try {
//       const batteryId = parseInt(req.params.id);
//       if (isNaN(batteryId)) {
//         return res.status(400).json({ message: "Invalid battery ID" });
//       }

//       // Check if battery exists
//       const battery = await storage.getBattery(batteryId);
//       if (!battery) {
//         return res.status(404).json({ message: "Battery not found" });
//       }

//       // Check if usage pattern already exists
//       const existingPattern = await storage.getUsagePattern(batteryId);

//       // Ensure the batteryId in the body matches the URL parameter
//       const data = { ...req.body, batteryId };

//       if (existingPattern) {
//         // Update existing pattern
//         const validatedData = insertUsagePatternSchema.partial().parse(data);
//         const updatedPattern = await storage.updateUsagePattern(existingPattern.id, validatedData);
//         return res.json(updatedPattern);
//       } else {
//         // Create new pattern
//         const validatedData = insertUsagePatternSchema.parse(data);
//         const pattern = await storage.createUsagePattern(validatedData);
//         return res.status(201).json(pattern);
//       }
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return res.status(400).json({ message: "Invalid usage pattern data", errors: error.errors });
//       }
//       res.status(500).json({ message: "Failed to create/update usage pattern" });
//     }
//   });

//   // Get recommendations for a battery
//   app.get("/api/batteries/:id/recommendations", async (req: Request, res: Response) => {
//     try {
//       const id = parseInt(req.params.id);
//       if (isNaN(id)) {
//         return res.status(400).json({ message: "Invalid battery ID" });
//       }

//       // Get recommendations specific to this battery and general recommendations (batteryId = 0)
//       const batteryRecommendations = await storage.getRecommendations(id);
//       const generalRecommendations = await storage.getRecommendations(0);

//       // Combine battery-specific and general recommendations
//       let recommendations = [...batteryRecommendations, ...generalRecommendations];

//       // Sort recommendations with most recent first
//       recommendations = recommendations.sort((a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//       );

//       // Limit to a maximum of 3 recommendations
//       if (recommendations.length > 3) {
//         recommendations = recommendations.slice(0, 3);
//       }

//       res.json(recommendations);
//     } catch (error) {
//       res.status(500).json({ message: "Failed to fetch recommendations" });
//     }
//   });

//   // Create a recommendation
//   app.post("/api/recommendations", async (req: Request, res: Response) => {
//     try {
//       const validatedData = insertRecommendationSchema.parse(req.body);

//       // If batteryId is provided, check if the battery exists
//       if (validatedData.batteryId !== 0) {
//         const battery = await storage.getBattery(validatedData.batteryId);
//         if (!battery) {
//           return res.status(404).json({ message: "Battery not found" });
//         }
//       }

//       const recommendation = await storage.createRecommendation(validatedData);
//       res.status(201).json(recommendation);
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return res.status(400).json({ message: "Invalid recommendation data", errors: error.errors });
//       }
//       res.status(500).json({ message: "Failed to create recommendation" });
//     }
//   });

//   // Update a recommendation (mark as resolved)
//   app.patch("/api/recommendations/:id", async (req: Request, res: Response) => {
//     try {
//       const id = parseInt(req.params.id);
//       if (isNaN(id)) {
//         return res.status(400).json({ message: "Invalid recommendation ID" });
//       }

//       const { resolved } = req.body;
//       if (typeof resolved !== 'boolean') {
//         return res.status(400).json({ message: "Resolved status must be a boolean" });
//       }

//       const updatedRecommendation = await storage.updateRecommendation(id, resolved);
//       if (!updatedRecommendation) {
//         return res.status(404).json({ message: "Recommendation not found" });
//       }

//       res.json(updatedRecommendation);
//     } catch (error) {
//       res.status(500).json({ message: "Failed to update recommendation" });
//     }
//   });

//   // Return all the endpoints for testing purposes
//   app.get("/api", (_req, res) => {
//     res.json({
//       message: "Battery Health Visualization Dashboard API",
//       endpoints: [
//         "GET /api/batteries",
//         "GET /api/batteries/:id",
//         "POST /api/batteries",
//         "PATCH /api/batteries/:id",
//         "DELETE /api/batteries/:id",
//         "GET /api/batteries/:id/history",
//         "POST /api/batteries/:id/history",
//         "GET /api/batteries/:id/usage",
//         "POST /api/batteries/:id/usage",
//         "GET /api/batteries/:id/recommendations",
//         "POST /api/recommendations",
//         "PATCH /api/recommendations/:id"
//       ]
//     });
//   });

//   const httpServer = createServer(app);

//   // Set up WebSocket server for realtime updates
//   const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

//   // Keep track of connected clients
//   const clients = new Set<WebSocket>();

//   wss.on('connection', (ws) => {
//     console.log('WebSocket client connected');
//     clients.add(ws);

//     // Send initial data to the client
//     storage.getBatteries()
//       .then(batteries => {
//         if (ws.readyState === WebSocket.OPEN) {
//           ws.send(JSON.stringify({
//             type: 'batteries',
//             data: batteries
//           }));
//         }
//       })
//       .catch(err => console.error('Error sending initial battery data:', err));

//     // Handle client disconnect
//     ws.on('close', () => {
//       console.log('WebSocket client disconnected');
//       clients.delete(ws);
//     });

//     // Handle messages from client
//     ws.on('message', (message) => {
//       try {
//         const data = JSON.parse(message.toString());
//         console.log('Received message:', data);

//         // Handle subscription requests
//         if (data.type === 'subscribe' && data.entity) {
//           console.log(`Client subscribed to ${data.entity} updates`);
//           // Additional subscription logic can be added here
//         }
//       } catch (error) {
//         console.error('Error processing WebSocket message:', error);
//       }
//     });
//   });

//   // Setup broadcast function to update all connected clients
//   // This will be called from the data generator
//   (global as any).broadcastBatteryUpdate = (data: any) => {
//     const message = JSON.stringify({
//       type: 'battery_update',
//       data
//     });

//     clients.forEach(client => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   };

//   return httpServer;
// }






// new code for deply 


import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer, WebSocket } from 'ws';
import { z } from "zod";
import { supabase } from "./supabase";
import {
  insertBatterySchema,
  insertBatteryHistorySchema,
  insertUsagePatternSchema,
  insertRecommendationSchema
} from '../shared/schema';

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to determine battery status based on health percentage
  function getHealthStatus(healthPercentage: number): string {
    if (healthPercentage >= 90) return "Excellent";
    if (healthPercentage >= 80) return "Good";
    if (healthPercentage >= 70) return "Fair";
    return "Poor";
  }

  // Get all batteries
  app.get("/api/batteries", async (req: Request, res: Response) => {
    try {
      // Get actual batteries from storage
      const batteries = await storage.getBatteries();
      console.log(`Found ${batteries.length} batteries in database`);

      // Make sure each battery has the correct status based on health percentage
      for (const battery of batteries) {
        battery.status = getHealthStatus(battery.healthPercentage);
      }

      res.json(batteries);
    } catch (error) {
      console.error('Error in GET /api/batteries:', error);
      res.status(500).json({ message: "Failed to fetch batteries" });
    }
  });

  // Get a single battery by ID
  app.get("/api/batteries/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid battery ID" });
      }

      const battery = await storage.getBattery(id);
      if (!battery) {
        return res.status(404).json({ message: "Battery not found" });
      }

      res.json(battery);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch battery" });
    }
  });

  // Create a new battery
  app.post("/api/batteries", async (req: Request, res: Response) => {
    try {
      // Convert ISO date strings to Date objects before validation
      const requestData = {
        ...req.body,
        initialDate: req.body.initialDate ? new Date(req.body.initialDate) : undefined,
        lastUpdated: req.body.lastUpdated ? new Date(req.body.lastUpdated) : new Date()
      };

      console.log('Processing battery data:', requestData);

      // Validate the processed data
      const validatedData = insertBatterySchema.parse(requestData);
      const battery = await storage.createBattery(validatedData);
      res.status(201).json(battery);
    } catch (error) {
      console.error('Error creating battery:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid battery data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create battery" });
    }
  });

  // Update a battery
  app.patch("/api/batteries/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid battery ID" });
      }

      // Partial validation of the update data
      const validatedData = insertBatterySchema.partial().parse(req.body);

      const updatedBattery = await storage.updateBattery(id, validatedData);
      if (!updatedBattery) {
        return res.status(404).json({ message: "Battery not found" });
      }

      res.json(updatedBattery);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid battery data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update battery" });
    }
  });

  // Delete a battery
  app.delete("/api/batteries/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid battery ID" });
      }

      const success = await storage.deleteBattery(id);
      if (!success) {
        return res.status(404).json({ message: "Battery not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete battery" });
    }
  });

  // Get battery history
  app.get("/api/batteries/:id/history", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid battery ID" });
      }

      const { startDate, endDate } = req.query;

      let batteryHistory;
      if (startDate && endDate) {
        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          return res.status(400).json({ message: "Invalid date format" });
        }

        batteryHistory = await storage.getBatteryHistoryFiltered(id, start, end);
      } else {
        batteryHistory = await storage.getBatteryHistory(id);
      }

      res.json(batteryHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch battery history" });
    }
  });

  // Add battery history
  app.post("/api/batteries/:id/history", async (req: Request, res: Response) => {
    try {
      const batteryId = parseInt(req.params.id);
      if (isNaN(batteryId)) {
        return res.status(400).json({ message: "Invalid battery ID" });
      }

      // Check if battery exists
      const battery = await storage.getBattery(batteryId);
      if (!battery) {
        return res.status(404).json({ message: "Battery not found" });
      }

      // Ensure the batteryId in the body matches the URL parameter
      const data = { ...req.body, batteryId };

      const validatedData = insertBatteryHistorySchema.parse(data);
      const history = await storage.createBatteryHistory(validatedData);

      res.status(201).json(history);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid history data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create battery history" });
    }
  });

  // Get usage pattern for a battery
  app.get("/api/batteries/:id/usage", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid battery ID" });
      }

      const usagePattern = await storage.getUsagePattern(id);
      if (!usagePattern) {
        return res.status(404).json({ message: "Usage pattern not found" });
      }

      res.json(usagePattern);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch usage pattern" });
    }
  });

  // Create or update usage pattern
  app.post("/api/batteries/:id/usage", async (req: Request, res: Response) => {
    try {
      const batteryId = parseInt(req.params.id);
      if (isNaN(batteryId)) {
        return res.status(400).json({ message: "Invalid battery ID" });
      }

      // Check if battery exists
      const battery = await storage.getBattery(batteryId);
      if (!battery) {
        return res.status(404).json({ message: "Battery not found" });
      }

      // Check if usage pattern already exists
      const existingPattern = await storage.getUsagePattern(batteryId);

      // Ensure the batteryId in the body matches the URL parameter
      const data = { ...req.body, batteryId };

      if (existingPattern) {
        // Update existing pattern
        const validatedData = insertUsagePatternSchema.partial().parse(data);
        const updatedPattern = await storage.updateUsagePattern(existingPattern.id, validatedData);
        return res.json(updatedPattern);
      } else {
        // Create new pattern
        const validatedData = insertUsagePatternSchema.parse(data);
        const pattern = await storage.createUsagePattern(validatedData);
        return res.status(201).json(pattern);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid usage pattern data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create/update usage pattern" });
    }
  });

  // Get recommendations for a battery
  app.get("/api/batteries/:id/recommendations", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid battery ID" });
      }

      // Get recommendations specific to this battery and general recommendations (batteryId = 0)
      const batteryRecommendations = await storage.getRecommendations(id);
      const generalRecommendations = await storage.getRecommendations(0);

      // Combine battery-specific and general recommendations
      let recommendations = [...batteryRecommendations, ...generalRecommendations];

      // Sort recommendations with most recent first
      recommendations = recommendations.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Limit to a maximum of 3 recommendations
      if (recommendations.length > 3) {
        recommendations = recommendations.slice(0, 3);
      }

      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  // Create a recommendation
  app.post("/api/recommendations", async (req: Request, res: Response) => {
    try {
      const validatedData = insertRecommendationSchema.parse(req.body);

      // If batteryId is provided, check if the battery exists
      if (validatedData.batteryId !== 0) {
        const battery = await storage.getBattery(validatedData.batteryId);
        if (!battery) {
          return res.status(404).json({ message: "Battery not found" });
        }
      }

      const recommendation = await storage.createRecommendation(validatedData);
      res.status(201).json(recommendation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recommendation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create recommendation" });
    }
  });

  // Update a recommendation (mark as resolved)
  app.patch("/api/recommendations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid recommendation ID" });
      }

      const { resolved } = req.body;
      if (typeof resolved !== 'boolean') {
        return res.status(400).json({ message: "Resolved status must be a boolean" });
      }

      const updatedRecommendation = await storage.updateRecommendation(id, resolved);
      if (!updatedRecommendation) {
        return res.status(404).json({ message: "Recommendation not found" });
      }

      res.json(updatedRecommendation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update recommendation" });
    }
  });

  // Return all the endpoints for testing purposes
  app.get("/api", (_req, res) => {
    res.json({
      message: "Battery Health Visualization Dashboard API",
      endpoints: [
        "GET /api/batteries",
        "GET /api/batteries/:id",
        "POST /api/batteries",
        "PATCH /api/batteries/:id",
        "DELETE /api/batteries/:id",
        "GET /api/batteries/:id/history",
        "POST /api/batteries/:id/history",
        "GET /api/batteries/:id/usage",
        "POST /api/batteries/:id/usage",
        "GET /api/batteries/:id/recommendations",
        "POST /api/recommendations",
        "PATCH /api/recommendations/:id"
      ]
    });
  });

  const httpServer = createServer(app);

  // Set up WebSocket server for realtime updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Keep track of connected clients
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    clients.add(ws);

    // Send initial data to the client
    storage.getBatteries()
      .then(batteries => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'batteries',
            data: batteries
          }));
        }
      })
      .catch(err => console.error('Error sending initial battery data:', err));

    // Handle client disconnect
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clients.delete(ws);
    });

    // Handle messages from client
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);

        // Handle subscription requests
        if (data.type === 'subscribe' && data.entity) {
          console.log(`Client subscribed to ${data.entity} updates`);
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });
  });

  // Export the broadcast function for use by other modules
  // This allows real-time updates to be pushed to all connected clients
  (global as any).broadcastBatteryUpdate = function (battery: any, history: any) {
    const message = JSON.stringify({
      type: 'battery_update',
      data: { battery, history }
    });

    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Set up a ping interval to keep connections alive
  setInterval(() => {
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'pong' }));
      }
    });
  }, 30000); // Send ping every 30 seconds

  return httpServer;
}