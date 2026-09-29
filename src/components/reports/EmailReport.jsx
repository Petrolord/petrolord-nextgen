import React from 'react';
import ReportHeader from './ReportHeader';
import ReportDetails from './ReportDetails';
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

const EmailReport = ({ reportData, dateRange, generatedBy }) => {
    if (!reportData) return null;

    return (
        <div className="space-y-6">
            <ReportHeader title="Email Report" dateRange={dateRange} generatedBy={generatedBy} />
            
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-pl-text mb-4">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(reportData.summary).map(([key, value]) => (
                        <SummaryCard key={key} label={key} value={value} />
                    ))}
                </div>
            </div>

            <ReportDetails details={reportData.details} />
        </div>
    );
};

export default EmailReport;