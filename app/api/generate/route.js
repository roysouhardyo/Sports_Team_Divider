import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Player from '@/models/Player';

// POST /api/generate - Generate balanced teams
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { playerIds } = body;
    
    if (!playerIds || !Array.isArray(playerIds) || playerIds.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 players are required to generate teams' },
        { status: 400 }
      );
    }
    
    // Fetch all selected players
    const players = await Player.find({ _id: { $in: playerIds } });
    
    if (players.length !== playerIds.length) {
      return NextResponse.json(
        { error: 'Some players were not found' },
        { status: 400 }
      );
    }
    
    // Sort players by rating (highest first) and add some randomization
    const sortedPlayers = players
      .sort((a, b) => b.rating - a.rating)
      .map(player => ({
        ...player.toObject(),
        // Add small random factor to break ties and add variety
        randomFactor: Math.random() * 0.1
      }))
      .sort((a, b) => (b.rating + b.randomFactor) - (a.rating + a.randomFactor));
    
    // Initialize teams
    const team1 = [];
    const team2 = [];
    let team1Total = 0;
    let team2Total = 0;
    
    // Distribute players alternately to the team with lower total rating
    sortedPlayers.forEach(player => {
      if (team1Total <= team2Total) {
        team1.push(player);
        team1Total += player.rating;
      } else {
        team2.push(player);
        team2Total += player.rating;
      }
    });
    
    // Remove the random factor from the response
    const cleanTeam1 = team1.map(({ randomFactor, ...player }) => player);
    const cleanTeam2 = team2.map(({ randomFactor, ...player }) => player);
    
    return NextResponse.json({
      team1: {
        players: cleanTeam1,
        totalRating: team1Total
      },
      team2: {
        players: cleanTeam2,
        totalRating: team2Total
      }
    });
  } catch (error) {
    console.error('Error generating teams:', error);
    return NextResponse.json(
      { error: 'Failed to generate teams' },
      { status: 500 }
    );
  }
}
