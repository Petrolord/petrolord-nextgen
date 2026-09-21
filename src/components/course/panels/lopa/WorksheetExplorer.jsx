import React, { useMemo, useState } from 'react';
import {
  scenario, outcomeOf, bandOf, parseNumber, parseProbabilityRows, parseIplRows, rowsText, iplText,
  worksheet, forgotten, loop, bands, snap, STREAMS,
} from './lopaLab';
import {
  PanelShell, SelectField, NumField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, twelve, silText, ex, Tbl, TextRows, Refusal, Declared, safe,
} from './panelBits';

// The LOPA worksheet (Associate): one scenario row, its credit rules, the TMEL,
// the required risk reduction, the outcome state and the loop back through a
// proposed SIF. Every figure is a return value of the vendored engine through
// lopaLab, on the teaching streams or on what the learner types. The engine
// invents no number, so neither does this panel: every frequency, probability
// and IPL PFD is typed, and a refused input shows the engine's own words.

export const MODES = [
  ['row', 'A LOPA row: frequency, credit and the risk reduction still missing'],
  ['loop', 'Closing the loop with a proposed SIF'],
  ['bands', 'Outcome states, the SIL bands and the exact decade'],
];

export const RowMode = ({ t }) => {
  const O = STREAMS.ORONI;
  const [ief, setIef] = useState(String(O.initiatingEventFrequencyPerYr));
  const [tmel, setTmel] = useState(String(O.tmelPerYr));
  const [enabling, setEnabling] = useState(rowsText(O.enablingConditions));
  const [modifiers, setModifiers] = useState(rowsText(O.conditionalModifiers));
  const [ipls, setIpls] = useState(iplText(O.ipls));
  const [sif, setSif] = useState('');
  const r = useMemo(() => scenario({
    initiatingEventFrequencyPerYr: parseNumber(ief),
    tmelPerYr: parseNumber(tmel),
    enablingConditions: parseProbabilityRows(enabling).rows,
    conditionalModifiers: parseProbabilityRows(modifiers).rows,
    ipls: parseIplRows(ipls).rows,
    ...(sif === '' ? {} : { sifPfdAvg: parseNumber(sif) }),
  }), [ief, tmel, enabling, modifiers, ipls, sif]);
  return (
    <>
      <FieldGrid>
        <NumField label="Initiating event frequency, per year" value={ief} onChange={setIef} />
        <NumField label="TMEL, per year" value={tmel} onChange={setTmel} />
        <NumField label="Proposed SIF PFDavg (blank for none)" value={sif} onChange={setSif} />
        <TextRows label="Enabling conditions, one per line: name, probability" value={enabling} onChange={setEnabling} rows={2} />
        <TextRows label="Conditional modifiers, one per line: name, probability" value={modifiers} onChange={setModifiers} />
        <TextRows label="IPLs, one per line: name, IPL PFD, independent (true or false), auditable (optional)" value={ipls} onChange={setIpls} rows={4} />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <>
          <TileGrid>
            <Tile label="Unmitigated frequency" value={twelve(r.unmitigatedFrequencyPerYr)} unit="per year" />
            <Tile label="Mitigated frequency without a SIF" value={twelve(r.mitigatedFrequencyWithoutSifPerYr)} unit="per year" />
            <Tile label="Required RRF" value={six(r.requiredRrf)} />
            <Tile label="Required SIF PFDavg" value={twelve(r.requiredSifPfdAvg)} />
            <Tile label="Outcome" value={r.outcome} />
            <Tile label="Required SIL" value={silText(r.requiredSil)} />
            {r.sifPfdAvg !== undefined && <Tile label="Mitigated frequency with the SIF" value={twelve(r.mitigatedFrequencyPerYr)} unit="per year" />}
            {r.sifPfdAvg !== undefined && <Tile label="The SIF's own band" value={silText(r.sifBand.sil)} />}
            <Tile label="Meets the TMEL" value={String(r.meetsTmel)} />
          </TileGrid>
          <Tbl
            head={['IPL', 'credited', 'reason, the engine\'s words']}
            rows={[...r.credited.map((c) => [c.name, 'yes', '']), ...r.notCredited.map((c) => [c.name, 'no', c.reason])]}
          />
          <Declared title="THE BINDING TARGET">{r.basis.bindingTarget}</Declared>
        </>
      )}
      {t && (
        <>
          <Note>ORONI, the teaching row, against a ladder of TMELs: the frequency does not move, only the tolerance does.</Note>
          <Tbl
            head={['TMEL per year', 'required RRF', 'outcome', 'required SIL', 'required PFDavg']}
            rows={t.w.ladder.map((x) => [ex(x.tmelPerYr), six(x.requiredRrf), x.outcome, silText(x.requiredSil), x.requiredSifPfdAvg === null ? 'none' : twelve(x.requiredSifPfdAvg)])}
          />
          <Note>ORONI with one term left out at a time.</Note>
          <Tbl head={['what was left out', 'unmitigated frequency per year', 'over the full row']} rows={t.f.map((x) => [x.what, twelve(x.unmitigatedFrequencyPerYr), six(x.overFull)])} />
          <Declared title="THE CREDIT RULE, IN THE ENGINE'S WORDS">{t.w.creditRule}</Declared>
        </>
      )}
    </>
  );
};

