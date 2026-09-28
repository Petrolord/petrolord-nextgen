import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeClass } from '@/design/themeClass';

// Consistent locked-state affordance. The real gate is server-side; this
// only explains it.
// Inside a design-system scope (batch 1B) it takes the theme roles; outside
// one the legacy classes render unchanged.
const LockedCard = ({ title, note, backTo, backLabel = 'Back to course' }) => {
  const tc = useThemeClass();
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className={tc('h-10 w-10 text-[#BFFF00] mx-auto', 'h-10 w-10 text-pl-muted mx-auto')} />
      <h2 className={tc('text-2xl font-bold text-white', 'text-2xl font-bold text-pl-text')}>{title}</h2>
      {note && <p className={tc('text-gray-400', 'text-pl-muted')}>{note}</p>}
      {backTo && (
        <Link to={backTo}>
          <Button variant="outline" className={tc('border-gray-600 text-gray-200', undefined)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> {backLabel}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default LockedCard;
