import React, { useMemo, useState } from 'react';
import {
  CAPSTONE_OWC_M, PROPS, P1, PROPERTY_METHODS, computePropertyModel,
} from '@/lib/reservoircalcTeaching';
import { PanelShell, SelectField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Property explorer: fill the porosity grid from the six well values by
// each of the three population methods and read what the choice is worth.
// Wells are posted with measured against modelled, because the headline of
// this tier is that a fitted trend honours none of them.
const W = 560;
const H = 460;
const PAD = { left: 48, top: 16, right: 16, bottom: 40 };

const fmt = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : '-');

const METHOD_LABEL = {
  constant: 'constant (weighted mean)',
  trend: 'trend (least-squares plane)',
  krige: 'krige (spherical, honours data)',
};

// Low porosity slate to high porosity lime.
function phiColor(v, lo, hi) {
  if (!Number.isFinite(v) || hi === lo) return 'transparent';
  const f = Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
  const r = Math.round(56 + (191 - 56) * f);
  const g = Math.round(89 + (255 - 89) * f);
  const b = Math.round(189 + (0 - 189) * f);
  return `rgb(${r},${g},${b})`;
}

const PropertyExplorer = () => {
  const [method, setMethod] = useState('trend');

  const m = useMemo(() => {
    try {
      return computePropertyModel(method, CAPSTONE_OWC_M);
    } catch {
      return null;
    }
  }, [method]);

  if (!m) {
    return (
      <PanelShell title="Property explorer" subtitle="Choose a population method.">
        <Note>That population method could not run on the six well values.</Note>
      </PanelShell>
    );
  }

  const { spec, oilNodes } = m;
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const xMin = spec.x0;
  const xMax = spec.x0 + (spec.nx - 1) * spec.dx;
  const yMin = spec.y0;
  const yMax = spec.y0 + (spec.ny - 1) * spec.dy;
  const sx = (x) => PAD.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y) => PAD.top + (1 - (y - yMin) / (yMax - yMin)) * plotH;
  const cw = plotW / Math.max(1, spec.nx - 1);
  const ch = plotH / Math.max(1, spec.ny - 1);

  const phis = oilNodes.map((o) => o.phi);
  const lo = Math.min(...phis);
  const hi = Math.max(...phis);

  const cells = oilNodes.map(({ j, phi }) => {
    const c = j % spec.nx;
    const r = Math.floor(j / spec.nx);
    return (
      <rect key={j}
        x={sx(spec.x0 + c * spec.dx) - cw / 2}
        y={sy(spec.y0 + r * spec.dy) - ch / 2}
        width={cw} height={ch}
        fill={phiColor(phi, lo, hi)} fillOpacity="0.85" />
    );
  });

  const worst = m.residuals.reduce(
    (a, r) => (Math.abs(r.modelled - r.measured) > Math.abs(a.modelled - a.measured) ? r : a),
    m.residuals[0],
  );

  return (
    <PanelShell title="Property explorer"
      subtitle={`Porosity over the 169 oil-bearing cells, populated from the six well values by ${METHOD_LABEL[method]}. Cell shade runs from the lowest modelled porosity to the highest. Every well is posted with what it measured and what the model says there.`}>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 items-end">
        <SelectField label="Population method" value={method} onChange={setMethod}
          options={PROPERTY_METHODS.map((v) => [v, METHOD_LABEL[v]])} />
        <div className="text-xs text-gray-500 sm:col-span-2">
          The capstone books the trend. Switch to constant and to krige and watch the booking,
          the porosity at P-1 and the well residuals move together.
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 420 }} role="img"
          aria-label={`Porosity model of the Ekene SAND by the ${method} method`}>
          <rect x="0" y="0" width={W} height={H} fill="#0F172A" />
          {cells}

          {m.residuals.map((r) => {
            const miss = r.modelled - r.measured;
            const off = Math.abs(miss) > 1e-9;
            return (
              <g key={r.name}>
                <circle cx={sx(r.x)} cy={sy(r.y)} r="4" fill="#fff"
                  stroke={off ? '#f87171' : '#4ade80'} strokeWidth="1.5" />
                <text x={sx(r.x) + 7} y={sy(r.y) - 4} fill="#e2e8f0" fontSize="9">
                  {r.name} {fmt(r.measured, 2)}
                </text>
                <text x={sx(r.x) + 7} y={sy(r.y) + 6} fontSize="9"
                  fill={off ? '#f87171' : '#4ade80'}>
                  model {fmt(r.modelled, 4)} ({miss >= 0 ? '+' : ''}{fmt(miss, 4)})
                </text>
              </g>
            );
          })}

          <circle cx={sx(P1.x)} cy={sy(P1.y)} r="4" fill="none" stroke="#BFFF00" strokeWidth="2" />
          <text x={sx(P1.x) + 7} y={sy(P1.y) + 12} fill="#BFFF00" fontSize="9">
            P-1 {fmt(m.phiAtP1, 4)}
          </text>

          <text x={PAD.left} y={H - 14} fill="#64748b" fontSize="9">x {xMin} to {xMax} m</text>
          <text x={PAD.left} y={12} fill="#64748b" fontSize="9">y {yMin} to {yMax} m (north up)</text>
        </svg>
      </div>

      <TileGrid>
        <Tile label="Arithmetic mean of the wells" value={fmt(m.means.arithmeticWells, 6)} unit="v/v" />
        <Tile label="Node mean over the oil" value={fmt(m.means.nodeMeanOverOil, 6)} unit="v/v" />
        <Tile label="Volume weighted mean" value={fmt(m.means.volumeWeighted, 6)} unit="v/v" />
        <Tile label="Porosity at P-1" value={fmt(m.phiAtP1, 6)} unit="v/v" />
        <Tile label="Largest well miss" value={`${worst.name} ${fmt(worst.modelled - worst.measured, 4)}`} unit="v/v" />
        <Tile label="Oil-bearing cells" value={String(m.model.cells)} unit="unchanged" />
        <Tile label="Gross rock volume" value={fmt(m.model.grvMm3, 4)} unit="10^6 m3" />
        <Tile label="Net volume" value={fmt(m.model.netMm3, 4)} unit="10^6 m3" />
        <Tile label="Pore volume" value={fmt(m.model.poreMm3, 4)} unit="10^6 m3" />
        <Tile label="HCPV" value={fmt(m.model.hcpvMm3, 4)} unit="10^6 m3" />
        <Tile label="STOIIP, this model" value={fmt(m.model.stoiipMmstb, 4)} unit="MMstb" />
        <Tile label={`Against the constant ${PROPS.phi}`} value={`${m.deltaMmstb >= 0 ? '+' : ''}${fmt(m.deltaMmstb, 4)}`} unit="MMstb" />
      </TileGrid>

      <Note>
        A green well ring means the model reproduces what that well measured; a red ring means it
        does not. The trend plane is red at every well, which is not a bug: a least-squares plane
        is fitted through the data, not threaded onto it. Notice that the geometry never moves.
        The cell count, the gross rock volume and the net volume are identical for all three
        methods, and the chain only starts to diverge at the pore step.
      </Note>
    </PanelShell>
  );
};

export default PropertyExplorer;
