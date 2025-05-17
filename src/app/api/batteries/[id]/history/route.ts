import { NextRequest, NextResponse } from "next/server";
import { memStorage } from "@/lib/db";
import { z } from "zod";
import { insertBatteryHistorySchema } from "@/lib/db/schema";

// GET battery history
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
    
    // Check for date filters in the URL params
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    
    let history;
    if (startDateParam && endDateParam) {
      // If both dates are provided, use filtered history
      const startDate = new Date(startDateParam);
      const endDate = new Date(endDateParam);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format" },
          { status: 400 }
        );
      }
      
      history = await memStorage.getBatteryHistoryFiltered(batteryId, startDate, endDate);
    } else {
      // Otherwise get all history
      history = await memStorage.getBatteryHistory(batteryId);
    }
    
    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to fetch battery history:", error);
    return NextResponse.json(
      { error: "Failed to fetch battery history" },
      { status: 500 }
    );
  }
}

// POST new battery history entry
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
    const validatedData = insertBatteryHistorySchema.parse(dataWithBatteryId);
    
    const newHistory = await memStorage.createBatteryHistory(validatedData);
    return NextResponse.json(newHistory, { status: 201 });
  } catch (error) {
    console.error("Failed to create battery history:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create battery history" },
      { status: 500 }
    );
  }
}