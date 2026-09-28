import React from 'react';
import { motion } from 'framer-motion';

const SummaryCard = ({ label, value }) => (
    <motion.div
        className="bg-pl-sunken p-4 rounded-lg border border-pl-border"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        <p className="text-sm text-pl-muted font-medium">{label}</p>
        <p className="text-xl font-bold text-pl-text mt-1 tabular-nums">{value ?? 'n/a'}</p>
    </motion.div>
);

const ReportSummary = ({ summary }) => {
    const summaryItems = [
        { label: 'Total Actions', value: summary.totalActions?.toLocaleString() },
        { label: 'Success Rate', value: `${summary.successRate}%` },
        { label: 'Failed Actions', value: summary.failedActions?.toLocaleString() },
        { label: 'Unique Users Active', value: summary.uniqueUsers?.toLocaleString() },
        { label: 'Most Active User', value: summary.mostActiveUser },
        { label: 'Most Common Action', value: summary.mostCommonAction },
    ];

    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold text-pl-text mb-4">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {summaryItems.map(item => (
                    <SummaryCard key={item.label} label={item.label} value={item.value} />
                ))}
            </div>
        </div>
    );
};

export default ReportSummary;