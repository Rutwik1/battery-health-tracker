import { NextRequest, NextResponse } from "next/server";
import { memStorage } from "@/lib/db";
import { z } from "zod";
import { insertBatterySchema } from "@/lib/db/schema";

// GET all batteries
export async function GET() {
  try {
    const batteries = await memStorage.getBatteries();
    return NextResponse.json(batteries);
  } catch (error) {
    console.error("Failed to fetch batteries:", error);
    return NextResponse.json(
      { error: "Failed to fetch batteries" },
      { status: 500 }
    );
  }
}

// POST new battery
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = insertBatterySchema.parse(body);
    
    const newBattery = await memStorage.createBattery(validatedData);
    return NextResponse.json(newBattery, { status: 201 });
  } catch (error) {
    console.error("Failed to create battery:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create battery" },
      { status: 500 }
    );
  }
}