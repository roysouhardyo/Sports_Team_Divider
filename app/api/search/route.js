import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Player from '@/models/Player';

// Force dynamic rendering for search functionality
export const dynamic = 'force-dynamic';

// GET /api/search?query=abc - Search players by name
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    if (!query || query.length < 1) {
      return NextResponse.json([]);
    }
    
    // Search for players whose name contains the query (case-insensitive)
    const players = await Player.find({
      name: { $regex: query, $options: 'i' }
    })
    .select('name rating position')
    .limit(10)
    .sort({ name: 1 });
    
    return NextResponse.json(players);
  } catch (error) {
    console.error('Error searching players:', error);
    return NextResponse.json(
      { error: 'Failed to search players' },
      { status: 500 }
    );
  }
}
