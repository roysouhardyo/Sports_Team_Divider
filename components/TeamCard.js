'use client';
import { motion } from 'framer-motion';
import PlayerCard from './PlayerCard';

export default function TeamCard({ team, teamNumber, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: teamNumber === 1 ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.2 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Team {teamNumber}</h2>
          <div className="text-right">
            <div className="text-sm text-primary-100">Total Rating</div>
            <div className="text-2xl font-bold text-white">{team.totalRating}</div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-3">
          {team.players.map((player, index) => (
            <motion.div
              key={player._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (delay * 0.2) + (index * 0.1) }}
            >
              <PlayerCard 
                player={player} 
                showActions={false}
              />
            </motion.div>
          ))}
        </div>
        
        {team.players.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No players assigned
          </div>
        )}
      </div>
    </motion.div>
  );
}
