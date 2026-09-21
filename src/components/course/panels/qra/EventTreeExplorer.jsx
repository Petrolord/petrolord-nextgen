import React, { useMemo, useState } from 'react';
import {
  flammableTree, lsir, irpa, parseNumber, parseRows, rowsText, release, forgotten, overfill, places, people,
  transectTable, STREAMS,
} from './qraLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, twelve, ex, Tbl, TextRows, Refusal, Declared, safe,
} from './panelBits';

// The event tree and individual risk builder (Associate): a flammable release
// through its tree, the location-specific individual risk at one place, and
// the individual risk per annum of one person over the places they occupy.
// Every figure is a return value of the vendored engine through qraLab, on the
// teaching streams or on what the learner types. Every frequency and every
// probability of death is typed: the engine invents none, and a probability
// of death comes from the consequence course as a stated input.

export const MODES = [
  ['tree', 'A flammable release through its event tree'],
  ['lsir', 'Individual risk at one place, the sum of f times Pd'],
  ['irpa', 'Individual risk per annum of one person'],
];

export const TreeMode = ({ t }) => {
  const R = STREAMS.EREMOR_RELEASE;
  const [f0, setF0] = useState(String(R.initiatingFrequencyPerYr));
  const [imm, setImm] = useState(String(R.immediateIgnitionProbability));
  const [del, setDel] = useState(String(R.delayedIgnitionProbability));
  const [flash, setFlash] = useState('');
  const [expl, setExpl] = useState('');
  const r = useMemo(() => flammableTree({
    initiatingFrequencyPerYr: parseNumber(f0),
    immediateIgnitionProbability: parseNumber(imm),
    delayedIgnitionProbability: parseNumber(del),
    ...(flash === '' && expl === '' ? {} : { vapourCloudSplit: { flashFire: parseNumber(flash), explosion: parseNumber(expl) } }),
  }), [f0, imm, del, flash, expl]);
  return (
    <>
      <FieldGrid>
        <NumField label="Release frequency, per year" value={f0} onChange={setF0} />
        <NumField label="Immediate ignition probability" value={imm} onChange={setImm} />
        <NumField label="Delayed ignition probability, given no immediate ignition" value={del} onChange={setDel} />
        <NumField label="Flash fire share of a delayed ignition (blank for the preset)" value={flash} onChange={setFlash} />
        <NumField label="Explosion share of a delayed ignition (blank for the preset)" value={expl} onChange={setExpl} />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <>
          <TileGrid>
            {Object.entries(r.outcomeTotalsPerYr).map(([k, v]) => <Tile key={k} label={k} value={twelve(v)} unit="per year" />)}
            <Tile label="Total, the release frequency" value={twelve(r.totalFrequencyPerYr)} unit="per year" />
          </TileGrid>
          <Tbl head={['path', 'outcome', 'path probability', 'frequency per year']} rows={r.outcomes.map((o) => [o.path.join(' then '), o.outcome, twelve(o.probability), twelve(o.frequencyPerYr)])} />
          <Declared title="THE SPLIT, IN THE ENGINE'S WORDS">{r.basis.vapourCloudSplit}</Declared>
        </>
      )}
      {t && (
        <>
          <Note>The EREMOR release, the teaching stream, through the tree with the preset split.</Note>
          <Tbl head={['outcome', 'frequency per year']} rows={t.rel.outcomes.map((o) => [o.outcome, twelve(o.frequencyPerYr)])} />
          <Note>The explosion frequency built three wrong ways. Each wrong tree is valid arithmetic: only the analyst knows which branch belongs where.</Note>
          <Tbl head={['how it was built', 'explosion frequency per year', 'over the right one']} rows={t.f.map((x) => [x.what, twelve(x.explosion), six(x.overRight)])} />
          <Note>The EREMOR tank overfill: two pool fire leaves pooled into one outcome.</Note>
          <Tbl head={['outcome', 'frequency per year']} rows={Object.entries(t.o.totals).map(([k, v]) => [k, twelve(v)])} />
        </>
      )}
    </>
  );
};

const SCEN_KEYS = ['frequencyPerYr', 'fatalityProbability'];

