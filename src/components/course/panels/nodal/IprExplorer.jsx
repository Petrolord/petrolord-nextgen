import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ReferenceDot,
} from 'recharts';
import {
  TEACHING_WELLS, BONNY_7, linspace,
  wellIpr, wellInflowReadings, wellForwardPressures, wellModelComparison, wellModelAofs,
  goldenCalibrationCases, goldenOilIprCases, goldenGasIprCases,
} from './nodalLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// IPR explorer, the Associate tier. What the reservoir will give: three inflow
// families read at the same conditions, the index each one backs out of a
// single production test, the two directions the same curve can be read in, and
// the absolute open flow with the thing it is not attached to it.
//
// Every figure on this page is a return value from nodalLab, which is a return
// value from the vendored nodal engine. Nothing here computes a rate or a
// pressure.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const pct = (v, d = 2) => (Number.isFinite(v) ? `${fmt(v * 100, d)} %` : '-');

const yn = (b) => (b ? 'yes' : 'no');

const MODES = [
  ['models', 'Three families, one set of conditions'],
  ['calibration', 'What one production test pins'],
  ['reading', 'Forwards and backwards on one curve'],
  ['aof', 'The absolute open flow, and what it is not'],
];

const WELLS = TEACHING_WELLS.map((W) => [W.label, `${W.label}: ${W.note}`]);

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const wellOf = (label) => TEACHING_WELLS.find((W) => W.label === label) || BONNY_7;

// A user-supplied condition joins the published list rather than replacing it,
// so the shape of the argument stays visible while the learner's own case sits
// on it.
const withCustom = (defaults, raw, hi) => {
  const v = Number(raw);
  const set = Number.isFinite(v) && v >= 0 && v <= hi ? defaults.concat(v) : defaults;
  return [...new Set(set)].sort((a, b) => b - a);
};

