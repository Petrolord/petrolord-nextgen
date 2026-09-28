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
import { useThemeClass } from '@/design/themeClass';

// Design system: theme roles inside the signed-in scope, legacy classes
// (unchanged) elsewhere. See docs/scope/DesignSystem-Rollout.md.

const NotificationBell = () => {
    const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
    const navigate = useNavigate();
    const tc = useThemeClass();

    const recentNotifications = notifications.slice(0, 5);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={tc("relative text-slate-400 hover:text-white", "relative text-pl-muted hover:text-pl-text")}>
                    <Bell className={`w-5 h-5 ${unreadCount > 0 ? tc('animate-pulse text-white', 'animate-pulse text-pl-text') : ''}`} />
                    {unreadCount > 0 && (
                        <span className={tc("absolute top-2 right-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#BFFF00] ring-2 ring-[#1E293B]", "absolute top-2 right-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-pl-accent ring-2 ring-pl-surface")}>
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={tc("w-80 md:w-96 bg-[#1E293B] border-slate-700 text-slate-200", "w-80 md:w-96")} align="end" forceMount>
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span className={tc("font-semibold text-white", "font-semibold text-pl-text")}>Notifications ({unreadCount})</span>
                    {unreadCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className={tc("h-auto px-2 text-xs text-[#BFFF00] hover:text-[#a3d900] hover:bg-transparent", "h-auto px-2 text-xs text-pl-primary-text hover:text-pl-primary-text-hover hover:bg-transparent")}
                            onClick={(e) => { e.preventDefault(); markAllAsRead(); }}
                        >
                            Mark all read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className={tc("bg-slate-700", undefined)} />
                
                <ScrollArea className="h-[300px]">
                    {recentNotifications.length > 0 ? (
                        <div className="flex flex-col gap-1 p-2">
                            {recentNotifications.map(notification => (
                                <div key={notification.id} className="relative">
                                    <div 
                                        className={`p-3 rounded-md text-sm cursor-pointer ${tc('hover:bg-slate-800', 'hover:bg-pl-sunken')} transition-colors ${!notification.is_read ? tc('bg-slate-800/50 border-l-2 border-[#BFFF00]', 'bg-pl-sunken/60 border-l-2 border-pl-accent') : ''}`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className={tc("font-medium text-white mb-1", "font-medium text-pl-text mb-1")}>{notification.title}</div>
                                        <div className={tc("text-slate-400 line-clamp-2 text-xs", "text-pl-muted line-clamp-2 text-xs")}>{notification.message}</div>
                                        <div className={tc("text-[10px] text-slate-500 mt-1 flex justify-between", "text-[10px] text-pl-muted mt-1 flex justify-between")}>
                                            <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                                            {!notification.is_read && <span className={tc("text-[#BFFF00]", "text-pl-accent-text")}>New</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={tc("flex flex-col items-center justify-center h-full py-8 text-slate-500", "flex flex-col items-center justify-center h-full py-8 text-pl-muted")}>
                            <Bell className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    )}
                </ScrollArea>
                
                <DropdownMenuSeparator className={tc("bg-slate-700", undefined)} />
                <DropdownMenuItem 
                    className={tc("w-full text-center justify-center cursor-pointer text-slate-400 hover:text-white hover:bg-slate-800 py-3 focus:bg-slate-800", "w-full text-center justify-center cursor-pointer text-pl-muted hover:text-pl-text py-3")}
                    onSelect={() => navigate('/dashboard/notifications')}
                >
                    View Notification Center
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationBell;