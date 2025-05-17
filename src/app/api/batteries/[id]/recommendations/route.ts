import { NextRequest, NextResponse } from "next/server";
import { memStorage } from "@/lib/db";
import { z } from "zod";
import { insertRecommendationSchema } from "@/lib/db/schema";

// GET recommendations for a specific battery
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
    
    const recommendations = await memStorage.getRecommendations(batteryId);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}

// POST new recommendation for a battery
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
    const validatedData = insertRecommendationSchema.parse(dataWithBatteryId);
    
    const newRecommendation = await memStorage.createRecommendation(validatedData);
    return NextResponse.json(newRecommendation, { status: 201 });
  } catch (error) {
    console.error("Failed to create recommendation:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create recommendation" },
      { status: 500 }
    );
  }
}