export const LoopMode = ({ t }) => {
  const [tmel, setTmel] = useState(String(STREAMS.LOOP_TMEL));
  const [sif, setSif] = useState(String(STREAMS.PROPOSED_SIFS[1]));
  const O = STREAMS.ORONI;
  const r = useMemo(() => scenario({ ...O, tmelPerYr: parseNumber(tmel), sifPfdAvg: parseNumber(sif) }), [tmel, sif, O]);
  return (
    <>
      <FieldGrid>
        <NumField label="TMEL for the ORONI row, per year" value={tmel} onChange={setTmel} />
        <NumField label="Proposed SIF PFDavg" value={sif} onChange={setSif} />
      </FieldGrid>
      {r.error ? <Refusal r={r} /> : (
        <TileGrid>
          <Tile label="Required PFDavg" value={twelve(r.requiredSifPfdAvg)} />
          <Tile label="Outcome" value={r.outcome} />
          <Tile label="The SIF's own band" value={silText(r.sifBand.sil)} />
          <Tile label="Mitigated frequency with the SIF" value={twelve(r.mitigatedFrequencyPerYr)} unit="per year" />
          <Tile label="Meets the TMEL" value={String(r.meetsTmel)} />
        </TileGrid>
      )}
      {t && (
        <>
          <Note>ORONI at the teaching TMEL requires {t.outcome} with a required PFDavg of {twelve(t.requiredSifPfdAvg)}.</Note>
          <Tbl
            head={['proposed SIF PFDavg', 'its own SIL band', 'mitigated frequency with the SIF, per year', 'meets the TMEL']}
            rows={t.rows.map((x) => [String(x.sifPfdAvg), silText(x.sifSil), twelve(x.mitigatedFrequencyPerYr), String(x.meetsTmel)])}
          />
          <Declared title="THE BAND IS A LABEL">
            A SIF in the band the row requires can still miss the TMEL. The required PFDavg is the target the SIF must
            reach itself.
          </Declared>
        </>
      )}
    </>
  );
};

export const BandsMode = ({ t }) => {
  const [rrf, setRrf] = useState('100');
  const [pfd, setPfd] = useState('0.01');
  const o = useMemo(() => outcomeOf(parseNumber(rrf)), [rrf]);
  const b = useMemo(() => bandOf(parseNumber(pfd)), [pfd]);
  return (
    <>
      <FieldGrid>
        <NumField label="A required RRF" value={rrf} onChange={setRrf} />
        <NumField label="An achieved PFDavg" value={pfd} onChange={setPfd} />
      </FieldGrid>
      <TileGrid>
        <Tile label="Outcome the RRF demands" value={o.error ? 'refused' : o.outcome} />
        <Tile label="Required SIL" value={o.error ? 'refused' : silText(o.requiredSil)} />
        <Tile label="Band of the achieved PFDavg" value={b.error ? 'refused' : silText(b.sil)} />
        <Tile label="State" value={b.error ? 'refused' : b.state} />
      </TileGrid>
      {o.error && <Refusal r={o} />}
      {b.error && <Refusal r={b} />}
      {!o.error && o.note && <Declared title="THE ENGINE NOTE">{o.note}</Declared>}
      {t && (
        <>
          <Tbl
            head={['required RRF', 'outcome', 'required SIL', 'required PFDavg']}
            rows={t.b.outcomes.map((x) => [String(x.rrf), x.outcome, silText(x.requiredSil), x.requiredSifPfdAvg === null ? 'none' : twelve(x.requiredSifPfdAvg)])}
          />
          <Tbl head={['achieved PFDavg', 'SIL', 'state']} rows={t.b.pfds.map((x) => [String(x.pfdAvg), silText(x.sil), x.state])} />
          <Declared title="THE BAND CONVENTION, IN THE ENGINE'S WORDS">{t.b.convention}</Declared>
          <Note>Products whose exact value is a decade, as IEEE double computes them, with the snap of {ex(t.s.snap)}.</Note>
          <Tbl head={['factors', 'the double', 'decadeOf', 'outcome']} rows={t.s.products.map((x) => [x.factors, x.double, String(x.decade), x.outcome])} />
        </>
      )}
    </>
  );
};

const WorksheetExplorer = ({ initialMode = 'row' }) => {
  const [mode, setMode] = useState(initialMode);
  const tRow = useMemo(() => (mode === 'row' ? safe(() => ({ w: worksheet(), f: forgotten() })) : null), [mode]);
  const tLoop = useMemo(() => (mode === 'loop' ? safe(loop) : null), [mode]);
  const tBands = useMemo(() => (mode === 'bands' ? safe(() => ({ b: bands(), s: snap() })) : null), [mode]);
  return (
    <PanelShell
      title="LOPA worksheet"
      subtitle="A scenario frequency times every enabling condition, conditional modifier and credited IPL PFD, set against a TMEL. Type every number: the engine invents none."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'row' && <RowMode t={tRow} />}
        {mode === 'loop' && <LoopMode t={tLoop} />}
        {mode === 'bands' && <BandsMode t={tBands} />}
      </div>
      <Note>
        Every number on this panel is a return value of the vendored LOPA engine. LOPA is frequency based: nothing here
        takes a risk matrix category or score.
      </Note>
    </PanelShell>
  );
};

export default WorksheetExplorer;
