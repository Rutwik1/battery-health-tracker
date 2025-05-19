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
} from "../shared/schema";

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
      // Get all batteries from database
      const { data: dbBatteries, error } = await supabase
        .from('batteries')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Database error fetching batteries:', error);
        throw new Error('Failed to fetch batteries from database');
      }

      // Log all batteries in database for debugging
      console.log('All batteries in database:', dbBatteries.map(b => b.id));

      // Default batteries if we need them (for initial setup)
      const defaultBatteries = [
        {
          id: 1,
          name: "Battery #1",
          serialNumber: "BAT-001",
          initialCapacity: 4000,
          currentCapacity: 3800,
          healthPercentage: 95,
          cycleCount: 112,
          expectedCycles: 1000,
          status: "Excellent",
          initialDate: "2023-05-12T00:00:00.000Z",
          lastUpdated: new Date().toISOString(),
          degradationRate: 0.5,
          userId: null
        },
        {
          id: 2,
          name: "Battery #2",
          serialNumber: "BAT-002",
          initialCapacity: 4000,
          currentCapacity: 3500,
          healthPercentage: 87,
          cycleCount: 320,
          expectedCycles: 1000,
          status: "Good",
          initialDate: "2023-03-24T00:00:00.000Z",
          lastUpdated: new Date().toISOString(),
          degradationRate: 0.7,
          userId: null
        },
        {
          id: 3,
          name: "Battery #3",
          serialNumber: "BAT-003",
          initialCapacity: 4000,
          currentCapacity: 2900,
          healthPercentage: 72,
          cycleCount: 520,
          expectedCycles: 1000,
          status: "Fair",
          initialDate: "2022-10-18T00:00:00.000Z",
          lastUpdated: new Date().toISOString(),
          degradationRate: 1.3,
          userId: null
        },
        {
          id: 4,
          name: "Battery #4",
          serialNumber: "BAT-004",
          initialCapacity: 4000,
          currentCapacity: 2300,
          healthPercentage: 57,
          cycleCount: 880,
          expectedCycles: 1000,
          status: "Poor",
          initialDate: "2021-11-05T00:00:00.000Z",
          lastUpdated: new Date().toISOString(),
          degradationRate: 2.1,
          userId: null
        }
      ];

      // Create an array to hold formatted results
      const resultBatteries = [];

      // Check if we have at least some batteries in the database
      if (dbBatteries && dbBatteries.length > 0) {
        console.log(`Found ${dbBatteries.length} batteries in database`);

        // Process all batteries from the database and format them for frontend
        for (const dbBattery of dbBatteries) {
          resultBatteries.push({
            id: dbBattery.id,
            name: dbBattery.name,
            serialNumber: dbBattery.serial_number,
            initialCapacity: dbBattery.initial_capacity,
            currentCapacity: dbBattery.current_capacity,
            healthPercentage: dbBattery.health_percentage,
            cycleCount: dbBattery.cycle_count,
            expectedCycles: dbBattery.expected_cycles,
            status: getHealthStatus(dbBattery.health_percentage),
            initialDate: dbBattery.initial_date,
            lastUpdated: dbBattery.last_updated,
            degradationRate: dbBattery.degradation_rate,
            userId: dbBattery.user_id
          });
        }
      } else {
        // Database is empty, insert default batteries
        console.log('No batteries found in database. Creating defaults...');
        for (const battery of defaultBatteries) {
          await supabase.from('batteries').upsert({
            id: battery.id,
            name: battery.name,
            serial_number: battery.serialNumber,
            initial_capacity: battery.initialCapacity,
            current_capacity: battery.currentCapacity,
            health_percentage: battery.healthPercentage,
            cycle_count: battery.cycleCount,
            expected_cycles: battery.expectedCycles,
            status: battery.status,
            initial_date: battery.initialDate,
            last_updated: battery.lastUpdated,
            degradation_rate: battery.degradationRate
          }, { onConflict: 'id' });

          resultBatteries.push(battery);
        }
      }

      // Verify we have batteries before returning
      console.log(`Returning ${resultBatteries.length} batteries to client`);

      // Send the formatted batteries to the client
      res.json(resultBatteries);
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

      // Get battery from Supabase database
      const { data, error } = await supabase
        .from('batteries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return res.status(404).json({ message: "Battery not found" });
      }

      // Format battery response
      const battery = {
        id: data.id,
        name: data.name,
        serialNumber: data.serial_number,
        initialCapacity: data.initial_capacity,
        currentCapacity: data.current_capacity,
        healthPercentage: data.health_percentage,
        cycleCount: data.cycle_count,
        expectedCycles: data.expected_cycles,
        status: getHealthStatus(data.health_percentage),
        initialDate: data.initial_date,
        lastUpdated: data.last_updated,
        degradationRate: data.degradation_rate
      };

      res.json(battery);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch battery" });
    }
  });

  // Create a new battery
  app.post("/api/batteries", async (req: Request, res: Response) => {
    try {
      // Get the next available battery ID
      const { data: existingBatteries, error: queryError } = await supabase
        .from('batteries')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      if (queryError) {
        console.error('Error querying batteries:', queryError);
        throw new Error('Failed to determine next battery ID');
      }

      // Calculate next ID (one higher than highest, or 5 if no batteries exist)
      const nextId = existingBatteries && existingBatteries.length > 0
        ? existingBatteries[0].id + 1
        : 5;

      console.log(`Using next battery ID: ${nextId}`);

      // Prepare dates in ISO format
      const now = new Date().toISOString();
      let initialDateStr = req.body.initialDate || now;

      try {
        // Ensure initialDate is a valid date
        const testDate = new Date(initialDateStr);
        if (isNaN(testDate.getTime())) {
          initialDateStr = now;
        }
      } catch (err) {
        console.error("Error with date format:", err);
        initialDateStr = now;
      }

      // Insert directly into Supabase with next ID
      const { data, error } = await supabase.from('batteries').insert({
        id: nextId,
        name: req.body.name,
        serial_number: req.body.serialNumber,
        initial_capacity: req.body.initialCapacity,
        current_capacity: req.body.currentCapacity,
        health_percentage: req.body.healthPercentage,
        cycle_count: req.body.cycleCount,
        expected_cycles: req.body.expectedCycles || 1000,
        status: getHealthStatus(req.body.healthPercentage),
        initial_date: initialDateStr,
        last_updated: now,
        degradation_rate: req.body.degradationRate || 0.5
      }).select('*').single();

      if (error) {
        console.error('Error inserting battery into database:', error);
        throw new Error('Failed to insert battery into database');
      }

      // Format the response to match the client's expected format
      const newBattery = {
        id: data.id,
        name: data.name,
        serialNumber: data.serial_number,
        initialCapacity: data.initial_capacity,
        currentCapacity: data.current_capacity,
        healthPercentage: data.health_percentage,
        cycleCount: data.cycle_count,
        expectedCycles: data.expected_cycles,
        status: getHealthStatus(data.health_percentage),
        initialDate: data.initial_date,
        lastUpdated: data.last_updated,
        degradationRate: data.degradation_rate
      };

      console.log('Successfully created new battery:', newBattery);

      // Broadcast to WebSocket clients
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'battery_added',
            data: newBattery
          }));
        }
      });

      return res.status(201).json(newBattery);
    } catch (error) {
      console.error('Error creating battery:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid battery data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create battery" });
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
  const clients: WebSocket[] = [];

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    clients.push(ws);

    // Send initial data to the client
    const fetchBatteries = async () => {
      try {
        // Get all batteries from database
        const { data: dbBatteries, error } = await supabase
          .from('batteries')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          console.error('Database error fetching batteries for WS:', error);
          return;
        }

        // Format batteries for frontend
        const formattedBatteries = dbBatteries.map(dbBattery => ({
          id: dbBattery.id,
          name: dbBattery.name,
          serialNumber: dbBattery.serial_number,
          initialCapacity: dbBattery.initial_capacity,
          currentCapacity: dbBattery.current_capacity,
          healthPercentage: dbBattery.health_percentage,
          cycleCount: dbBattery.cycle_count,
          expectedCycles: dbBattery.expected_cycles,
          status: getHealthStatus(dbBattery.health_percentage),
          initialDate: dbBattery.initial_date,
          lastUpdated: dbBattery.last_updated,
          degradationRate: dbBattery.degradation_rate,
          userId: dbBattery.user_id
        }));

        if (ws.readyState === WebSocket.OPEN) {
          console.log(`Sending ${formattedBatteries.length} batteries to WS client`);
          ws.send(JSON.stringify({
            type: 'batteries',
            data: formattedBatteries
          }));
        }
      } catch (err) {
        console.error('Error sending initial battery data:', err);
      }
    };

    // Send initial data
    fetchBatteries();

    // Handle client disconnect
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      const index = clients.indexOf(ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
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
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    });
  });

  return httpServer;
}