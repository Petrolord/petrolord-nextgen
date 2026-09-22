import React from 'react';
import { Download } from 'lucide-react';

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

const CapstoneCaseFiles = ({ files, note }) => (
  <div className="rounded-md border border-gray-700 bg-[#0F172A] p-3 space-y-2" data-testid="capstone-case-files">
    <p className="text-white text-sm font-medium mb-0">Capstone case files</p>
    {note && <p className="text-xs text-gray-400 mb-0">{note}</p>}
    <div className="flex flex-wrap gap-2">
      {files.map((f) => (
        <button key={f.name} type="button" onClick={() => download(f.name, f.text)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-600 bg-gray-800 text-gray-200 text-xs hover:border-[#BFFF00]">
          <Download className="h-3 w-3 text-[#BFFF00]" /> {f.name}
        </button>
      ))}
    </div>
  </div>
);

export default CapstoneCaseFiles;
