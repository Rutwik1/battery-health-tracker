import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/store';

// GET /api/batteries/:id/usage - Get usage pattern for a specific battery
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

    const usagePattern = await storage.getUsagePattern(id);
    if (!usagePattern) {
      return NextResponse.json(
        { error: 'Usage pattern not found for this battery' },
        { status: 404 }
      );
    }

    return NextResponse.json(usagePattern);
  } catch (error) {
    console.error(`Error fetching usage pattern for battery ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch usage pattern' },
      { status: 500 }
    );
  }
}

// POST /api/batteries/:id/usage - Create or update usage pattern for a battery
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
    if (
      !body.chargingFrequency ||
      !body.dischargeDepth ||
      !body.temperatureExposure ||
      !body.usageType ||
      !body.environmentalConditions ||
      body.fastChargingPercentage === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Set the batteryId from the URL parameter
    body.batteryId = id;
    
    // Check if a usage pattern already exists for this battery
    const existingPattern = await storage.getUsagePattern(id);
    
    let usagePattern;
    if (existingPattern) {
      // Update existing pattern
      usagePattern = await storage.updateUsagePattern(existingPattern.id, body);
    } else {
      // Create new pattern
      usagePattern = await storage.createUsagePattern(body);
    }
    
    return NextResponse.json(usagePattern, { status: 201 });
  } catch (error) {
    console.error(`Error creating/updating usage pattern for battery ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to save usage pattern' },
      { status: 500 }
    );
  }
}