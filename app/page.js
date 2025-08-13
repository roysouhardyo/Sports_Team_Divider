'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import PlayerCard from '@/components/PlayerCard';
import TeamCard from '@/components/TeamCard';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teams, setTeams] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', rating: '', position: '' });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch all players on component mount
  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      const data = await response.json();
      setAllPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handlePlayerSelect = (player) => {
    // Check if player is already selected to avoid duplicates
    const isAlreadySelected = selectedPlayers.find(p => p._id === player._id);
    if (!isAlreadySelected) {
      setSelectedPlayers(prev => [...prev, player]);
    }
  };

  const handleMultiplePlayerSelect = (players) => {
    // Add multiple players at once, avoiding duplicates
    setSelectedPlayers(prev => {
      const existingIds = prev.map(p => p._id);
      const newPlayers = players.filter(player => !existingIds.includes(player._id));
      return [...prev, ...newPlayers];
    });
  };

  const handlePlayerRemove = (playerId) => {
    setSelectedPlayers(selectedPlayers.filter(p => p._id !== playerId));
  };

  const handleGenerateTeams = async () => {
    if (selectedPlayers.length < 2) {
      alert('Please select at least 2 players to generate teams');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerIds: selectedPlayers.map(p => p._id)
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setTeams(data);
      } else {
        alert(data.error || 'Failed to generate teams');
      }
    } catch (error) {
      console.error('Error generating teams:', error);
      alert('Failed to generate teams');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedPlayers([]);
    setTeams(null);
  };

  const handleAddPlayerClick = () => {
    if (!isAuthenticated) {
      setPendingAction({ type: 'showAddForm' });
      setShowLoginModal(true);
      return;
    }
    setShowAddForm(!showAddForm);
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setPendingAction({ type: 'addPlayer', playerData: { ...newPlayer } });
      setShowLoginModal(true);
      return;
    }

    if (!newPlayer.name || !newPlayer.rating || !newPlayer.position) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newPlayer),
      });

      const data = await response.json();
      if (response.ok) {
        setNewPlayer({ name: '', rating: '', position: '' });
        setShowAddForm(false);
        fetchPlayers();
      } else {
        if (response.status === 401) {
          alert('Authentication required. Please login again.');
          setShowLoginModal(true);
        } else {
          alert(data.error || 'Failed to add player');
        }
      }
    } catch (error) {
      console.error('Error adding player:', error);
      alert('Failed to add player');
    }
  };

  const handleLoginSuccess = () => {
    if (pendingAction) {
      if (pendingAction.type === 'showAddForm') {
        setShowAddForm(true);
      } else if (pendingAction.type === 'addPlayer') {
        // Re-submit the form with the stored player data
        setNewPlayer(pendingAction.playerData);
        // We need to trigger the form submission again
        setTimeout(() => {
          const form = document.querySelector('form');
          if (form) {
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          }
        }, 100);
      }
      setPendingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 to-dark-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-dark-900 mb-4">
            Football Team Divider
          </h1>
          <p className="text-lg text-dark-600 max-w-2xl mx-auto">
            Create balanced football teams based on player ratings and positions. 
            Search for players, add them to your match, and generate perfectly balanced teams.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Player Selection */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Search and Add Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-dark-900 mb-4">Add Players</h2>
              
              <div className="space-y-4">
                <SearchBar 
                  onPlayerSelect={handlePlayerSelect} 
                  onMultiplePlayerSelect={handleMultiplePlayerSelect}
                />
                
                <div className="flex items-center space-x-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-sm text-gray-500">or</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddPlayerClick}
                  className="w-full py-3 px-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-all duration-200 font-medium"
                >
                  {showAddForm ? 'Cancel' : 'Add New Player'}
                </motion.button>
              </div>

              <AnimatePresence>
                {showAddForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ 
                      duration: 0.3, 
                      ease: "easeInOut",
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 }
                    }}
                    onSubmit={handleAddPlayer}
                    className="mt-4 space-y-4 pt-4 border-t border-gray-200"
                  >
                                         <motion.input
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.1 }}
                       type="text"
                       placeholder="Player Name"
                       value={newPlayer.name}
                       onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-900 placeholder-gray-500 transition-all duration-200"
                     />
                     <motion.input
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.2 }}
                       type="number"
                       placeholder="Rating (1-100)"
                       min="1"
                       max="100"
                       value={newPlayer.rating}
                       onChange={(e) => setNewPlayer({...newPlayer, rating: e.target.value})}
                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-900 placeholder-gray-500 transition-all duration-200"
                     />
                                           <motion.select
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        value={newPlayer.position}
                        onChange={(e) => setNewPlayer({...newPlayer, position: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-900 transition-all duration-200"
                      >
                        <option value="">Select Position</option>
                        <option value="GK">Goalkeeper (GK)</option>
                        <option value="DF">Defender (DF)</option>
                        <option value="MF">Midfielder (MF)</option>
                        <option value="FW">Forward (FW)</option>
                      </motion.select>
                                         <motion.button
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.4 }}
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                       type="submit"
                       className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
                     >
                       Add Player
                     </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Selected Players */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-dark-900">
                  Selected Players ({selectedPlayers.length})
                </h2>
                {selectedPlayers.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearSelection}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Clear All
                  </motion.button>
                )}
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {selectedPlayers.map((player) => (
                    <motion.div
                      key={player._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <PlayerCard
                        player={player}
                        onRemove={handlePlayerRemove}
                        isSelected={true}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {selectedPlayers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No players selected. Search and add players to get started.
                  </div>
                )}
              </div>

              {selectedPlayers.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerateTeams}
                    disabled={isGenerating}
                    className="w-full py-3 px-4 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-lg"
                  >
                    {isGenerating ? 'Generating Teams...' : 'Generate Balanced Teams'}
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Team Display */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <AnimatePresence>
              {teams ? (
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <h2 className="text-2xl font-bold text-dark-900 mb-2">Generated Teams</h2>
                    <p className="text-dark-600">
                      Rating difference: {Math.abs(teams.team1.totalRating - teams.team2.totalRating)}
                    </p>
                  </motion.div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <TeamCard team={teams.team1} teamNumber={1} delay={0} />
                    <TeamCard team={teams.team2} teamNumber={2} delay={1} />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <div className="text-6xl mb-4">⚽</div>
                  <h3 className="text-xl font-semibold text-dark-900 mb-2">
                    Ready to Generate Teams
                  </h3>
                  <p className="text-dark-600">
                    Select at least 2 players and click "Generate Balanced Teams" to create your match.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
