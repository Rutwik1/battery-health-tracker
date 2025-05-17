import { NextRequest, NextResponse } from "next/server";
import { memStorage } from "@/lib/db";
import { z } from "zod";

// PATCH (update) a recommendation (mark as resolved/unresolved)
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
    
    // Validate the request body
    const updateSchema = z.object({
      resolved: z.boolean()
    });
    
    const { resolved } = updateSchema.parse(body);
    
    const updatedRecommendation = await memStorage.updateRecommendation(id, resolved);
    
    if (!updatedRecommendation) {
      return NextResponse.json(
        { error: "Recommendation not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedRecommendation);
  } catch (error) {
    console.error("Failed to update recommendation:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update recommendation" },
      { status: 500 }
    );
  }
}