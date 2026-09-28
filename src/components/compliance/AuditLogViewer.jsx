import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { auditService } from '@/services/auditService';
import { Loader2, Search, Filter, Download, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { exportToCSV } from '@/lib/reportExportUtils';

const AuditLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    logType: 'all',
    status: 'all',
    severity: 'all'
  });

  // Modal State
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [page, pageSize, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const activeFilters = { ...filters };
      if (activeFilters.logType === 'all') delete activeFilters.logType;
      if (activeFilters.status === 'all') delete activeFilters.status;
      if (activeFilters.severity === 'all') delete activeFilters.severity;

      const { data, count } = await auditService.fetchLogs({
        page,
        pageSize,
        filters: activeFilters
      });
      setLogs(data);
      setTotalCount(count);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to page 1 on filter change
  };

  const openLogDetails = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleExport = () => {
      // Basic client-side export of current view
      // Ideally this would trigger a backend job for full dataset export
      const exportData = {
          summary: { exportedAt: new Date().toLocaleString() },
          details: logs.map(l => ({
              Timestamp: new Date(l.timestamp).toLocaleString(),
              Action: l.action,
              User: l.profiles?.email || 'System',
              Resource: l.resource_type,
              Status: l.status
          }))
      };
      exportToCSV(exportData, 'Audit_Logs_Export');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'success': return <Badge className="bg-pl-success-bg text-pl-success-text border-0">Success</Badge>;
      case 'failure': return <Badge className="bg-pl-danger-bg text-pl-danger-text border-0">Failure</Badge>;
      default: return <Badge variant="outline" className="text-pl-muted">{status || 'n/a'}</Badge>;
    }
  };

  const getSeverityBadge = (severity) => {
      if (!severity) return null;
      switch(severity) {
          case 'critical': return <Badge className="bg-pl-danger text-pl-danger-fg border-0">CRITICAL</Badge>;
          case 'high': return <Badge className="bg-pl-danger-bg text-pl-danger-text border-0">HIGH</Badge>;
          case 'medium': return <Badge className="bg-pl-warning-bg text-pl-warning-text border-0">MEDIUM</Badge>;
          default: return null;
      }
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center bg-pl-surface p-4 rounded-lg border border-pl-border">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-pl-muted" />
            <Input 
              placeholder="Search actions or resources..." 
              className="pl-8"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <Select value={filters.logType} onValueChange={(val) => handleFilterChange('logType', val)}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Log Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="action">Action</SelectItem>
              <SelectItem value="access">Access</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(val) => handleFilterChange('status', val)}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failure">Failure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-pl-sunken">
              <TableRow className="hover:bg-transparent border-pl-border">
                <TableHead className="text-pl-muted">Timestamp</TableHead>
                <TableHead className="text-pl-muted">Severity</TableHead>
                <TableHead className="text-pl-muted">User</TableHead>
                <TableHead className="text-pl-muted">Action</TableHead>
                <TableHead className="text-pl-muted">Resource</TableHead>
                <TableHead className="text-pl-muted">Status</TableHead>
                <TableHead className="text-right text-pl-muted">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-pl-primary" />
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-pl-muted">
                    No logs found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} className="border-pl-border hover:bg-pl-sunken/60">
                    <TableCell className="text-pl-text whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                        {getSeverityBadge(log.severity)}
                    </TableCell>
                    <TableCell className="text-pl-text">
                      {log.profiles?.email || <span className="text-pl-muted italic">System</span>}
                    </TableCell>
                    <TableCell className="text-pl-text font-medium">{log.action}</TableCell>
                    <TableCell className="text-pl-text">
                      {log.resource_type} <span className="text-pl-muted text-xs">#{log.resource_id?.slice(0, 8)}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" aria-label="View details" onClick={() => openLogDetails(log)}>
                        <Eye className="w-4 h-4 text-pl-muted hover:text-pl-text" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-2 text-sm text-pl-muted">
        <div>
          Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} entries
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(p => p + 1)}
            disabled={page * pageSize >= totalCount}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Transaction ID: {selectedLog?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-pl-muted block mb-1">Timestamp</label>
                  <div className="text-pl-text">{new Date(selectedLog.timestamp).toLocaleString()}</div>
                </div>
                <div>
                  <label className="text-pl-muted block mb-1">User Agent</label>
                  <div className="text-pl-text truncate" title={selectedLog.user_agent}>{selectedLog.user_agent}</div>
                </div>
                <div>
                  <label className="text-pl-muted block mb-1">Action</label>
                  <div className="text-pl-text font-mono">{selectedLog.action}</div>
                </div>
                 <div>
                  <label className="text-pl-muted block mb-1">Status</label>
                  <div className="text-pl-text">{selectedLog.status.toUpperCase()}</div>
                </div>
              </div>

              <div className="border-t border-pl-border pt-4">
                <label className="text-pl-muted block mb-2">Technical Details (JSON)</label>
                <pre className="bg-pl-sunken p-4 rounded-md overflow-x-auto text-xs font-mono text-pl-text">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>

              {(selectedLog.old_value || selectedLog.new_value) && (
                <div className="grid grid-cols-2 gap-4 border-t border-pl-border pt-4">
                  <div>
                    <label className="text-pl-muted block mb-2">Old Value</label>
                    <pre className="bg-pl-sunken p-2 rounded text-xs font-mono text-pl-danger-text overflow-x-auto">
                        {selectedLog.old_value ? JSON.stringify(selectedLog.old_value, null, 2) : 'null'}
                    </pre>
                  </div>
                  <div>
                    <label className="text-pl-muted block mb-2">New Value</label>
                    <pre className="bg-pl-sunken p-2 rounded text-xs font-mono text-pl-success-text overflow-x-auto">
                        {selectedLog.new_value ? JSON.stringify(selectedLog.new_value, null, 2) : 'null'}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogViewer;