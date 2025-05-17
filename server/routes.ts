import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer, WebSocket } from 'ws';
import { z } from "zod";
import { 
  insertBatterySchema, 
  insertBatteryHistorySchema,
  insertUsagePatternSchema,
  insertRecommendationSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all batteries
  app.get("/api/batteries", async (req: Request, res: Response) => {
    try {
      const batteries = await storage.getBatteries();
      res.json(batteries);
    } catch (error) {
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
      
      const recommendations = [...batteryRecommendations, ...generalRecommendations];
      
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
        "PATCH /api/recommendations/:id",
        "GET /api/generate-demo-data"
      ]
    });
  });
  
  // Special endpoint to manually generate demo data
  app.get("/api/generate-demo-data", async (_req, res) => {
    try {
      // Import function directly to avoid circular dependency
      const { ensureDemoBatteries } = require('./data-generator');
      await ensureDemoBatteries();
      
      // Get the updated list of batteries
      const batteries = await storage.getBatteries();
      
      res.json({
        message: "Demo data generated successfully",
        batteryCount: batteries.length,
        batteries
      });
    } catch (error) {
      console.error("Error generating demo data:", error);
      res.status(500).json({ message: "Failed to generate demo data", error: String(error) });
    }
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
          // Additional subscription logic can be added here
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
  });
  
  // Setup broadcast function to update all connected clients
  // This will be called from the data generator
  (global as any).broadcastBatteryUpdate = (data: any) => {
    const message = JSON.stringify({
      type: 'battery_update',
      data
    });
    
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };
  
  return httpServer;
}
