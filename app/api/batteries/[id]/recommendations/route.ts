import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/store';

// GET /api/batteries/:id/recommendations - Get recommendations for a specific battery
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

    const recommendations = await storage.getRecommendations(id);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error(`Error fetching recommendations for battery ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

// POST /api/batteries/:id/recommendations - Create a new recommendation for a battery
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
    if (!body.type || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields (type, message)' },
        { status: 400 }
      );
    }
    
    // Set the batteryId from the URL parameter
    body.batteryId = id;
    
    // Set createdAt to current date if not provided
    if (!body.createdAt) {
      body.createdAt = new Date();
    } else {
      body.createdAt = new Date(body.createdAt);
    }
    
    // Set resolved to false by default if not provided
    if (body.resolved === undefined) {
      body.resolved = false;
    }
    
    const recommendation = await storage.createRecommendation(body);
    return NextResponse.json(recommendation, { status: 201 });
  } catch (error) {
    console.error(`Error creating recommendation for battery ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to create recommendation' },
      { status: 500 }
    );
  }
}