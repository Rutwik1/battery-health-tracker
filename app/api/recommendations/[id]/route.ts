import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/store';

// PATCH /api/recommendations/:id - Update a recommendation (mark as resolved/unresolved)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid recommendation ID' },
        { status: 400 }
      );
    }

    const body = await req.json();
    
    // The resolved status must be provided
    if (body.resolved === undefined) {
      return NextResponse.json(
        { error: 'Missing resolved status' },
        { status: 400 }
      );
    }
    
    const updatedRecommendation = await storage.updateRecommendation(id, body.resolved);
    if (!updatedRecommendation) {
      return NextResponse.json(
        { error: 'Recommendation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRecommendation);
  } catch (error) {
    console.error(`Error updating recommendation ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update recommendation' },
      { status: 500 }
    );
  }
}