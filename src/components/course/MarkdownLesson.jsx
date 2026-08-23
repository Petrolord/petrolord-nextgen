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
  h1: (p) => <h1 className="text-2xl font-bold text-white mt-8 mb-3 first:mt-0" {...p} />,
  h2: (p) => <h2 className="text-xl font-semibold text-white mt-7 mb-3 first:mt-0" {...p} />,
  h3: (p) => <h3 className="text-lg font-semibold text-white mt-5 mb-2" {...p} />,
  p: (p) => <p className="text-gray-300 leading-7 mb-4" {...p} />,
  ul: (p) => <ul className="list-disc pl-6 text-gray-300 space-y-1.5 mb-4" {...p} />,
  ol: (p) => <ol className="list-decimal pl-6 text-gray-300 space-y-1.5 mb-4" {...p} />,
  li: (p) => <li className="leading-7" {...p} />,
  strong: (p) => <strong className="text-white font-semibold" {...p} />,
  em: (p) => <em className="text-gray-200" {...p} />,
  a: (p) => <a className="text-[#BFFF00] hover:underline" target="_blank" rel="noreferrer" {...p} />,
  blockquote: (p) => (
    <blockquote className="border-l-2 border-[#BFFF00]/60 bg-[#0F172A] rounded-r-md pl-4 pr-3 py-2 my-4 text-gray-300 [&>p]:mb-0" {...p} />
  ),
  code: ({ inline, ...p }) =>
    inline
      ? <code className="bg-[#0F172A] border border-gray-700 rounded px-1.5 py-0.5 text-[13px] text-[#BFFF00]" {...p} />
      : <code className="text-gray-200 text-[13px]" {...p} />,
  pre: (p) => <pre className="bg-[#0F172A] border border-gray-700 rounded-md p-4 overflow-x-auto mb-4" {...p} />,
  table: (p) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border border-gray-700" {...p} />
    </div>
  ),
  thead: (p) => <thead className="bg-[#0F172A] text-gray-200" {...p} />,
  th: (p) => <th className="border border-gray-700 px-3 py-2 text-left font-medium" {...p} />,
  td: (p) => <td className="border border-gray-700 px-3 py-2 text-gray-300" {...p} />,
  hr: () => <hr className="border-gray-700 my-6" />,
};

function PanelCallout({ id }) {
  return (
    <div className="rounded-md border border-dashed border-gray-600 bg-[#0F172A] p-4 my-4 flex items-center gap-3">
      <MonitorPlay className="h-5 w-5 text-[#BFFF00] shrink-0" />
      <p className="text-sm text-gray-400 mb-0">
        Interactive panel <span className="font-mono text-gray-300">{id}</span>, available in the app.
      </p>
    </div>
  );
}

function PanelSlot({ id, printMode }) {
  const Panel = resolvePanel(id);
  if (printMode || !Panel) return <PanelCallout id={id} />;
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-32 rounded-md border border-gray-700 bg-[#0F172A] my-4">
        <Loader2 className="h-6 w-6 animate-spin text-[#BFFF00]" />
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
        className="max-w-full rounded-md border border-gray-700 my-4"
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
