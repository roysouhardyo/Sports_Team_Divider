'use client';
import { motion } from 'framer-motion';

const positionColors = {
  GK: 'bg-blue-100 text-blue-800',
  DF: 'bg-green-100 text-green-800',
  MF: 'bg-yellow-100 text-yellow-800',
  FW: 'bg-red-100 text-red-800',
};

export default function PlayerCard({ player, onSelect, onRemove, isSelected = false, showActions = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-white rounded-xl shadow-md border-2 transition-all duration-200 ${
        isSelected 
          ? 'border-primary-500 shadow-lg' 
          : 'border-gray-200 hover:border-primary-300'
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-dark-900 text-xl">{player.name}</h3>
          <span className={`px-3 py-2 rounded-full text-sm font-bold ${positionColors[player.position]}`}>
            {player.position}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-base text-dark-600 font-medium">Rating:</span>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < Math.floor(player.rating / 20) 
                      ? 'bg-primary-500' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-primary-600 text-lg">{player.rating}</span>
          </div>
          
          {showActions && (
            <div className="flex space-x-2">
              {onSelect && !isSelected && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(player)}
                  className="px-3 py-1 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Add
                </motion.button>
              )}
              {onRemove && isSelected && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onRemove(player._id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
