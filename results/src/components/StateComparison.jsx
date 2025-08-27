import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, Target, AlertTriangle,
  Award, ArrowUp, ArrowDown, Zap, Eye, EyeOff,
  ChevronLeft, ChevronRight, RefreshCw, Download
} from 'lucide-react';

const StateComparison = ({
  stateData,
  selectedState,
  onStateSelect,
  isVisible,
  onToggle
}) => {
  const [sortBy, setSortBy] = useState('Healthcare_Access_mean');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  // Sort and paginate states
  const sortedStates = useMemo(() => {
    if (!stateData) return [];

    return [...stateData].sort((a, b) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [stateData, sortBy, sortOrder]);

  const paginatedStates = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return sortedStates.slice(start, start + itemsPerPage);
  }, [sortedStates, currentPage]);

  const totalPages = Math.ceil(sortedStates.length / itemsPerPage);

  // Sorting options
  const sortOptions = [
    { key: 'Healthcare_Access_mean', name: 'Healthcare Score', icon: BarChart3, desc: "Mean healthcare access score across the state" },
    { key: 'Population_sum', name: 'Total Population', icon: Users, desc: "Total population of the state" },
    { key: 'Opportunity_Score_mean', name: 'Opportunity', icon: Target, desc: "Mean opportunity score across the state" },
    { key: 'Vulnerability_Index_mean', name: 'Vulnerability', icon: AlertTriangle, desc: "Mean vulnerability index across the state" },
    { key: 'Healthcare_Rank', name: 'National Rank', icon: Award, desc: "National rank of the state's healthcare performance (Higher is better)" },
    { key: 'Inequality_Score', name: 'Inequality', icon: TrendingUp, desc: "Inequality score across the state" },
  ];

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
    setCurrentPage(0);
  };

  if (!isVisible) {
    return (
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onToggle}
        className="fixed bottom-40 right-4 z-40 p-3 glass-dark rounded-full border border-neon-green/30 hover:border-neon-green/60 transition-all group"
      >
        <BarChart3 className="w-5 h-5 text-neon-green group-hover:text-white" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-40 right-4 z-40 w-96 max-h-[60vh] overflow-hidden"
    >
      <div className="glass-dark rounded-2xl border border-neon-green/30">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-cyber font-bold text-white text-sm">State Rankings</h3>
                <p className="text-xs text-gray-400">{sortedStates.length} states analyzed</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>

          {/* Sort controls */}
          <div className="mt-3 flex gap-1 overflow-x-auto pb-2">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                title={option.desc}
                onClick={() => handleSort(option.key)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${sortBy === option.key
                    ? 'bg-neon-green text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                <option.icon className="w-3 h-3" />
                <span>{option.name}</span>
                {sortBy === option.key && (
                  <div className="ml-1">
                    {sortOrder === 'desc' ? <ArrowDown className="w-2 h-2" /> : <ArrowUp className="w-2 h-2" />}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* States list */}
        <div className="p-4 max-h-80 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            {paginatedStates.map((state, idx) => {
              const isSelected = selectedState === state.State;
              const rank = sortedStates.findIndex(s => s.State === state.State) + 1;

              return (
                <motion.button
                  key={state.State}
                  onClick={() => onStateSelect(state.State)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${isSelected
                      ? 'border-neon-green bg-neon-green/10 text-white'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-700/50 text-gray-300'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center text-xs font-bold text-neon-green">
                        {rank}
                      </span>
                      <span className="font-medium">{state.State}</span>
                    </div>
                    <span className="font-mono text-sm text-neon-green">
                      {typeof state[sortBy] === 'number' ?
                        (state[sortBy] > 1000000 ?
                          `${(state[sortBy] / 1000000).toFixed(1)}M` :
                          state[sortBy].toFixed(1)
                        ) : state[sortBy]
                      }
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                    <div>
                      <span>Healthcare:</span>
                      <span className="ml-1 text-white font-mono">
                        {state.Healthcare_Access_mean?.toFixed(1)}
                      </span>
                    </div>
                    <div>
                      <span>Counties:</span>
                      <span className="ml-1 text-white font-mono">
                        {state.County_count}
                      </span>
                    </div>
                    <div>
                      <span>Pop:</span>
                      <span className="ml-1 text-white font-mono">
                        {(state.Population_sum / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>

                  {/* Progress bar for main metric */}
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="h-1 rounded-full bg-gradient-to-r from-neon-green to-neon-blue"
                        style={{
                          width: `${Math.min(100, (state[sortBy] / Math.max(...sortedStates.map(s => s[sortBy]))) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3 h-3" />
                Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-6 h-6 rounded text-xs ${currentPage === i
                        ? 'bg-neon-green text-white'
                        : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StateComparison;