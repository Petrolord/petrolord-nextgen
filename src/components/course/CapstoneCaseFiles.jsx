import React from 'react';
import { Download } from 'lucide-react';
import { useThemeClass } from '@/design/themeClass';

// The capstone case files, offered for download on the capstone card. A
// capstone set on its own case (FOLLOW-ON-PROGRAMME section 3, pick A) ships
// its inputs here rather than inside a panel, so no panel opens on the case:
// the learner downloads the files and opens them in the panels themselves.
// `files` is [{ name, text }]; each becomes a plain-text download.
const download = (name, text) => {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Inside a design-system scope (batch 1B) the box and its buttons take the
// theme roles; outside one the legacy classes render unchanged.
const CapstoneCaseFiles = ({ files, note }) => {
  const tc = useThemeClass();
  return (
    <div className={tc('rounded-md border border-gray-700 bg-[#0F172A] p-3 space-y-2', 'rounded-md border border-pl-border bg-pl-sunken p-3 space-y-2')} data-testid="capstone-case-files">
      <p className={tc('text-white text-sm font-medium mb-0', 'text-pl-text text-sm font-medium mb-0')}>Capstone case files</p>
      {note && <p className={tc('text-xs text-gray-400 mb-0', 'text-xs text-pl-muted mb-0')}>{note}</p>}
      <div className="flex flex-wrap gap-2">
        {files.map((f) => (
          <button key={f.name} type="button" onClick={() => download(f.name, f.text)}
            className={tc('inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-600 bg-gray-800 text-gray-200 text-xs hover:border-[#BFFF00]', 'inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-pl-border-strong bg-pl-surface text-pl-text text-xs hover:bg-pl-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus')}>
            <Download className={tc('h-3 w-3 text-[#BFFF00]', 'h-3 w-3 text-pl-primary-text')} /> {f.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CapstoneCaseFiles;
