import React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

// Design system: theme roles. See docs/scope/DesignSystem-Rollout.md.

const NotificationBell = () => {
    const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
    const navigate = useNavigate();

    const recentNotifications = notifications.slice(0, 5);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-pl-muted hover:text-pl-text">
                    <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-pulse text-pl-text' : ''}`} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-pl-accent ring-2 ring-pl-surface">
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 md:w-96" align="end" forceMount>
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span className="font-semibold text-pl-text">Notifications ({unreadCount})</span>
                    {unreadCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto px-2 text-xs text-pl-primary-text hover:text-pl-primary-text-hover hover:bg-transparent"
                            onClick={(e) => { e.preventDefault(); markAllAsRead(); }}
                        >
                            Mark all read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <ScrollArea className="h-[300px]">
                    {recentNotifications.length > 0 ? (
                        <div className="flex flex-col gap-1 p-2">
                            {recentNotifications.map(notification => (
                                <div key={notification.id} className="relative">
                                    <div 
                                        className={`p-3 rounded-md text-sm cursor-pointer ${'hover:bg-pl-sunken'} transition-colors ${!notification.is_read ? 'bg-pl-sunken/60 border-l-2 border-pl-accent' : ''}`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="font-medium text-pl-text mb-1">{notification.title}</div>
                                        <div className="text-pl-muted line-clamp-2 text-xs">{notification.message}</div>
                                        <div className="text-[10px] text-pl-muted mt-1 flex justify-between">
                                            <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                                            {!notification.is_read && <span className="text-pl-accent-text">New</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-pl-muted">
                            <Bell className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    )}
                </ScrollArea>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    className="w-full text-center justify-center cursor-pointer text-pl-muted hover:text-pl-text py-3"
                    onSelect={() => navigate('/dashboard/notifications')}
                >
                    View Notification Center
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationBell;