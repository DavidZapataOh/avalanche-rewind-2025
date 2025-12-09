'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { getShortMonthName } from '@/lib/utils';
import { Calendar, Flame, Activity } from 'lucide-react';
import type { MonthlyActivity } from '@/lib/types';

interface ActivitySlideProps {
    activeDays: number;
    longestStreakDays: number;
    mostActiveMonths: MonthlyActivity[];
    totalTransactions: number;
}

export function ActivitySlide({
    activeDays,
    longestStreakDays,
    mostActiveMonths,
    totalTransactions,
}: ActivitySlideProps) {
    // Prepare chart data for all 12 months
    const chartData = Array.from({ length: 12 }, (_, i) => {
        const monthData = mostActiveMonths.find(m => m.month === i + 1);
        return {
            month: getShortMonthName(i + 1),
            txCount: monthData?.txCount || 0,
        };
    });

    const maxTxCount = Math.max(...chartData.map(d => d.txCount));
    const mostActiveMonth = mostActiveMonths.length > 0
        ? mostActiveMonths.reduce((a, b) => a.txCount > b.txCount ? a : b)
        : null;

    return (
        <div className="slide-container overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-avax-red/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto w-full px-6"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <span className="text-gray-400 uppercase tracking-widest text-sm font-medium">
                        Your Year in Motion
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mt-2 leading-tight">
                        {mostActiveMonth ? (
                            <>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-avax-red to-orange-500">
                                    {getShortMonthName(mostActiveMonth.month)}
                                </span> was legendary.
                            </>
                        ) : (
                            'The Avalanche Journey'
                        )}
                    </h2>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
                    {[
                        { icon: Activity, label: "Total Transactions", value: totalTransactions, color: "text-blue-400" },
                        { icon: Calendar, label: "Active Days", value: activeDays, color: "text-green-400" },
                        { icon: Flame, label: "Longest Streak", value: longestStreakDays, color: "text-orange-500" }
                    ].map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group"
                        >
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <stat.icon className={`w-5 h-5 ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                                <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</span>
                            </div>
                            <AnimatedNumber
                                value={stat.value}
                                className="text-4xl font-black text-white"
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="w-full h-[300px] pl-0"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#0D1224', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                                dy={10}
                            />
                            <Bar dataKey="txCount" radius={[6, 6, 0, 0]} animationDuration={1500}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.txCount === maxTxCount ? '#E84142' : 'rgba(232, 65, 66, 0.4)'}
                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </motion.div>
        </div>
    );
}
