import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/store';

// GET /api/batteries/:id - Get a specific battery
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

    const battery = await storage.getBattery(id);
    if (!battery) {
      return NextResponse.json(
        { error: 'Battery not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(battery);
  } catch (error) {
    console.error(`Error fetching battery ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch battery' },
      { status: 500 }
    );
  }
}

// PATCH /api/batteries/:id - Update a battery
export async function PATCH(
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

    const body = await req.json();
    
    // Format dates if present
    if (body.initialDate) {
      body.initialDate = new Date(body.initialDate);
    }
    
    // Set lastUpdated to current date
    body.lastUpdated = new Date();
    
    const updatedBattery = await storage.updateBattery(id, body);
    if (!updatedBattery) {
      return NextResponse.json(
        { error: 'Battery not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBattery);
  } catch (error) {
    console.error(`Error updating battery ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update battery' },
      { status: 500 }
    );
  }
}

// DELETE /api/batteries/:id - Delete a battery
export async function DELETE(
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

    const deleted = await storage.deleteBattery(id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Battery not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting battery ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete battery' },
      { status: 500 }
    );
  }
}