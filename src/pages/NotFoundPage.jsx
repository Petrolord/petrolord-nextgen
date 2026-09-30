import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicPage, AUTH_COLUMN, AUTH_ICON_TILE, AUTH_TITLE } from '@/components/public/PublicPage';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <PublicPage testId="not-found-theme-scope" mainClassName={AUTH_COLUMN}>
      <div className="max-w-lg text-center">
        <p aria-hidden="true" className="select-none font-pl-display text-[120px] font-semibold leading-none text-pl-border-strong/40 sm:text-[150px]">404</p>

        <div className="relative -mt-12 mb-8 sm:-mt-16">
            <div className={`${AUTH_ICON_TILE} border border-pl-warning/40 bg-pl-warning-bg shadow-pl-md`}>
                <AlertCircle className="h-7 w-7 text-pl-warning-text" />
            </div>
            <h1 className={`${AUTH_TITLE} mb-2`}>Page Not Found</h1>
            <p className="text-pl-muted">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
                onClick={() => navigate('/dashboard')}
                className="px-8 font-semibold"
            >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
            </Button>
            <Button
                variant="outline"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
            </Button>
        </div>
      </div>
    </PublicPage>
  );
};

export default NotFoundPage;