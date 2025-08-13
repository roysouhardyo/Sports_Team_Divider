'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar({ onPlayerSelect, onMultiplePlayerSelect, placeholder = "Search players..." }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAllPlayers, setShowAllPlayers] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const searchRef = useRef(null);

  // Fetch all players on component mount
  useEffect(() => {
    fetchAllPlayers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setShowAllPlayers(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAllPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      const data = await response.json();
      setAllPlayers(data);
    } catch (error) {
      console.error('Error fetching all players:', error);
    }
  };

  useEffect(() => {
    const searchPlayers = async () => {
      if (query.length < 1) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (error) {
        console.error('Error searching players:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchPlayers, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSuggestionClick = (player) => {
    onPlayerSelect(player);
    setQuery('');
    setShowSuggestions(false);
  };

  const handlePlayerToggle = (player) => {
    const isSelected = selectedPlayers.find(p => p._id === player._id);
    if (isSelected) {
      setSelectedPlayers(selectedPlayers.filter(p => p._id !== player._id));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleAddSelected = () => {
    // Add all selected players to the main selection
    if (selectedPlayers.length > 0) {
      if (onMultiplePlayerSelect) {
        // Use the new multiple player select function if available
        onMultiplePlayerSelect(selectedPlayers);
      } else {
        // Fallback to individual player selection
        selectedPlayers.forEach(player => {
          onPlayerSelect(player);
        });
      }
      // Clear the selection and hide the list
      setSelectedPlayers([]);
      setShowAllPlayers(false);
    }
  };

  const handleShowAllPlayers = () => {
    setShowAllPlayers(!showAllPlayers);
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 pr-4 text-dark-900 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
          </div>
        )}
      </div>

      {/* Show All Players Button */}
      <div className="mt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShowAllPlayers}
          className="w-full py-2 px-4 bg-gray-100 text-dark-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          {showAllPlayers ? 'Hide All Players' : `Show All Players (${allPlayers.length})`}
        </motion.button>
      </div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((player, index) => (
              <motion.div
                key={player._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(player)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-dark-900">{player.name}</div>
                    <div className="text-sm text-dark-600">
                      {player.position} • Rating: {player.rating}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    player.position === 'GK' ? 'bg-blue-100 text-blue-800' :
                    player.position === 'DF' ? 'bg-green-100 text-green-800' :
                    player.position === 'MF' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {player.position}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Players List */}
      <AnimatePresence>
        {showAllPlayers && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto"
          >
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-dark-700">
                  Select Players ({selectedPlayers.length} selected)
                </span>
                                 {selectedPlayers.length > 0 && (
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={handleAddSelected}
                     className="px-3 py-1 bg-primary-500 text-white text-xs rounded-lg hover:bg-primary-600 transition-colors font-medium"
                   >
                     Add Selected ({selectedPlayers.length})
                   </motion.button>
                 )}
              </div>
            </div>
            
            {allPlayers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No players found. Add some players first!
              </div>
            ) : (
              allPlayers.map((player, index) => {
                const isSelected = selectedPlayers.find(p => p._id === player._id);
                return (
                  <motion.div
                    key={player._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handlePlayerToggle(player)}
                    className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                      isSelected ? 'bg-primary-50 border-primary-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'bg-primary-500 border-primary-500' 
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-dark-900">{player.name}</div>
                          <div className="text-sm text-dark-600">
                            {player.position} • Rating: {player.rating}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          player.position === 'GK' ? 'bg-blue-100 text-blue-800' :
                          player.position === 'DF' ? 'bg-green-100 text-green-800' :
                          player.position === 'MF' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {player.position}
                        </span>
                        {isSelected && (
                          <div className="text-primary-600 text-sm font-medium">
                            ✓
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
