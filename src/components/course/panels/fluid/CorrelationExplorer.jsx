import React, { useMemo, useState } from 'react';
import {
  EKENE, correlationSpread, viscosityChain, zSpread, gasAt, waterAt,
  reducedState, validityReport, oilSg,
} from './fluidLab';
import {
  PanelShell, Tile, TileGrid, Note, NumField,
} from '@/components/course/panels/petrophysics/panelKit';

// Correlation explorer: the black-oil description of one oil, three
// correlations at a time. The point is that the correlations disagree, that
// the disagreement is not small, and that each one carries a range it was
// fitted over which the engine will tell you about.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) })
  : '-');

const CorrelationExplorer = () => {
  const [api, setApi] = useState(String(EKENE.api));
  const [gasSg, setGasSg] = useState(String(EKENE.gasSg));
  const [tempF, setTempF] = useState(String(EKENE.tempF));
  const [rs, setRs] = useState(String(EKENE.rsDesignScfStb));
  const [pPsia, setPPsia] = useState(String(EKENE.piPsia));

  const out = useMemo(() => {
    const n = (s) => Number(s);
    const state = {
      api: n(api), gasSg: n(gasSg), tempF: n(tempF), rsScfStb: n(rs), pbPsia: EKENE.pbPsia,
    };
    if (![state.api, state.gasSg, state.tempF, state.rsScfStb, n(pPsia)].every(Number.isFinite)) {
      return { error: 'Every field needs a number.' };
    }
    if (state.api <= 0 || state.gasSg <= 0 || state.rsScfStb < 0 || n(pPsia) <= 0) {
      return { error: 'API, gas gravity and pressure must be positive.' };
    }
    try {
      const rows = correlationSpread(state);
      const z = zSpread(n(pPsia), state.tempF, state.gasSg);
      const red = reducedState(n(pPsia), state.tempF, state.gasSg);
      return {
        rows,
        z,
        red,
        chain: viscosityChain({ ...state, pPsia: n(pPsia) }),
        gas: gasAt(n(pPsia), state.tempF, state.gasSg, z.hallYarborough),
        water: waterAt(n(pPsia), state.tempF),
        osg: oilSg(state.api),
        warn: validityReport({
          pi: n(pPsia), tempF: state.tempF, api: state.api, gasSg: state.gasSg,
          pprMax: red.ppr, tpr: red.tpr, rsMax: state.rsScfStb,
        }),
      };
    } catch (e) {
      return { error: e.message };
    }
  }, [api, gasSg, tempF, rs, pPsia]);

  if (out.error) {
    return (
      <PanelShell title="Correlation explorer">
        <Note>{out.error}</Note>
      </PanelShell>
    );
  }

  const { rows, z, chain, gas, water, osg, warn } = out;
  const pbs = rows.map((r) => r.pbAtRs);
  const spread = Math.max(...pbs) - Math.min(...pbs);

  return (
    <PanelShell
      title="Correlation explorer"
      subtitle="One oil, every correlation the engine carries, and the range each was fitted over"
    >
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <NumField label="Oil gravity (API)" value={api} onChange={setApi} />
        <NumField label="Gas gravity" value={gasSg} onChange={setGasSg} />
        <NumField label="Temperature (F)" value={tempF} onChange={setTempF} />
        <NumField label="Solution gas (scf/stb)" value={rs} onChange={setRs} />
        <NumField label="Pressure (psia)" value={pPsia} onChange={setPPsia} />
      </div>

      <div className="mt-4 rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-black/40 text-gray-400">
            <tr>
              <th className="text-left p-2">Correlation</th>
              <th className="text-right p-2">Bubble point (psia)</th>
              <th className="text-right p-2">Rs at 2000 psia (scf/stb)</th>
              <th className="text-right p-2">Bo (rb/stb)</th>
              <th className="text-left p-2">Tier</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-gray-800">
                <td className="p-2 text-white">
                  {r.name} <span className="text-gray-500">({r.year})</span>
                </td>
                <td className="p-2 text-right text-gray-200">{fmt(r.pbAtRs, 1)}</td>
                <td className="p-2 text-right text-gray-200">{fmt(r.rsAtPb, 2)}</td>
                <td className="p-2 text-right text-gray-200">{fmt(r.boAtRs, 4)}</td>
                <td className={`p-2 ${r.tier === 'screening' ? 'text-amber-400' : 'text-gray-400'}`}>
                  {r.tier.replace('_', ' ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TileGrid>
        <Tile label="Bubble point spread" value={fmt(spread, 1)} unit="psia across three" />
        <Tile label="Oil specific gravity" value={fmt(osg, 4)} />
        <Tile label="Dead oil viscosity" value={fmt(chain.deadOilCp, 4)} unit="cp, Beal" />
        <Tile label="Live oil at bubble point" value={fmt(chain.liveOilAtPbCp, 4)} unit="cp, Beggs-Robinson" />
        <Tile label="Oil at this pressure" value={fmt(chain.oilAtPressureCp, 4)} unit="cp" />
        <Tile label="Gas z, Hall-Yarborough" value={fmt(z.hallYarborough, 5)} />
        <Tile label="Gas z, Dranchuk-Abou-Kassem" value={fmt(z.dranchukAbouKassem, 5)} />
        <Tile label="z disagreement" value={fmt(z.gapPct, 4)} unit="percent" />
        <Tile label="Gas FVF" value={fmt(gas.bgRbPerScf, 7)} unit="rb/scf" />
        <Tile label="Gas viscosity" value={fmt(gas.viscosityCp, 5)} unit="cp" />
        <Tile label="Water FVF" value={fmt(water.bwRbStb, 5)} unit="rb/stb, McCain" />
        <Tile label="Water viscosity" value={fmt(water.viscosityCp, 4)} unit="cp" />
      </TileGrid>

      <div className="mt-3">
        {warn.total === 0 ? (
          <Note>
            Every correlation on screen is inside the range it was fitted over. That is worth
            checking rather than assuming: push the temperature past 300 F or the API past 60 and
            the engine starts naming the correlation and the bound it has left.
          </Note>
        ) : (
          <div className="rounded border border-amber-700/60 bg-amber-950/30 p-3">
            <p className="text-amber-300 text-xs font-medium mb-1">
              {warn.total} validity {warn.total === 1 ? 'warning' : 'warnings'}
            </p>
            <ul className="text-[11px] text-amber-200/90 space-y-1 list-disc pl-4">
              {[...warn.correlation, ...warn.viscosity].map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </PanelShell>
  );
};

export default CorrelationExplorer;
