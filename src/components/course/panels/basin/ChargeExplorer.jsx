import React, { useEffect, useMemo, useState } from 'react';
import { computeErosionScenario } from '@/lib/basinTeaching';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Charge explorer: the full reference-basin forward model, run live at an
// erosion amount the learner picks, always against the no-erosion twin.
// The burial staircase is drawn because its treads are the deposition
// convention; the temperature and reflectance tracks are drawn together
// because their divergence at age zero IS the erosion signature; and the
// generation, cap and expulsion curves are drawn together because the
// squeeze only exists where all three are visible at once.
const AMOUNTS = [0, 300, 600, 900];
const W = 560;
const H1 = 210;
const H2 = 240;
const PAD = { left: 52, top: 18, right: 52, bottom: 28 };
const AGE_MAX = 150;

const fmt = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : '-');

const ChargeExplorer = () => {
  const [amount, setAmount] = useState(600);
  const [runs, setRuns] = useState({});

  useEffect(() => {
    let cancelled = false;
    if (!runs[amount]) {
      computeErosionScenario(amount).then((res) => {
        if (!cancelled) setRuns((prev) => ({ ...prev, [amount]: res }));
      });
    }
    return () => { cancelled = true; };
  }, [amount, runs]);

  const m = runs[amount];

  const geom = useMemo(() => {
    const plotW = W - PAD.left - PAD.right;
    const sx = (age) => PAD.left + ((AGE_MAX - age) / AGE_MAX) * plotW;
    return { plotW, sx };
  }, []);

  if (!m) {
    return (
      <PanelShell title="Charge explorer"
        subtitle={`Running the forward model at ${amount} m of erosion, twice (with the event and without it).`}>
        <Note>Marching 150 Ma of basin history in 1 Ma steps. This takes a moment.</Note>
      </PanelShell>
    );
  }

  const { sx } = geom;
  const zMax = 4000;
  const syZ = (z) => PAD.top + (z / zMax) * (H1 - PAD.top - PAD.bottom);
  const topPts = m.burial.map((b) => `${sx(b.age)},${syZ(b.top)}`).join(' ');
  const botPts = m.burial.map((b) => `${sx(b.age)},${syZ(b.bottom)}`).join(' ');

  const tMax = 180;
  const plotH2 = H2 - PAD.top - PAD.bottom;
  const syT = (t) => PAD.top + (1 - t / tMax) * plotH2;
  const roMax = 2.0;
  const syRo = (ro) => PAD.top + (1 - ro / roMax) * plotH2;
  const tempPts = m.temperature.map((e) => `${sx(e.age)},${syT(e.value)}`).join(' ');
  const roPts = m.maturity.map((e) => `${sx(e.age)},${syRo(e.value)}`).join(' ');

  const massMax = 20000;
  const syM = (kg) => PAD.top + (1 - kg / massMax) * plotH2;
  const genPts = m.generation.map((e) => `${sx(e.age)},${syM(e.value)}`).join(' ');
  const expPts = m.expulsion.map((e) => `${sx(e.age)},${syM(e.value)}`).join(' ');
  const capPts = m.capSeries.map((e) => `${sx(e.age)},${syM(Math.min(e.cap, massMax))}`).join(' ');

  return (
    <PanelShell title="Charge explorer"
      subtitle="The golden reference basin run forward, source layer highlighted, against its no-erosion twin. Pick the erosion amount; the reference event is 600 m at 10 Ma.">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-400">Erosion at 10 Ma (m):</span>
        {AMOUNTS.map((a) => (
          <button key={a} type="button" onClick={() => setAmount(a)}
            className={`px-3 py-1.5 rounded-md border text-sm ${amount === a
              ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold'
              : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
            {a}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H1}`} width="100%" style={{ minWidth: 460 }} role="img"
          aria-label="Source layer burial history">
          <rect x="0" y="0" width={W} height={H1} fill="#0F172A" />
          <polyline points={topPts} fill="none" stroke="#38bdf8" strokeWidth="1.8" />
          <polyline points={botPts} fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.6" />
          <text x={PAD.left} y="13" fill="#38bdf8" fontSize="9">source top and bottom depth (0 to {zMax} m)</text>
          <text x={PAD.left} y={H1 - 8} fill="#64748b" fontSize="9">150 Ma (left) to present (right)</text>
        </svg>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H2}`} width="100%" style={{ minWidth: 460 }} role="img"
          aria-label="Source temperature and reflectance histories, and the mass curves">
          <rect x="0" y="0" width={W} height={H2} fill="#0F172A" />
          <polyline points={tempPts} fill="none" stroke="#f87171" strokeWidth="1.6" />
          <polyline points={roPts} fill="none" stroke="#BFFF00" strokeWidth="1.8" />
          <polyline points={genPts} fill="none" stroke="#a78bfa" strokeWidth="1.4" />
          <polyline points={capPts} fill="none" stroke="#64748b" strokeWidth="1"
            strokeDasharray="4 3" />
          <polyline points={expPts} fill="none" stroke="#fb923c" strokeWidth="1.8" />
          <text x={PAD.left} y="13" fill="#f87171" fontSize="9">temperature (0 to {tMax} degC)</text>
          <text x={PAD.left + 170} y="13" fill="#BFFF00" fontSize="9">Ro (0 to {roMax})</text>
          <text x={PAD.left + 240} y="13" fill="#a78bfa" fontSize="9">generated</text>
          <text x={PAD.left + 300} y="13" fill="#64748b" fontSize="9">cap</text>
          <text x={PAD.left + 330} y="13" fill="#fb923c" fontSize="9">expelled (0 to {massMax} kg/m2)</text>
          <text x={PAD.left} y={H2 - 8} fill="#64748b" fontSize="9">150 Ma (left) to present (right)</text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Final Ro" value={fmt(m.finalRo, 8)} unit="%Ro" />
        <Tile label="Final temperature" value={fmt(m.finalTempC, 6)} unit="degC" />
        <Tile label="Final TR" value={fmt(m.finalTr, 8)} unit="frac" />
        <Tile label="Generated" value={fmt(m.generated, 3)} unit="kg/m2" />
        <Tile label="Expelled" value={fmt(m.expelled, 3)} unit="kg/m2" />
        <Tile label="Erosion signature (delta Ro)" value={fmt(m.roDelta, 8)} unit="%Ro" />
        <Tile label="No-event baseline Ro" value={fmt(m.baselineRo, 8)} unit="%Ro" />
        <Tile label="No-event expelled" value={fmt(m.baselineExpelled, 3)} unit="kg/m2" />
        <Tile label="Potential (closed form)" value={fmt(m.potentialMass, 4)} unit="kg/m2" />
      </TileGrid>

      <Note>
        Watch three places. The burial track's treads are instant deposition, a convention, not
        geology. Where the dashed cap dips below the rising generation curve during the phantom
        decade, the expelled curve jumps and never gives the jump back: that is the squeeze, and at
        600 m it sets the graded expelled mass at 11 Ma. And at age zero the temperature has
        returned to within a ten-thousandth of a degree of the no-event run while the reflectance
        has not: the thermometer forgets, the reflectance remembers, and their difference is the
        capstone's sixth field.
      </Note>
    </PanelShell>
  );
};

export default ChargeExplorer;