export const LsirMode = ({ t }) => {
  const [text, setText] = useState(() => {
    const f = { ...release().totals, 'pool fire': overfill().totals['pool fire'] };
    return rowsText(Object.entries(STREAMS.EREMOR_PLACES['process deck']).map(([name, pd]) => ({ name, frequencyPerYr: f[name], fatalityProbability: pd })), SCEN_KEYS);
  });
  const r = useMemo(() => lsir({ scenarios: parseRows(text, SCEN_KEYS).rows }), [text]);
  return (
    <>
      <FieldGrid>
        <TextRows label="Scenarios at the place, one per line: name, frequency per year, probability of death (stated)" value={text} onChange={setText} rows={5} />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <>
          <TileGrid>
            <Tile label="LSIR" value={twelve(r.lsirPerYr)} unit="per year" />
          </TileGrid>
          <Tbl head={['scenario', 'f x Pd per year', 'fraction of the LSIR']} rows={r.contributions.map((c) => [c.name, twelve(c.contributionPerYr), six(c.fraction)])} />
          <Declared title="WHAT LSIR MEANS, IN THE ENGINE'S WORDS">{r.basis.model}</Declared>
        </>
      )}
      {t && (
        <>
          <Note>The three EREMOR places, each with its own stated probability of death per outcome.</Note>
          <Tbl head={['place', 'LSIR per year']} rows={t.p.lsir.map((x) => [x.place, twelve(x.lsirPerYr)])} />
          <Note>The EREMOR transect and the Purple Book contours it crosses. A crossing is a presentation rule the engine chose.</Note>
          <Tbl head={['contour per year', 'crossings, m']} rows={t.tr.contours.map((c) => [ex(c.levelPerYr), c.crossingsM.length ? c.crossingsM.map(six).join(', ') : 'none'])} />
        </>
      )}
    </>
  );
};

const LOC_KEYS = ['lsirPerYr', 'hoursPerYr', 'occupancyFraction', 'vulnerabilityFactor'];

export const IrpaMode = ({ t }) => {
  const [text, setText] = useState(() => {
    const L = Object.fromEntries(places().lsir.map((x) => [x.place, x.lsirPerYr]));
    return rowsText(STREAMS.EREMOR_OPERATOR.map((l) => ({ name: l.place, lsirPerYr: L[l.place], hoursPerYr: l.hoursPerYr })), LOC_KEYS);
  });
  const r = useMemo(() => irpa({ locations: parseRows(text, LOC_KEYS).rows }), [text]);
  return (
    <>
      <FieldGrid>
        <TextRows
          label="Places, one per line: name, LSIR per year, hours a year, fraction of the year, vulnerability factor (give hours or a fraction, and leave the rest blank)"
          value={text}
          onChange={setText}
          rows={4}
        />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <>
          <TileGrid>
            <Tile label="IRPA" value={twelve(r.irpaPerYr)} unit="per year" />
            <Tile label="Total occupancy" value={twelve(r.totalOccupancyFraction)} unit="of the year" />
          </TileGrid>
          <Tbl head={['place', 'occupancy fraction', 'vulnerability factor', 'contribution per year']} rows={r.contributions.map((c) => [c.name, twelve(c.occupancyFraction), String(c.vulnerabilityFactor), twelve(c.contributionPerYr)])} />
          <Declared title="WHAT IRPA MEANS, IN THE ENGINE'S WORDS">{r.basis.model}</Declared>
        </>
      )}
      {t && (
        <>
          <Note>The EREMOR operator, and the same operator built wrongly.</Note>
          <Tbl
            head={['how it was built', 'IRPA per year']}
            rows={[
              ['hours over 8760, the engine', twelve(t.pp.operator.irpaPerYr)],
              ['no occupancy', twelve(t.pp.wrong.noOccupancy)],
              ['hours over 8766', twelve(t.pp.wrong.hoursOver8766)],
              ['the process deck alone', twelve(t.pp.wrong.deckAlone)],
            ]}
          />
        </>
      )}
    </>
  );
};

const EventTreeExplorer = ({ initialMode = 'tree' }) => {
  const [mode, setMode] = useState(initialMode);
  const tTree = useMemo(() => (mode === 'tree' ? safe(() => ({ rel: release(), f: forgotten(), o: overfill() })) : null), [mode]);
  const tLsir = useMemo(() => (mode === 'lsir' ? safe(() => ({ p: places(), tr: transectTable() })) : null), [mode]);
  const tIrpa = useMemo(() => (mode === 'irpa' ? safe(() => ({ pp: people() })) : null), [mode]);
  return (
    <PanelShell
      title="Event tree and individual risk builder"
      subtitle="Frequencies per year through the branches of a tree, then summed with a stated probability of death at a place, then spread over the places one person occupies. Type every number: the engine invents none."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'tree' && <TreeMode t={tTree} />}
        {mode === 'lsir' && <LsirMode t={tLsir} />}
        {mode === 'irpa' && <IrpaMode t={tIrpa} />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored QRA engine. A probability of death is a stated input
        here, taken from the consequence course.
      </Note>
    </PanelShell>
  );
};

export default EventTreeExplorer;