const Models = ({ W }) => {
  const [extra, setExtra] = useState('');
  const chart = useMemo(() => {
    try { return wellModelComparison(W, linspace(W.prPsia, 0, 61)); } catch { return null; }
  }, [W]);
  const rows = useMemo(() => {
    try {
      // The lab picks the conditions: the reservoir pressure, the bubble point,
      // the test and an even ladder down to zero. A learner's own pressure joins
      // that list rather than replacing it.
      return wellModelComparison(W, withCustom(wellForwardPressures(W), extra, W.prPsia));
    } catch { return null; }
  }, [W, extra]);
  const aofs = useMemo(() => {
    try { return wellModelAofs(W); } catch { return null; }
  }, [W]);
  if (!chart || !chart.length || !rows || !rows.length || !aofs) {
    return <Note>Three inflow families need a reservoir pressure, a bubble point and a production test before any of them will draw a curve. With one of those missing the engine returns no curve at all rather than a straight line through the origin, and there is nothing to compare.</Note>;
  }
  const atPb = rows.find((r) => r.pwfPsia === W.pbPsia);
  const atZero = rows[rows.length - 1];
  const atTest = rows.find((r) => r.pwfPsia === W.testPwfPsia);
  const above = rows.filter((r) => !r.belowBubblePoint);
  const straightAgreesAbovePb = above.every((r) => r.straightLineMinusCompositeStbd === 0);
  return (
    <>
      <FieldGrid>
        <NumField label="Add a flowing pressure of your own, psia" value={extra} onChange={setExtra} placeholder={String(W.pbPsia)} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Reservoir pressure" value={fmt(W.prPsia, 0)} unit="psia" />
          <Tile label="Bubble point" value={fmt(W.pbPsia, 0)} unit="psia" />
          <Tile label="The one test, rate" value={fmt(W.testQStbd, 0)} unit="stb/d" />
          <Tile label="The one test, pressure" value={fmt(W.testPwfPsia, 0)} unit="psia" />
          <Tile label="Straight line open flow" value={fmt(aofs.straightLineStbd, 3)} unit="stb/d" />
          <Tile label="Vogel open flow" value={fmt(aofs.vogelStbd, 3)} unit="stb/d" />
          <Tile label="Composite open flow" value={fmt(aofs.compositeStbd, 3)} unit="stb/d" />
          <Tile label="Straight line and composite agree above the bubble point"
            value={yn(straightAgreesAbovePb)} />
        </TileGrid>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="pwfPsia" type="number" reversed domain={[0, W.prPsia]} tick={AXIS}
              label={{ value: 'flowing bottomhole pressure, psia', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'rate, stb/d', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={W.pbPsia} stroke="#f472b6" strokeDasharray="5 3"
              label={{ value: 'bubble point', fill: '#f472b6', fontSize: 10, position: 'top' }} />
            <ReferenceLine x={W.testPwfPsia} stroke="#38bdf8" strokeDasharray="5 3"
              label={{ value: 'the test', fill: '#38bdf8', fontSize: 10, position: 'top' }} />
            <Line type="monotone" dataKey="straightLineStbd" name="straight line, a constant index"
              stroke="#f97316" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="vogelStbd" name="Vogel, wholly saturated"
              stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="compositeStbd" name="composite, straight above pb and Vogel below"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">flowing pressure, psia</th>
              <th className="text-left pr-3">below the bubble point</th>
              <th className="text-left pr-3">straight line, stb/d</th>
              <th className="text-left pr-3">Vogel, stb/d</th>
              <th className="text-left pr-3">composite, stb/d</th>
              <th className="text-left pr-3">straight line less composite</th>
              <th className="text-left">Vogel less composite</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.pwfPsia} className={r.pwfPsia === W.testPwfPsia ? 'text-white' : ''}>
                <td className="pr-3">{fmt(r.pwfPsia, 0)}</td>
                <td className="pr-3 text-slate-400">{yn(r.belowBubblePoint)}</td>
                <td className="pr-3 text-[#f97316]">{fmt(r.straightLineStbd, 3)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.vogelStbd, 3)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.compositeStbd, 3)}</td>
                <td className="pr-3">{fmt(r.straightLineMinusCompositeStbd, 3)}</td>
                <td>{fmt(r.vogelMinusCompositeStbd, 3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Read the last two columns down the table. At the test itself, {fmt(W.testPwfPsia, 0)} psia,
        all three families return {atTest ? fmt(atTest.compositeStbd, 3) : '-'} stb/d and the two
        difference columns are {atTest ? fmt(atTest.straightLineMinusCompositeStbd, 6) : '-'} and
        {' '}{atTest ? fmt(atTest.vogelMinusCompositeStbd, 6) : '-'}, because all three were
        calibrated on that one point.
        {straightAgreesAbovePb
          ? ` Above the bubble point the straight line and the composite are the same curve on this well, and the engine says so exactly: every row above ${fmt(W.pbPsia, 0)} psia carries a difference of nought, because this well's test was taken above its bubble point and the straight line therefore backs out the well's own index.`
          : ` Above the bubble point the straight line and the composite are NOT the same curve here, and that is the second failure worth separating out: this well's test was taken below its bubble point, so the index the straight line backs out is not the well's own and the two curves are already apart at pressures where the physics agrees with the straight line.`}
        {' '}Vogel joins neither of them above the bubble point, and the reason is worth naming, it
        treats the whole drawdown as saturated and so bends where there is nothing to bend for.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        Below the bubble point they come apart further. At {fmt(W.pbPsia, 0)} psia the straight line
        reading and the composite reading differ by
        {' '}{atPb ? fmt(atPb.straightLineMinusCompositeStbd, 3) : '-'} stb/d, and at zero pressure
        the straight line offers {atZero ? fmt(atZero.straightLineStbd, 3) : '-'} stb/d against the
        composite's {atZero ? fmt(atZero.compositeStbd, 3) : '-'}. Gas coming out of solution takes
        the relative permeability to oil down with it, and a constant index has no way to say that.
      </div>
      <Note>
        The straight line is not wrong, it is wrong BELOW THE BUBBLE POINT. Above it the reservoir
        really does deliver in proportion to drawdown, and a curve fitted through a saturated test
        and read back into the undersaturated region carries the error the other way. Which half of
        the curve you are standing on decides which family is honest, and that is a fact about the
        reservoir rather than a preference about models.
      </Note>
    </>
  );
};

const Calibration = ({ W }) => {
  const aofs = useMemo(() => {
    try { return wellModelAofs(W); } catch { return null; }
  }, [W]);
  const readings = useMemo(() => {
    try { return wellInflowReadings(W); } catch { return null; }
  }, [W]);
  const golden = useMemo(() => {
    try { return goldenCalibrationCases(); } catch { return null; }
  }, []);
  if (!aofs || !readings || !golden || !golden.length) {
    return <Note>A calibration needs a production test the engine will accept: a positive rate at a flowing pressure below the reservoir pressure. Without one there is no index to back out and the engine returns no curve rather than guessing an index from the reservoir pressure alone.</Note>;
  }
  const corrupted = aofs.calibrationIsCorrupted;
  return (
    <>
      <div className={`rounded-md border p-4 ${corrupted ? 'border-rose-700 bg-rose-900/20' : 'border-emerald-600 bg-emerald-900/20'}`}>
        <p className="text-xs text-gray-400 mb-1">
          The productivity index each family backs out of the SAME test on {W.label}
        </p>
        <p className="text-2xl font-bold text-white mb-1">
          {fmt(aofs.straightLinePiStbdPerPsi, 6)}
          <span className="text-[#BFFF00]"> against </span>
          {fmt(aofs.compositePiStbdPerPsi, 6)} <span className="text-gray-400 text-sm">stb/d/psi</span>
        </p>
        <p className={`text-sm mb-0 ${corrupted ? 'text-rose-300' : 'text-emerald-300'}`}>
          {corrupted
            ? `The test sits at ${fmt(W.testPwfPsia, 0)} psia, BELOW the ${fmt(W.pbPsia, 0)} psia bubble point, so the straight line is being fitted to a two phase test. The index it returns is ${fmt(aofs.piErrorStbdPerPsi, 6)} stb/d/psi away from the well's own, and the sign of that gap says the straight line UNDERSTATES the index.`
            : `The test sits at ${fmt(W.testPwfPsia, 0)} psia, ABOVE the ${fmt(W.pbPsia, 0)} psia bubble point, so the straight line is being fitted to single phase flow and it backs out the well's own index exactly. The gap is ${fmt(aofs.piErrorStbdPerPsi, 6)} stb/d/psi.`}
        </p>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Test rate" value={fmt(readings.testQStbd, 0)} unit="stb/d" />
          <Tile label="Test flowing pressure" value={fmt(readings.testPwfPsia, 0)} unit="psia" />
          <Tile label="Drawdown at the test" value={fmt(readings.testDrawdownPsi, 0)} unit="psi" />
          <Tile label="Test below the bubble point" value={yn(readings.testIsBelowBubblePoint)} />
          <Tile label="Index the straight line infers" value={fmt(aofs.straightLinePiStbdPerPsi, 6)} unit="stb/d/psi" />
          <Tile label="Index the composite infers" value={fmt(aofs.compositePiStbdPerPsi, 6)} unit="stb/d/psi" />
          <Tile label="Index error the calibration carries" value={fmt(aofs.piErrorStbdPerPsi, 6)} unit="stb/d/psi" />
          <Tile label="Calibration is corrupted" value={yn(corrupted)} />
        </TileGrid>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">published case</th>
              <th className="text-left pr-3">family</th>
              <th className="text-left pr-3">pr, psia</th>
              <th className="text-left pr-3">pb, psia</th>
              <th className="text-left pr-3">test, stb/d at psia</th>
              <th className="text-left pr-3">index, stb/d/psi</th>
              <th className="text-left pr-3">Fetkovich C</th>
              <th className="text-left pr-3">open flow, stb/d</th>
              <th className="text-left">rate returned at the test pressure</th>
            </tr>
          </thead>
          <tbody>
            {golden.map((c) => (
              <tr key={c.id} className={c.id.startsWith('composite') ? 'text-white' : ''}>
                <td className="pr-3">{c.id}</td>
                <td className="pr-3 text-slate-400">{c.model}</td>
                <td className="pr-3">{fmt(c.inputs.pr, 0)}</td>
                <td className="pr-3">{fmt(c.inputs.pb, 0)}</td>
                <td className="pr-3">{fmt(c.inputs.testQ, 0)} at {fmt(c.inputs.testPwf, 0)}</td>
                <td className="pr-3 text-[#BFFF00]">{Number.isFinite(c.piStbdPerPsi) ? fmt(c.piStbdPerPsi, 7) : 'the family has none'}</td>
                <td className="pr-3">{Number.isFinite(c.fetkovichC) ? fmt(c.fetkovichC, 10) : '-'}</td>
                <td className="pr-3">{fmt(c.aofStbd, 4)}</td>
                <td>{fmt(c.qAtTestPwfStbd, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The last column is the check every one of these cases has to pass: read the calibrated curve
        back at the pressure the test was taken at and the rate that comes out is the rate that went
        in. Calibration is not a fit through a cloud, it is one equation in one unknown, and a
        family with no index at all still has to honour the test. Vogel pins its open flow from it,
        Fetkovich pins a coefficient C of
        {' '}{fmt((golden.find((c) => c.id === 'fetkovichFromTest') || {}).fetkovichC, 10)}, and the
        two composite rows are the same family calibrated from a test on either side of the bubble
        point.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        Compare those two composite rows and then read the card above. The index a straight line
        backs out of a test is the test rate over the test drawdown, and that is only the
        productivity index if the flow between the sandface and the reservoir was single phase all
        the way. Take the test below the bubble point and part of the drawdown was spent pushing two
        phases, so the rate is lower than a single phase reservoir would have given at the same
        drawdown, and the index that falls out is smaller than the well's own. The curve is then
        wrong in its shape AND wrong in its slope at the top, which are two different mistakes that
        do not cancel.
      </div>
      <Note>
        Switch wells above to see the controlled version of the same experiment. On a well whose
        test sits above its bubble point the index error is exactly nought and the only thing left
        between the straight line and the composite is the shape of the curve below the bubble
        point. On a well whose test sits below it, both mistakes are present at once, and a lesson
        that only ever shows the second case cannot tell a learner which of the two it is looking
        at.
      </Note>
    </>
  );
};

const Reading = ({ W }) => {
  const readings = useMemo(() => {
    try { return wellInflowReadings(W); } catch { return null; }
  }, [W]);
  const curve = useMemo(() => {
    try { return wellIpr(W).curve; } catch { return null; }
  }, [W]);
  const chord = useMemo(() => {
    try { return goldenGasIprCases(); } catch { return null; }
  }, []);
  const [fwd, setFwd] = useState('');
  const [inv, setInv] = useState('');
  if (!readings || !curve || !curve.length || !chord) {
    return <Note>There is no curve to read in either direction. The engine returns an empty curve when the conditions do not describe a well, and neither a forward reading nor an inverse one has an answer on an empty curve.</Note>;
  }
  const forward = readings.forward;
  const inverse = readings.inverse;
  const fwdRow = forward.find((r) => String(r.pwfPsia) === fwd) || forward[Math.floor(forward.length / 2)];
  const invRow = inverse.find((r) => String(r.qStbd) === inv) || inverse[Math.floor(inverse.length / 2)];
  const worstChord = chord
    .flatMap((c) => c.chord40.map((r) => ({ id: c.id, model: c.model, ...r })))
    .reduce((a, b) => (Math.abs(b.biasPsi) > Math.abs(a.biasPsi) ? b : a));
  return (
    <>
      <FieldGrid>
        <SelectField label="Forward reading: a pressure to read a rate at" value={fwd || String(fwdRow.pwfPsia)}
          onChange={setFwd} options={forward.map((r) => [String(r.pwfPsia), `${fmt(r.pwfPsia, 0)} psia`])} />
        <SelectField label="Inverse reading: a rate to read a pressure at" value={inv || String(invRow.qStbd)}
          onChange={setInv} options={inverse.map((r) => [String(r.qStbd), `${fmt(r.qStbd, 0)} stb/d`])} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Forward: pressure asked for" value={fmt(fwdRow.pwfPsia, 0)} unit="psia" />
          <Tile label="Forward: rate returned" value={fmt(fwdRow.qStbd, 4)} unit="stb/d" />
          <Tile label="Forward: drawdown it took" value={fmt(fwdRow.drawdownPsi, 3)} unit="psi" />
          <Tile label="Forward: share of the open flow" value={pct(fwdRow.fracOfAof, 3)} />
          <Tile label="Inverse: rate asked for" value={fmt(invRow.qStbd, 0)} unit="stb/d" />
          <Tile label="Inverse: pressure returned" value={fmt(invRow.pwfPsia, 4)} unit="psia" />
          <Tile label="Inverse: drawdown it took" value={fmt(invRow.drawdownPsi, 3)} unit="psi" />
          <Tile label="Inverse: share of the open flow" value={pct(invRow.fracOfAof, 3)} />
        </TileGrid>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curve} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="q" type="number" domain={[0, readings.aofStbd]} tick={AXIS}
              label={{ value: 'rate, stb/d', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis dataKey="pwf" domain={[0, W.prPsia]} tick={AXIS}
              label={{ value: 'flowing bottomhole pressure, psia', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 3)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="pwf" name="the composite inflow curve"
              stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <ReferenceLine y={fwdRow.pwfPsia} stroke="#38bdf8" strokeDasharray="4 3"
              label={{ value: 'forward: a pressure goes in', fill: '#38bdf8', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceDot x={fwdRow.qStbd} y={fwdRow.pwfPsia} r={5} fill="#38bdf8" stroke="none" />
            <ReferenceLine x={invRow.qStbd} stroke="#f472b6" strokeDasharray="4 3"
              label={{ value: 'inverse: a rate goes in', fill: '#f472b6', fontSize: 10, position: 'insideTopLeft' }} />
            <ReferenceDot x={invRow.qStbd} y={invRow.pwfPsia} r={5} fill="#f472b6" stroke="none" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid gap-3 lg:grid-cols-2 mt-3">
        <div className="overflow-x-auto">
          <p className="text-xs text-slate-500 mb-1">Forward: a pressure in, a rate out</p>
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">pressure, psia</th>
                <th className="text-left pr-3">rate, stb/d</th>
                <th className="text-left pr-3">drawdown, psi</th>
                <th className="text-left">share of open flow</th>
              </tr>
            </thead>
            <tbody>
              {forward.map((r) => (
                <tr key={r.pwfPsia} className={r.pwfPsia === fwdRow.pwfPsia ? 'text-[#38bdf8]' : ''}>
                  <td className="pr-3">{fmt(r.pwfPsia, 0)}</td>
                  <td className="pr-3">{fmt(r.qStbd, 4)}</td>
                  <td className="pr-3">{fmt(r.drawdownPsi, 0)}</td>
                  <td>{pct(r.fracOfAof, 3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto">
          <p className="text-xs text-slate-500 mb-1">Inverse: a rate in, a pressure out</p>
          <table className="text-xs text-slate-300 w-full">
            <thead className="text-slate-500">
              <tr>
                <th className="text-left pr-3">rate, stb/d</th>
                <th className="text-left pr-3">pressure, psia</th>
                <th className="text-left pr-3">drawdown, psi</th>
                <th className="text-left">share of open flow</th>
              </tr>
            </thead>
            <tbody>
              {inverse.map((r) => (
                <tr key={r.qStbd} className={r.qStbd === invRow.qStbd ? 'text-[#f472b6]' : ''}>
                  <td className="pr-3">{fmt(r.qStbd, 0)}</td>
                  <td className="pr-3">{fmt(r.pwfPsia, 4)}</td>
                  <td className="pr-3">{fmt(r.drawdownPsi, 3)}</td>
                  <td>{pct(r.fracOfAof, 3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Both markers sit on the same curve and neither reading is harder than the other to look at.
        They are not the same OPERATION. The forward reading evaluates the relation: hand it
        {' '}{fmt(fwdRow.pwfPsia, 0)} psia and the composite says {fmt(fwdRow.qStbd, 4)} stb/d in one
        pass, because the relation is written as rate in terms of pressure. The inverse reading has
        to SOLVE it: hand it {fmt(invRow.qStbd, 0)} stb/d and the engine root finds the pressure
        {' '}{fmt(invRow.pwfPsia, 4)} psia that makes the forward relation return that rate. One is
        an evaluation and one is a search, and they can fail in different ways.
      </div>
      <div className="mt-3 overflow-x-auto">
        <p className="text-xs text-slate-500 mb-1">
          Why the search, and not a reading off the sampled curve: the published gas families,
          inverted both ways
        </p>
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">published gas case</th>
              <th className="text-left pr-3">rate, Mscf/d</th>
              <th className="text-left pr-3">chord off the sampled curve, psia</th>
              <th className="text-left pr-3">exact inverse, psia</th>
              <th className="text-left">bias, psi</th>
            </tr>
          </thead>
          <tbody>
            {chord.flatMap((c) => c.chord40.map((r) => (
              <tr key={`${c.id}-${r.qMscfd}`} className={Math.abs(r.biasPsi) > 5 ? 'text-rose-300 font-semibold' : ''}>
                <td className="pr-3">{c.id}</td>
                <td className="pr-3">{fmt(r.qMscfd, 4)}</td>
                <td className="pr-3">{fmt(r.chordPwfPsia, 4)}</td>
                <td className="pr-3">{fmt(r.exactPwfPsia, 4)}</td>
                <td>{fmt(r.biasPsi, 6)}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Every bias in that last column is NEGATIVE, and that is the tell. The engine samples a gas
        deliverability curve evenly in PRESSURE, which makes it sparse in RATE exactly where the
        curve is steepest, so a straight chord drawn between two neighbouring samples cuts the
        corner and lands low. It is one to three psi through the body of both families and
        {' '}{fmt(worstChord.biasPsi, 6)} psi at the low rate end of {worstChord.id}, where the curve
        turns hardest. The oil inverse on this page carries none of it, because it is a Brent root
        find on the forward relation and never touches a table.
      </div>
      <Note>
        The practical version: an inverse reading is only as good as the thing it searches. Solve
        the relation and you get the answer the relation implies. Interpolate a sampled copy of it
        and you get the answer the SAMPLING implies, with a bias whose sign you can predict from the
        curvature and whose size you cannot, unless somebody measured it. Somebody did, and the
        column above is the measurement.
      </Note>
    </>
  );
};

const Aof = ({ W }) => {
  const aofs = useMemo(() => {
    try { return wellModelAofs(W); } catch { return null; }
  }, [W]);
  const readings = useMemo(() => {
    try { return wellInflowReadings(W); } catch { return null; }
  }, [W]);
  const published = useMemo(() => {
    try { return goldenOilIprCases(); } catch { return null; }
  }, []);
  if (!aofs || !readings || !published || !published.length) {
    return <Note>An absolute open flow is a reading off a calibrated curve, so a well with no curve has no open flow. The engine returns NaN rather than a large number, which is the right refusal: an open flow invented from a reservoir pressure alone would look exactly like a real one.</Note>;
  }
  const bars = [
    { name: 'straight line', v: aofs.straightLineStbd, fill: '#f97316' },
    { name: 'Vogel', v: aofs.vogelStbd, fill: '#38bdf8' },
    { name: 'composite', v: aofs.compositeStbd, fill: '#BFFF00' },
  ];
  const atZero = readings.forward[readings.forward.length - 1];
  return (
    <>
      <div className="rounded-md border border-gray-700 bg-[#0F172A] p-4">
        <p className="text-xs text-gray-400 mb-1">
          The absolute open flow on {W.label}: the rate the calibrated curve returns at a flowing
          bottomhole pressure of nought
        </p>
        <p className="text-2xl font-bold text-white mb-1">
          {fmt(aofs.compositeStbd, 4)} <span className="text-gray-400 text-sm">stb/d</span>
        </p>
        <p className="text-sm mb-0 text-gray-300">
          The same well read by the other two families gives
          {' '}{fmt(aofs.straightLineStbd, 4)} and {fmt(aofs.vogelStbd, 4)} stb/d. Three numbers, one
          well, one production test. The open flow is as much a property of the family you chose as
          it is of the reservoir.
        </p>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Reservoir pressure" value={fmt(readings.prPsia, 0)} unit="psia" />
          <Tile label="Drawdown an open flow requires" value={fmt(atZero.drawdownPsi, 0)} unit="psi" />
          <Tile label="Composite open flow" value={fmt(aofs.compositeStbd, 4)} unit="stb/d" />
          <Tile label="Rate at the bubble point" value={fmt(readings.qAtBubblePointStbd, 4)} unit="stb/d" />
          <Tile label="Share of the open flow that is saturated flow"
            value={pct(readings.saturatedShareOfAof, 3)} />
          <Tile label="The one test that pinned all of it"
            value={`${fmt(readings.testQStbd, 0)} at ${fmt(readings.testPwfPsia, 0)}`} unit="stb/d, psia" />
          <Tile label="Straight line open flow" value={fmt(aofs.straightLineStbd, 4)} unit="stb/d" />
          <Tile label="Vogel open flow" value={fmt(aofs.vogelStbd, 4)} unit="stb/d" />
        </TileGrid>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 16, bottom: 5, left: 20 }}>
            {GRID}
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis tick={AXIS} tickFormatter={(v) => fmt(v, 0)}
              label={{ value: 'open flow, stb/d', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt(v, 4)} />
            <ReferenceLine y={aofs.compositeStbd} stroke="#BFFF00" strokeDasharray="5 3"
              label={{ value: 'the composite reading', fill: '#BFFF00', fontSize: 10, position: 'insideBottomRight' }} />
            <Bar dataKey="v" name="stb/d" isAnimationActive={false}>
              {bars.map((b) => <Cell key={b.name} fill={b.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">published case</th>
              <th className="text-left pr-3">family</th>
              <th className="text-left pr-3">reservoir pressure, psia</th>
              <th className="text-left pr-3">bubble point, psia</th>
              <th className="text-left pr-3">open flow, stb/d</th>
              <th className="text-left">rows on the sampled curve</th>
            </tr>
          </thead>
          <tbody>
            {published.map((c) => (
              <tr key={c.id}>
                <td className="pr-3">{c.id}</td>
                <td className="pr-3 text-slate-400">{c.model}</td>
                <td className="pr-3">{fmt(c.inputs.pr, 0)}</td>
                <td className="pr-3">{Number.isFinite(c.inputs.pb) ? fmt(c.inputs.pb, 0) : '-'}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(c.aofStbd, 4)}</td>
                <td>{fmt(c.curveRows, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        WHAT THE OPEN FLOW IS. It is the last row of the forward table and nothing more: the rate
        the calibrated relation returns when you hand it a flowing bottomhole pressure of nought. It
        is the cleanest single number for comparing one inflow against another, it is what a
        deliverability curve is normalised against, and it is the upper bound the node solver scans
        up to.
      </div>
      <div className="mt-2 text-xs text-slate-300">
        WHAT IT IS NOT. It is not a rate anybody should plan on. Producing at it would require the
        pressure at the sandface to be nought, which means the full {fmt(atZero.drawdownPsi, 0)} psi
        of drawdown, no column standing in the tubing, no wellhead pressure and no separator to
        deliver into. No completion delivers that, and nothing on this page has yet said what the
        tubing would demand at that rate. It is also not a measurement: three families calibrated
        from the same test read it as {fmt(aofs.straightLineStbd, 4)},
        {' '}{fmt(aofs.vogelStbd, 4)} and {fmt(aofs.compositeStbd, 4)} stb/d, and every one of those
        readings is an extrapolation far outside the drawdown the test actually explored.
      </div>
      <Note>
        Quote an open flow as a capacity and it will be read as a target. The honest way to use it
        is as a denominator: this well is producing at some share of its open flow, and the share is
        the thing that means something. The rate the well will actually make is set where the inflow
        meets what the tubing will accept, which is a different question and a later tier.
      </Note>
    </>
  );
};

const IprExplorer = () => {
  const [mode, setMode] = useState('models');
  const [wellLabel, setWellLabel] = useState(BONNY_7.label);
  const W = wellOf(wellLabel);
  return (
    <PanelShell
      title="Inflow explorer"
      subtitle="Three inflow families read at one set of conditions, the index a single production test pins, the same curve read forwards and backwards, and the absolute open flow with the thing it is not"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        <SelectField label="Teaching well" value={wellLabel} onChange={setWellLabel} options={WELLS} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'models' && <Models W={W} />}
        {mode === 'calibration' && <Calibration W={W} />}
        {mode === 'reading' && <Reading W={W} />}
        {mode === 'aof' && <Aof W={W} />}
      </div>
    </PanelShell>
  );
};

export default IprExplorer;
