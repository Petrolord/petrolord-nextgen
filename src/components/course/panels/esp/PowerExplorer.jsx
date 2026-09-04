import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, BarChart, Line, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceArea,
} from 'recharts';
import {
  ESP_THRESHOLDS, DERATE_SWEEP_PCT, SEAM_FINDING, DIAGNOSIS_FIX,
  allCases, stackSizing, twoPowerCostRows, loadFractionSeamRows,
  twoPowerPickStudies, teachingCableFlipStudy,
  diagnosisFixture, underCurveBandRows, ampsHighBandRows, ampsLowBandRows,
} from './espLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Power explorer, the Expert tier. The two brake powers a sizing returns and
// which one the electrical chain is built on, the two fields called
// loadFraction that answer different questions, a cable pick made twice on
// those two powers, and the three ratio bands the diagnosis prints.
//
// Every figure on this page is a return value from espLab, which is a return
// value from the vendored ESP engine. Nothing here computes a power, a current,
// a voltage drop or a ratio.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const pct = (v, d = 2) => (Number.isFinite(v) ? `${fmt(v * 100, d)} %` : '-');

const yn = (b) => (b ? 'yes' : 'no');

const MODES = [
  ['twopowers', 'Two brake powers, and the identity between them'],
  ['derate', 'Two fields called loadFraction'],
  ['cable', 'The same pick, made twice'],
  ['diagnosis', 'Three bands, printed two ways'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

// The four cases the course walks, built once, so a failure to build them is a
// Note rather than a module that will not import.
const CASES = (() => {
  try { return allCases(); } catch { return []; }
})();

const TwoPowers = () => {
  const rows = useMemo(() => {
    try { return CASES.map(stackSizing); } catch { return null; }
  }, []);
  const cost = useMemo(() => {
    try { return twoPowerCostRows(); } catch { return null; }
  }, []);
  if (!rows || !rows.length || !cost || !cost.length) {
    return <Note>There are two brake powers only where there is a stack. A sizing that could not buy a stage count returns neither the power at the head required nor the power at the head made, so there is no pair to compare and no ratio to check.</Note>;
  }
  const tight = rows.reduce((a, b) => (b.twoPowerGapPct < a.twoPowerGapPct ? b : a));
  const wide = rows.reduce((a, b) => (b.twoPowerGapPct > a.twoPowerGapPct ? b : a));
  const worstIdentity = rows.reduce((a, b) => (Math.abs(b.identity) > Math.abs(a.identity) ? b : a));
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Cases on this page" value={fmt(rows.length, 0)} />
          <Tile label="Tightest gap" value={fmt(tight.twoPowerGapPct, 6)} unit="%" />
          <Tile label="On this many stages" value={fmt(tight.stages, 0)} />
          <Tile label="Widest gap" value={fmt(wide.twoPowerGapPct, 6)} unit="%" />
          <Tile label="On this many stages" value={fmt(wide.stages, 0)} />
          <Tile label="Worst power ratio less head ratio" value={fmt(worstIdentity.identity, 18)} />
          <Tile label="The identity holds on every case" value={yn(rows.every((r) => Math.abs(r.identity) < 1e-12))} />
          <Tile label="Bigger power is always the one at the head MADE" value={yn(rows.every((r) => r.twoPowerGapHp > 0))} />
        </TileGrid>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 10, right: 20, bottom: 46, left: 0 }}>
            {GRID}
            <XAxis dataKey="id" tick={AXIS} interval={0} angle={-12} textAnchor="end" height={56} />
            <YAxis yAxisId="pct" tick={AXIS}
              label={{ value: 'gap between the two powers, percent', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="pct" dataKey="twoPowerGapPct" name="gap, percent of the smaller power" isAnimationActive={false}>
              {rows.map((r) => (
                <Cell key={r.id} fill={r.stages > 100 ? '#38bdf8' : '#f97316'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">case</th>
              <th className="text-left pr-3">stages</th>
              <th className="text-left pr-3">head required, ft</th>
              <th className="text-left pr-3">head made, ft</th>
              <th className="text-left pr-3">brake power at the head required, hp</th>
              <th className="text-left pr-3">brake power at the head made, hp</th>
              <th className="text-left pr-3">gap, hp</th>
              <th className="text-left pr-3">gap, percent</th>
              <th className="text-left pr-3">power ratio</th>
              <th className="text-left pr-3">head ratio</th>
              <th className="text-left">difference</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.tag}</td>
                <td className="pr-3">{fmt(r.stages, 0)}</td>
                <td className="pr-3">{fmt(r.tdhFt, 4)}</td>
                <td className="pr-3">{fmt(r.headMadeFt, 4)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.shaftHp, 6)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.stackBhpTotal, 6)}</td>
                <td className="pr-3">{fmt(r.twoPowerGapHp, 6)}</td>
                <td className="pr-3">{fmt(r.twoPowerGapPct, 6)}</td>
                <td className="pr-3">{fmt(r.powerRatio, 12)}</td>
                <td className="pr-3">{fmt(r.headRatio, 12)}</td>
                <td>{fmt(r.identity, 18)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">case</th>
              <th className="text-left pr-3">the electrical chain is built on, hp</th>
              <th className="text-left pr-3">the published motor sizing takes, hp</th>
              <th className="text-left pr-3">difference, hp</th>
              <th className="text-left">as a share of the LARGER, percent</th>
            </tr>
          </thead>
          <tbody>
            {cost.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.tag}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.electricalChainBuiltOnHp, 6)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.publishedMethodTakesHp, 6)}</td>
                <td className="pr-3">{fmt(r.understatementHp, 6)}</td>
                <td>{fmt(r.understatementPct, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        A SIZING RETURNS TWO BRAKE POWERS AND THEY ARE NOT THE SAME NUMBER. One is the power at the
        head the duty REQUIRES. The other is the power at the head the integer stack actually MAKES,
        which is larger, because rounding the stage count up bought head that nobody asked for. Both
        are correct answers to different questions, and everything electrical in this package,
        current, voltage drop, cable pick and surface kVA, is built on the SMALLER of them while the
        published motor sizing method takes the larger.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        THE IDENTITY. Brake power is linear in head at a fixed rate and a fixed efficiency, so the
        ratio of the two powers IS the ratio of the two heads. The last column of the first table is
        that difference, and the worst of it across all four cases is
        {' '}{fmt(worstIdentity.identity, 18)}, which is machine noise. That is not a coincidence to
        note in passing: it says the two power gap and the head margin are ONE fact wearing two
        names, so a design that quotes both as separate safety factors has counted the same rounding
        twice.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        And the size of it is entirely about how many stages there are. The four cases spread from
        {' '}{fmt(tight.twoPowerGapPct, 6)} percent on {fmt(tight.stages, 0)} stages to
        {' '}{fmt(wide.twoPowerGapPct, 6)} percent on {fmt(wide.stages, 0)}. Same rounding rule, same
        engine, two orders of magnitude apart, because one rounded stage out of a couple of hundred
        is nothing and one rounded stage out of a few dozen is not.
      </div>
      <Note>
        READ THE DENOMINATOR BEFORE YOU QUOTE EITHER. The percentage in the first table divides the
        gap by the smaller power; the percentage in the second divides it by the larger. They are
        the same gap and not two findings, and the pair of them will look like a contradiction to
        anybody who copies one number out of each.
      </Note>
    </>
  );
};

const Derate = () => {
  const rows = useMemo(() => {
    try { return loadFractionSeamRows(); } catch { return null; }
  }, []);
  const [caseId, setCaseId] = useState('');
  if (!rows || !rows.length) {
    return <Note>A load fraction needs a nameplate power to divide by. Handed a nameplate of nought the motor current model returns no load fraction and no amps rather than an infinity, so neither field exists and there is no seam to look at.</Note>;
  }
  const row = rows.find((r) => r.id === caseId) || rows[0];
  const chart = row.derates.map((d) => ({
    ...d,
    electricalLoadFraction: row.electricalLoadFraction,
  }));
  const crossings = row.derates.filter((d) => d.selectionLoadFraction > ESP_THRESHOLDS.motorOverloadedSelectionLoad);
  const electricalCrosses = row.electricalLoadFraction > ESP_THRESHOLDS.motorOverloadedSelectionLoad;
  return (
    <>
      <FieldGrid>
        <SelectField label="Case" value={caseId || row.id} onChange={setCaseId}
          options={rows.map((r) => [r.id, r.tag])} />
      </FieldGrid>
      <div className="mt-3 rounded-md border border-amber-700 bg-amber-900/20 p-4">
        <p className="text-xs text-gray-400 mb-1">
          Two fields called loadFraction, in one domain, on {row.tag}
        </p>
        <p className="text-2xl font-bold text-white mb-1">
          {fmt(row.electricalLoadFraction, 8)}
          <span className="text-[#BFFF00]"> against </span>
          {fmt(row.derates[row.derates.length - 1].selectionLoadFraction, 8)}
          <span className="text-gray-400 text-sm"> at {fmt(row.derates[row.derates.length - 1].deratePct, 0)} percent derate</span>
        </p>
        <p className="text-sm text-amber-200 mb-0">
          BOTH ARE RIGHT FOR WHAT THEY MEAN. espDesign.sizePump reports UTILISATION against the
          motor's usable rating, shaft power over nameplate power times the derate, and that is the
          published selection rule. espMotorCable.motorCurrent reports the ELECTRICAL load fraction,
          shaft power over the plate with no derate, because the current a machine draws at a shaft
          load does not move when somebody cuts its permissible load. THE DEFECT IS THE SHARED NAME,
          not either number, and the amps, the cable pick and the weak estimate flag are all built
          on the underated one.
        </p>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Nameplate" value={fmt(row.nameplateHp, 0)} unit="hp" />
          <Tile label="Shaft power" value={fmt(row.shaftHp, 6)} unit="hp" />
          <Tile label="ELECTRICAL load fraction, no derate" value={fmt(row.electricalLoadFraction, 8)} />
          <Tile label="Input power at that load" value={fmt(row.inputKw, 6)} unit="kW" />
          <Tile label="Derate sweep, points" value={fmt(row.derates.length, 0)} />
          <Tile label="Widest gap on the sweep" value={fmt(row.derates[row.derates.length - 1].gapPoints, 6)} unit="points" />
          <Tile label="Selection load crosses one on this sweep" value={yn(crossings.length > 0)} />
          <Tile label="Electrical load crosses one" value={yn(electricalCrosses)} />
        </TileGrid>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="deratePct" type="number" domain={['dataMin', 'dataMax']} tick={AXIS}
              label={{ value: 'thrust derate, percent', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'load fraction', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 8)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={ESP_THRESHOLDS.motorOverloadedSelectionLoad} stroke="#f97316" strokeWidth={2}
              label={{ value: 'the selection rule calls this overloaded', fill: '#f97316', fontSize: 10, position: 'insideTopLeft' }} />
            <ReferenceLine y={ESP_THRESHOLDS.weakCurrentEstimateBelowLoad} stroke="#f472b6" strokeDasharray="5 3"
              label={{ value: 'below here the current estimate is flagged weak', fill: '#f472b6', fontSize: 10, position: 'insideBottomLeft' }} />
            <Line type="monotone" dataKey="electricalLoadFraction" name="ELECTRICAL load fraction, motorCurrent"
              stroke="#BFFF00" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="selectionLoadFraction" name="SELECTION load fraction, sizePump"
              stroke="#38bdf8" strokeWidth={2} dot isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">thrust derate, percent</th>
              <th className="text-left pr-3">derate as a factor</th>
              <th className="text-left pr-3">SELECTION load fraction</th>
              <th className="text-left pr-3">ELECTRICAL load fraction</th>
              <th className="text-left pr-3">the seam, in points</th>
              <th className="text-left">warnings the sizing raises</th>
            </tr>
          </thead>
          <tbody>
            {row.derates.map((d) => (
              <tr key={d.deratePct} className={d.warningCodes.includes('motorOverloaded') ? 'text-white' : ''}>
                <td className="pr-3">{fmt(d.deratePct, 0)}</td>
                <td className="pr-3">{fmt(d.derate, 4)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(d.selectionLoadFraction, 8)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(row.electricalLoadFraction, 8)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(d.gapPoints, 6)}</td>
                <td>{d.warningCodes.length ? d.warningCodes.join(', ') : 'none'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THIS IS A SEAM AND NOT AN ERROR. The lime line does not move across the sweep, because
        cutting a motor's permissible load does not change the current it draws at a given shaft
        load. The blue line climbs, because the same shaft power is a larger share of a smaller
        usable rating. The gap between them is the electrical load fraction times one over the derate
        less one, and it opens to {fmt(row.derates[row.derates.length - 1].gapPoints, 6)} points at
        the far end of this sweep, on a derate ladder that runs from
        {' '}{fmt(DERATE_SWEEP_PCT[0], 0)} to {fmt(DERATE_SWEEP_PCT[DERATE_SWEEP_PCT.length - 1], 0)}
        {' '}percent.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        {crossings.length > 0 && !electricalCrosses
          ? `On this case the two answers land on opposite sides of a decision. The selection rule calls the motor overloaded from ${fmt(crossings[0].deratePct, 0)} percent derate upward and raises a warning, while the electrical load fraction sits at ${fmt(row.electricalLoadFraction, 8)} and never reaches one, so the amps, the cable pick and the weak estimate flag all carry on as though nothing had happened. Neither half is wrong. They were asked different questions and they answered the ones they were asked.`
          : `On this case both readings stay on the same side of the overload line across the whole derate sweep, which is why a well like this one hides the seam rather than showing it. Move to the case where the selection rule crosses one and the electrical fraction does not, and the same two fields disagree about whether the motor is in trouble.`}
      </div>
      <div className="mt-2 text-xs text-slate-300">
        The finding as the wave recorded it: an electrical load fraction of
        {' '}{fmt(SEAM_FINDING.electricalLoadFraction, 6)} on a derate of
        {' '}{fmt(SEAM_FINDING.derate, 4)} opens a gap of {fmt(SEAM_FINDING.gapPoints, 6)} points.
        That is the whole size of it, and it is arithmetic rather than an approximation, so the gap
        can be predicted for any load and any derate without running anything.
      </div>
      <Note>
        The fix here is not to either number. It is to the name. Two fields called loadFraction in
        one domain, one of them derated and one of them not, is a trap that no test catches because
        every test is written by somebody who already knows which one they meant. Rename them and
        the whole class of mistake goes away.
      </Note>
    </>
  );
};

const Cable = () => {
  const studies = useMemo(() => {
    try { return twoPowerPickStudies(); } catch { return null; }
  }, []);
  const flips = useMemo(() => {
    try { return teachingCableFlipStudy(); } catch { return null; }
  }, []);
  const [label, setLabel] = useState('');
  if (!studies || !studies.length || !flips) {
    return <Note>A cable pick needs a conductor table, a limit and a current. With any of those missing selectCable has nothing to sort and returns no candidates, so there is no pick to make once, let alone twice.</Note>;
  }
  const study = studies.find((s) => s.label === label) || flips[0] || studies[0];
  const movers = studies.filter((s) => s.pickMoved);
  const nonMovers = studies.filter((s) => !s.pickMoved);
  const noPick = studies.filter((s) => s.chosenOnShaft === null && s.chosenOnStack === null);
  const bothEmpty = study.chosenOnShaft === null && study.chosenOnStack === null;
  // The conductor that WON on the smaller power, read back out of the losing
  // pick, so the drop that disqualified it is on the page beside the one that
  // did not.
  const winnerOnStack = study.chosenOnShaft === null
    ? null
    : study.onStack.candidates.find((x) => x.label === study.chosenOnShaft);
  const onStackOf = (l) => study.onStack.candidates.find((y) => y.label === l) || null;
  const chartRows = bothEmpty ? [] : study.onShaft.candidates.map((x) => ({
    label: x.label,
    onShaftDropPct: x.dropPct,
    onStackDropPct: onStackOf(x.label) ? onStackOf(x.label).dropPct : null,
  }));
  // A display frame and not a result: the shaded band runs from the limit up to
  // the worst drop any candidate actually reads, both of them engine values.
  const worstDropPct = chartRows.length
    ? chartRows.reduce((a, r) => Math.max(a, r.onShaftDropPct, r.onStackDropPct || 0), 0)
    : 0;
  return (
    <>
      <FieldGrid>
        <SelectField label="Study" value={label || study.label} onChange={setLabel}
          options={studies.map((s) => [s.label, s.label])} />
      </FieldGrid>
      <div className={`mt-3 rounded-md border p-4 ${study.pickMoved ? 'border-rose-700 bg-rose-900/20' : 'border-gray-700 bg-[#0F172A]'}`}>
        <p className="text-xs text-gray-400 mb-1">
          One design, one conductor table, one limit, two defensible readings of the power
        </p>
        {bothEmpty ? (
          <p className="text-sm text-gray-300 mb-0">
            NOTHING QUALIFIES ON EITHER POWER on this study, so there is no pick to compare. Every
            conductor in the table fails the {fmt(study.maxDropPct, 1)} percent drop limit at this
            current over {fmt(study.lengthFt, 0)} ft at {fmt(study.cableTempF, 0)} degF, and
            selectCable returns candidates with no winner rather than the least bad one. That is a
            refusal and it is the right behaviour: a cable that fails the limit is not a cable, and
            picking the closest loser would hide it.
          </p>
        ) : (
          <>
            <p className="text-2xl font-bold text-white mb-1">
              {study.chosenOnShaft || 'nothing qualifies'}
              <span className="text-[#BFFF00]"> against </span>
              {study.chosenOnStack || 'nothing qualifies'}
            </p>
            <p className={`text-sm mb-0 ${study.pickMoved ? 'text-rose-300' : 'text-gray-300'}`}>
              {study.pickMoved
                ? `THE PICK MOVED. On the brake power at the head REQUIRED, ${fmt(study.shaftHp, 6)} hp, the deciding drop is ${fmt(study.decidingDropOnShaftPct, 6)} percent and ${study.chosenOnShaft} passes. On the brake power at the head the stack MAKES, ${fmt(study.stackBhpTotal, 6)} hp, the same conductor reads ${winnerOnStack ? fmt(winnerOnStack.dropPct, 6) : '-'} percent, which is over the ${fmt(study.maxDropPct, 1)} percent limit, so the pick steps up to ${study.chosenOnStack} at ${fmt(study.decidingDropOnStackPct, 6)} percent. Same design, same table, same limit, different conductor out.`
                : `The pick did NOT move: ${study.chosenOnShaft} either way. The deciding drop goes from ${fmt(study.decidingDropOnShaftPct, 6)} percent on the smaller power to ${fmt(study.decidingDropOnStackPct, 6)} percent on the larger, and both of them are on the same side of the ${fmt(study.maxDropPct, 1)} percent limit, so nothing changes.`}
            </p>
          </>
        )}
      </div>
      {!bothEmpty && (
        <>
          <div className="mt-3">
            <TileGrid>
              <Tile label="Brake power at the head required" value={fmt(study.shaftHp, 6)} unit="hp" />
              <Tile label="Brake power at the head made" value={fmt(study.stackBhpTotal, 6)} unit="hp" />
              <Tile label="Drop limit" value={fmt(study.maxDropPct, 1)} unit="%" />
              <Tile label="Cable length" value={fmt(study.lengthFt, 0)} unit="ft" />
              <Tile label="Cable temperature" value={fmt(study.cableTempF, 0)} unit="degF" />
              <Tile label="Nameplate" value={`${fmt(study.nameplateHp, 0)} hp, ${fmt(study.nameplateVolts, 0)} V, ${fmt(study.nameplateAmps, 0)} A`} />
              <Tile label="Deciding drop on the smaller power" value={fmt(study.decidingDropOnShaftPct, 6)} unit="%" />
              <Tile label="Deciding drop on the larger power" value={fmt(study.decidingDropOnStackPct, 6)} unit="%" />
            </TileGrid>
          </div>
          <div className="h-72 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartRows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
                {GRID}
                <XAxis dataKey="label" tick={AXIS} />
                <YAxis tick={AXIS}
                  label={{ value: 'voltage drop, percent', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 6)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {worstDropPct > study.maxDropPct && (
                  <ReferenceArea y1={study.maxDropPct} y2={worstDropPct} fill="#f43f5e" fillOpacity={0.1} />
                )}
                <ReferenceLine y={study.maxDropPct} stroke="#f43f5e" strokeWidth={2}
                  label={{ value: 'the limit', fill: '#f43f5e', fontSize: 10, position: 'insideTopRight' }} />
                <Bar dataKey="onShaftDropPct" name="on the brake power at the head required" fill="#BFFF00" isAnimationActive={false} />
                <Bar dataKey="onStackDropPct" name="on the brake power at the head made" fill="#f97316" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">conductor</th>
                  <th className="text-left pr-3">amps on the smaller power</th>
                  <th className="text-left pr-3">drop, percent</th>
                  <th className="text-left pr-3">passes</th>
                  <th className="text-left pr-3">amps on the larger power</th>
                  <th className="text-left pr-3">drop, percent</th>
                  <th className="text-left pr-3">passes</th>
                  <th className="text-left">ampacity check</th>
                </tr>
              </thead>
              <tbody>
                {study.onShaft.candidates.map((x) => {
                  const y = onStackOf(x.label);
                  const chosen = x.label === study.chosenOnShaft || (y && y.label === study.chosenOnStack);
                  return (
                    <tr key={x.label} className={chosen ? 'text-white' : ''}>
                      <td className="pr-3">{x.label}</td>
                      <td className="pr-3">{fmt(x.amps, 6)}</td>
                      <td className="pr-3 text-[#BFFF00]">{fmt(x.dropPct, 6)}</td>
                      <td className={`pr-3 ${x.dropOk ? '' : 'text-[#f43f5e]'}`}>{yn(x.dropOk)}</td>
                      <td className="pr-3">{y ? fmt(y.amps, 6) : '-'}</td>
                      <td className="pr-3 text-[#f97316]">{y ? fmt(y.dropPct, 6) : '-'}</td>
                      <td className={`pr-3 ${y && !y.dropOk ? 'text-[#f43f5e]' : ''}`}>{y ? yn(y.dropOk) : '-'}</td>
                      <td>{x.ampacityDeclared === null ? 'no ampacity in the table, so it passes' : fmt(x.ampacityDeclared, 0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">study</th>
              <th className="text-left pr-3">length, ft</th>
              <th className="text-left pr-3">on the head required</th>
              <th className="text-left pr-3">drop, percent</th>
              <th className="text-left pr-3">on the head made</th>
              <th className="text-left pr-3">drop, percent</th>
              <th className="text-left">pick moved</th>
            </tr>
          </thead>
          <tbody>
            {studies.map((s) => (
              <tr key={s.label} className={s.pickMoved ? 'text-white' : ''}>
                <td className="pr-3">{s.label}</td>
                <td className="pr-3">{fmt(s.lengthFt, 0)}</td>
                <td className="pr-3 text-[#BFFF00]">{s.chosenOnShaft || 'nothing qualifies'}</td>
                <td className="pr-3">{s.decidingDropOnShaftPct === null ? '-' : fmt(s.decidingDropOnShaftPct, 6)}</td>
                <td className="pr-3 text-[#f97316]">{s.chosenOnStack || 'nothing qualifies'}</td>
                <td className="pr-3">{s.decidingDropOnStackPct === null ? '-' : fmt(s.decidingDropOnStackPct, 6)}</td>
                <td className={s.pickMoved ? 'text-[#f43f5e] font-semibold' : ''}>{yn(s.pickMoved)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        THE NON-MOVERS ARE THE POINT OF THAT TABLE. {fmt(movers.length, 0)} of
        {' '}{fmt(studies.length, 0)} studies move, and the other {fmt(nonMovers.length, 0)} do not,
        which is what proves the flip is a property of SHORT STACKS rather than a property of the
        method. A pick moves only when the winning conductor's drop sits between the limit divided
        by the power ratio and the limit itself, and that window is exactly the rounding margin wide.
        On a stack of a couple of hundred stages the margin is a few hundredths of a percent, the
        window is far too narrow to catch a candidate, and the same pick comes out whichever power
        you hand over. On a stack of a few dozen the margin is percent, the window is wide enough,
        and it does.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        {noPick.length > 0
          ? `${fmt(noPick.length, 0)} of these studies return NO PICK on either power. Every conductor in the shipped table fails the drop limit at those lengths, currents and temperatures, and selectCable says so by returning no cable rather than the least bad one. Select one of them above to see what the panel does with a mode that has no answer.`
          : 'Every study on this page returns a pick on both powers.'}
      </div>
      <div className="mt-2 text-xs text-slate-300">
        One more thing about the last column of the candidate table. selectCable takes the cheapest
        conductor that passes BOTH the drop limit and the ampacity check, and on the shipped table
        the second check is TRUE BY CONSTRUCTION, because a candidate with no declared ampacity
        passes it and the shipped table carries no ampacity column at all. The honest statement is
        that the check does not currently check anything, not that the cable is wrong.
      </div>
      <Note>
        This is the money shot of the tier and it is worth being precise about what it does not say.
        Neither pick is a mistake. Both powers are engine returns, both are defensible, and an
        engineer who reads either one and applies the published limit has done nothing wrong. What
        comes out of the table is still different, and there is nothing in the answer to say which
        power it was built on. That is what an undocumented convention costs.
      </Note>
    </>
  );
};

const Diagnosis = () => {
  const fixture = useMemo(() => {
    try { return diagnosisFixture(); } catch { return null; }
  }, []);
  const under = useMemo(() => {
    try { return underCurveBandRows(); } catch { return null; }
  }, []);
  const high = useMemo(() => {
    try { return ampsHighBandRows(); } catch { return null; }
  }, []);
  const low = useMemo(() => {
    try { return ampsLowBandRows(); } catch { return null; }
  }, []);
  if (!fixture || !under || !under.length || !high || !high.length || !low || !low.length) {
    return <Note>A diagnosis reads the stack curve backwards, so it needs a curve, a stage count and a measurement. With no expected head to compare against there is no ratio, no band and no flag, and the engine returns nothing rather than calling the well healthy by default.</Note>;
  }
  const bands = [
    {
      key: 'underCurve',
      title: 'head under the curve',
      threshold: pct(ESP_THRESHOLDS.underCurveRatio, 1),
      rows: under.map((r) => ({ at: fmt(r.ratio, 4), ...r })),
      colliding: under.filter((r) => r.flagRaised && r.oldPrintEqualledThreshold),
    },
    {
      key: 'ampsHigh',
      title: 'motor amps high',
      threshold: pct(ESP_THRESHOLDS.ampsHighLoad, 1),
      rows: high.map((r) => ({ at: fmt(r.load, 4), ...r })),
      colliding: high.filter((r) => r.flagRaised && r.oldPrintEqualledThreshold),
    },
    {
      key: 'ampsLow',
      title: 'motor amps low',
      threshold: pct(ESP_THRESHOLDS.ampsLowLoad, 1),
      rows: low.map((r) => ({ at: fmt(r.load, 4), ...r })),
      colliding: low.filter((r) => r.flagRaised && r.oldPrintEqualledThreshold),
    },
  ];
  return (
    <>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Stages in the fixture" value={fmt(fixture.stages, 0)} />
          <Tile label="Duty" value={fmt(fixture.qBpd, 0)} unit="bbl/d" />
          <Tile label="Drive" value={fmt(fixture.hz, 0)} unit="Hz" />
          <Tile label="Head the stack should make" value={fmt(fixture.headStackShouldMakeFt, 6)} unit="ft" />
          <Tile label="Head per stage there" value={fmt(fixture.headPerStageFt, 6)} unit="ft" />
          <Tile label="Under curve band" value={pct(ESP_THRESHOLDS.underCurveRatio, 1)} />
          <Tile label="Amps high band" value={pct(ESP_THRESHOLDS.ampsHighLoad, 1)} />
          <Tile label="Amps low band" value={pct(ESP_THRESHOLDS.ampsLowLoad, 1)} />
        </TileGrid>
      </div>
      {bands.map((b) => (
        <div key={b.key} className="mt-4 rounded-md border border-gray-700 bg-[#0F172A] p-3">
          <p className="text-xs text-gray-400 mb-2">
            {b.title}: the flag fires below or above {b.threshold} and then prints the number it
            fired on. {fmt(b.colliding.length, 0)} of {fmt(b.rows.length, 0)} rows on this band used
            to print the threshold itself.
          </p>
          <div className="overflow-x-auto">
            <table className="text-xs text-slate-300 w-full">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left pr-3">measured at</th>
                  <th className="text-left pr-3">flag raised</th>
                  <th className="text-left pr-3">printed the OLD way</th>
                  <th className="text-left pr-3">prints the NEW way</th>
                  <th className="text-left">the old print equalled the threshold</th>
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r) => (
                  <tr key={r.at} className={r.flagRaised && r.oldPrintEqualledThreshold ? 'text-white' : ''}>
                    <td className="pr-3">{r.at}</td>
                    <td className={`pr-3 ${r.flagRaised ? 'text-[#f97316]' : 'text-slate-500'}`}>{yn(r.flagRaised)}</td>
                    <td className="pr-3 text-[#f43f5e]">{r.printedBeforeFixPct}</td>
                    <td className="pr-3 text-[#BFFF00]">{r.printsNowPct}</td>
                    <td>{yn(r.oldPrintEqualledThreshold)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <div className="mt-3 text-xs text-slate-300">
        THE DEFECT WAS IN THE MESSAGE AND NOWHERE ELSE. Each of these three flags fires on a STRICT
        inequality against its threshold and then prints the ratio it fired on. Rounded to whole
        percent, everything in the first tenth of a percent past the threshold rendered AS the
        threshold: a real warning that reads like a false alarm, on a screen where the operator's
        next move is to dismiss it. Read the two print columns side by side and the collision is the
        rows where the old column equals the threshold and the flag is up.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        WHAT THE FIX CHANGED: {fmt(DIAGNOSIS_FIX.messageTemplatesChanged, 0)} message templates went
        from no decimal places to one. Thresholds changed: {fmt(DIAGNOSIS_FIX.thresholdsChanged, 0)}.
        Returned fields changed: {fmt(DIAGNOSIS_FIX.returnedFieldsChanged, 0)}. No comparison, no
        arithmetic and no returned number moved anywhere. Every flag that fired before fires after,
        at the same ratio, and every value the function RETURNS is bit for bit what it was.
      </div>
      <Note>
        ONE DECIMAL NARROWS THE COLLISION BY A FACTOR OF TEN AND DOES NOT REMOVE IT. A whole percent
        print collides with the threshold anywhere in the tenth of a percent beyond it. A one decimal
        print collides anywhere in the hundredth of a percent beyond it, which is ten times narrower
        and still not nought: look at the rows nearest each threshold and the new column still lands
        on it. Rounding cannot fix a display that prints a number next to the bound it just crossed.
        The only fix that removes the collision is to stop printing the two together, and that was
        not this wave's to make.
      </Note>
    </>
  );
};

const PowerExplorer = () => {
  const [mode, setMode] = useState('twopowers');
  return (
    <PanelShell
      title="Power explorer"
      subtitle="The two brake powers a sizing returns and the identity that binds them, the two fields called loadFraction that answer different questions, one cable pick made twice on those two powers, and the three ratio bands the diagnosis prints"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'twopowers' && <TwoPowers />}
        {mode === 'derate' && <Derate />}
        {mode === 'cable' && <Cable />}
        {mode === 'diagnosis' && <Diagnosis />}
      </div>
    </PanelShell>
  );
};

export default PowerExplorer;
