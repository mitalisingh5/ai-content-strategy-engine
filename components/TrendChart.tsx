import React from 'react';

interface TrendChartProps {
    data: { month: string; volume: number }[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-sm text-gray-500">No data available</div>;
    }

    const width = 300;
    const height = 100;
    const padding = { top: 10, right: 0, bottom: 20, left: 0 };

    const maxVolume = Math.max(...data.map(d => d.volume));
    const minVolume = Math.min(...data.map(d => d.volume));

    const getX = (index: number) => {
        return padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
    };

    const getY = (volume: number) => {
        if (maxVolume === minVolume) {
            return height - padding.bottom;
        }
        return height - padding.bottom - ((volume - minVolume) / (maxVolume - minVolume)) * (height - padding.top - padding.bottom);
    };

    const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.volume)}`).join(' ');
    
    const areaPath = `${linePath} L ${getX(data.length - 1)} ${height - padding.bottom} L ${getX(0)} ${height - padding.bottom} Z`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" className="text-primary" stopOpacity="0.4"/>
                    <stop offset="100%" className="text-primary" stopOpacity="0"/>
                </linearGradient>
            </defs>
            <g>
                <path d={areaPath} fill="url(#chartGradient)" />
                <path d={linePath} stroke="currentColor" className="text-primary" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

                {data.map((d, i) => {
                    // Show labels for the first, middle, and last months
                    if (i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1) {
                         return (
                            <text
                                key={i}
                                x={getX(i)}
                                y={height - 5}
                                textAnchor="middle"
                                fontSize="10"
                                className="fill-current text-text-muted-light dark:text-text-muted-dark"
                            >
                                {d.month}
                            </text>
                        );
                    }
                    return null;
                })}
            </g>
        </svg>
    );
};

export default TrendChart;
