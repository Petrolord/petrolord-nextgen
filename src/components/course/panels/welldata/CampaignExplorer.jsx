import React, { useMemo, useState } from 'react';
import { TEACHING_FILES, computeAdvanced, computeCampaign } from '@/lib/welldataTeaching';
import { parseLas } from '@petrolord/engines/engines/welldata/lasParse.js';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';
import UserLasPicker, { mergeFiles } from './UserLasPicker';
import { useThemeClass } from '@/design/themeClass';

// Campaign explorer: all six teaching files at once, with each aggregate
// shown beside the composition behind it. The point of the tier is that
// a total hides what it is made of, so the per-curve breakdown of the
// null count is one click away rather than buried. It opens on the teaching
// campaign; a campaign of the learner's own files (the capstone case) runs
// through the same pipeline once they open the files.
const fmt = (v) => (Number.isFinite(v) ? String(v) : '-');

const TEACHING = computeAdvanced();

function curveBreakdown(f) {
  const parsed = parseLas(f.text);
  const rows = [];
  for (let i = 1; i < parsed.curves.length; i++) {
    const c = parsed.curves[i];
    let finite = 0;
    for (const v of c.data) if (Number.isFinite(v)) finite += 1;
    rows.push({
      mnemonic: c.mnemonic, unit: c.unit, n: c.data.length,
      nulls: c.data.length - finite, dead: finite === 0,
    });
  }
  return { nullValue: parsed.nullValue, rows };
}

