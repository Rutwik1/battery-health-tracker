import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/store';

// GET /api/batteries - Get all batteries
export async function GET(req: NextRequest) {
  try {
    const batteries = await storage.getBatteries();
    return NextResponse.json(batteries);
  } catch (error) {
    console.error('Error fetching batteries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batteries' },
      { status: 500 }
    );
  }
}

// POST /api/batteries - Create a new battery
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Ensure required fields are present
    if (!body.name || !body.serialNumber || !body.initialCapacity || 
        !body.currentCapacity || !body.healthPercentage || !body.cycleCount || 
        !body.expectedCycles || !body.status || !body.initialDate || !body.degradationRate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Format dates
    if (body.initialDate) {
      body.initialDate = new Date(body.initialDate);
    }
    
    // Set lastUpdated to current date
    body.lastUpdated = new Date();
    
    const newBattery = await storage.createBattery(body);
    return NextResponse.json(newBattery, { status: 201 });
  } catch (error) {
    console.error('Error creating battery:', error);
    return NextResponse.json(
      { error: 'Failed to create battery' },
      { status: 500 }
    );
  }
}