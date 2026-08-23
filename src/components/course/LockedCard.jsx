import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Consistent locked-state affordance. The real gate is server-side; this
// only explains it.
const LockedCard = ({ title, note, backTo, backLabel = 'Back to course' }) => (
  <div className="max-w-xl mx-auto p-8 text-center space-y-4">
    <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    {note && <p className="text-gray-400">{note}</p>}
    {backTo && (
      <Link to={backTo}>
        <Button variant="outline" className="border-gray-600 text-gray-200">
          <ArrowLeft className="h-4 w-4 mr-1" /> {backLabel}
        </Button>
      </Link>
    )}
  </div>
);

export default LockedCard;
