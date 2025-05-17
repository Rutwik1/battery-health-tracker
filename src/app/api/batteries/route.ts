import { NextResponse, NextRequest } from "next/server";
import { memStorage } from "@/lib/db";
import { insertBatterySchema } from "@/lib/db/schema";

export async function GET() {
  try {
    const batteries = await memStorage.getBatteries();
    return NextResponse.json(batteries);
  } catch (error) {
    console.error("Error fetching batteries:", error);
    return NextResponse.json(
      { error: "Failed to fetch batteries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const parsedBody = insertBatterySchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid battery data", details: parsedBody.error.format() },
        { status: 400 }
      );
    }
    
    const battery = await memStorage.createBattery(parsedBody.data);
    return NextResponse.json(battery, { status: 201 });
  } catch (error) {
    console.error("Error creating battery:", error);
    return NextResponse.json(
      { error: "Failed to create battery" },
      { status: 500 }
    );
  }
}