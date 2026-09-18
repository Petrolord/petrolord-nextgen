import React from 'react';
import { CardDescription } from '@/components/ui/card';

// A capstone prompt whose conditions are RECORDS keeps its line breaks. The
// riskchange prompts are a paragraph of prose followed by registers written
// one record per line, and a plain CardDescription collapses every newline
// into a space, which flattens a register into one unreadable paragraph. A
// learner who cannot read the records cannot earn the grade.
//
// whitespace-pre-line keeps the newlines and still collapses runs of spaces
// and wraps long lines, so a prose-only prompt renders exactly as before.
// Only the riskchange page uses it; the other courses' pages are unchanged.
const CapstonePrompt = ({ prompt }) => (
  <CardDescription className="whitespace-pre-line" data-testid="capstone-prompt">
    {prompt}
  </CardDescription>
);

export default CapstonePrompt;
