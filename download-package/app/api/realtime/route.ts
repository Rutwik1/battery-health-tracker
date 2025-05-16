import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { storage } from '@/lib/data/storage';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Simulate real-time updates to batteries
    const updatedBatteries = await storage.simulateRealTimeUpdates(session.user.id);
    
    return NextResponse.json(updatedBatteries);
  } catch (error) {
    console.error('Failed to simulate real-time updates:', error);
    return NextResponse.json(
      { error: 'Failed to process real-time updates' },
      { status: 500 }
    );
  }
}