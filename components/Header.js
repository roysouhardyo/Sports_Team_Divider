'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border-b border-dark-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚽</span>
            </div>
            <Link href="/" className="text-xl font-bold text-dark-900 hover:text-primary-600">
              Team Divider
            </Link>
          </motion.div>
          
          <nav className="flex items-center space-x-8">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                href="/" 
                className="text-dark-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                href="/manage" 
                className="text-dark-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Manage Players
              </Link>
            </motion.div>
            
            {isAuthenticated && (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <span className="text-sm text-green-600 font-medium">Admin</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </motion.button>
              </motion.div>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
