import React, { useState } from 'react';
import { readUserFiles } from '@/lib/welldataTeaching';

// "Open your own LAS files": reads files from the learner's computer (the
// capstone case files, or any LAS they have) so a panel can run them through
// the same parser and pipeline as the teaching files. Nothing is uploaded;
// the text is read in the browser.
const UserLasPicker = ({ onFiles, label = 'Open your own LAS files' }) => {
  const [error, setError] = useState(null);
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-dashed border-gray-500 text-gray-300 cursor-pointer hover:border-[#BFFF00]">
        {label}
        <input type="file" multiple accept=".las,.LAS,.txt" className="hidden" data-testid="user-las-input"
          onChange={async (e) => {
            try {
              setError(null);
              const files = await readUserFiles(e.target.files);
              if (files.length) onFiles(files);
            } catch (err) {
              setError(err.message);
            }
            e.target.value = '';
          }} />
      </label>
      {error && <span className="text-red-400">Could not read that file: {error}</span>}
    </div>
  );
};

// Merge newly opened files into a list, replacing any file of the same name.
export const mergeFiles = (prev, next) => {
  const names = new Set(next.map((f) => f.label));
  return [...prev.filter((f) => !names.has(f.label)), ...next];
};

export default UserLasPicker;
