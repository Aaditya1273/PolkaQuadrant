'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QuadrantChart from '@/components/charts/QuadrantChart';
import MetricsCard from '@/components/dashboard/MetricsCard';
import FraudAlerts from '@/components/dashboard/FraudAlerts';
import NetworkStatus from '@/components/dashboard/NetworkStatus';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Activity, AlertTriangle, CheckCircle, TrendingUp, Zap, Radio } from 'lucide-react';

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(true);
  const { data: liveData, isConnected } = useWebSocket('ws://localhost:4000');
  const [isHydrated, setIsHydrated] = useState(false);

  // Mock data - will be replaced with real data from API
  const [metrics, setMetrics] = useState({
    totalRounds: 12,
    activeAlerts: 3,
    testCoverage: 95.4,
    mainnetStatus: 'connected',
    aiAccuracy: 99.2,
    throughtput: '10K+',
  });

  const [quadrantData, setQuadrantData] = useState([
    { x: 5000, y: 85, r: 15, label: 'Project A', risk: 0.2 },
    { x: 8000, y: 92, r: 20, label: 'Project B', risk: 0.1 },
    { x: 3000, y: 65, r: 10, label: 'Project C', risk: 0.7 },
    { x: 12000, y: 78, r: 25, label: 'Project D', risk: 0.3 },
    { x: 6500, y: 88, r: 18, label: 'Project E', risk: 0.15 },
  ]);

  // Hydration fix
  useEffect(() => {
    setIsHydrated(true);
    setDarkMode(true);
  }, []);

  useEffect(() => {
    // Update metrics from live data
    if (liveData) {
      setMetrics((prev) => ({
        ...prev,
        ...liveData.metrics,
      }));
    }
  }, [liveData]);

  // Toggle dark mode
  useEffect(() => {
    if (!isHydrated) return;
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, isHydrated]);

  if (!isHydrated) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Cleaner Background */}
      <div className="fixed inset-0 z-0">
        {darkMode ? (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950/20"></div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50/30 to-white"></div>
        )}
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative z-20 backdrop-blur-xl border-b sticky top-0 ${
          darkMode 
            ? 'bg-gray-800/90 border-gray-700' 
            : 'bg-white/95 border-gray-200 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/50 animate-pulse-glow">
                <span className="text-2xl">🪐</span>
              </div>
              <div>
                <h1 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">Polka</span>Quadrant
                </h1>
                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>AI-Secured Validator</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Network Status */}
              <NetworkStatus isConnected={isConnected} />

              {/* Live Indicator */}
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-emerald-300">Live</span>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-500/20 transition-all duration-300"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8"
        >
          <motion.div variants={itemVariants} className="lg:col-span-1.5">
            <MetricsCard
              title="Total Rounds"
              value={metrics.totalRounds}
              icon={<Activity className="w-5 h-5" />}
              trend="+2 this month"
              color="emerald"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="lg:col-span-1.5">
            <MetricsCard
              title="Active Alerts"
              value={metrics.activeAlerts}
              icon={<AlertTriangle className="w-5 h-5" />}
              trend="3 flagged"
              color="red"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="lg:col-span-1.5">
            <MetricsCard
              title="AI Accuracy"
              value={`${metrics.aiAccuracy}%`}
              icon={<CheckCircle className="w-5 h-5" />}
              trend="+0.3% today"
              color="emerald"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="lg:col-span-1.5">
            <MetricsCard
              title="Throughput"
              value={metrics.throughtput}
              icon={<TrendingUp className="w-5 h-5" />}
              trend="tx/sec"
              color="emerald"
            />
          </motion.div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quadrant Chart */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className={`rounded-2xl border transition-all duration-300 p-6 h-full shadow-lg ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' 
                : 'bg-white border-gray-200 hover:border-emerald-400 hover:shadow-xl'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                    Funding Quadrant Analysis
                  </h2>
                  <p className="text-xs text-emerald-300/60 font-mono mt-1">
                    Funding (X) × Impact (Y) × Reputation (size) × Risk (color)
                  </p>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs font-mono text-emerald-300">Live</span>
                </div>
              </div>
              <QuadrantChart data={quadrantData} />
            </div>
          </motion.div>

          {/* Fraud Alerts */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <FraudAlerts />
          </motion.div>
        </div>

        {/* Additional Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Detection Accuracy */}
          <div className={`rounded-2xl border transition-all duration-300 p-6 shadow-lg ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' 
              : 'bg-white border-gray-200 hover:border-emerald-400 hover:shadow-xl'
          }`}>
            <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent mb-4">
              Detection Accuracy
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Sybil Attacks', value: 92, color: 'from-emerald-400 to-emerald-600' },
                { label: 'Wash Trading', value: 88, color: 'from-emerald-400 to-emerald-500' },
                { label: 'Bot Behavior', value: 90, color: 'from-emerald-300 to-emerald-500' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-emerald-300/70 font-mono">{item.label}</span>
                    <span className="font-bold text-emerald-400">{item.value}%</span>
                  </div>
                  <div className="w-full bg-emerald-950/40 rounded-full h-2 overflow-hidden border border-emerald-500/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`rounded-2xl border transition-all duration-300 p-6 shadow-lg ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' 
              : 'bg-white border-gray-200 hover:border-emerald-400 hover:shadow-xl'
          }`}>
            <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Round #12 finalized', time: '2 min ago', status: 'success' },
                { label: 'Sybil attack detected', time: '15 min ago', status: 'alert' },
                { label: 'New project added', time: '1 hour ago', status: 'info' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    item.status === 'success' ? 'bg-emerald-400' :
                    item.status === 'alert' ? 'bg-red-400' :
                    'bg-blue-400'
                  } animate-pulse`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-emerald-100 font-medium truncate">{item.label}</p>
                    <p className="text-xs text-emerald-400/60 font-mono">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Network Stats */}
          <div className{`rounded-2xl border transition-all duration-300 p-6 shadow-lg ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' 
              : 'bg-white border-gray-200 hover:border-emerald-400 hover:shadow-xl'
          }`}>
            <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent mb-4">
              Network Stats
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Connected Nodes', value: '3/3' },
                { label: 'Block Height', value: '1,234,567' },
                { label: 'Avg Block Time', value: '6.2s' },
                { label: 'Total Projects', value: '47' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex justify-between items-center group"
                >
                  <span className="text-xs text-emerald-300/70 font-mono group-hover:text-emerald-300 transition-colors">{item.label}</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}