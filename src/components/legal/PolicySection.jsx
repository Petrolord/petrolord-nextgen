import React from 'react';

// Batch 6B: on the roles of the public frame (always light). The print
// variants are kept, so a printed policy is black on white.
const PolicySection = ({ id, title, children }) => {
  return (
    <section id={id} className="mb-12 scroll-mt-28 border-b border-pl-border pb-8 last:border-0 print:border-gray-200">
      <h2 className="text-2xl font-bold text-pl-text mb-4 flex items-center gap-3 print:text-black">
        <span className="w-1.5 h-6 bg-pl-accent rounded-full print:bg-black"></span>
        {title}
      </h2>
      <div className="text-pl-text space-y-4 leading-relaxed print:text-gray-800 text-lg">
        {children}
      </div>
    </section>
  );
};

export default PolicySection;
