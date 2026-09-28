import React from 'react';

const StatusBadge = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    if (status === 'success' || status === 'sent') {
        return <span className={`${baseClasses} bg-pl-success-bg text-pl-success-text`}>Success</span>;
    }
    if (status === 'failure' || status === 'failed') {
        return <span className={`${baseClasses} bg-pl-danger-bg text-pl-danger-text`}>Failure</span>;
    }
     if (status === 'completed') {
        return <span className={`${baseClasses} bg-pl-info-bg text-pl-info-text`}>Completed</span>;
    }
    return <span className={`${baseClasses} bg-pl-sunken text-pl-muted`}>{status ?? 'n/a'}</span>;
};

const ReportDetails = ({ details }) => {
    if (!details || details.length === 0) {
        return <p className="text-pl-muted text-center py-8">No detailed data available for this report.</p>;
    }
    
    const headers = Object.keys(details[0]);

    const renderCellContent = (content) => {
        if (typeof content === 'string' && content.startsWith('{')) {
            return <pre className="whitespace-pre-wrap bg-pl-sunken text-pl-text font-mono p-2 rounded text-xs max-w-md overflow-auto">{content}</pre>;
        }
        if (typeof content === 'boolean') {
            return content ? 'Yes' : 'No';
        }
        return content ?? 'n/a';
    };


    return (
        <div>
            <h3 className="text-xl font-semibold text-pl-text mb-4">Detailed Logs</h3>
            <div className="bg-pl-surface rounded-lg border border-pl-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-pl-sunken text-pl-text">
                            <tr>
                                {headers.map(header => (
                                    <th key={header} className="px-6 py-3 font-semibold capitalize">{header.replace(/_/g, ' ')}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pl-border text-pl-text">
                            {details.map((row, index) => (
                                <tr key={row.id || index} className="hover:bg-pl-sunken/60">
                                    {headers.map(header => (
                                        <td key={header} className="px-6 py-4 whitespace-nowrap">
                                            {header.toLowerCase().includes('status') ? <StatusBadge status={row[header]} /> : renderCellContent(row[header])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;