import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  HOURS_PER_DAY, NPT_FRAC, ACTIVITY_KINDS,
  ropSweep, tripDepthSweep, casingSpeedSweep, flatDurationSweep, nptSweep,
  programOf, publishedProgram, publishedTotals,
} from './wellCostLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Time explorer, the Associate tier. The four closed forms against the input
// that drives each of them, the published programme as a schedule and a
// time-depth curve, the allowance read in both of its conventions, and the two
// numbers that leave this engine for the AFE.
//
// Every figure on this page is a return value from the lab, which is a return
// value from the engine. Nothing here computes hours.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const pct = (v, d = 3) => (Number.isFinite(v) ? `${fmt(v * 100, d)} %` : '-');

const MODES = [
  ['forms', 'The four closed forms'],
  ['schedule', 'The published programme'],
  ['npt', 'The allowance, in both conventions'],
  ['rollup', 'What the programme rolls up to'],
];

const FORMS = [
  ['drill', 'Drilling: interval over rate'],
  ['trip', 'Tripping: twice the depth over speed'],
  ['casing', 'Casing: a run plus a flat floor'],
  ['flat', 'Flat time: the duration itself'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

// A user-supplied value joins the published sweep rather than replacing it, so
// the shape stays visible while the learner's own case sits on it.
const withCustom = (defaults, raw) => {
  const v = Number(raw);
  const set = Number.isFinite(v) && v > 0 ? defaults.concat(v) : defaults;
  return [...new Set(set)].sort((a, b) => a - b);
};

const Drill = () => {
  const [rop, setRop] = useState('');
  const rows = useMemo(() => {
    try { return ropSweep(withCustom([5, 8, 10, 15, 25, 40], rop)); } catch { return null; }
  }, [rop]);
  if (!rows || !rows.length) {
    return <Note>A rate of penetration has to be a positive number of metres per hour before the engine will give an activity a duration. Type one above and the sweep comes back.</Note>;
  }
  const footages = new Set(rows.map((r) => r.footageM));
  const at = (v) => rows.find((r) => r.ropMPerHr === v);
  const half = at(5);
  const full = at(10);
  return (
    <>
      <FieldGrid>
        <NumField label="Add a rate of your own, m/hr" value={rop} onChange={setRop} placeholder="12" />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Interval drilled in every row" value={fmt(rows[0].footageM, 3)} unit="m" />
          <Tile label="Distinct footage values in the sweep" value={fmt(footages.size, 0)} />
          <Tile label="Hours at 5 m/hr" value={fmt(rows[0] && at(5) ? at(5).hr : NaN, 3)} unit="h" />
          <Tile label="Hours at 10 m/hr" value={fmt(at(10) ? at(10).hr : NaN, 3)} unit="h" />
          <Tile label="Halving the rate multiplies the hours by"
            value={half && full ? fmt(half.hr / full.hr, 6) : '-'} />
          <Tile label="Fastest row" value={fmt(rows[rows.length - 1].hr, 3)} unit="h" />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="ropMPerHr" type="number" tick={AXIS}
              label={{ value: 'rate of penetration, m/hr', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="hr" tick={AXIS}
              label={{ value: 'hours', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="m" orientation="right" domain={[0, 'dataMax']} tick={AXIS}
              label={{ value: 'rate times hours, m', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="hr" type="monotone" dataKey="hr" name="hours the section takes"
              stroke="#BFFF00" dot isAnimationActive={false} />
            <Line yAxisId="m" type="monotone" dataKey="footageM" name="rate times hours"
              stroke="#f472b6" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">rate, m/hr</th>
              <th className="text-left pr-3">hours</th>
              <th className="text-left pr-3">days</th>
              <th className="text-left">rate times hours, m</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.ropMPerHr}>
                <td className="pr-3">{fmt(r.ropMPerHr, 4)}</td>
                <td className="pr-3">{fmt(r.hr, 4)}</td>
                <td className="pr-3">{fmt(r.days, 5)}</td>
                <td className="text-[#f472b6]">{fmt(r.footageM, 3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The pink line is flat. Whatever the rate does, rate times hours comes back to the same
        {' '}{fmt(rows[0].footageM, 0)} m, because the metres are the thing you asked for and the
        hours are what they cost. That is a HYPERBOLA and not a line: halving the rate from 10 to 5
        multiplies the hours by exactly {half && full ? fmt(half.hr / full.hr, 6) : '-'}, and the
        same halving lower down costs far more hours than it does higher up.
      </div>
      <Note>
        This is why a rate of penetration argument is a cost argument, and why the argument is
        worth having on the slow sections first. The hours saved by a fixed improvement in rate are
        not the same at 8 m/hr as at 25 m/hr, so an efficiency programme that spreads itself evenly
        across a well is spending its effort where the curve is already flat.
      </Note>
    </>
  );
};

const Trip = () => {
  const [speed, setSpeed] = useState('500');
  const [depth, setDepth] = useState('');
  const v = Number(speed);
  const rows = useMemo(() => {
    try {
      if (!Number.isFinite(v) || v <= 0) return null;
      return tripDepthSweep(withCustom([500, 1000, 2000, 3000, 4500], depth), v);
    } catch { return null; }
  }, [v, depth]);
  if (!rows || !rows.length) {
    return <Note>A trip needs a positive tripping speed in metres per hour and a positive depth. With either one missing there is no duration to report, and the engine says so rather than guessing.</Note>;
  }
  const ratios = new Set(rows.map((r) => r.roundTripRatio));
  const pair = rows.filter((r) => r.mdM === 1000 || r.mdM === 2000);
  return (
    <>
      <FieldGrid>
        <NumField label="Tripping speed, m/hr" value={speed} onChange={setSpeed} placeholder="500" />
        <NumField label="Add a depth of your own, m" value={depth} onChange={setDepth} placeholder="3500" />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Round trip over one way, every row" value={fmt(rows[0].roundTripRatio, 6)} />
          <Tile label="Distinct ratios in the sweep" value={fmt(ratios.size, 0)} />
          <Tile label="Hours at the deepest row" value={fmt(rows[rows.length - 1].hr, 4)} unit="h" />
          <Tile label="One way at that depth" value={fmt(rows[rows.length - 1].oneWayHr, 4)} unit="h" />
          <Tile label="Twice the hole, times the hours by"
            value={pair.length === 2 ? fmt(pair[1].hr / pair[0].hr, 6) : '-'} />
          <Tile label="Speed in force" value={fmt(rows[0].tripSpeedMPerHr, 4)} unit="m/hr" />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="mdM" type="number" tick={AXIS}
              label={{ value: 'depth, m', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'hours', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="linear" dataKey="hr" name="round trip, out and back"
              stroke="#BFFF00" dot isAnimationActive={false} />
            <Line type="linear" dataKey="oneWayHr" name="one way only"
              stroke="#38bdf8" strokeDasharray="4 3" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">depth, m</th>
              <th className="text-left pr-3">one way, h</th>
              <th className="text-left pr-3">round trip, h</th>
              <th className="text-left">round trip over one way</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.mdM}>
                <td className="pr-3">{fmt(r.mdM, 3)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.oneWayHr, 4)}</td>
                <td className="pr-3">{fmt(r.hr, 4)}</td>
                <td className="text-[#BFFF00]">{fmt(r.roundTripRatio, 6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Two straight lines, and the upper one is exactly twice the lower one at every depth. The
        last column is {fmt(rows[0].roundTripRatio, 6)} in every row and it is not an
        approximation: a round trip is out and back, so the engine charges the depth twice. Read
        the dashed line as a trip and you have halved the tripping time in the estimate.
      </div>
      <Note>
        On a deep well that mistake is not a rounding error. The published programme trips twice,
        at 2,000 m and at total depth, and both of those are round trips. Halving them in an
        estimate is days, and the days go straight onto the rig line because the rig is on a day
        rate whether the pipe is going up or coming down.
      </Note>
    </>
  );
};

const Casing = () => {
  const [md, setMd] = useState('3000');
  const [flat, setFlat] = useState('14');
  const [speed, setSpeed] = useState('');
  const mdM = Number(md);
  const flatHr = Number(flat);
  const rows = useMemo(() => {
    try {
      if (!Number.isFinite(mdM) || mdM <= 0 || !Number.isFinite(flatHr) || flatHr < 0) return null;
      return casingSpeedSweep(withCustom([100, 200, 300, 400, 800, 2000], speed), mdM, flatHr);
    } catch { return null; }
  }, [mdM, flatHr, speed]);
  const enormous = useMemo(() => {
    try {
      if (!Number.isFinite(mdM) || mdM <= 0 || !Number.isFinite(flatHr) || flatHr < 0) return null;
      return casingSpeedSweep([1e9], mdM, flatHr)[0];
    } catch { return null; }
  }, [mdM, flatHr]);
  if (!rows || !rows.length || !enormous) {
    return <Note>A casing run needs a positive depth, a positive running speed and a flat time that is not negative. The flat time is allowed to be zero, and a zero there is a claim worth defending: it says the cement sets in no time at all.</Note>;
  }
  const at = (x) => rows.find((r) => r.runSpeedMPerHr === x);
  const a400 = at(400);
  const a800 = at(800);
  return (
    <>
      <FieldGrid>
        <NumField label="Depth of the casing string, m" value={md} onChange={setMd} placeholder="3000" />
        <NumField label="Flat time, h" value={flat} onChange={setFlat} placeholder="14" />
        <NumField label="Add a running speed, m/hr" value={speed} onChange={setSpeed} placeholder="600" />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="The floor no speed can beat" value={fmt(rows[0].floorHr, 4)} unit="h" />
          <Tile label="Hours at a billion m/hr" value={fmt(enormous.hr, 4)} unit="h" />
          <Tile label="Running hours at that speed" value={fmt(enormous.runHr, 6)} unit="h" />
          <Tile label="Hours at 400 m/hr" value={a400 ? fmt(a400.hr, 4) : '-'} unit="h" />
          <Tile label="Hours at 800 m/hr" value={a800 ? fmt(a800.hr, 4) : '-'} unit="h" />
          <Tile label="What doubling 400 to 800 buys"
            value={a400 && a800 ? fmt(a400.hr - a800.hr, 4) : '-'} unit="h" />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="runSpeedMPerHr" type="number" tick={AXIS}
              label={{ value: 'running speed, m/hr', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis domain={[0, 'dataMax']} tick={AXIS}
              label={{ value: 'hours', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={rows[0].floorHr} stroke="#f472b6" strokeDasharray="5 3"
              label={{ value: 'the flat floor', fill: '#f472b6', fontSize: 10, position: 'insideBottomRight' }} />
            <Line type="monotone" dataKey="hr" name="whole activity"
              stroke="#BFFF00" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="runHr" name="the running half only"
              stroke="#38bdf8" strokeDasharray="4 3" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">speed, m/hr</th>
              <th className="text-left pr-3">running, h</th>
              <th className="text-left pr-3">flat, h</th>
              <th className="text-left">activity, h</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.runSpeedMPerHr}>
                <td className="pr-3">{fmt(r.runSpeedMPerHr, 3)}</td>
                <td className="pr-3 text-[#38bdf8]">{fmt(r.runHr, 4)}</td>
                <td className="pr-3 text-[#f472b6]">{fmt(r.flatHr, 4)}</td>
                <td>{fmt(r.hr, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        This form is AFFINE, not proportional, and the pink line is the reason. The green curve
        falls as the speed rises and then stops falling, flattening onto
        {' '}{fmt(rows[0].floorHr, 4)} h. Ask for a billion metres per hour and the activity still
        takes {fmt(enormous.hr, 4)} h, because rigging up, circulating, cementing and waiting on
        cement do not care how fast the pipe went down. Doubling 400 to 800 m/hr buys
        {' '}{a400 && a800 ? fmt(a400.hr - a800.hr, 4) : '-'} h out of
        {' '}{a400 ? fmt(a400.hr, 4) : '-'}, which is not half of anything.
      </div>
      <Note>
        The practical version: on a casing job, hours come out of the flat term far more readily
        than out of the running speed, and the flat term is where the cement schedule lives. An
        argument about running speed on a string whose flat time is the larger half is an argument
        about the smaller half of the job.
      </Note>
    </>
  );
};

const Flat = () => {
  const [dur, setDur] = useState('');
  const rows = useMemo(() => {
    try { return flatDurationSweep(withCustom([6, 12, 24, 48, 60, 96], dur)); } catch { return null; }
  }, [dur]);
  const publishedFlats = useMemo(() => {
    try { return publishedProgram().rows.filter((r) => r.kind === 'flat'); } catch { return null; }
  }, []);
  const totals = useMemo(() => {
    try { return publishedTotals(); } catch { return null; }
  }, []);
  if (!rows || !rows.length || !publishedFlats || !totals) {
    return <Note>A flat activity needs a duration in hours and nothing else. Give it a number and it is its own answer.</Note>;
  }
  const flatHr = publishedFlats.reduce((s, r) => s + r.productiveHr, 0);
  const disagreements = rows.filter((r) => r.hr !== r.durationHr).length;
  return (
    <>
      <FieldGrid>
        <NumField label="Add a duration of your own, h" value={dur} onChange={setDur} placeholder="18" />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Rows where hours differ from duration" value={fmt(disagreements, 0)} />
          <Tile label="Flat activities on the published well" value={fmt(publishedFlats.length, 0)} />
          <Tile label="Their productive hours" value={fmt(flatHr, 3)} unit="h" />
          <Tile label="Productive hours on the whole well" value={fmt(totals.productiveHr, 3)} unit="h" />
          <Tile label="Share of the productive programme" value={pct(flatHr / totals.productiveHr, 2)} />
          <Tile label="Activity kinds the engine knows" value={ACTIVITY_KINDS.join(', ')} />
        </TileGrid>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">duration asked for, h</th>
              <th className="text-left pr-3">hours returned</th>
              <th className="text-left">rate that could change it</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.durationHr}>
                <td className="pr-3">{fmt(r.durationHr, 4)}</td>
                <td className="pr-3 text-[#BFFF00]">{fmt(r.hr, 4)}</td>
                <td className="text-slate-400">none, this kind has no rate at all</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">flat activity on the published well</th>
              <th className="text-left pr-3">productive, h</th>
              <th className="text-left">elapsed, h</th>
            </tr>
          </thead>
          <tbody>
            {publishedFlats.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{fmt(r.productiveHr, 4)}</td>
                <td>{fmt(r.durationHr, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        {fmt(flatHr, 0)} of the {fmt(totals.productiveHr, 0)} productive hours on this well are
        flat time, which is {pct(flatHr / totals.productiveHr, 2)} of the programme, and no
        drilling rate touches any of it. A campaign that promises to save days by drilling faster
        has to find them in the other {pct(1 - flatHr / totals.productiveHr, 2)}.
      </div>
      <Note>
        Flat time is where the honest work of a schedule usually hides: rig moves, tests, waiting
        on cement, handover. It is the only kind of activity with no rate, which makes it immune to
        every rate argument and also the easiest place for optimism to sit unchallenged, because
        there is no formula to disagree with. A flat duration is a judgement, and it should be
        defended as one.
      </Note>
    </>
  );
};

const Forms = () => {
  const [form, setForm] = useState('drill');
  return (
    <>
      <SelectField label="Closed form" value={form} onChange={setForm} options={FORMS} />
      <div className="mt-3">
        {form === 'drill' && <Drill />}
        {form === 'trip' && <Trip />}
        {form === 'casing' && <Casing />}
        {form === 'flat' && <Flat />}
      </div>
    </>
  );
};

const Schedule = () => {
  const [npt, setNpt] = useState(String(NPT_FRAC));
  const nptFrac = Number(npt);
  const program = useMemo(() => {
    try {
      if (!Number.isFinite(nptFrac) || nptFrac < 0) return null;
      return programOf({ nptFrac });
    } catch { return null; }
  }, [nptFrac]);
  if (!program) {
    return <Note>The allowance has to be a fraction of nought or more. A negative allowance would be non-productive time running backwards, and the engine refuses it rather than returning a shorter well than the work in it.</Note>;
  }
  const t = program.totals;
  const last = program.rows[program.rows.length - 1];
  return (
    <>
      <FieldGrid>
        <NumField label="Non-productive allowance, fraction of productive time" value={npt} onChange={setNpt} placeholder="0.125" />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Activities" value={fmt(program.rows.length, 0)} />
          <Tile label="Productive" value={fmt(t.productiveHr, 3)} unit="h" />
          <Tile label="Non-productive" value={fmt(t.nptHr, 3)} unit="h" />
          <Tile label="Elapsed" value={fmt(t.totalHr, 3)} unit="h" />
          <Tile label="Elapsed" value={fmt(t.totalDays, 4)} unit="days" />
          <Tile label="Last row ends at" value={fmt(last.endHr, 3)} unit="h" />
          <Tile label="Hole depth at the end" value={fmt(t.tdMdM, 3)} unit="m" />
          <Tile label="Curve breakpoints" value={fmt(program.curve.length, 0)} />
        </TileGrid>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={program.curve} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="tHr" type="number" tick={AXIS}
              label={{ value: 'elapsed hours', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis dataKey="mdM" reversed domain={[0, 'dataMax']} tick={AXIS}
              label={{ value: 'hole depth, m', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="linear" dataKey="mdM" name="time depth curve"
              stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">activity</th>
              <th className="text-left pr-3">kind</th>
              <th className="text-left pr-3">productive, h</th>
              <th className="text-left pr-3">elapsed, h</th>
              <th className="text-left pr-3">starts, h</th>
              <th className="text-left pr-3">ends, h</th>
              <th className="text-left">hole at the end, m</th>
            </tr>
          </thead>
          <tbody>
            {program.rows.map((r) => (
              <tr key={r.id} className={r.kind === 'drill' ? 'text-[#BFFF00]' : ''}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{r.kind}</td>
                <td className="pr-3">{fmt(r.productiveHr, 4)}</td>
                <td className="pr-3">{fmt(r.durationHr, 4)}</td>
                <td className="pr-3">{fmt(r.startHr, 4)}</td>
                <td className="pr-3">{fmt(r.endHr, 4)}</td>
                <td>{fmt(r.endMdM, 3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The classic drilling curve, and it is a staircase for a reason: it slopes while a drill
        activity is running and it stands vertical through everything else. The green rows are the
        only ones that move the hole. On this programme {fmt(program.rows.filter((r) => r.kind === 'drill').length, 0)}
        {' '}of the {fmt(program.rows.length, 0)} activities advance depth at all, and the last row
        ends at {fmt(last.endHr, 3)} h, which is the same number as the elapsed total
        {' '}{fmt(t.totalHr, 3)} h. If those two ever disagreed, a row would have been dropped from
        the roll-up.
      </div>
      <Note>
        Change the allowance above and watch what moves. Every elapsed hour stretches, the curve
        gets wider, and the productive column does not shift by an hour, because the allowance
        stretches the schedule rather than changing the work.
      </Note>
    </>
  );
};

const Npt = () => {
  const [frac, setFrac] = useState('');
  const rows = useMemo(() => {
    try {
      const v = Number(frac);
      const base = [0, 0.05, 0.125, 0.2, 0.3, 0.5];
      const set = Number.isFinite(v) && v >= 0 ? base.concat(v) : base;
      return nptSweep([...new Set(set)].sort((a, b) => a - b));
    } catch { return null; }
  }, [frac]);
  if (!rows || !rows.length) {
    return <Note>An allowance is a fraction of nought or more. Anything else is not a schedule the engine will build, and a refusal here is better than a well that comes back shorter than the work in it.</Note>;
  }
  const productive = new Set(rows.map((r) => r.productiveHr));
  const published = rows.find((r) => r.nptFrac === NPT_FRAC);
  return (
    <>
      <FieldGrid>
        <NumField label="Add an allowance of your own, fraction" value={frac} onChange={setFrac} placeholder="0.25" />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Published allowance" value={fmt(NPT_FRAC, 5)} />
          <Tile label="Share of PRODUCTIVE time at that allowance"
            value={published ? pct(published.shareOfProductive, 3) : '-'} />
          <Tile label="Share of ELAPSED time at that allowance"
            value={published ? pct(published.shareOfTotal, 3) : '-'} />
          <Tile label="The gap between the two readings"
            value={published ? pct(published.shareOfProductive - published.shareOfTotal, 3) : '-'} />
          <Tile label="Productive hours, every row" value={fmt(rows[0].productiveHr, 3)} unit="h" />
          <Tile label="Distinct productive-hour values" value={fmt(productive.size, 0)} />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 0 }}>
            {GRID}
            <XAxis dataKey="nptFrac" type="number" tick={AXIS}
              label={{ value: 'allowance entered', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS}
              label={{ value: 'share of hours', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="shareOfProductive" name="share of PRODUCTIVE time, what you typed"
              stroke="#BFFF00" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="shareOfTotal" name="share of ELAPSED time, what it becomes"
              stroke="#f472b6" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">allowance</th>
              <th className="text-left pr-3">productive, h</th>
              <th className="text-left pr-3">non-productive, h</th>
              <th className="text-left pr-3">elapsed, h</th>
              <th className="text-left pr-3">days</th>
              <th className="text-left pr-3">share of PRODUCTIVE</th>
              <th className="text-left">share of ELAPSED</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.nptFrac} className={r.nptFrac === NPT_FRAC ? 'text-white' : ''}>
                <td className="pr-3">{fmt(r.nptFrac, 5)}</td>
                <td className="pr-3">{fmt(r.productiveHr, 3)}</td>
                <td className="pr-3">{fmt(r.nptHr, 3)}</td>
                <td className="pr-3">{fmt(r.totalHr, 3)}</td>
                <td className="pr-3">{fmt(r.totalDays, 4)}</td>
                <td className="pr-3 text-[#BFFF00]">{pct(r.shareOfProductive, 3)}</td>
                <td className="text-[#f472b6]">{pct(r.shareOfTotal, 3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Read the last two columns together, because this is the trap the tier is built on. The
        number you type is a fraction of PRODUCTIVE time: the engine multiplies every activity by
        one plus the allowance, so the non-productive hours are that fraction of the work. Their
        share of ELAPSED time is always the smaller figure, the allowance over one plus the
        allowance. At the published {fmt(NPT_FRAC, 5)} that is
        {' '}{published ? pct(published.shareOfProductive, 3) : '-'} of the work against
        {' '}{published ? pct(published.shareOfTotal, 3) : '-'} of the well. Ask for a quarter of
        elapsed time and type 0.25, and you get less than you asked for.
      </div>
      <Note>
        Now read the productive column down the table. It never moves, and there is exactly
        {' '}{fmt(productive.size, 0)} distinct value in it across the whole sweep. That is the
        cleanest statement of what an allowance is: it does not change the work in the well, it
        changes how long the work is expected to take. Two actions that shorten non-productive time
        leave those {fmt(rows[0].productiveHr, 0)} hours exactly where they were.
      </Note>
    </>
  );
};

const Rollup = () => {
  const [npt, setNpt] = useState(String(NPT_FRAC));
  const nptFrac = Number(npt);
  const program = useMemo(() => {
    try {
      if (!Number.isFinite(nptFrac) || nptFrac < 0) return null;
      return programOf({ nptFrac });
    } catch { return null; }
  }, [nptFrac]);
  const published = useMemo(() => {
    try { return publishedTotals(); } catch { return null; }
  }, []);
  if (!program || !published) {
    return <Note>There is no programme to roll up. An allowance of nought or more and at least one activity are the whole of what the engine asks for, and it will not invent either.</Note>;
  }
  const t = program.totals;
  const rows = [
    { key: 'productiveHr', label: 'Productive hours', value: t.productiveHr, unit: 'h', travels: false },
    { key: 'nptHr', label: 'Non-productive hours', value: t.nptHr, unit: 'h', travels: false },
    { key: 'totalHr', label: 'Elapsed hours', value: t.totalHr, unit: 'h', travels: false },
    { key: 'totalDays', label: 'Elapsed days', value: t.totalDays, unit: 'days', travels: true },
    { key: 'drilledM', label: 'Drilled metres', value: t.drilledM, unit: 'm', travels: true },
    { key: 'tdMdM', label: 'Hole depth at the end', value: t.tdMdM, unit: 'm', travels: false },
  ];
  return (
    <>
      <FieldGrid>
        <NumField label="Non-productive allowance, fraction" value={npt} onChange={setNpt} placeholder="0.125" />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Elapsed hours" value={fmt(t.totalHr, 3)} unit="h" />
          <Tile label="Hours in a day" value={fmt(HOURS_PER_DAY, 0)} unit="h" />
          <Tile label="Elapsed days" value={fmt(t.totalDays, 5)} unit="days" />
          <Tile label="Drilled metres" value={fmt(t.drilledM, 3)} unit="m" />
          <Tile label="Published elapsed days" value={fmt(published.totalDays, 5)} unit="days" />
          <Tile label="Published drilled metres" value={fmt(published.drilledM, 3)} unit="m" />
        </TileGrid>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">total</th>
              <th className="text-left pr-3">value</th>
              <th className="text-left pr-3">unit</th>
              <th className="text-left">does it travel to the AFE</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className={r.travels ? 'text-[#BFFF00]' : ''}>
                <td className="pr-3">{r.label}</td>
                <td className="pr-3">{fmt(r.value, 5)}</td>
                <td className="pr-3">{r.unit}</td>
                <td>{r.travels ? 'yes, a cost line multiplies it' : 'no, it stays in the schedule'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Elapsed hours over {fmt(HOURS_PER_DAY, 0)} is elapsed days, exactly:
        {' '}{fmt(t.totalHr, 3)} h gives {fmt(t.totalDays, 5)} days. Only two of these six numbers
        leave this engine. Days multiply every per-day line on the AFE and metres multiply every
        per-meter line, so a mistake in either one is a cost error rather than a schedule error.
        The other four describe the well and are argued about here, before anybody prices them.
      </div>
      <Note>
        Notice that the drilled metres and the hole depth at the end are the same
        {' '}{fmt(t.drilledM, 0)} m on this well and are not the same quantity. Depth is where the
        hole got to; drilled metres are how much hole was made. Sidetrack the well and they part
        company, and the per-meter lines follow the metres rather than the depth.
      </Note>
    </>
  );
};

const TimeExplorer = () => {
  const [mode, setMode] = useState('forms');
  return (
    <PanelShell
      title="Time explorer"
      subtitle="The four closed forms against their driving inputs, the published schedule and its time-depth curve, and the allowance read in both of its conventions"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'forms' && <Forms />}
        {mode === 'schedule' && <Schedule />}
        {mode === 'npt' && <Npt />}
        {mode === 'rollup' && <Rollup />}
      </div>
    </PanelShell>
  );
};

export default TimeExplorer;
