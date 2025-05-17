import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/store';

// GET /api/batteries/:id/history - Get history for a specific battery
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid battery ID' },
        { status: 400 }
      );
    }

    // Check if start and end dates are provided
    const searchParams = req.nextUrl.searchParams;
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');

    let history;
    if (startDateStr && endDateStr) {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      history = await storage.getBatteryHistoryFiltered(id, startDate, endDate);
    } else {
      history = await storage.getBatteryHistory(id);
    }

    return NextResponse.json(history);
  } catch (error) {
    console.error(`Error fetching history for battery ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch battery history' },
      { status: 500 }
    );
  }
}

// POST /api/batteries/:id/history - Create new history entry for a battery
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid battery ID' },
        { status: 400 }
      );
    }

    // Check if battery exists
    const battery = await storage.getBattery(id);
    if (!battery) {
      return NextResponse.json(
        { error: 'Battery not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    
    // Validate required fields
    if (!body.capacity || !body.healthPercentage || !body.cycleCount) {
      return NextResponse.json(
        { error: 'Missing required fields (capacity, healthPercentage, cycleCount)' },
        { status: 400 }
      );
    }
    
    // Set the batteryId from the URL parameter
    body.batteryId = id;
    
    // Set date to current if not provided
    if (!body.date) {
      body.date = new Date();
    } else {
      body.date = new Date(body.date);
    }
    
    const historyEntry = await storage.createBatteryHistory(body);
    
    // Update the battery's current status too
    await storage.updateBattery(id, {
      currentCapacity: body.capacity,
      healthPercentage: body.healthPercentage,
      cycleCount: body.cycleCount,
      lastUpdated: new Date()
    });
    
    return NextResponse.json(historyEntry, { status: 201 });
  } catch (error) {
    console.error(`Error creating history for battery ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to create battery history entry' },
      { status: 500 }
    );
  }
}