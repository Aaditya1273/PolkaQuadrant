'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, AlertCircle, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Alert {
  id: string;
  type: 'sybil' | 'wash' | 'bot';
  project: string;
  riskScore: number;
  timestamp: string;
}

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AlertsModal({ isOpen, onClose }: AlertsModalProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchAllAlerts();
    }
  }, [isOpen]);

  const fetchAllAlerts = async () => {
    try {
      const response = await fetch('http://localhost:4001/api/v1/ai/demo');
      const data = await response.json();
      
      if (data.highRiskProjects && data.highRiskProjects.length > 0) {
        const formattedAlerts = data.highRiskProjects.map((project: any, index: number) => ({
          id: project.id || `alert-${index}`,
          type: project.riskScore > 0.8 ? 'sybil' : project.riskScore > 0.6 ? 'wash' : 'bot',
          project: project.name || `Project ${index}`,
          riskScore: project.riskScore || 0.5,
          timestamp: `${Math.floor(Math.random() * 60)} min ago`,
        }));
        setAlerts(formattedAlerts);
      } else {
        // Use fallback if no data
        setAlerts([
          { id: '1', type: 'sybil', project: 'Project C', riskScore: 0.85, timestamp: '5 min ago' },
          { id: '2', type: 'wash', project: 'Project F', riskScore: 0.72, timestamp: '12 min ago' },
          { id: '3', type: 'bot', project: 'Project H', riskScore: 0.68, timestamp: '23 min ago' },
          { id: '4', type: 'sybil', project: 'Project K', riskScore: 0.91, timestamp: '35 min ago' },
          { id: '5', type: 'wash', project: 'Project M', riskScore: 0.65, timestamp: '42 min ago' },
        ]);
      }
    } catch (error) {
      // Use fallback demo data if backend is offline
      setAlerts([
        { id: '1', type: 'sybil', project: 'Project C', riskScore: 0.85, timestamp: '5 min ago' },
        { id: '2', type: 'wash', project: 'Project F', riskScore: 0.72, timestamp: '12 min ago' },
        { id: '3', type: 'bot', project: 'Project H', riskScore: 0.68, timestamp: '23 min ago' },
        { id: '4', type: 'sybil', project: 'Project K', riskScore: 0.91, timestamp: '35 min ago' },
        { id: '5', type: 'wash', project: 'Project M', riskScore: 0.65, timestamp: '42 min ago' },
      ]);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'sybil':
        return <AlertTriangle className="w-6 h-6" />;
      case 'wash':
        return <AlertCircle className="w-6 h-6" />;
      case 'bot':
        return <Shield className="w-6 h-6" />;
      default:
        return <AlertTriangle className="w-6 h-6" />;
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    All Fraud Alerts
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {alerts.length} active alerts detected
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
                {alerts.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No active alerts</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      All contributions look legitimate
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-5 rounded-xl border-2 ${colorClasses[color]} hover:shadow-lg transition-all cursor-pointer`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 mt-1">
                              {getAlertIcon(alert.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-base font-bold">
                                  {getAlertLabel(alert.type)}
                                </p>
                                <span className="text-lg font-bold">
                                  {(alert.riskScore * 100).toFixed(0)}%
                                </span>
                              </div>
                              <p className="text-sm font-medium mb-1">{alert.project}</p>
                              <p className="text-xs opacity-75">{alert.timestamp}</p>
                              
                              {/* Action buttons */}
                              <div className="flex gap-2 mt-3">
                                <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors">
                                  Investigate
                                </button>
                                <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors">
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
