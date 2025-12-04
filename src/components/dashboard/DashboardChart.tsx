import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import type { DashboardDataDto } from '../../types/dashboard.types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface DashboardChartProps {
    data: DashboardDataDto['monthlyStats'];
}

const DashboardChart: React.FC<DashboardChartProps> = ({ data }) => {
    // Get all keys except 'month' from the first data item
    const dataKeys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'month') : [];

    // Predefined colors for legacy + some extras for dynamic
    const colorMap: Record<string, string> = {
        'Akta Kelahiran': '#10b981', // emerald
        'Akta Kematian': '#64748b', // slate
        'Surat Kehilangan': '#f59e0b', // amber
        'Surat Permohonan Pindah': '#3b82f6', // blue
        'Surat Perubahan Kependudukan': '#8b5cf6', // purple
    };

    // Helper to generate random color if not in map
    const getColor = (key: string, index: number) => {
        if (colorMap[key]) return colorMap[key];
        const colors = ['#ec4899', '#ef4444', '#f97316', '#84cc16', '#06b6d4', '#6366f1'];
        return colors[index % colors.length];
    };

    const chartData = {
        labels: data.map(stat => stat.month),
        datasets: dataKeys.map((key, index) => ({
            label: key,
            data: data.map(stat => (stat as any)[key] || 0),
            backgroundColor: getColor(key, index),
            borderRadius: 4,
        })),
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    boxWidth: 18,
                    font: {
                        size: 12,
                    },
                }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                }
            },
        },
    };

    return <Bar options={options} data={chartData} />;
};

export default DashboardChart;