const CampaignExplorer = () => {
  const tc = useThemeClass();
  const [userFiles, setUserFiles] = useState([]);
  const [useOwn, setUseOwn] = useState(false);
  const own = useOwn && userFiles.length > 0;
  const files = own ? userFiles : TEACHING_FILES;
  const A = useMemo(() => {
    if (!own) return TEACHING;
    try {
      return computeCampaign(userFiles);
    } catch (e) {
      return { error: e.message };
    }
  }, [own, userFiles]);
  const [openFile, setOpenFile] = useState('nullheavy_20');
  const openF = files.find((x) => x.id === openFile) || files[0];
  const detail = useMemo(() => {
    try {
      return curveBreakdown(openF);
    } catch {
      return { nullValue: null, rows: [] };
    }
  }, [openF]);
  const detailTotal = detail.rows.reduce((s, r) => s + r.nulls, 0);

  const picker = (
    <div className="flex flex-wrap items-center gap-2">
      <UserLasPicker label="Open your own LAS files as a campaign"
        onFiles={(fs) => { setUserFiles((prev) => mergeFiles(prev, fs)); setUseOwn(true); setOpenFile(fs[0].id); }} />
      {userFiles.length > 0 && (
        <>
          {[[false, 'Teaching campaign'], [true, `Your campaign (${userFiles.length} files)`]].map(([v, l]) => (
            <button key={l} type="button" onClick={() => setUseOwn(v)}
              className={`px-3 py-1.5 rounded-md border text-xs ${useOwn === v
                ? tc('bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold', 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold')
                : tc('bg-gray-800 text-gray-300 border-gray-600', 'bg-pl-surface text-pl-text border-pl-border-strong')}`}>{l}</button>
          ))}
          <button type="button" onClick={() => { setUserFiles([]); setUseOwn(false); }}
            className={tc('text-xs text-gray-400 hover:underline', 'text-xs text-pl-muted hover:underline')}>Clear your files</button>
        </>
      )}
    </div>
  );

  if (A.error) {
    return (
      <PanelShell title="Campaign explorer" subtitle="One of your files could not be imported.">
        {picker}
        <p className={tc('text-red-400 text-sm mb-0', 'text-pl-danger-text text-sm mb-0')}>Import failed: {A.error}</p>
      </PanelShell>
    );
  }

  return (
    <PanelShell title="Campaign explorer"
      subtitle={`All ${A.perFile.length} ${own ? 'of your' : 'teaching'} files through the import pipeline at once. Every aggregate below is shown beside the composition behind it.`}>
      {picker}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={tc('text-gray-400 border-b border-gray-700', 'text-pl-muted border-b border-pl-border')}>
              <th className="text-left py-2 pr-4">file</th>
              <th className="text-left py-2 pr-4">curves</th>
              <th className="text-left py-2 pr-4">converted</th>
              <th className="text-left py-2 pr-4">uniform step</th>
              <th className="text-left py-2 pr-4">dead</th>
              <th className="text-left py-2 pr-4">nulls</th>
              <th className="text-left py-2">samples</th>
            </tr>
          </thead>
          <tbody>
            {A.perFile.map((f) => (
              <tr key={f.id} className={tc('border-b border-gray-800 cursor-pointer hover:bg-gray-800', 'border-b border-pl-border cursor-pointer hover:bg-pl-raised')}
                onClick={() => setOpenFile(f.id)}>
                <td className={`py-2 pr-4 ${openF.id === f.id ? tc('text-[#BFFF00] font-semibold', 'text-pl-primary-text font-semibold') : tc('text-white', 'text-pl-text')}`}>{f.label}</td>
                <td className={tc('py-2 pr-4 text-gray-300', 'py-2 pr-4 text-pl-text')}>{f.curves}</td>
                <td className={`py-2 pr-4 ${f.converted ? tc('text-[#BFFF00] font-semibold', 'text-pl-primary-text font-semibold') : tc('text-gray-500', 'text-pl-muted')}`}>
                  {f.converted ? 'YES' : 'no'}
                </td>
                <td className={`py-2 pr-4 ${f.uniform ? tc('text-gray-500', 'text-pl-muted') : tc('text-[#f472b6] font-semibold', 'text-pl-warning-text font-semibold')}`}>
                  {f.uniform ? 'yes' : 'NO'}
                </td>
                <td className={`py-2 pr-4 ${f.dead ? tc('text-[#f472b6] font-semibold', 'text-pl-danger-text font-semibold') : tc('text-gray-500', 'text-pl-muted')}`}>{f.dead}</td>
                <td className={tc('py-2 pr-4 text-gray-300', 'py-2 pr-4 text-pl-text')}>{f.nulls}</td>
                <td className={tc('py-2 text-gray-300', 'py-2 text-pl-text')}>{f.samples}</td>
              </tr>
            ))}
            <tr className={tc('border-t-2 border-gray-600', 'border-t-2 border-pl-border-strong')}>
              <td className={tc('py-2 pr-4 text-[#BFFF00] font-semibold', 'py-2 pr-4 text-pl-primary-text font-semibold')}>campaign</td>
              <td className={tc('py-2 pr-4 text-[#BFFF00] font-semibold', 'py-2 pr-4 text-pl-primary-text font-semibold')}>{A.campaignCurves}</td>
              <td className={tc('py-2 pr-4 text-[#BFFF00] font-semibold', 'py-2 pr-4 text-pl-primary-text font-semibold')}>{A.convertedFiles}</td>
              <td className={tc('py-2 pr-4 text-[#BFFF00] font-semibold', 'py-2 pr-4 text-pl-primary-text font-semibold')}>{A.uniformFiles} of {A.perFile.length}</td>
              <td className={tc('py-2 pr-4 text-[#BFFF00] font-semibold', 'py-2 pr-4 text-pl-primary-text font-semibold')}>{A.deadCurves}</td>
              <td className={tc('py-2 pr-4 text-gray-500', 'py-2 pr-4 text-pl-muted')}>see below</td>
              <td className={tc('py-2 text-gray-500', 'py-2 text-pl-muted')}></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={tc('text-xs text-gray-500', 'text-xs text-pl-muted')}>
        Click any file above to open its per-curve composition.
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={tc('text-gray-400 border-b border-gray-700', 'text-pl-muted border-b border-pl-border')}>
              <th className="text-left py-2 pr-4">{openF.label}: curve</th>
              <th className="text-left py-2 pr-4">unit</th>
              <th className="text-left py-2 pr-4">nulls</th>
              <th className="text-left py-2 pr-4">of samples</th>
              <th className="text-left py-2">verdict</th>
            </tr>
          </thead>
          <tbody>
            {detail.rows.map((r) => (
              <tr key={r.mnemonic} className={tc('border-b border-gray-800', 'border-b border-pl-border')}>
                <td className={tc('py-2 pr-4 text-white', 'py-2 pr-4 text-pl-text')}>{r.mnemonic}</td>
                <td className={tc('py-2 pr-4 text-gray-300', 'py-2 pr-4 text-pl-text')}>{r.unit}</td>
                <td className={`py-2 pr-4 ${r.dead ? tc('text-[#f472b6] font-semibold', 'text-pl-danger-text font-semibold') : tc('text-gray-300', 'text-pl-text')}`}>{r.nulls}</td>
                <td className={tc('py-2 pr-4 text-gray-300', 'py-2 pr-4 text-pl-text')}>{r.n}</td>
                <td className={`py-2 ${r.dead ? tc('text-[#f472b6] font-semibold', 'text-pl-danger-text font-semibold') : tc('text-gray-500', 'text-pl-muted')}`}>
                  {r.dead ? 'DEAD, no finite samples' : r.nulls > 0 ? 'scattered nulls' : 'complete'}
                </td>
              </tr>
            ))}
            <tr className={tc('border-t-2 border-gray-600', 'border-t-2 border-pl-border-strong')}>
              <td className={tc('py-2 pr-4 text-[#BFFF00] font-semibold', 'py-2 pr-4 text-pl-primary-text font-semibold')}>total</td>
              <td className={tc('py-2 pr-4 text-gray-500', 'py-2 pr-4 text-pl-muted')}>NULL {fmt(detail.nullValue)}</td>
              <td className={tc('py-2 pr-4 text-[#BFFF00] font-semibold', 'py-2 pr-4 text-pl-primary-text font-semibold')}>{detailTotal}</td>
              <td className={tc('py-2 pr-4 text-gray-500', 'py-2 pr-4 text-pl-muted')}></td>
              <td className={tc('py-2 text-gray-500', 'py-2 text-pl-muted')}></td>
            </tr>
          </tbody>
        </table>
      </div>

      <TileGrid>
        <Tile label="Curves imported" value={String(A.campaignCurves)} unit="depth excluded" />
        <Tile label="Files needing conversion" value={String(A.convertedFiles)} unit="count" />
        <Tile label="Dead curves" value={String(A.deadCurves)} unit="count" />
        <Tile label="Files with a uniform step" value={String(A.uniformFiles)} unit={`of ${A.perFile.length}`} />
        {!own && <Tile label="wrapped_12 depth samples" value={String(A.wrappedSamples)} unit="samples" />}
        {!own && <Tile label="nullheavy_20 flagged nulls" value={String(A.nullheavyNulls)} unit="count" />}
      </TileGrid>

      {own ? (
      <Note>
        Your campaign: the per-file table above gives each file's samples and flagged nulls, and a
        click opens its per-curve composition below.
      </Note>
      ) : (
      <Note>
        Open nullheavy_20 in the lower table. Its 272 nulls are not 272 scattered bad readings: 201
        of them are NPHI, which has no finite sample at all and is the campaign's one dead curve,
        and only 71 are scattered nulls inside a GR that does have data. Those are two different
        findings with two different responses, and the single number 272 shows neither. Every
        aggregate on this panel behaves the same way, which is why each one is shown beside what it
        is made of.
      </Note>
      )}
    </PanelShell>
  );
};

export default CampaignExplorer;
