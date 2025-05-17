import { NextRequest, NextResponse } from "next/server";
import { memStorage } from "@/lib/db";
import { z } from "zod";
import { insertUsagePatternSchema } from "@/lib/db/schema";

// GET usage pattern for a specific battery
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const batteryId = parseInt(params.id);
    
    if (isNaN(batteryId)) {
      return NextResponse.json(
        { error: "Invalid battery ID format" },
        { status: 400 }
      );
    }
    
    // Check if the battery exists
    const battery = await memStorage.getBattery(batteryId);
    if (!battery) {
      return NextResponse.json(
        { error: "Battery not found" },
        { status: 404 }
      );
    }
    
    const usagePattern = await memStorage.getUsagePattern(batteryId);
    
    if (!usagePattern) {
      return NextResponse.json(
        { error: "Usage pattern not found for this battery" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(usagePattern);
  } catch (error) {
    console.error("Failed to fetch usage pattern:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage pattern" },
      { status: 500 }
    );
  }
}

// POST new or update usage pattern for a battery
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const batteryId = parseInt(params.id);
    
    if (isNaN(batteryId)) {
      return NextResponse.json(
        { error: "Invalid battery ID format" },
        { status: 400 }
      );
    }
    
    // Check if the battery exists
    const battery = await memStorage.getBattery(batteryId);
    if (!battery) {
      return NextResponse.json(
        { error: "Battery not found" },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
    // Ensure the body has the correct battery ID
    const dataWithBatteryId = { ...body, batteryId };
    
    // Validate the request body
    const validatedData = insertUsagePatternSchema.parse(dataWithBatteryId);
    
    // Check if usage pattern already exists
    const existingPattern = await memStorage.getUsagePattern(batteryId);
    
    let result;
    if (existingPattern) {
      // Update existing pattern
      result = await memStorage.updateUsagePattern(existingPattern.id, validatedData);
      return NextResponse.json(result);
    } else {
      // Create new pattern
      result = await memStorage.createUsagePattern(validatedData);
      return NextResponse.json(result, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to create/update usage pattern:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create/update usage pattern" },
      { status: 500 }
    );
  }
}