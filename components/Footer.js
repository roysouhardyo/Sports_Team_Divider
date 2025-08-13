'use client';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-dark-900 text-white py-8 mt-auto border-t border-dark-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-gray-300">
              © 2024 Team Divider. All rights reserved.
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-300">
              Created with ❤️ by <span className="text-primary-400 font-semibold">Souhardya Roy</span>
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
