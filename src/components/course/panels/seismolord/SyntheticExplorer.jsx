import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend,
} from 'recharts';
import {
  computeSynthetic, waveletRows, traceRows, CAPSTONE_FREQ_HZ, DT_MS, NS,
} from '@/lib/seismolordTeaching';
import { PanelShell, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Synthetic explorer: build the seismogram from the teaching well at a
// wavelet frequency the learner chooses, and read the summary the
// capstone grades. Nothing is pre-computed for them: change the
// frequency and every number below moves.
const fmt = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : '-');

const SyntheticExplorer = () => {
  const [freq, setFreq] = useState(String(CAPSTONE_FREQ_HZ));

  const f = Number(freq);
  const valid = Number.isFinite(f) && f > 0 && f <= 200;

  const result = useMemo(() => {
    if (!valid) return null;
    try {
      return computeSynthetic(f);
    } catch {
      return null;
    }
  }, [f, valid]);

  const wRows = useMemo(() => (result ? waveletRows(result.wavelet) : []), [result]);
  const tRows = useMemo(() => (result ? traceRows(result.syn) : []), [result]);

  if (!result) {
    return (
      <PanelShell title="Synthetic explorer" subtitle="Enter a wavelet frequency between 1 and 200 Hz.">
        <NumField label="Wavelet frequency (Hz)" value={freq} onChange={setFreq} />
        <Note>The frequency must be a positive number.</Note>
      </PanelShell>
    );
  }

  const s = result.summary;

  return (
    <PanelShell title="Synthetic explorer"
      subtitle={`The teaching well through the full pipeline: velocity and density to impedance, impedance to reflection coefficients, convolved with a ${fmt(f, 0)} Hz Ricker wavelet on a ${DT_MS} ms grid.`}>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
        <NumField label="Wavelet frequency (Hz)" value={freq} onChange={setFreq} />
        <div className="text-xs text-gray-500 sm:col-span-3">
          The capstone is read at {CAPSTONE_FREQ_HZ} Hz. Try 15 and 40 Hz too and watch both the
          strongest amplitude and its time move.
        </div>
      </div>

      <TileGrid>
        <Tile label="Mean sonic velocity" value={fmt(s.meanVelocity, 2)} unit="m/s" />
        <Tile label="TWT at the top of the log" value={fmt(s.twtLogTop, 0)} unit="ms" />
        <Tile label="TWT at the base of the log" value={fmt(s.twtLogBase, 0)} unit="ms" />
        <Tile label="Maximum impedance" value={fmt(s.impMax, 2)} />
        <Tile label="Strongest reflection coefficient" value={fmt(s.rcPeakAbs, 6)} />
        <Tile label="TWT of that reflection" value={fmt(s.rcPeakTwt, 0)} unit="ms" />
        <Tile label="Strongest synthetic amplitude" value={fmt(s.synPeakAbs, 6)} />
        <Tile label="TWT of that amplitude" value={fmt(s.synPeakTwt, 0)} unit="ms" />
      </TileGrid>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <p className="text-xs text-gray-400 mb-1">Ricker wavelet</p>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wRows} margin={{ top: 5, right: 8, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="t" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis domain={[-0.6, 1.05]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', color: '#fff' }}
                  formatter={(v) => fmt(Number(v))} />
                <ReferenceLine y={0} stroke="#475569" />
                <Line type="monotone" dataKey="a" name="amplitude" stroke="#BFFF00" dot={false} strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-xs text-gray-400 mb-1">Reflectivity and synthetic trace against two-way time</p>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tRows} margin={{ top: 5, right: 8, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="twt" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', color: '#fff' }}
                  formatter={(v) => fmt(Number(v), 6)} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <ReferenceLine y={0} stroke="#475569" />
                <ReferenceLine x={s.rcPeakTwt} stroke="#f472b6" strokeDasharray="4 3" />
                <ReferenceLine x={s.synPeakTwt} stroke="#38bdf8" strokeDasharray="4 3" />
                <Line type="monotone" dataKey="rc" name="reflectivity" stroke="#f472b6" dot={false} strokeWidth={1.2} />
                <Line type="monotone" dataKey="syn" name="synthetic" stroke="#38bdf8" dot={false} strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Note>
        Pink dashed line: the strongest reflection coefficient. Blue dashed line: the strongest
        synthetic amplitude. They sit at different times because the trace is a sum of overlapping
        wavelet copies, not a picture of individual reflections. The grid runs 0 to {(NS - 1) * DT_MS} ms
        while the log occupies only {fmt(s.twtLogTop, 0)} to {fmt(s.twtLogBase, 0)} ms; samples outside
        the live window are gaps and are excluded from every statistic here.
      </Note>
    </PanelShell>
  );
};

export default SyntheticExplorer;
