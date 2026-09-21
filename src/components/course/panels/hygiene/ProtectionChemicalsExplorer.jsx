import React, { useMemo, useState } from 'react';
import {
  protectors, chemicals, briefScala, NRR_SWEEP,
} from './hygieneLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, Quote, safe,
} from './hygieneKit';

// Protection and chemicals: four hearing protector methods side by side, the
// 8-hour chemical TWA and the STEL window, the additive mixture index, and the
// Brief and Scala reduction factors.
//
// TWO PROTECTOR ESTIMATES ANSWER TWO QUESTIONS. The OSHA Technical Manual field
// derating is used when deciding whether engineering controls are needed;
// Appendix B is the adequacy test for hearing conservation. The NIOSH derating
// by type and the dual-protection rule are oracle only, and this panel says so.
//
// Every figure here is a return value of the vendored exposure engine through
// hygieneLab. Every limit is an input typed from a public OSHA value.

export const MODES = [
  ['protectors', 'Four hearing protector methods'],
  ['averages', 'The 8-hour TWA and the STEL window'],
  ['mixture', 'The additive mixture index'],
  ['reduction', 'Brief and Scala, daily and weekly'],
];

export const ProtectorsMode = ({ p, nrr }) => {
  if (!p) return <Note>The protector reader did not return.</Note>;
  const row = p.sweep.find((r) => r.nrrDb === Number(nrr)) || p.sweep[0];
  return (
    <>
      <TileGrid>
        <Tile label={`Appendix B at NRR ${row.nrrDb}`} value={six(row.appendixB)} unit="dBA" />
        <Tile label={`OSHA field derating at NRR ${row.nrrDb}, the engineering-controls question`} value={six(row.field50)} unit="dBA" />
        <Tile label={`Dual protection at NRR ${row.nrrDb} (oracle only)`} value={six(row.dual)} unit="dBA" />
        <Tile label={`NIOSH earmuff derating at NRR ${row.nrrDb} (oracle only)`} value={six(row.earmuff)} unit="dBA" />
      </TileGrid>
      <Tbl
        head={['method', 'weighting', 'credited NRR dB', 'attenuation dB', 'estimated level dBA']}
        rows={p.rows.map((r) => [`${r.method}${r.protectorType ? ` (${r.protectorType})` : ''}`, r.weighting, six(r.creditedNrrDb), six(r.attenuationDb), six(r.protectedDbA)])}
      />
      <Note>
        The OSHA Technical Manual worked example, reproduced: 98 dBA with an NRR of 25 gives {six(p.otm.field50)} dBA under the
        field derating and {six(p.otm.appendixB)} dBA under Appendix B. The field derating is published for A-weighted data only:
      </Note>
      <Quote>{p.fieldOnC.message}</Quote>
      <Note>An NRR under 7 on A-weighted data would raise the estimate, so the engine credits nothing and warns:</Note>
      <Quote>{p.floorWarning}</Quote>
    </>
  );
};

export const AveragesMode = ({ ch }) => {
  if (!ch) return <Note>The chemical reader did not return.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="1910.1000(d)(1) worked example, 8-hour TWA" value={six(ch.d1Example)} unit="ppm" />
        {ch.twa.map((r) => <Tile key={r.label} label={`${r.label}, 8-hour TWA`} value={six(r.twa8h)} unit="ppm" />)}
      </TileGrid>
      <Tbl
        head={['record', 'hours covered', '8-hour TWA ppm', 'average over the hours covered ppm', 'warnings']}
        rows={ch.twa.map((r) => [r.label, six(r.hours), six(r.twa8h), six(r.overHoursCovered), String(r.warnings.length)])}
      />
      {ch.twa.flatMap((r) => r.warnings).map((m) => <Quote key={m}>{m}</Quote>)}
      <Tbl
        head={['record', 'minutes covered', 'STEL ppm', 'warnings']}
        rows={ch.stel.map((r) => [r.label, six(r.minutes), six(r.stel15Min), String(r.warnings.length)])}
      />
      {ch.stel.flatMap((r) => r.warnings).map((m) => <Quote key={m}>{m}</Quote>)}
      <Quote>{ch.stelTooLong.message}</Quote>
    </>
  );
};

