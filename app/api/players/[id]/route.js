import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Player from '@/models/Player';

// PUT /api/players/[id] - Update player
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();
    
    const { name, rating, position } = body;
    
    // Validate required fields
    if (!name || !rating || !position) {
      return NextResponse.json(
        { error: 'Name, rating, and position are required' },
        { status: 400 }
      );
    }
    
    // Check if another player with the same name exists
    const existingPlayer = await Player.findOne({ 
      name: name.trim(), 
      _id: { $ne: id } 
    });
    if (existingPlayer) {
      return NextResponse.json(
        { error: 'Player with this name already exists' },
        { status: 400 }
      );
    }
    
    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        rating: parseInt(rating),
        position: position.toUpperCase(),
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedPlayer) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedPlayer);
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    );
  }
}

// DELETE /api/players/[id] - Delete player
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const deletedPlayer = await Player.findByIdAndDelete(id);
    
    if (!deletedPlayer) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    );
  }
}
