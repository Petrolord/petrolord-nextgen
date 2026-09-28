import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Check, Trash2, Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Design system (batch 2A): rendered only by NotificationCenter on
// /dashboard/notifications, inside the signed-in scope. The type colour is
// a status role and each type keeps its own icon shape and label.
const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
    const { id, title, message, notification_type, is_read, created_at, data } = notification;
    
    // Icon selection based on type
    const getIcon = () => {
        switch (notification_type) {
            case 'error': return <XCircle className="h-5 w-5 text-pl-danger-text" role="img" aria-label="Error" />;
            case 'warning': return <AlertTriangle className="h-5 w-5 text-pl-warning-text" role="img" aria-label="Warning" />;
            case 'success': return <CheckCircle className="h-5 w-5 text-pl-success-text" role="img" aria-label="Success" />;
            default: return <Info className="h-5 w-5 text-pl-info-text" role="img" aria-label="Information" />;
        }
    };

    const category = data?.category || 'General';

    return (
        <div className={cn(
            "group flex gap-4 p-4 rounded-lg border transition-all duration-200",
            is_read ? "bg-pl-surface border-pl-border opacity-75 hover:opacity-100" : "bg-pl-raised border-pl-border-strong shadow-pl-sm"
        )}>
            <div className="flex-shrink-0 pt-1">
                {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm font-medium leading-none", is_read ? "text-pl-muted" : "text-pl-text")}>
                        {title}
                    </p>
                    <span className="text-xs text-pl-muted whitespace-nowrap">
                        {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
                    </span>
                </div>
                
                <p className="text-sm text-pl-muted leading-relaxed">
                    {message}
                </p>
                
                <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center rounded-full bg-pl-sunken px-2 py-0.5 text-xs font-medium text-pl-muted border border-pl-border">
                        {category}
                    </span>
                    {data?.action_url && (
                        <a 
                            href={data.action_url} 
                            className="text-xs text-pl-primary-text hover:text-pl-primary-text-hover hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            View Details
                        </a>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                {!is_read && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-pl-muted hover:text-pl-primary-text"
                        onClick={() => onMarkRead(id)}
                        title="Mark as read"
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                )}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-pl-muted hover:text-pl-danger-text"
                    onClick={() => onDelete(id)}
                    title="Delete"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default NotificationItem;