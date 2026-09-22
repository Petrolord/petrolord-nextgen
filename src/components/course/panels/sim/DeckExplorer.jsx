import React, { useMemo, useState } from 'react';
import {
  deckTextAt, keywordCounts, gridSummary, SECTIONS, TEACHING_MEAN_M, TEACHING_OWC_M,
} from './simLab';
import { PanelShell, Tile, TileGrid, Note, NumField } from '@/components/course/panels/petrophysics/panelKit';

// Deck explorer: the composed Ekene deck, section by section. The point is
// that a deck is an ordered text file with six sections, and every number in
// it came from somewhere the previous four courses can name.

const fmt = (v, d = 4) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d }) : '-');

const DeckExplorer = () => {
  const [section, setSection] = useState('GRID');
  const [maxLines, setMaxLines] = useState(24);
  // The deck opens as committed; a capstone brief may state a regional mean
  // and a contact to rebuild it at, and the learner types them in.
  const [mean, setMean] = useState(String(TEACHING_MEAN_M));
  const [owc, setOwc] = useState(String(TEACHING_OWC_M));

  const out = useMemo(() => {
    try {
      const m = Number(mean);
      const c = Number(owc);
      if (!(m > 1400 && m < 1700) || !(c > 1400 && c < 1700)) throw new Error('Type a regional mean and a contact in metres TVD, both between 1400 and 1700.');
      const teaching = m === TEACHING_MEAN_M && c === TEACHING_OWC_M;
      const lines = deckTextAt(teaching ? null : { regionalMean: m, owcM: c }).split('\n');
      const starts = SECTIONS.map((name) => ({ name, line: lines.indexOf(name) }));
      const sections = starts.map((st, idx) => ({
        ...st,
        endLine: idx + 1 < starts.length ? starts[idx + 1].line - 1 : lines.length - 1,
        lineCount: (idx + 1 < starts.length ? starts[idx + 1].line - 1 : lines.length - 1) - st.line + 1,
      }));
      const active = sections.find((s) => s.name === section) || sections[0];
      const body = lines.slice(active.line, Math.min(active.endLine + 1, active.line + maxLines));
      return {
        lines, sections, active, body, counts: keywordCounts(), grid: gridSummary(),
      };
    } catch (e) {
      return { error: e.message };
    }
  }, [section, maxLines, mean, owc]);

  const inputs = (
    <div className="grid gap-3 grid-cols-2 items-end">
      <NumField label="Regional mean (m TVD)" value={mean} onChange={setMean} />
      <NumField label="Oil water contact (m TVD)" value={owc} onChange={setOwc} />
    </div>
  );

  if (out.error) {
    return <PanelShell title="Deck explorer">{inputs}<Note>{out.error}</Note></PanelShell>;
  }

  const { lines, sections, active, body, counts, grid } = out;

  return (
    <PanelShell
      title="Deck explorer"
      subtitle="The composed Ekene deck: six sections, in order, in field units"
    >
      {inputs}
      <div className="text-xs text-gray-500">
        The deck opens as committed (regional mean {TEACHING_MEAN_M} m, contact {TEACHING_OWC_M} m). Type another
        setting and the deck is rebuilt: the tops kriged at that mean, the EQUIL datum and contact, and the well
        reference depths.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-gray-400 text-xs mb-1">Section</p>
            <div className="flex flex-wrap gap-1">
              {SECTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSection(s)}
                  className={`px-2 py-1 text-xs rounded border ${
                    s === active.name
                      ? 'bg-[#BFFF00] text-black border-[#BFFF00]'
                      : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">
              Lines shown: <span className="text-white">{maxLines}</span>
            </p>
            <input
              type="range" min={8} max={60} step={4} value={maxLines}
              onChange={(e) => setMaxLines(Number(e.target.value))}
              className="w-full accent-[#BFFF00]"
            />
        </div>
      </div>

      <TileGrid>
        <Tile label="Cells" value={fmt(grid.cellCount, 0)} unit={`${grid.nx}x${grid.ny}x${grid.nz}`} />
        <Tile label="Deck lines" value={fmt(lines.length, 0)} />
        <Tile label={`${active.name} starts`} value={fmt(active.line, 0)} unit={`of ${fmt(active.lineCount, 0)}`} />
        <Tile label="WCONHIST blocks" value={fmt(counts.WCONHIST, 0)} unit="per period" />
        <Tile label="DATES blocks" value={fmt(counts.DATES, 0)} />
        <Tile label="TSTEP blocks" value={fmt(counts.TSTEP, 0)} unit="prediction" />
      </TileGrid>

      <div className="mt-4 rounded border border-gray-700 bg-black/40 overflow-x-auto">
        <pre className="text-[11px] leading-relaxed text-gray-200 p-3 whitespace-pre">
          {body.map((l, idx) => (
            <div key={`${active.name}-${active.line + idx}`}>
              <span className="text-gray-600 select-none">{String(active.line + idx).padStart(4, ' ')}  </span>
              <span className={l.trim() && l === l.trim() && l === l.toUpperCase() ? 'text-[#BFFF00]' : ''}>{l || ' '}</span>
            </div>
          ))}
        </pre>
      </div>

      <Note>
        The sections must appear in this order: {sections.map((s) => s.name).join(' then ')}. A simulator
        reads them in sequence, so a keyword in the wrong section is not a warning, it is a different deck.
      </Note>
    </PanelShell>
  );
};

export default DeckExplorer;
