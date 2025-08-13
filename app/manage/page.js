'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import PlayerCard from '@/components/PlayerCard';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';

export default function ManagePlayers() {
  const [players, setPlayers] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', rating: '', position: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Load players immediately on mount
    fetchPlayers();
  }, []);

  // Preload authentication status
  useEffect(() => {
    if (isAuthenticated) {
      // If already authenticated, we can skip the auth check
      return;
    }
  }, [isAuthenticated]);

  const fetchPlayers = async () => {
    try {
      // Add cache control for faster loading
      const response = await fetch('/api/players', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (player) => {
    if (!isAuthenticated) {
      setPendingAction({ type: 'edit', player });
      setShowLoginModal(true);
      return;
    }
    
    setEditingPlayer(player);
    setEditForm({
      name: player.name,
      rating: player.rating.toString(),
      position: player.position
    });
  };

  const handleCancelEdit = () => {
    setEditingPlayer(null);
    setEditForm({ name: '', rating: '', position: '' });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.rating || !editForm.position) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`/api/players/${editingPlayer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editForm),
      });

      const data = await response.json();
      if (response.ok) {
        setEditingPlayer(null);
        setEditForm({ name: '', rating: '', position: '' });
        fetchPlayers();
      } else {
        if (response.status === 401) {
          alert('Authentication required. Please login again.');
          setShowLoginModal(true);
        } else {
          alert(data.error || 'Failed to update player');
        }
      }
    } catch (error) {
      console.error('Error updating player:', error);
      alert('Failed to update player');
    }
  };

  const handleDelete = async (playerId) => {
    if (!isAuthenticated) {
      setPendingAction({ type: 'delete', playerId });
      setShowLoginModal(true);
      return;
    }

    if (!confirm('Are you sure you want to delete this player?')) {
      return;
    }

    try {
      const response = await fetch(`/api/players/${playerId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchPlayers();
      } else {
        const data = await response.json();
        if (response.status === 401) {
          alert('Authentication required. Please login again.');
          setShowLoginModal(true);
        } else {
          alert(data.error || 'Failed to delete player');
        }
      }
    } catch (error) {
      console.error('Error deleting player:', error);
      alert('Failed to delete player');
    }
  };

  const handleLoginSuccess = () => {
    if (pendingAction) {
      if (pendingAction.type === 'edit') {
        setEditingPlayer(pendingAction.player);
        setEditForm({
          name: pendingAction.player.name,
          rating: pendingAction.player.rating.toString(),
          position: pendingAction.player.position
        });
      } else if (pendingAction.type === 'delete') {
        handleDelete(pendingAction.playerId);
      }
      setPendingAction(null);
    }
  };

  const positionStats = (players || []).reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1;
    return acc;
  }, {});

  const averageRating = (players || []).length > 0 
    ? Math.round((players || []).reduce((sum, player) => sum + player.rating, 0) / players.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 to-dark-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-dark-900 mb-4">
            Manage Players
          </h1>
          <p className="text-xl text-dark-600">
            View, edit, and delete players from your database.
            {!isAuthenticated && (
              <span className="block text-base text-orange-600 mt-2">
                ⚠️ Authentication required to edit or delete players
              </span>
            )}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-6 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">{(players || []).length}</div>
            <div className="text-lg text-dark-600 font-medium">Total Players</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{positionStats.GK || 0}</div>
            <div className="text-lg text-dark-600 font-medium">Goalkeepers</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{positionStats.DF || 0}</div>
            <div className="text-lg text-dark-600 font-medium">Defenders</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">{positionStats.MF || 0}</div>
            <div className="text-lg text-dark-600 font-medium">Midfielders</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">{positionStats.FW || 0}</div>
            <div className="text-lg text-dark-600 font-medium">Forwards</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-2">{averageRating}</div>
            <div className="text-lg text-dark-600 font-medium">Avg Rating</div>
          </div>
        </motion.div>

        {/* Players List */}
                 <div className="bg-white rounded-xl shadow-md p-6">
           <h2 className="text-3xl font-bold text-dark-900 mb-6">All Players</h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                             <p className="text-lg text-dark-600 font-medium">Loading players...</p>
            </div>
          ) : (players || []).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
                             <h3 className="text-2xl font-bold text-dark-900 mb-2">No Players Found</h3>
               <p className="text-lg text-dark-600">Add some players to get started!</p>
            </div>
          ) : (
                         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                             <AnimatePresence>
                 {(players || []).map((player) => (
                  <motion.div
                    key={player._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                  >
                    {editingPlayer?._id === player._id ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 rounded-xl p-4 border-2 border-primary-300"
                      >
                        <form onSubmit={handleSaveEdit} className="space-y-3">
                                                     <input
                             type="text"
                             placeholder="Player Name"
                             value={editForm.name}
                             onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base text-dark-900 placeholder-gray-500"
                           />
                                                     <input
                             type="number"
                             placeholder="Rating (1-100)"
                             min="1"
                             max="100"
                             value={editForm.rating}
                             onChange={(e) => setEditForm({...editForm, rating: e.target.value})}
                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base text-dark-900 placeholder-gray-500"
                           />
                                                     <select
                             value={editForm.position}
                             onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base text-dark-900"
                           >
                            <option value="">Select Position</option>
                            <option value="GK">Goalkeeper (GK)</option>
                            <option value="DF">Defender (DF)</option>
                            <option value="MF">Midfielder (MF)</option>
                            <option value="FW">Forward (FW)</option>
                          </select>
                          <div className="flex space-x-2">
                                                         <motion.button
                               whileHover={{ scale: 1.05 }}
                               whileTap={{ scale: 0.95 }}
                               type="submit"
                               className="flex-1 py-3 px-4 bg-green-500 text-white text-base font-medium rounded-lg hover:bg-green-600 transition-colors"
                             >
                               Save
                             </motion.button>
                             <motion.button
                               whileHover={{ scale: 1.05 }}
                               whileTap={{ scale: 0.95 }}
                               type="button"
                               onClick={handleCancelEdit}
                               className="flex-1 py-3 px-4 bg-gray-500 text-white text-base font-medium rounded-lg hover:bg-gray-600 transition-colors"
                             >
                               Cancel
                             </motion.button>
                          </div>
                        </form>
                      </motion.div>
                    ) : (
                      <div className="relative">
                        <PlayerCard 
                          player={player} 
                          showActions={false}
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(player)}
                            className="p-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(player._id)}
                            className="p-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