export const MixtureMode = ({ ch }) => {
  if (!ch) return <Note>The chemical reader did not return.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="1910.1000(d)(2) worked example, index" value={six(ch.d2Example.index)} />
        <Tile label="Teaching mixture, index" value={six(ch.mixture.index)} />
        <Tile label="Teaching mixture, largest single term" value={six(ch.mixture.largestTerm)} />
        <Tile label="An index of exactly one exceeds" value={String(ch.unity.exceeds)} />
      </TileGrid>
      <Tbl
        head={['substance', 'concentration ppm', 'limit ppm', 'term']}
        rows={ch.mixture.components.map((c, k) => [c.name, six(c.concentration), six(c.limit), six(ch.mixture.terms[k])])}
      />
      <Note>
        Every component sits under its own limit and the mixture still exceeds. The index assumes the components act the same
        way on the same organ; the engine computes the additive index only and cannot tell which case a mixture is in.
      </Note>
    </>
  );
};

export const ReductionMode = ({ b }) => {
  if (!b) return <Note>The reduction-factor reader did not return.</Note>;
  return (
    <>
      <TileGrid>
        <Tile label="ESTA 12-hour example, adjusted limit" value={six(b.esta.adjusted)} />
        <Tile label="ESTA example, governing factor" value={b.esta.governing} />
      </TileGrid>
      <Tbl
        head={['shift hours', 'raw daily factor', 'daily factor', 'adjusted limit for 100']}
        rows={b.daily.map((r) => [six(r.hours), six(r.rawRf), six(r.rf), six(r.adjusted100)])}
      />
      <Tbl
        head={['week hours', 'raw weekly factor', 'weekly factor']}
        rows={b.weekly.map((r) => [six(r.hours), six(r.rawRf), six(r.rf)])}
      />
      <Note>The weekly factor is {b.weeklyEvidence}.</Note>
      <Tbl
        head={['shift hours', 'week hours', 'daily factor', 'weekly factor', 'governing', 'adjusted limit']}
        rows={b.pairs.map((r) => [six(r.shiftHours), six(r.weeklyHours), six(r.dailyRf), six(r.weeklyRf), r.governing, six(r.adjusted)])}
      />
    </>
  );
};

const ProtectionChemicalsExplorer = ({ initialMode = 'protectors' }) => {
  const [mode, setMode] = useState(initialMode);
  const [nrr, setNrr] = useState(String(NRR_SWEEP[6]));

  const p = useMemo(() => safe(protectors), []);
  const ch = useMemo(() => safe(chemicals), []);
  const b = useMemo(() => safe(briefScala), []);

  return (
    <PanelShell
      title="Protection and chemicals"
      subtitle="Four hearing protector methods side by side, the 8-hour chemical TWA and the 15-minute STEL, the additive mixture index, and the Brief and Scala reduction factors."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        {mode === 'protectors' && (
          <SelectField
            label="Labelled NRR, dB"
            value={nrr}
            onChange={setNrr}
            options={NRR_SWEEP.map((v) => [String(v), `${v} dB`])}
          />
        )}
      </FieldGrid>
      <div className="mt-3">
        {mode === 'protectors' && <ProtectorsMode p={p} nrr={nrr} />}
        {mode === 'averages' && <AveragesMode ch={ch} />}
        {mode === 'mixture' && <MixtureMode ch={ch} />}
        {mode === 'reduction' && <ReductionMode b={b} />}
      </div>
      <Note>
        Every number on this page is a return value of the vendored exposure engine, printed to the precision the teaching digest
        prints. Every exposure limit is an input typed from a public OSHA value; no licensed limit is quoted.
      </Note>
    </PanelShell>
  );
};

export default ProtectionChemicalsExplorer;
