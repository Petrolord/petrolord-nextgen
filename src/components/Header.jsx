import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, User, ArrowLeft, X, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useApplicationLayout } from '@/contexts/ApplicationLayoutContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ViewAsSelector from '@/components/ViewAsSelector';
import NotificationBell from '@/components/notifications/NotificationBell';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { SIDEBAR_DRAWER_ID } from '@/components/Sidebar';

// Design system (docs/scope/DesignSystem-Rollout.md): the header sits inside
// the signed-in scope on theme roles and shows the light/dark ThemeToggle.

const Header = ({ sidebarOpen = false, setSidebarOpen }) => {
  const { user, signOut, profile } = useAuth();
  const { isFullScreen, currentAppName, moduleName, exitFullScreen } = useApplicationLayout();
  const navigate = useNavigate();

  return (
    <header className="bg-pl-surface border-b border-pl-border h-16 flex items-center justify-between px-4 md:px-6 z-20 transition-all duration-300">
      
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        
        {/* Full Screen Mode: Show Back Navigation */}
        {isFullScreen ? (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-pl-muted hover:text-pl-text hover:bg-pl-sunken gap-2 pl-0"
                    onClick={exitFullScreen}
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Back to {moduleName || 'Dashboard'}</span>
                </Button>
                <div className="h-6 w-px bg-pl-border"></div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-pl-accent-text tracking-wide uppercase px-2 py-0.5 rounded-sm bg-pl-accent/10 border border-pl-accent/30">
                        {currentAppName}
                    </span>
                </div>
            </div>
        ) : (
            /* Normal Mode: Mobile Trigger & View Selector */
            <div className="flex items-center gap-2">
                {/* Phone: opens the navigation drawer (the rail is hidden below md) */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-pl-muted"
                    aria-label="Open navigation"
                    aria-haspopup="dialog"
                    aria-expanded={sidebarOpen ? 'true' : 'false'}
                    aria-controls={SIDEBAR_DRAWER_ID}
                    data-testid="nav-menu-button"
                    onClick={() => setSidebarOpen && setSidebarOpen(true)}
                >
                    <Menu className="w-6 h-6" aria-hidden="true" />
                </Button>
                
                {/* View As Selector - placed prominently in header for Admins */}
                <div className="hidden md:block">
                    <ViewAsSelector />
                </div>
            </div>
        )}
      </div>

      {/* CENTER SECTION (Optional Search) */}
      {!isFullScreen && (
        <div className="hidden md:flex items-center relative max-w-md w-full mx-4 transition-all">
            <Search className="absolute left-3 text-pl-muted w-4 h-4" />
            <input 
            type="text" 
            placeholder="Search resources, wells, or reports..." 
            className="w-full bg-pl-surface border border-pl-border-strong rounded-full py-1.5 pl-10 pr-4 text-sm text-pl-text placeholder:text-pl-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus transition-colors"
            />
        </div>
      )}

      {/* RIGHT SECTION: Actions & Profile */}
      <div className="flex items-center space-x-2 md:space-x-4">
        
        {/* In Full Screen Mode, show an explicit 'Exit' button for clarity */}
        {isFullScreen && (
             <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex border-pl-danger/40 text-pl-danger-text hover:bg-pl-danger-bg hover:text-pl-danger-text"
                onClick={exitFullScreen}
             >
                <X className="w-4 h-4 mr-2" />
                Exit Tool
             </Button>
        )}

        {/* Light / dark switch (renders only inside the design-system scope) */}
        <ThemeToggle />

        {/* Integrated Notification Bell */}
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border border-pl-border-strong">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={profile?.display_name || "User"} />
                <AvatarFallback className="bg-pl-sunken text-pl-text">
                    {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : <User className="w-4 h-4"/>}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-pl-text">{profile?.display_name || "User"}</p>
                <p className="text-xs leading-none text-pl-muted">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Mobile View As Selector fallback */}
            {!isFullScreen && (
                <div className="md:hidden px-2 py-2">
                    <ViewAsSelector />
                </div>
            )}
            
            <DropdownMenuItem className="cursor-pointer">
                <Link to="/dashboard/settings" className="w-full flex items-center">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-pl-danger-text focus:text-pl-danger-text cursor-pointer" onClick={signOut}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;