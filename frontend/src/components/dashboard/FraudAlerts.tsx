'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Shield, AlertCircle } from 'lucide-react';

interface Alert {
  id: string;
  type: 'sybil' | 'wash' | 'bot';
  project: string;
  riskScore: number;
  timestamp: string;
}

export default function FraudAlerts() {
  // Mock alerts - will be replaced with real data
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'sybil',
      project: 'Project C',
      riskScore: 0.85,
      timestamp: '5 min ago',
    },
    {
      id: '2',
      type: 'wash',
      project: 'Project F',
      riskScore: 0.72,
      timestamp: '12 min ago',
    },
    {
      id: '3',
      type: 'bot',
      project: 'Project H',
      riskScore: 0.68,
      timestamp: '23 min ago',
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'sybil':
        return <AlertTriangle className="w-5 h-5" />;
      case 'wash':
        return <AlertCircle className="w-5 h-5" />;
      case 'bot':
        return <Shield className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getAlertColor = (riskScore: number) => {
    if (riskScore >= 0.7) return 'red';
    if (riskScore >= 0.5) return 'orange';
    return 'yellow';
  };

  const getAlertLabel = (type: string) => {
    switch (type) {
      case 'sybil':
        return 'Sybil Attack';
      case 'wash':
        return 'Wash Trading';
      case 'bot':
        return 'Bot Behavior';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Fraud Alerts
        </h2>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          {alerts.length} Active
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => {
          const color = getAlertColor(alert.riskScore);
          const colorClasses = {
            red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
            orange:
              'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400',
            yellow:
              'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400',
          };

          return (
            <motion.div
              key={alert.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${colorClasses[color]} hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      {getAlertLabel(alert.type)}
                    </p>
                    <span className="text-xs font-medium">
                      {(alert.riskScore * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm mt-1">{alert.project}</p>
                  <p className="text-xs mt-1 opacity-75">{alert.timestamp}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No active alerts</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            All contributions look legitimate
          </p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-center text-sm font-medium text-polkadot-pink hover:text-polkadot-purple transition-colors">
          View All Alerts →
        </button>
      </div>
    </div>
  );
}
