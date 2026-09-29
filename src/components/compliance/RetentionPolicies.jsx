import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { auditService } from '@/services/auditService';
import { useToast } from '@/components/ui/use-toast';
import { Archive, Save } from 'lucide-react';

const RetentionPolicies = () => {
    const { toast } = useToast();
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        loadPolicies();
    }, []);

    const loadPolicies = async () => {
        try {
            const data = await auditService.getRetentionPolicies();
            setPolicies(data);
        } catch (error) {
            console.error("Failed to load policies", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePolicyChange = (id, field, value) => {
        setPolicies(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
        setHasChanges(true);
    };

    const handleSave = async (policy) => {
        try {
            await auditService.updateRetentionPolicy(policy.id, {
                retention_days: policy.retention_days,
                auto_delete: policy.auto_delete
            });
            toast({ title: "Policy Saved", description: `Updated ${policy.policy_name}` });
        } catch (error) {
            toast({ variant: "destructive", title: "Save Failed", description: error.message });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-pl-text flex items-center">
                    <Archive className="w-5 h-5 mr-2 text-pl-accent-text" aria-hidden="true" />
                    Data Retention Policies
                </CardTitle>
                <p className="text-sm text-pl-muted">
                    Configure how long audit logs are kept before being automatically archived or deleted.
                </p>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-pl-sunken">
                        <TableRow className="border-pl-border">
                            <TableHead className="text-pl-muted">Policy Name</TableHead>
                            <TableHead className="text-pl-muted">Log Type</TableHead>
                            <TableHead className="text-pl-muted">Retention (Days)</TableHead>
                            <TableHead className="text-pl-muted">Auto Delete</TableHead>
                            <TableHead className="text-right text-pl-muted">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {policies.map((policy) => (
                            <TableRow key={policy.id} className="border-pl-border">
                                <TableCell className="font-medium text-pl-text">{policy.policy_name}</TableCell>
                                <TableCell className="text-pl-text capitalize">{policy.log_type}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            type="number" 
                                            className="w-24"
                                            value={policy.retention_days}
                                            onChange={(e) => handlePolicyChange(policy.id, 'retention_days', parseInt(e.target.value))}
                                        />
                                        <span className="text-pl-muted text-sm">days</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Switch 
                                        checked={policy.auto_delete}
                                        onCheckedChange={(checked) => handlePolicyChange(policy.id, 'auto_delete', checked)}
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => handleSave(policy)}
                                    >
                                        <Save className="w-4 h-4 mr-2" /> Save
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default RetentionPolicies;