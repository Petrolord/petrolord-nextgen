import React, { useMemo, useState } from 'react';
import {
  TW, DEPTH, ZONES, porosityCurves, vshLinearCurve, swCurve, zoneMean, sampleIndexAt, fmt, num,
} from './typewellLab';
import { PanelShell, NumField, Tile, TileGrid, FieldGrid, Note } from './panelKit';

// Shaly-sand saturation lab: Archie, Simandoux and Indonesia side by
// side on the course conventions (neutron-density porosity, linear Vsh),
// driven entirely by the parameters the learner sets.
const METHODS = [
  ['archie', 'Archie'],
  ['simandoux', 'Simandoux'],
  ['indonesia', 'Indonesia'],
];

const ShalySwLab = () => {
  const [p, setP] = useState({
    rw: String(TW.rw), rsh: String(TW.rsh), a: String(TW.a), m: String(TW.m), n: String(TW.n),
    grClean: String(TW.gr_clean), grClay: String(TW.gr_clay), sampleDepth: '2020',
  });
  const set = (k) => (v) => setP((s) => ({ ...s, [k]: v }));

  const parsed = {
    rw: num(p.rw), rsh: num(p.rsh), a: num(p.a), m: num(p.m), n: num(p.n),
    grClean: num(p.grClean), grClay: num(p.grClay),
  };
  const valid = Object.values(parsed).every(Number.isFinite);

  const phi = useMemo(
    () => porosityCurves({ rhoMa: TW.rho_ma, rhoFl: TW.rho_fl, dtMa: TW.dt_ma, dtFl: TW.dt_fl }).phiNdArr,
    [],
  );
  const vsh = useMemo(
    () => (valid ? vshLinearCurve(parsed.grClean, parsed.grClay) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p.grClean, p.grClay, valid],
  );

  const sw = useMemo(() => {
    if (!valid || !vsh) return null;
    const out = {};
    for (const [method] of METHODS) {
      out[method] = swCurve({ method, phi, vsh, ...parsed });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vsh, p.rw, p.rsh, p.a, p.m, p.n, valid]);

  const iSample = sampleIndexAt(num(p.sampleDepth) || 2020);

  return (
    <PanelShell title="Shaly-sand saturation lab"
      subtitle="Neutron-density porosity and linear Vsh are the course conventions; everything else here is yours to set. Watch the three models agree in clean rock and split in shale.">
      <FieldGrid>
        <NumField label="Rw (ohm.m)" value={p.rw} onChange={set('rw')} />
        <NumField label="Rsh (ohm.m)" value={p.rsh} onChange={set('rsh')} />
        <NumField label="a" value={p.a} onChange={set('a')} />
        <NumField label="m" value={p.m} onChange={set('m')} />
        <NumField label="n" value={p.n} onChange={set('n')} />
        <NumField label="GR clean (API)" value={p.grClean} onChange={set('grClean')} />
        <NumField label="GR clay (API)" value={p.grClay} onChange={set('grClay')} />
        <NumField label="Sample depth (m)" value={p.sampleDepth} onChange={set('sampleDepth')} />
      </FieldGrid>

      {sw ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs border-b border-gray-700">
                  <th className="text-left py-2 pr-4">Model</th>
                  <th className="text-left py-2 pr-4">Sample at {DEPTH[iSample]} m</th>
                  <th className="text-left py-2 pr-4">SAND_A mean</th>
                  <th className="text-left py-2 pr-4">SAND_B mean</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {METHODS.map(([method, label]) => (
                  <tr key={method} className="border-b border-gray-800">
                    <td className="py-2 pr-4 text-white">{label}</td>
                    <td className="py-2 pr-4">{fmt(sw[method][iSample])}</td>
                    <td className="py-2 pr-4">{fmt(zoneMean(sw[method], ZONES.SAND_A))}</td>
                    <td className="py-2 pr-4">{fmt(zoneMean(sw[method], ZONES.SAND_B))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TileGrid>
            <Tile label={`Linear Vsh at ${DEPTH[iSample]} m`} value={fmt(vsh[iSample])} />
            <Tile label={`N-D porosity at ${DEPTH[iSample]} m`} value={fmt(phi[iSample])} unit="v/v" />
          </TileGrid>
        </>
      ) : (
        <Note>Enter finite parameters to compute.</Note>
      )}
      <Note>Try the shale at 2000 m and the clean sand at 2020 m. At Vsh = 0 both shaly-sand models collapse exactly to Archie; in shale, Archie reads the highest because clay conduction is blamed on water.</Note>
    </PanelShell>
  );
};

export default ShalySwLab;
