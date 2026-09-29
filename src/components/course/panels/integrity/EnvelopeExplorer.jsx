import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import ChartFrame from '@/components/charts/ChartFrame';
import { GRID_STYLE, TOOLTIP_STYLE, LEGEND_PROPS } from '@/utils/chartTheme';
import { AXIS_TICK, SVG_CHART, seriesColor } from '@/utils/chartSvg';
import {
  ELEMENT_STATUSES, ENVELOPE_STATUSES, ELEMENT_KINDS,
  publishedElements, verifyPublished, statusSweep, categorySweep, flowPotentialSweep, seatCount,
} from './integrityLab';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Envelope explorer, the Associate tier. Who is in the envelope, what one
// element's status does to the whole of it, how the two envelope statuses map
// to a traffic light, and what the published well actually scores.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const MODES = [
  ['elements', 'The roster and the seats it fills'],
  ['status', 'One element against the whole envelope'],
  ['category', 'The traffic light table'],
  ['verify', 'The published well, verified'],
];

const CATEGORY_TEXT = {
  green: 'text-pl-success-text',
  yellow: 'text-pl-warning-text',
  orange: 'text-pl-danger-text',
  red: 'text-pl-danger-text font-semibold',
};

const CATEGORY_CELL = {
  green: 'bg-pl-success-bg border-pl-success/40 text-pl-success-text',
  yellow: 'bg-pl-warning-bg border-pl-warning/40 text-pl-warning-text',
  orange: 'bg-pl-danger-bg border-pl-danger/40 text-pl-danger-text',
  red: 'bg-pl-danger border-pl-danger text-pl-danger-fg',
};

const ENVELOPE_TEXT = {
  intact: 'text-pl-success-text',
  degraded: 'text-pl-warning-text',
  failed: 'text-pl-danger-text',
  empty: 'text-pl-danger-text',
};

const kindLabel = (kind) => (ELEMENT_KINDS.find((k) => k.kind === kind) || {}).label || kind || '-';

