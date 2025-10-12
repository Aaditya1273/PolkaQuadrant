'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QuadrantChart from '@/components/charts/QuadrantChart';
import MetricsCard from '@/components/dashboard/MetricsCard';
import FraudAlerts from '@/components/dashboard/FraudAlerts';
import NetworkStatus from '@/components/dashboard/NetworkStatus';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const { data: liveData, isConnected } = useWebSocket('ws://localhost:4000');

  // Mock data - will be replaced with real data from API
  const [metrics, setMetrics] = useState({
    totalRounds: 12,
    activeAlerts: 3,
    testCoverage: 95.4,
    mainnetStatus: 'connected',
  });

  const [quadrantData, setQuadrantData] = useState([
    { x: 5000, y: 85, r: 15, label: 'Project A', risk: 0.2 },
    { x: 8000, y: 92, r: 20, label: 'Project B', risk: 0.1 },
    { x: 3000, y: 65, r: 10, label: 'Project C', risk: 0.7 },
    { x: 12000, y: 78, r: 25, label: 'Project D', risk: 0.3 },
    { x: 6500, y: 88, r: 18, label: 'Project E', risk: 0.15 },
  ]);

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
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-polkadot-pink to-polkadot-purple rounded-lg flex items-center justify-center">
                <span className="text-2xl">🪐</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  PolkaQuadrant
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  AI-Secured Quadratic Funding Validator
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Network Status */}
              <NetworkStatus isConnected={isConnected} />

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <MetricsCard
            title="Total Rounds"
            value={metrics.totalRounds}
            icon={<Activity className="w-6 h-6" />}
            trend="+2 this month"
            color="blue"
          />
          <MetricsCard
            title="Active Alerts"
            value={metrics.activeAlerts}
            icon={<AlertTriangle className="w-6 h-6" />}
            trend="3 flagged"
            color="red"
          />
          <MetricsCard
            title="Test Coverage"
            value={`${metrics.testCoverage}%`}
            icon={<CheckCircle className="w-6 h-6" />}
            trend="+5% this week"
            color="green"
          />
          <MetricsCard
            title="Mainnet Status"
            value={metrics.mainnetStatus}
            icon={<TrendingUp className="w-6 h-6" />}
            trend="Acala connected"
            color="purple"
          />
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quadrant Chart */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Funding Quadrant Analysis
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Funding (X) × Impact (Y) × Reputation (size) × Risk (color)
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Live
                  </span>
                </div>
              </div>
              <QuadrantChart data={quadrantData} />
            </div>
          </motion.div>

          {/* Fraud Alerts */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <FraudAlerts />
          </motion.div>
        </div>

        {/* Additional Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Detection Accuracy
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Sybil Attacks</span>
                  <span className="font-medium text-gray-900 dark:text-white">92%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-polkadot-pink h-2 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Wash Trading</span>
                  <span className="font-medium text-gray-900 dark:text-white">88%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-polkadot-purple h-2 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Bot Behavior</span>
                  <span className="font-medium text-gray-900 dark:text-white">90%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">Round #12 finalized</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">Sybil attack detected</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">New project added</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Network Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Connected Nodes</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">3/3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Block Height</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">1,234,567</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Block Time</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">6.2s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Projects</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">47</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
