import React, { useMemo, useState } from 'react';
import {
  TW, WATER_LEG, rwArps, spK, rweFromSsp, fitPickett, porosityCurves,
  bookSandA, waterLegMeanSw, fmt, num,
} from './typewellLab';
import { Button } from '@/components/ui/button';
import { PanelShell, NumField, Tile, TileGrid, FieldGrid, Note } from './panelKit';

// Rw triangulator: the Expert workflow end to end. The learner corrects
// the lab sample with Arps, converts the SP reading, fits the water leg,
// checks the leg reads Sw ~ 1, and books SAND_A with an Rw they choose.
// Bookings are produced on demand; nothing is pre-booked.
const RwTriangulator = () => {
  const [g, setG] = useState({
    rwSample: '0.114', tSample: '75', tFm: '180', ssp: '-93', rmfe: '0.62',
  });
  const set = (k) => (v) => setG((s) => ({ ...s, [k]: v }));

  const [bookRwInput, setBookRwInput] = useState('');
  const [bookings, setBookings] = useState([]);

  const rw1 = num(g.rwSample);
  const t1 = num(g.tSample);
  const t2 = num(g.tFm);
  const ssp = num(g.ssp);
  const rmfe = num(g.rmfe);

  const arps = Number.isFinite(rw1) && Number.isFinite(t1) && Number.isFinite(t2)
    ? rwArps(rw1, t1, t2) : NaN;
  const k = Number.isFinite(t2) ? spK(t2) : NaN;
  const rwe = Number.isFinite(ssp) && rmfe > 0 && Number.isFinite(t2)
    ? rweFromSsp(ssp, rmfe, t2) : NaN;

  // The Professional tier's fit, recomputed from the data (not a stored
  // answer): the standard water-leg window on N-D porosity.
  const pickett = useMemo(() => {
    try {
      const phi = porosityCurves({ rhoMa: TW.rho_ma, rhoFl: TW.rho_fl, dtMa: TW.dt_ma, dtFl: TW.dt_fl }).phiNdArr;
      return fitPickett(phi, WATER_LEG[0], WATER_LEG[1]);
    } catch {
      return null;
    }
  }, []);

  const legMean = Number.isFinite(arps) ? waterLegMeanSw(arps) : NaN;

  const runBooking = () => {
    const rw = num(bookRwInput);
    if (!Number.isFinite(rw) || rw <= 0) return;
    setBookings((b) => [{ rw, summary: bookSandA(rw) }, ...b].slice(0, 4));
  };

  return (
    <PanelShell title="Rw triangulator"
      subtitle="Three independent routes to Rw, the water-leg check, and the booking consequence. Enter the Rw you decide to book with; the panel books nothing until you do.">
      <FieldGrid>
        <NumField label="Lab sample Rw (ohm.m)" value={g.rwSample} onChange={set('rwSample')} />
        <NumField label="Sample temp (degF)" value={g.tSample} onChange={set('tSample')} />
        <NumField label="Formation temp (degF)" value={g.tFm} onChange={set('tFm')} />
        <NumField label="SSP (mV)" value={g.ssp} onChange={set('ssp')} />
        <NumField label="Rmfe (ohm.m)" value={g.rmfe} onChange={set('rmfe')} />
      </FieldGrid>

      <TileGrid>
        <Tile label="Route 1: Arps-corrected sample" value={fmt(arps)} unit="ohm.m" />
        <Tile label="Route 2: SP quicklook Rwe" value={fmt(rwe)} unit="ohm.m" />
        <Tile label="Route 3: Pickett a x Rw (water leg)" value={pickett ? fmt(pickett.aRw) : '-'} unit="ohm.m" />
        <Tile label="SP coefficient K" value={fmt(k, 2)} unit="mV/decade" />
        <Tile label="Water-leg mean Sw at the Arps Rw" value={fmt(legMean)} unit="v/v" />
        <Tile label="Pickett m (water leg)" value={pickett ? fmt(pickett.m, 3) : '-'} />
      </TileGrid>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 items-end">
        <NumField label="Book SAND_A with Rw (ohm.m)" value={bookRwInput}
          onChange={setBookRwInput} placeholder="your adopted Rw" />
        <Button onClick={runBooking} className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold h-8">
          Book SAND_A
        </Button>
        {bookings.length > 0 && (
          <Button variant="outline" onClick={() => setBookings([])}
            className="border-gray-600 text-gray-300 h-8">
            Clear bookings
          </Button>
        )}
      </div>

      {bookings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b border-gray-700">
                <th className="text-left py-2 pr-4">Booked with Rw</th>
                <th className="text-left py-2 pr-4">Net (m)</th>
                <th className="text-left py-2 pr-4">NTG</th>
                <th className="text-left py-2 pr-4">Pay-avg phi</th>
                <th className="text-left py-2 pr-4">Pay-avg Sw</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {bookings.map((b) => (
                <tr key={b.rw} className="border-b border-gray-800">
                  <td className="py-2 pr-4 text-white">{fmt(b.rw)}</td>
                  <td className="py-2 pr-4">{b.summary.net_m?.toFixed(1)}</td>
                  <td className="py-2 pr-4">{fmt(b.summary.ntg, 3)}</td>
                  <td className="py-2 pr-4">{fmt(b.summary.phi_avg)}</td>
                  <td className="py-2 pr-4">{fmt(b.summary.sw_avg)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Note>The booking uses the Associate recipe (density porosity, Larionov tertiary Vsh, Archie) with only Rw changed, so the pay difference you see is pure Rw. Book once with your corrected value and once with the raw sample to quantify the damage.</Note>
    </PanelShell>
  );
};

export default RwTriangulator;
