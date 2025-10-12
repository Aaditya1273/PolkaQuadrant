'use client';

import { useEffect, useRef } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

interface QuadrantDataPoint {
  x: number; // Funding amount
  y: number; // Impact score
  r: number; // Reputation (bubble size)
  label: string; // Project name
  risk: number; // Risk score (0-1)
}

interface QuadrantChartProps {
  data: QuadrantDataPoint[];
}

export default function QuadrantChart({ data }: QuadrantChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Get risk color based on risk score
    const getRiskColor = (risk: number, alpha: number = 0.7) => {
      if (risk < 0.3) return `rgba(34, 197, 94, ${alpha})`; // Green - Low risk
      if (risk < 0.5) return `rgba(234, 179, 8, ${alpha})`; // Yellow - Medium risk
      if (risk < 0.7) return `rgba(249, 115, 22, ${alpha})`; // Orange - High risk
      return `rgba(239, 68, 68, ${alpha})`; // Red - Very high risk
    };

    // Prepare datasets
    const datasets = data.map((point) => ({
      label: point.label,
      data: [{ x: point.x, y: point.y, r: point.r }],
      backgroundColor: getRiskColor(point.risk, 0.6),
      borderColor: getRiskColor(point.risk, 1),
      borderWidth: 2,
    }));

    // Create chart
    chartInstance.current = new ChartJS(ctx, {
      type: 'bubble',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: document.documentElement.classList.contains('dark')
                ? '#e5e7eb'
                : '#374151',
              usePointStyle: true,
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: (context: any) => {
                const point = data[context.datasetIndex];
                return [
                  `Funding: $${point.x.toLocaleString()}`,
                  `Impact: ${point.y}%`,
                  `Reputation: ${point.r}`,
                  `Risk: ${(point.risk * 100).toFixed(1)}%`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Funding Amount ($)',
              color: document.documentElement.classList.contains('dark')
                ? '#e5e7eb'
                : '#374151',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
            grid: {
              color: document.documentElement.classList.contains('dark')
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              color: document.documentElement.classList.contains('dark')
                ? '#9ca3af'
                : '#6b7280',
              callback: (value: any) => `$${(value / 1000).toFixed(0)}K`,
            },
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Impact Score (%)',
              color: document.documentElement.classList.contains('dark')
                ? '#e5e7eb'
                : '#374151',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
            grid: {
              color: document.documentElement.classList.contains('dark')
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              color: document.documentElement.classList.contains('dark')
                ? '#9ca3af'
                : '#6b7280',
              callback: (value: any) => `${value}%`,
            },
          },
        },
      },
    });

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="relative h-[400px] w-full">
      <canvas ref={chartRef} />
      
      {/* Legend for risk colors */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-600 dark:text-gray-400">Low Risk (&lt;30%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-gray-600 dark:text-gray-400">Medium Risk (30-50%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-gray-600 dark:text-gray-400">High Risk (50-70%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-600 dark:text-gray-400">Very High Risk (&gt;70%)</span>
        </div>
      </div>
    </div>
  );
}
