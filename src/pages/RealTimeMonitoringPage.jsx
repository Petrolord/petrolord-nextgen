import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Activity, Search, Filter, RefreshCw, Download, 
  Users, AlertTriangle, CheckCircle, XCircle, Clock,
  ShieldAlert, Database
} from 'lucide-react';
import { format } from 'date-fns';
import { utils, writeFile } from 'xlsx';
import { ACTIONS, LOG_TYPES } from '@/services/auditService';

const POLL_INTERVAL = 5000; // 5 seconds

// Icon chip tints on the theme roles. The danger chip sits on "Errors Today",
// so the colour always comes with its word.
const STAT_TONES = {
  info: 'bg-pl-info-bg text-pl-info-text',
  primary: 'bg-pl-primary/10 text-pl-primary-text',
  success: 'bg-pl-success-bg text-pl-success-text',
  danger: 'bg-pl-danger-bg text-pl-danger-text',
};

const StatCard = ({ title, value, icon: Icon, tone, trend }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-pl-muted">{title}</p>
          <h3 className="text-2xl font-bold text-pl-text mt-2 tabular-nums">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${STAT_TONES[tone] || STAT_TONES.primary}`}>
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs text-pl-muted">
          <span className="text-pl-success-text font-medium mr-1">{trend}</span> since last hour
        </div>
      )}
    </CardContent>
  </Card>
);

const RealTimeMonitoringPage = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  
  // Stats
  const [stats, setStats] = useState({
    activeUsers: 0,
    errorsToday: 0,
    loginsToday: 0,
    actionsToday: 0
  });

  // Filters
  const [filterAction, setFilterAction] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const refreshInterval = useRef(null);

  useEffect(() => {
    fetchLogs();
    fetchStats();

    if (autoRefresh) {
      refreshInterval.current = setInterval(() => {
        fetchLogs(true); // Quiet refresh
        fetchStats();
      }, POLL_INTERVAL);
    }

    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, [autoRefresh]);

  const fetchStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString();

      // Get logins today
      const { count: logins } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('action', 'LOGIN')
        .gte('timestamp', todayStr);

      // Get errors today
      const { count: errors } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'failure')
        .gte('timestamp', todayStr);

      // Get total actions today
      const { count: total } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', todayStr);

      // Estimate active users (unique actors in last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: activeData } = await supabase
        .from('audit_logs')
        .select('actor_id')
        .gte('timestamp', oneHourAgo);
      
      const uniqueActive = new Set(activeData?.map(l => l.actor_id)).size;

      setStats({
        loginsToday: logins || 0,
        errorsToday: errors || 0,
        actionsToday: total || 0,
        activeUsers: uniqueActive || 0
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLogs = async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      // Apply basic filters if not 'all'
      // Note: Complex filtering usually done on client for small datasets or specialized RPC for large
      // Here we fetch latest 100 and filter client side for responsiveness on the "Live Feed" feel
      
      const { data, error } = await query;
      
      if (error) throw error;
      setLogs(data);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      if (!quiet) setLoading(false);
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'LOGIN': return 'text-pl-info-text bg-pl-info-bg border-pl-info/30';
      case 'LOGOUT': return 'text-pl-muted bg-pl-sunken border-pl-border';
      case 'QUIZ_SUBMIT': return 'text-pl-primary-text bg-pl-primary/10 border-pl-primary/30';
      case 'GRADE_CHANGE': return 'text-pl-warning-text bg-pl-warning-bg border-pl-warning/30';
      case 'SYSTEM_ERROR': return 'text-pl-danger-text bg-pl-danger-bg border-pl-danger/30';
      case 'COURSE_COMPLETE': return 'text-pl-success-text bg-pl-success-bg border-pl-success/30';
      default: return 'text-pl-text bg-pl-sunken border-pl-border';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesRole = filterRole === 'all' || log.actor_role === filterRole;
    const matchesSearch = searchTerm === '' || 
      log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesAction && matchesRole && matchesSearch;
  });

  const exportLogs = () => {
    const dataToExport = filteredLogs.map(log => ({
      Timestamp: format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      Action: log.action,
      Actor: log.user_email,
      Role: log.actor_role,
      Resource: log.resource_name,
      Type: log.resource_type,
      Status: log.status,
      Details: JSON.stringify(log.details)
    }));

    const ws = utils.json_to_sheet(dataToExport);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Audit Logs");
    writeFile(wb, `Audit_Logs_${format(new Date(), 'yyyy-MM-dd_HHmm')}.xlsx`);
  };

  return (
    <div className="px-4 py-8 md:px-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-pl-text flex items-center gap-2">
            <Activity className="h-8 w-8 text-pl-accent-text" aria-hidden="true" /> Real-Time Monitoring
          </h1>
          <p className="text-pl-muted mt-1">
            Live system event feed. Last updated: {format(lastRefreshed, 'HH:mm:ss')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
           <Button 
            variant={autoRefresh ? "secondary" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-pl-success-bg text-pl-success-text border border-pl-success/40 hover:bg-pl-success-bg" : undefined}
           >
             <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
             {autoRefresh ? 'Live Updates On' : 'Live Updates Off'}
           </Button>
           <Button onClick={exportLogs} variant="outline">
             <Download className="w-4 h-4 mr-2" /> Export
           </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Active Users (1h)" value={stats.activeUsers} icon={Users} tone="info" />
        <StatCard title="Events Today" value={stats.actionsToday} icon={Database} tone="primary" />
        <StatCard title="Logins Today" value={stats.loginsToday} icon={CheckCircle} tone="success" />
        <StatCard title="Errors Today" value={stats.errorsToday} icon={AlertTriangle} tone="danger" />
      </div>

      {/* Main Log Feed */}
      <Card>
        <CardHeader className="pb-3">
           <div className="flex flex-col md:flex-row justify-between gap-4">
             <CardTitle className="text-pl-text text-lg font-medium">Event Stream</CardTitle>
             <div className="flex flex-wrap gap-2">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pl-muted" />
                    <Input 
                      placeholder="Search actor, resource..." 
                      className="pl-9 h-9 text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filterAction} onValueChange={setFilterAction}>
                    <SelectTrigger className="w-[140px] h-9 text-sm">
                        <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="LOGIN">Login</SelectItem>
                        <SelectItem value="QUIZ_SUBMIT">Quiz Submit</SelectItem>
                        <SelectItem value="GRADE_CHANGE">Grade Change</SelectItem>
                        <SelectItem value="SYSTEM_ERROR">Errors</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-[140px] h-9 text-sm">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="lecturer">Lecturer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
             </div>
           </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-pl-border overflow-x-auto">
             <Table>
                <TableHeader className="bg-pl-sunken">
                  <TableRow className="border-pl-border hover:bg-transparent">
                    <TableHead className="text-pl-muted w-[180px]">Timestamp</TableHead>
                    <TableHead className="text-pl-muted">Action</TableHead>
                    <TableHead className="text-pl-muted">Actor</TableHead>
                    <TableHead className="text-pl-muted">Resource</TableHead>
                    <TableHead className="text-pl-muted text-center">Status</TableHead>
                    <TableHead className="text-pl-muted text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id} className="border-pl-border hover:bg-pl-sunken/60">
                        <TableCell className="font-mono text-xs text-pl-muted whitespace-nowrap">
                          {format(new Date(log.timestamp), 'MMM d, HH:mm:ss')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${getActionColor(log.action)}`}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                           <div className="flex flex-col">
                              <span className="text-sm text-pl-text">{log.user_email || 'System'}</span>
                              <span className="text-xs text-pl-muted capitalize">{log.actor_role || 'n/a'}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                            <span className="text-sm text-pl-text">{log.resource_name || log.resource_id || 'n/a'}</span>
                            {log.resource_type && <span className="text-xs text-pl-muted ml-1">({log.resource_type})</span>}
                        </TableCell>
                        <TableCell className="text-center">
                           {log.status === 'success' ? (
                             <span className="inline-flex items-center gap-1 text-xs text-pl-success-text"><CheckCircle className="w-4 h-4" aria-hidden="true" />Success</span>
                           ) : (
                             <span className="inline-flex items-center gap-1 text-xs text-pl-danger-text"><XCircle className="w-4 h-4" aria-hidden="true" />Failure</span>
                           )}
                        </TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-pl-muted hover:text-pl-text" aria-label="Details">
                              <Search className="w-3 h-3" />
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-pl-muted">
                        No events found matching current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
             </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMonitoringPage;