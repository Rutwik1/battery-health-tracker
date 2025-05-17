import { NextRequest, NextResponse } from "next/server";
import { memStorage } from "@/lib/db";
import { z } from "zod";
import { insertBatterySchema } from "@/lib/db/schema";

// GET a single battery by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }
    
    const battery = await memStorage.getBattery(id);
    
    if (!battery) {
      return NextResponse.json(
        { error: "Battery not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(battery);
  } catch (error) {
    console.error("Failed to fetch battery:", error);
    return NextResponse.json(
      { error: "Failed to fetch battery" },
      { status: 500 }
    );
  }
}

// PATCH (update) a battery
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Partial validation of the update data
    const updateSchema = insertBatterySchema.partial();
    const validatedData = updateSchema.parse(body);
    
    const updatedBattery = await memStorage.updateBattery(id, validatedData);
    
    if (!updatedBattery) {
      return NextResponse.json(
        { error: "Battery not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedBattery);
  } catch (error) {
    console.error("Failed to update battery:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update battery" },
      { status: 500 }
    );
  }
}

// DELETE a battery
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }
    
    const success = await memStorage.deleteBattery(id);
    
    if (!success) {
      return NextResponse.json(
        { error: "Battery not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete battery:", error);
    return NextResponse.json(
      { error: "Failed to delete battery" },
      { status: 500 }
    );
  }
}