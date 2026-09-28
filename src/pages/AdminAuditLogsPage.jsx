import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/components/ui/use-toast';
import { getAuditLogs } from '@/lib/auditLogger';
import { fetchUsers } from '@/lib/userUtils'; // To populate user filter
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuditDetailModal from '@/components/AuditDetailModal';
import { FileText, Eye, ArrowUpDown, ChevronLeft, ChevronRight, Search, CheckCircle, XCircle } from 'lucide-react';

const LOGS_PER_PAGE = 25;

const ACTIONS = ['all', 'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'ROLE_CHANGE', 'STATUS_CHANGE'];
const RESOURCE_TYPES = ['all', 'USER', 'COURSE', 'ENROLLMENT', 'CERTIFICATE', 'EMAIL', 'PROFILE', 'SYSTEM'];
const STATUSES = ['all', 'success', 'failure'];

const AdminAuditLogsPage = () => {
    const { toast } = useToast();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalLogs, setTotalLogs] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const [filters, setFilters] = useState({ action: 'all', resourceType: 'all', status: 'all', userId: 'all' });
    const [sort, setSort] = useState({ by: 'timestamp', ascending: false });

    const [selectedLog, setSelectedLog] = useState(null);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);

    const loadLogs = useCallback(async () => {
        setLoading(true);
        try {
            const { logs: fetchedLogs, count } = await getAuditLogs({
                page: currentPage,
                searchTerm: debouncedSearchTerm,
                filters,
                sort,
            });
            setLogs(fetchedLogs);
            setTotalLogs(count);
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch audit logs.' });
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearchTerm, filters, sort, toast]);
    
    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    useEffect(() => {
        async function loadUsers() {
            try {
                // Fetch all users for filter dropdown
                const { users: fetchedUsers } = await fetchUsers({ page: 1, searchTerm: '', filters: {}, sort: {} });
                 // This might need adjustment if fetchUsers doesn't return all users.
                 // For now, it will fetch the first page of users. A better implementation might fetch all users.
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Failed to fetch users for filter", error);
            }
        }
        loadUsers();
    }, []);

    const handleSort = (column) => {
        setSort(s => ({ by: column, ascending: s.by === column ? !s.ascending : true }));
    };

    const totalPages = Math.ceil(totalLogs / LOGS_PER_PAGE);

    const ActionBadge = ({ action }) => {
        const colors = {
            CREATE: 'bg-pl-info-bg text-pl-info-text',
            UPDATE: 'bg-pl-primary/10 text-pl-primary-text',
            DELETE: 'bg-pl-danger-bg text-pl-danger-text',
            LOGIN: 'bg-pl-success-bg text-pl-success-text',
            LOGOUT: 'bg-pl-sunken text-pl-muted',
            ROLE_CHANGE: 'bg-pl-warning-bg text-pl-warning-text',
            STATUS_CHANGE: 'bg-pl-warning-bg text-pl-warning-text',
            DEFAULT: 'bg-pl-sunken text-pl-muted',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[action] || colors.DEFAULT}`}>{action}</span>;
    };

    return (
        <>
            <Helmet><title>Audit Logs - Petrolord</title></Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="px-4 py-8 md:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-pl-text mb-2 flex items-center"><FileText className="w-8 h-8 mr-4" />Audit Logs</h1>
                        <p className="text-xl text-pl-muted">Track all important activities across the system.</p>
                    </div>
                </div>

                <div className="bg-pl-surface rounded-lg p-4 mb-6 border border-pl-border flex flex-wrap items-center gap-4">
                    <div className="relative flex-grow min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pl-muted h-5 w-5" /><Input placeholder="Search user, resource, or description..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-full" /></div>
                    <Select value={filters.userId} onValueChange={value => setFilters(f => ({ ...f, userId: value }))}><SelectTrigger className="flex-grow min-w-[150px]"><SelectValue placeholder="Filter by User" /></SelectTrigger><SelectContent><SelectItem value="all">All Users</SelectItem>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.display_name || u.email}</SelectItem>)}</SelectContent></Select>
                    <Select value={filters.action} onValueChange={value => setFilters(f => ({ ...f, action: value }))}><SelectTrigger className="flex-grow min-w-[150px]"><SelectValue /></SelectTrigger><SelectContent>{ACTIONS.map(a => <SelectItem key={a} value={a}>{a.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}</SelectContent></Select>
                    <Select value={filters.resourceType} onValueChange={value => setFilters(f => ({ ...f, resourceType: value }))}><SelectTrigger className="flex-grow min-w-[150px]"><SelectValue /></SelectTrigger><SelectContent>{RESOURCE_TYPES.map(r => <SelectItem key={r} value={r}>{r.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}</SelectContent></Select>
                    <Select value={filters.status} onValueChange={value => setFilters(f => ({ ...f, status: value }))}><SelectTrigger className="flex-grow min-w-[150px]"><SelectValue /></SelectTrigger><SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}</SelectContent></Select>
                </div>

                <div className="bg-pl-surface rounded-lg border border-pl-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-pl-sunken">
                                <tr>
                                    {['user_email', 'action', 'resource_type', 'description', 'status', 'timestamp'].map(col => (
                                        <th key={col} className="px-6 py-3 text-left font-semibold text-pl-text">
                                            <button onClick={() => handleSort(col)} className="flex items-center gap-2 hover:text-pl-text transition-colors">{col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}<ArrowUpDown className="w-3 h-3" /></button>
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-right font-semibold text-pl-text">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-pl-border">
                                {loading ? Array.from({ length: 10 }).map((_, i) => <tr key={i}><td colSpan="7" className="p-4"><div className="h-4 bg-pl-sunken rounded animate-pulse"></div></td></tr>)
                                : logs.length === 0 ? <tr><td colSpan="7" className="text-center py-10 text-pl-muted">No audit logs found.</td></tr>
                                : logs.map(log => (
                                    <tr key={log.id} className="hover:bg-pl-sunken/60">
                                        <td className="px-6 py-4 text-pl-text font-medium">{log.user_email || log.user_id}</td>
                                        <td className="px-6 py-4"><ActionBadge action={log.action} /></td>
                                        <td className="px-6 py-4 text-pl-text">{log.resource_type}</td>
                                        <td className="px-6 py-4 text-pl-text truncate max-w-sm">{log.description}</td>
                                        <td className="px-6 py-4">{log.status === 'success' ? <span className="inline-flex items-center gap-1 text-pl-success-text"><CheckCircle className="w-5 h-5" aria-hidden="true" />Success</span> : <span className="inline-flex items-center gap-1 text-pl-danger-text"><XCircle className="w-5 h-5" aria-hidden="true" />Failure</span>}</td>
                                        <td className="px-6 py-4 text-pl-text">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right"><Button variant="ghost" size="icon" aria-label="View details" onClick={() => { setSelectedLog(log); setDetailModalOpen(true); }}><Eye className="h-4 w-4" /></Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                    <span className="text-sm text-pl-muted">Page {currentPage} of {totalPages} ({totalLogs} logs)</span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4 mr-1" /> Previous</Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next <ChevronRight className="h-4 w-4 ml-1" /></Button>
                    </div>
                </div>
            </motion.div>

            <AuditDetailModal log={selectedLog} isOpen={isDetailModalOpen} onClose={() => setDetailModalOpen(false)} />
        </>
    );
};

export default AdminAuditLogsPage;