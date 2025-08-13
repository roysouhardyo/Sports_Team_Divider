import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Player from '@/models/Player';

// GET /api/players - Fetch all players
export async function GET() {
  try {
    await dbConnect();
    const players = await Player.find({}).sort({ name: 1 });
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}

// POST /api/players - Add new player
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const { name, rating, position } = body;
    
    // Validate required fields
    if (!name || !rating || !position) {
      return NextResponse.json(
        { error: 'Name, rating, and position are required' },
        { status: 400 }
      );
    }
    
    // Check if player already exists
    const existingPlayer = await Player.findOne({ name: name.trim() });
    if (existingPlayer) {
      return NextResponse.json(
        { error: 'Player with this name already exists' },
        { status: 400 }
      );
    }
    
    const player = await Player.create({
      name: name.trim(),
      rating: parseInt(rating),
      position: position.toUpperCase(),
    });
    
    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    );
  }
}