const Elements = () => {
  const [common, setCommon] = useState('none');
  const roster = useMemo(() => {
    try { return publishedElements(); } catch { return null; }
  }, []);
  const shown = useMemo(() => {
    if (!roster) return null;
    if (common === 'none') return roster;
    return roster.map((el) => (el.name === common ? { ...el, envelope: 'both' } : el));
  }, [roster, common]);
  const seats = useMemo(() => {
    try { return seatCount(shown); } catch { return null; }
  }, [shown]);
  const published = useMemo(() => {
    try { return seatCount(); } catch { return null; }
  }, []);
  const verdict = useMemo(() => {
    try { return verifyPublished({ elements: shown }); } catch { return null; }
  }, [shown]);

  if (!roster || !roster.length || !seats || !published || !verdict) {
    return <Note>No barrier roster is available to read. A well with nothing recorded against it has no envelope to verify, which is itself a finding rather than a clean sheet.</Note>;
  }

  const options = [['none', 'None, the roster as published']].concat(roster.map((el) => [el.name, el.name]));
  const bars = [
    { name: 'physical elements', v: seats.physical },
    { name: 'primary seats', v: seats.primary },
    { name: 'secondary seats', v: seats.secondary },
    { name: 'seats claimed', v: seats.seats },
  ];

  return (
    <>
      <SelectField label="Serve one element into BOTH envelopes" value={common} onChange={setCommon} options={options} />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Physical elements" value={fmt(seats.physical, 0)} />
          <Tile label="Primary seats" value={fmt(seats.primary, 0)} />
          <Tile label="Secondary seats" value={fmt(seats.secondary, 0)} />
          <Tile label="Seats claimed in total" value={fmt(seats.seats, 0)} />
          <Tile label="Common elements" value={fmt(seats.common, 0)} />
          <Tile label="Overcount" value={fmt(seats.overcount, 0)} />
          <Tile label="Published overcount" value={fmt(published.overcount, 0)} />
          <Tile label="Common WBE flagged by the engine" value={verdict.shared.length ? verdict.shared.join(', ') : 'none'} />
        </TileGrid>
      </div>
      <ChartFrame height={224} className="mt-3">
        <BarChart data={bars} margin={{ top: 10, right: 16, bottom: 5, left: 0 }}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis dataKey="name" tick={{ ...AXIS_TICK, fontSize: 10 }} />
          <YAxis allowDecimals={false} tick={AXIS_TICK}
            label={{ value: 'count', angle: -90, position: 'insideLeft', fill: SVG_CHART.note, fontSize: 10 }} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend {...LEGEND_PROPS} />
          <ReferenceLine y={seats.physical} stroke={seriesColor(4)}
            label={{ value: 'the physical count', fill: seriesColor(4), fontSize: 10, position: 'top' }} />
          <Bar dataKey="v" name="how many" fill={seriesColor(1)} isAnimationActive={false} />
        </BarChart>
      </ChartFrame>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">element</th>
              <th className="text-left pr-3">kind</th>
              <th className="text-left pr-3">envelope</th>
              <th className="text-left">status</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((el) => (
              <tr key={el.name} className={el.envelope === 'both' ? 'text-pl-accent-text font-semibold' : ''}>
                <td className="pr-3">{el.name}</td>
                <td className="pr-3">{kindLabel(el.kind)}</td>
                <td className="pr-3">{el.envelope}</td>
                <td className={el.status === 'verified' ? 'text-pl-success-text' : 'text-pl-warning-text'}>{el.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        The published roster has {fmt(seats.physical, 0)} physical elements filling
        {' '}{fmt(published.seats, 0)} seats, an overcount of {fmt(published.overcount, 0)}, so on
        this well the two envelopes really are made of different hardware. Serve any one element
        into both envelopes with the selector above and watch the seat total climb past the
        physical count while the well acquires no new steel at all. That gap is exactly the
        independence the two-barrier rule assumes and does not have.
      </div>
      <Note>
        A common well barrier element is not forbidden, it is a dispensation, and the engine
        reports it as a warning rather than a failure. What it is not is free: one element serving
        two envelopes means one failure can take both of them, and the count of barriers on the
        drawing stops being the count of barriers in the well.
      </Note>
    </>
  );
};

const Status = () => {
  const [base, setBase] = useState('verified');
  const sweep = useMemo(() => {
    try { return statusSweep(base); } catch { return null; }
  }, [base]);
  if (!sweep || !sweep.length) {
    return <Note>That is not an element status the engine will accept. An element is verified, degraded, failed or not-verified, and nothing else.</Note>;
  }
  const worst = sweep.filter((r) => r.primary !== 'intact');
  const nv = sweep.find((r) => r.status === 'not-verified');
  const deg = sweep.find((r) => r.status === 'degraded');
  return (
    <>
      <SelectField label="Status of every OTHER element" value={base} onChange={setBase}
        options={ELEMENT_STATUSES.map((s) => [s, s])} />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Element statuses in the vocabulary" value={fmt(ELEMENT_STATUSES.length, 0)} />
          <Tile label="Envelope statuses in the vocabulary" value={fmt(ENVELOPE_STATUSES.length, 0)} />
          <Tile label="Rows where one element drags the envelope down" value={fmt(worst.length, 0)} />
          <Tile label="not-verified gives" value={nv ? nv.primary : '-'} />
          <Tile label="degraded gives" value={deg ? deg.primary : '-'} />
          <Tile label="Do those two agree" value={nv && deg && nv.primary === deg.primary ? 'yes, exactly' : 'no'} />
        </TileGrid>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">status of the ONE element</th>
              <th className="text-left pr-3">primary envelope</th>
              <th className="text-left pr-3">secondary envelope</th>
              <th className="text-left">what moved</th>
            </tr>
          </thead>
          <tbody>
            {sweep.map((r) => (
              <tr key={r.status}>
                <td className="pr-3">{r.status}</td>
                <td className={`pr-3 ${ENVELOPE_TEXT[r.primary] || ''}`}>{r.primary}</td>
                <td className={`pr-3 ${ENVELOPE_TEXT[r.secondary] || ''}`}>{r.secondary}</td>
                <td>{r.primary === r.secondary ? 'nothing, both envelopes read the same' : 'the primary alone, and it holds the bad element'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        Every row above puts three good elements and one questionable one in the primary envelope,
        and the primary reads back as the questionable one every time. There is no averaging here
        and no majority vote. The WORST element sets the whole envelope, which is the only safe
        reduction for a barrier: three sound seals and one that leaks is a leak.
      </div>
      <Note>
        Read the not-verified row beside the degraded row. They give the same answer, and that is
        deliberate. An element nobody has checked is not a working barrier, it is an unknown, and
        the standard treats an unknown as a degradation. If it passed through as verified instead,
        a well nobody had tested would read as sound. Note also the vocabulary: an ELEMENT is
        verified, degraded, failed or not-verified, while an ENVELOPE is intact, degraded, failed
        or empty. Two lists, and the engine refuses to confuse them.
      </Note>
    </>
  );
};

const Category = () => {
  const [flow, setFlow] = useState('true');
  const flowPotential = flow === 'true';
  const grid = useMemo(() => {
    try { return categorySweep(flowPotential); } catch { return null; }
  }, [flowPotential]);
  const flowRows = useMemo(() => {
    try { return flowPotentialSweep(); } catch { return null; }
  }, []);
  const moved = useMemo(() => {
    try {
      const on = categorySweep(true);
      const off = categorySweep(false);
      return on.filter((r) => {
        const o = off.find((x) => x.primary === r.primary && x.secondary === r.secondary);
        return o && o.category.category !== r.category.category;
      }).length;
    } catch { return 0; }
  }, []);
  if (!grid || !grid.length) {
    return <Note>That flow potential setting does not give the engine a table to build. The two envelope statuses have to come from the envelope vocabulary before there is a category to read.</Note>;
  }
  const at = (primary, secondary) => grid.find((r) => r.primary === primary && r.secondary === secondary);
  const emptyPrimary = grid.filter((r) => r.primary === 'empty');
  const greenEmpty = emptyPrimary.filter((r) => r.category.category === 'green');
  const greens = grid.filter((r) => r.category.category === 'green');
  return (
    <>
      <SelectField label="Flow potential to surface" value={flow} onChange={setFlow}
        options={[['true', 'Yes, the well can flow'], ['false', 'No, nothing can reach surface']]} />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Rows in the table" value={fmt(grid.length, 0)} />
          <Tile label="Green rows here" value={fmt(greens.length, 0)} />
          <Tile label="Rows with an EMPTY primary" value={fmt(emptyPrimary.length, 0)} />
          <Tile label="Of those, green" value={fmt(greenEmpty.length, 0)} />
          <Tile label="Rows the flow flag moves" value={fmt(moved, 0)} />
          <Tile label="Intact over empty" value={at('intact', 'empty') ? at('intact', 'empty').category.category : '-'} />
        </TileGrid>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="text-xs w-full border-separate" style={{ borderSpacing: '4px' }}>
          <thead>
            <tr>
              <th className="text-left text-pl-muted pr-2">primary \ secondary</th>
              {ENVELOPE_STATUSES.map((s) => (
                <th key={s} className="text-pl-muted font-normal">{s}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ENVELOPE_STATUSES.map((primary) => (
              <tr key={primary}>
                <td className="text-pl-muted pr-2">{primary}</td>
                {ENVELOPE_STATUSES.map((secondary) => {
                  const cell = at(primary, secondary);
                  const cat = cell ? cell.category.category : null;
                  return (
                    <td key={secondary} className="align-top">
                      <div className={`rounded-md border px-2 py-1 ${cat ? CATEGORY_CELL[cat] : 'border-pl-border text-pl-muted'}`}>
                        {cat || '-'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">primary</th>
              <th className="text-left pr-3">secondary</th>
              <th className="text-left pr-3">category</th>
              <th className="text-left">the reason the engine gives</th>
            </tr>
          </thead>
          <tbody>
            {grid.map((r) => (
              <tr key={`${r.primary}-${r.secondary}`}>
                <td className="pr-3">{r.primary}</td>
                <td className="pr-3">{r.secondary}</td>
                <td className={`pr-3 ${CATEGORY_TEXT[r.category.category] || ''}`}>{r.category.category}</td>
                <td className="text-pl-muted">{r.category.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {flowRows && flowRows.length ? (
        <div className="mt-3 overflow-x-auto">
          <table className="text-xs text-pl-text w-full">
            <thead className="text-pl-muted">
              <tr>
                <th className="text-left pr-3">primary, against an intact secondary</th>
                <th className="text-left pr-3">can flow</th>
                <th className="text-left">category</th>
              </tr>
            </thead>
            <tbody>
              {flowRows.map((r) => (
                <tr key={`${r.primary}-${String(r.flowPotential)}`}>
                  <td className="pr-3">{r.primary}</td>
                  <td className="pr-3">{r.flowPotential ? 'yes' : 'no'}</td>
                  <td className={CATEGORY_TEXT[r.category.category] || ''}>{r.category.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <div className="mt-3 text-xs text-pl-text">
        Count the green cells. With flow potential there is exactly one, the corner where both
        envelopes are intact, and the whole rest of the grid is a finding of some size. Turn the
        flow flag off and the no-flow branch answers on the PRIMARY alone, which is why
        {' '}{fmt(moved, 0)} of the sixteen states move. That is far wider than a rule about a
        missing second envelope: it changes the answer wherever the secondary is worse than the
        primary.
      </div>
      <Note>
        Now read the EMPTY primary row in either branch. There are {fmt(emptyPrimary.length, 0)} of
        them and {fmt(greenEmpty.length, 0)} are green, in both branches. An empty envelope is
        nothing recorded, and nothing recorded is never a clean bill of health. The no-flow branch
        used to fall through to green there, so a well with no barriers logged against it came back
        clean with a reason naming a barrier that did not exist. In an integrity engine the
        dangerous direction of a bug is always the reassuring one.
      </Note>
    </>
  );
};

const Verify = () => {
  const [flow, setFlow] = useState('true');
  const flowPotential = flow === 'true';
  const v = useMemo(() => {
    try { return verifyPublished({ flowPotential }); } catch { return null; }
  }, [flowPotential]);
  if (!v) {
    return <Note>The published roster cannot be verified as it stands. Every element needs an envelope of primary, secondary or both, and a status from the element vocabulary.</Note>;
  }
  return (
    <>
      <SelectField label="Flow potential to surface" value={flow} onChange={setFlow}
        options={[['true', 'Yes, the well can flow'], ['false', 'No, nothing can reach surface']]} />
      <div className={`mt-3 rounded-md border p-4 ${CATEGORY_CELL[v.category] || 'border-pl-border'}`}>
        <p className="text-xs text-pl-muted mb-1">The published well</p>
        <p className="text-3xl font-bold mb-0">{v.category}</p>
        <p className="text-xs mt-2 mb-0">{v.reason}</p>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Primary envelope" value={v.primary.status} />
          <Tile label="Elements in it" value={fmt(v.primary.count, 0)} />
          <Tile label="Secondary envelope" value={v.secondary.status} />
          <Tile label="Elements in it" value={fmt(v.secondary.count, 0)} />
          <Tile label="Common elements" value={v.shared.length ? v.shared.join(', ') : 'none'} />
          <Tile label="Checks run" value={fmt(v.checks.length, 0)} />
          <Tile label="Checks passing" value={fmt(v.checks.filter((c) => c.pass).length, 0)} />
          <Tile label="Engine" value={v.engine} />
        </TileGrid>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-pl-text w-full">
          <thead className="text-pl-muted">
            <tr>
              <th className="text-left pr-3">check</th>
              <th className="text-left pr-3">level</th>
              <th className="text-left pr-3">verdict</th>
              <th className="text-left">detail</th>
            </tr>
          </thead>
          <tbody>
            {v.checks.map((c) => (
              <tr key={c.id}>
                <td className="pr-3">{c.label}</td>
                <td className="pr-3">{c.level}</td>
                <td className={`pr-3 ${c.pass ? 'text-pl-success-text' : 'text-pl-danger-text'}`}>{c.pass ? 'pass' : 'fail'}</td>
                <td className="text-pl-muted">{c.detail || 'n/a'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-pl-text">
        Every check on this well passes and the well is still not green. The four checks are rules
        about the SHAPE of the envelope: are there two of them, is anything shared, is anything
        untested, is anything failed. The category is a rule about its HEALTH, and it comes from
        rolling the elements up. The published primary reads {v.primary.status} because one element
        inside it is degraded, and one degraded envelope beside an intact one is
        {' '}{v.category}. A checklist of passes is not a verdict.
      </div>
      <Note>
        The reason string is the part worth carrying off this page: {v.reason} An integrity report
        that gives a colour and no reason cannot be argued with, and a colour nobody can argue with
        is a colour nobody acts on. Note too what the engine does NOT check. It verifies the status
        roll-up and the envelope rules. Whether the elements actually form a closed surface around
        the source is the engineer's drawing, and no code on this page has seen it.
      </Note>
    </>
  );
};

const EnvelopeExplorer = () => {
  const [mode, setMode] = useState('elements');
  return (
    <PanelShell
      title="Barrier envelope explorer"
      subtitle="Who is in the envelope, what one element does to the whole of it, and how the two envelopes become a traffic light"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'elements' && <Elements />}
        {mode === 'status' && <Status />}
        {mode === 'category' && <Category />}
        {mode === 'verify' && <Verify />}
      </div>
    </PanelShell>
  );
};

export default EnvelopeExplorer;
