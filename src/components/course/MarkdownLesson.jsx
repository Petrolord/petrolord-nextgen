import React, { Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Loader2, MonitorPlay } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { splitLessonSegments, figureUrl } from '@/lib/courseContent';
import { resolvePanel } from '@/content/courses/panelRegistry';

// Renders one lesson's markdown (GFM + KaTeX math) with interactive
// panels interleaved at their {{panel:<id>}} markers. printMode swaps
// panels for a static callout (admin handbook / print).

const mdComponents = {
  h1: (p) => <h1 className="text-2xl font-bold text-pl-text mt-8 mb-3 first:mt-0" {...p} />,
  h2: (p) => <h2 className="text-xl font-semibold text-pl-text mt-7 mb-3 first:mt-0" {...p} />,
  h3: (p) => <h3 className="text-lg font-semibold text-pl-text mt-5 mb-2" {...p} />,
  p: (p) => <p className="text-pl-text leading-7 mb-4" {...p} />,
  ul: (p) => <ul className="list-disc pl-6 text-pl-text space-y-1.5 mb-4" {...p} />,
  ol: (p) => <ol className="list-decimal pl-6 text-pl-text space-y-1.5 mb-4" {...p} />,
  li: (p) => <li className="leading-7" {...p} />,
  strong: (p) => <strong className="text-pl-text font-semibold" {...p} />,
  em: (p) => <em className="text-pl-text" {...p} />,
  a: (p) => <a className="text-pl-primary-text hover:text-pl-primary-text-hover hover:underline" target="_blank" rel="noreferrer" {...p} />,
  blockquote: (p) => (
    <blockquote className="border-l-2 border-pl-accent bg-pl-sunken rounded-r-md pl-4 pr-3 py-2 my-4 text-pl-text [&>p]:mb-0" {...p} />
  ),
  code: ({ inline, ...p }) =>
    inline
      ? <code className="bg-pl-sunken border border-pl-border rounded px-1.5 py-0.5 text-[13px] text-pl-text" {...p} />
      : <code className="text-pl-text text-[13px]" {...p} />,
  pre: (p) => <pre className="bg-pl-sunken border border-pl-border rounded-md p-4 overflow-x-auto mb-4" {...p} />,
  table: (p) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border border-pl-border" {...p} />
    </div>
  ),
  thead: (p) => <thead className="bg-pl-sunken text-pl-text" {...p} />,
  th: (p) => <th className="border border-pl-border px-3 py-2 text-left font-medium" {...p} />,
  td: (p) => <td className="border border-pl-border px-3 py-2 text-pl-text" {...p} />,
  hr: () => <hr className="border-pl-border my-6" />,
};

function PanelCallout({ id }) {
  return (
    <div className="rounded-md border border-dashed border-pl-border-strong bg-pl-sunken p-4 my-4 flex items-center gap-3">
      <MonitorPlay className="h-5 w-5 text-pl-accent-text shrink-0" />
      <p className="text-sm text-pl-muted mb-0">
        Interactive panel <span className="font-mono text-pl-text">{id}</span>, available in the app.
      </p>
    </div>
  );
}

function PanelSlot({ id, printMode }) {
  const Panel = resolvePanel(id);
  if (printMode || !Panel) return <PanelCallout id={id} />;
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-32 rounded-md border border-pl-border bg-pl-sunken my-4">
        <Loader2 className="h-6 w-6 animate-spin text-pl-primary-text" />
      </div>
    }>
      <div className="my-4"><Panel /></div>
    </Suspense>
  );
}

const MarkdownLesson = ({ raw, app, tier, moduleKey, printMode = false }) => {
  const segments = splitLessonSegments(raw);
  const components = {
    ...mdComponents,
    img: ({ src, alt, ...rest }) => (
      <img
        src={figureUrl(app, tier, moduleKey, src)}
        alt={alt || ''}
        className="max-w-full rounded-md border border-pl-border my-4"
        {...rest}
      />
    ),
  };
  return (
    <div className="markdown-lesson">
      {segments.map((seg, i) =>
        seg.type === 'panel' ? (
          <PanelSlot key={`panel-${seg.id}-${i}`} id={seg.id} printMode={printMode} />
        ) : (
          <ReactMarkdown
            key={`md-${i}`}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={components}
          >
            {seg.content}
          </ReactMarkdown>
        ),
      )}
    </div>
  );
};

export default MarkdownLesson;
