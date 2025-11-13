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
    const chartData = {
        labels: data.map(stat => stat.month),
        datasets: [
            {
                label: 'Akta Kelahiran',
                data: data.map(stat => stat.aktaKelahiran),
                backgroundColor: '#10b981',
                borderRadius: 4,
            },
            {
                label: 'Akta Kematian',
                data: data.map(stat => stat.aktaKematian),
                backgroundColor: '#64748b',
                borderRadius: 4,
            },
            {
                label: 'Surat Kehilangan',
                data: data.map(stat => stat.suratKehilangan),
                backgroundColor: '#f59e0b', 
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    boxWidth: 20,
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