import React, { useMemo, useState } from 'react';
import { goodOilTuned, tuningLedger, goodOilFlash, TIER } from './fluidLab';
import {
  PanelShell, Tile, TileGrid, Note, NumField,
} from '@/components/course/panels/petrophysics/panelKit';

// Tuning explorer: four bounded knobs on one pseudo-component, regressed
// against four laboratory targets at once. The point is the ledger: three
// targets improve, one gets worse, and that trade is the honest shape of a
// fit with fewer knobs than it has things to satisfy.

const MODES = ['The ledger', 'The knobs', 'Flash'];

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d })
  : '-');

const KNOB_NOTES = {
  fTc: 'multiplies the C7+ critical temperature',
  fPc: 'multiplies the C7+ critical pressure',
  kC1: 'sets the C1 to C7+ binary interaction parameter outright',
  sPlus: 'sets the C7+ volume shift outright, which is what moves stock tank gravity',
};

const TuningExplorer = () => {
  const [mode, setMode] = useState(MODES[0]);
  const [flashT, setFlashT] = useState('220');
  const [flashP, setFlashP] = useState('1500');

  const fit = useMemo(() => {
    try {
      return { ok: true, value: goodOilTuned(), ledger: tuningLedger() };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }, []);

  const flash = useMemo(() => {
    const t = Number(flashT);
    const p = Number(flashP);
    if (!Number.isFinite(t) || !Number.isFinite(p) || p <= 0) {
      return { error: 'Temperature and a positive pressure, please.' };
    }
    try {
      return goodOilFlash(t, p);
    } catch (e) {
      return { error: e.message };
    }
  }, [flashT, flashP]);

  if (!fit.ok) {
    return <PanelShell title="Tuning explorer"><Note>{fit.error}</Note></PanelShell>;
  }

  const f = fit.value;
  const ledger = fit.ledger;
  const worse = ledger.filter((r) => !r.improved);

  return (
    <PanelShell
      title="Tuning explorer"
      subtitle="Four bounded knobs on the C7+ pseudo-component, against four laboratory targets at once"
    >
      <div className="flex flex-wrap gap-1">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-2 py-1 text-xs rounded border ${
              m === mode
                ? 'bg-[#BFFF00] text-black border-[#BFFF00]'
                : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === 'The ledger' && (
        <>
          <div className="mt-4 rounded border border-gray-700 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-black/40 text-gray-400">
                <tr>
                  <th className="text-left p-2">Target</th>
                  <th className="text-right p-2">Measured</th>
                  <th className="text-right p-2">Untuned</th>
                  <th className="text-right p-2">Tuned</th>
                  <th className="text-right p-2">Error before</th>
                  <th className="text-right p-2">Error after</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((r) => (
                  <tr key={r.name} className="border-t border-gray-800">
                    <td className="p-2 text-white">
                      {r.name} <span className="text-gray-500">({r.unit})</span>
                    </td>
                    <td className="p-2 text-right text-gray-200">{fmt(r.measured, 3)}</td>
                    <td className="p-2 text-right text-gray-400">{fmt(r.untuned, 3)}</td>
                    <td className="p-2 text-right text-gray-200">{fmt(r.tuned, 3)}</td>
                    <td className="p-2 text-right text-gray-400">{fmt(r.untunedErr, 3)}</td>
                    <td className={`p-2 text-right ${r.improved ? 'text-[#BFFF00]' : 'text-red-400'}`}>
                      {fmt(r.tunedErr, 3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TileGrid>
            <Tile label="Residual before" value={fmt(f.ssrBefore, 8)} />
            <Tile label="Residual after" value={fmt(f.ssrAfter, 8)} />
            <Tile label="Reduction" value={fmt(f.ssrReduction, 3)} unit="times" />
            <Tile label="Targets improved" value={`${ledger.length - worse.length} of ${ledger.length}`} />
          </TileGrid>
          <Note>
            {worse.length === 0
              ? 'Every target improved, which on four knobs and four targets would be worth being suspicious about.'
              : `${worse.map((r) => r.name).join(' and ')} got WORSE. That is not a failure. Total GOR and stock tank gravity share the stock-tank volume, so a joint fit trades them against each other, and four knobs cannot make four targets exact. A fit that improves everything at once usually has more freedom than it has data.`}
          </Note>
        </>
      )}

      {mode === 'The knobs' && (
        <>
          <div className="mt-4 rounded border border-gray-700 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-black/40 text-gray-400">
                <tr>
                  <th className="text-left p-2">Knob</th>
                  <th className="text-right p-2">Start</th>
                  <th className="text-right p-2">Tuned</th>
                  <th className="text-left p-2">What it moves</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(f.knobs).map((k) => (
                  <tr key={k} className="border-t border-gray-800">
                    <td className="p-2 text-white">{k}</td>
                    <td className="p-2 text-right text-gray-400">{fmt(f.startKnobs?.[k], 6)}</td>
                    <td className="p-2 text-right text-gray-200">{fmt(f.knobs[k], 6)}</td>
                    <td className="p-2 text-gray-400">{KNOB_NOTES[k]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TileGrid>
            <Tile label="Converged" value={f.converged ? 'yes' : 'no'} />
            <Tile label="Iterations" value={fmt(f.iterations, 0)} />
            <Tile label="Bounds hit" value={f.boundsHit.length === 0 ? 'none' : f.boundsHit.join(', ')} />
            <Tile label="Tier of the result" value="lab tuned" />
          </TileGrid>
          <Note>
            Every knob acts on the C7+ pseudo-component and nothing else. The library components are
            measured substances with published constants, and a regression that moves those is
            fitting away from physics rather than toward this fluid. No knob reached its bound, which
            is the check that says the answer is an optimum rather than an edge. A tuned model is
            tier <span className="text-white">lab tuned</span>: {TIER.lab_tuned}.
          </Note>
        </>
      )}

      {mode === 'Flash' && (
        <>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <NumField label="Temperature (F)" value={flashT} onChange={setFlashT} />
            <NumField label="Pressure (psia)" value={flashP} onChange={setFlashP} />
          </div>
          {flash.error ? (
            <Note>{flash.error}</Note>
          ) : (
            <>
              <TileGrid>
                <Tile label="Vapour fraction" value={fmt(flash.beta, 6)} unit="mole basis" />
                <Tile label="State" value={flash.twoPhase ? 'two phase' : 'single phase'} />
                <Tile label="Liquid density" value={fmt(flash.liquid?.density, 3)} unit="lb/ft3" />
                <Tile label="Vapour density" value={fmt(flash.vapor?.density, 4)} unit="lb/ft3" />
              </TileGrid>
              <Note>
                This is the untuned model. Take the pressure up past its saturation pressure and the
                vapour fraction goes to zero: the fluid becomes a single-phase oil and the flash has
                nothing to split. That transition is what a saturation-pressure search brackets, and
                it is why the untuned model refuses to report a formation volume factor at the
                laboratory&apos;s stated reservoir pressure.
              </Note>
            </>
          )}
        </>
      )}
    </PanelShell>
  );
};

export default TuningExplorer;
