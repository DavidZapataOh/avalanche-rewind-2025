'use client';

import { motion } from 'framer-motion';
import { WolfiMascot } from '@/components/WolfiMascot';
import { ActivityCalendar } from 'react-activity-calendar';
import React, { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface ActivitySceneProps {
    activeDays: number;
    longestStreakDays: number;
    totalTransactions: number;
    dailyActivity?: { date: string; count: number; level: number }[];
}

export function ActivityScene({ activeDays, totalTransactions, dailyActivity = [] }: ActivitySceneProps) {

    // Ensure we have a full year of data points for the calendar
    const calendarData = useMemo(() => {
        // If dailyActivity is empty, return placeholder year
        if (!dailyActivity || dailyActivity.length === 0) {
            const empty = [];
            const start = new Date('2025-01-01');
            const end = new Date('2025-12-31');
            for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
                empty.push({ date: d.toISOString().split('T')[0], count: 0, level: 0 });
            }
            return empty;
        }
        return dailyActivity;
    }, [dailyActivity]);

    // Avalanche Red Theme
    const theme = {
        light: ['#1f1f1f', '#4d1a1a', '#800000', '#D32F2F', '#E84142'],
        dark: ['#1f1f1f', '#4d1a1a', '#800000', '#D32F2F', '#E84142'],
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full px-4 relative">

            {/* Header */}
            <div className="text-center mb-8 shrink-0">
                <motion.h2
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-white text-4xl font-black uppercase tracking-tighter"
                >
                    Your Avalanche Season
                </motion.h2>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 font-mono"
                >
                    Every block tells a story. Here is yours.
                </motion.p>
            </div>

            {/* KPI Clouds */}
            <div className="flex gap-8 mb-8">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="bg-[#1a1a1a] border border-white/10 px-6 py-3 rounded-2xl flex flex-col items-center"
                >
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Txs</div>
                    <div className="text-3xl font-black text-white">{totalTransactions}</div>
                </motion.div>

                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="bg-[#1a1a1a] border border-white/10 px-6 py-3 rounded-2xl flex flex-col items-center"
                >
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Active Days</div>
                    <div className="text-3xl font-black text-white">{activeDays}</div>
                </motion.div>
            </div>

            {/* Heatmap Container */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="w-full max-w-4xl bg-[#0a0a0a] p-6 rounded-xl border-2 border-[#333] shadow-2xl overflow-x-auto"
            >
                <div className="min-w-max mx-auto">
                    <ActivityCalendar
                        data={calendarData}
                        theme={theme}
                        blockSize={12}
                        blockMargin={4}
                        fontSize={12}
                        renderBlock={(block, activity) => (
                            React.cloneElement(block, {
                                'data-tooltip-id': 'activity-tooltip',
                                'data-tooltip-content': `${activity.count} Txs on ${activity.date}`,
                            })
                        )}
                        labels={{
                            legend: {
                                less: 'Less',
                                more: 'More',
                            },
                        }}
                        showWeekdayLabels
                        style={{ color: '#ffffff' }}
                    />
                    <Tooltip id="activity-tooltip" style={{ backgroundColor: '#E84142', color: '#fff', fontWeight: 'bold', borderRadius: '8px' }} />
                </div>
            </motion.div>

            {/* Wolfi Mascot */}
            <motion.div
                className="absolute bottom-6 right-10 md:right-20 pointer-events-none"
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 1, type: "spring" }}
            >
                <WolfiMascot expression="cool" scale={0.7} />
            </motion.div>

        </div>
    );
}
