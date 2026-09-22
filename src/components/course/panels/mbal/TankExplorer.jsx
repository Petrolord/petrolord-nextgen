import React, { useMemo, useState } from 'react';
import {
  runEkeneTank, reconciliation, runTank, typedTankInputs, runDakeTank, EKENE,
} from './tankLab';
import { PanelShell, SelectField, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Tank explorer: the Ekene survey history through the real material-balance
// engine. The F-against-Et plot is the whole Havlena-Odeh idea in one picture,
// and the aquifer selector lets a learner watch what happens when the model is
// given a term the data does not need. "Your tank" takes a survey table typed
// by the learner (the Associate capstone's tank is one) and opens prefilled
// with the Ekene history; "Dake Exercise 9.2" runs the published benchmark and
// opens with no aquifer, the compulsory counterfactual.

// The typed-tank form opens on the Ekene history (initial state plus six surveys).
const EKENE_TYPED = {
  pi: String(EKENE.inputs.initial_pressure_psia), swi: String(EKENE.inputs.initial_water_saturation),
  cf: String(EKENE.inputs.formation_compressibility_psi), cw: String(EKENE.inputs.water_compressibility_psi),
  rows: EKENE.inputs.production_data.map((r) => ({ p: String(r.pressure_psia), np: String(r.cum_oil_stb), bo: String(r.bo_rb_stb) })),
};

const W = 620;
const H = 320;
const PAD = { left: 76, top: 16, right: 16, bottom: 40 };

const fmt = (v, d = 4) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d }) : '-');
const sci = (v, d = 6) => (Number.isFinite(v) ? Number(v).toPrecision(d) : '-');

const TankExplorer = () => {
  const [dataset, setDataset] = useState('ekene');
  const [aquiferModel, setAquiferModel] = useState('none');
  const [dakeAquifer, setDakeAquifer] = useState('none');
  const [form, setForm] = useState(EKENE_TYPED);

  const out = useMemo(() => {
    try {
      if (dataset === 'dake') return { dake: runDakeTank({ aquifer: dakeAquifer }) };
      if (dataset === 'typed') {
        const n = (x) => Number(x);
        const rows = form.rows.map((r) => ({ p: n(r.p), np: n(r.np), bo: n(r.bo) }));
        const consts = { pi: n(form.pi), swi: n(form.swi), cf: n(form.cf), cw: n(form.cw) };
        if (![...Object.values(consts), ...rows.flatMap((r) => [r.p, r.np, r.bo])].every(Number.isFinite)) {
          return { error: 'Type a number in every box of the survey table and the constants.' };
        }
        return { ...runTank(typedTankInputs({ ...consts, rows }), { aquiferModel }), recon: null };
      }
      return { ...runEkeneTank({ aquiferModel }), recon: reconciliation() };
    } catch (e) {
      return { error: e.message };
    }
  }, [dataset, aquiferModel, dakeAquifer, form]);

  const setRow = (i, k) => (v) => setForm((f) => ({ ...f, rows: f.rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)) }));
  const controls = (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 sm:w-[32rem]">
        <SelectField label="Dataset" value={dataset} onChange={setDataset}
          options={[['ekene', 'Ekene survey history'], ['typed', 'Your tank (typed)'], ['dake', 'Dake Exercise 9.2 (published)']]} />
        {dataset === 'dake' ? (
          <SelectField label="Aquifer given to the engine" value={dakeAquifer} onChange={setDakeAquifer}
            options={[['none', 'None (the counterfactual)'], ['finite', 'Carter-Tracy, finite (reD from the exercise)'], ['infinite', 'Carter-Tracy, infinite acting']]} />
        ) : (
          <SelectField label="Aquifer model given to the engine" value={aquiferModel} onChange={setAquiferModel}
            options={[['none', 'None (the truth)'], ['pot', 'Pot aquifer (not needed here)']]} />
        )}
      </div>
      {dataset === 'typed' && (
        <div className="space-y-2">
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            <NumField label="Initial pressure (psia)" value={form.pi} onChange={(v) => setForm((f) => ({ ...f, pi: v }))} />
            <NumField label="Swi" value={form.swi} onChange={(v) => setForm((f) => ({ ...f, swi: v }))} />
            <NumField label="cf (1/psi)" value={form.cf} onChange={(v) => setForm((f) => ({ ...f, cf: v }))} />
            <NumField label="cw (1/psi)" value={form.cw} onChange={(v) => setForm((f) => ({ ...f, cw: v }))} />
          </div>
          <p className="text-xs text-gray-400 mb-0">Survey table: row 0 is the initial state (Np 0); every row above the bubble point.</p>
          {form.rows.map((r, i) => (
            <div key={i} className="grid gap-2 grid-cols-3 sm:w-[32rem]">
              <NumField label={`Row ${i}: p (psia)`} value={r.p} onChange={setRow(i, 'p')} />
              <NumField label="Np (stb)" value={r.np} onChange={setRow(i, 'np')} />
              <NumField label="Bo (rb/stb)" value={r.bo} onChange={setRow(i, 'bo')} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (out.error) return <PanelShell title="Tank explorer">{controls}<Note>{dataset === 'typed' ? out.error : `Engine error: ${out.error}`}</Note></PanelShell>;
  if (out.dake) {
    const d = out.dake;
    return (
      <PanelShell title="Tank explorer"
        subtitle="Dake Exercise 9.2 through computeMaterialBalance with a Carter-Tracy aquifer. It opens with no aquifer, the counterfactual the exercise asks you to rule out.">
        {controls}
        <TileGrid>
          <Tile label="OOIP from the regression" value={fmt(d.ooip_mmstb, 6)} unit="MMSTB" />
          <Tile label="Cumulative water influx" value={fmt(d.we_mmrb, 6)} unit="MMrb" />
          <Tile label="R-squared" value={sci(d.result.r_squared, 9)} />
          <Tile label="Validation tier" value={d.result.validation_tier} />
        </TileGrid>
        <Note>
          Compare the three aquifer choices against each other. With no aquifer the regression has to
          explain the pressure support with oil alone; the finite Carter-Tracy aquifer is the case the
          exercise was built on; the infinite-acting one keeps supplying water a bounded aquifer cannot.
        </Note>
      </PanelShell>
    );
  }
  const { result, rows, last, recon } = out;

  const pts = rows.filter((r) => r.n > 0);
  const maxEt = Math.max(...pts.map((r) => r.Et_rb)) * 1.1;
  const maxF = Math.max(...pts.map((r) => r.F_rb)) * 1.1;
  const x = (et) => PAD.left + (et / maxEt) * (W - PAD.left - PAD.right);
  const y = (F) => H - PAD.bottom - (F / maxF) * (H - PAD.top - PAD.bottom);
  const slope = result.regression_slope;
  const intercept = result.regression_intercept ?? 0;

  return (
    <PanelShell
      title="Tank explorer"
      subtitle={`${dataset === 'typed' ? 'Your typed tank' : 'The Ekene survey history'} through computeMaterialBalance. F against Et is the Havlena-Odeh straight line; its slope is the oil in place.`}
    >
      {controls}

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="#334155" />
        <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="#334155" />
        {/* fitted line through the origin: F = N * Et */}
        <line
          x1={x(0)} y1={y(intercept)}
          x2={x(maxEt)} y2={y(intercept + slope * maxEt)}
          stroke="#BFFF00" strokeWidth="1.6" opacity="0.9"
        />
        {pts.map((r) => (
          <g key={r.n}>
            <circle cx={x(r.Et_rb)} cy={y(r.F_rb)} r="4" fill="#38bdf8" />
            <text x={x(r.Et_rb) + 7} y={y(r.F_rb) - 5} fontSize="9" fill="#64748b">{r.date.slice(0, 7)}</text>
          </g>
        ))}
        <text x={W / 2} y={H - 8} fontSize="10" fill="#64748b" textAnchor="middle">Et, total expansion (rb/stb)</text>
        <text x={14} y={H / 2} fontSize="10" fill="#64748b" transform={`rotate(-90 14 ${H / 2})`} textAnchor="middle">F, withdrawal (rb)</text>
        <text x={PAD.left + 10} y={PAD.top + 12} fontSize="10" fill="#BFFF00">fitted line, slope = OOIP</text>
      </svg>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-gray-300">
          <thead className="text-gray-500">
            <tr>
              {['n', 'date', 'p psia', 'Np stb', 'F rb', 'Eo rb/stb', 'Efw rb', 'Et rb', 'F/Et'].map((h) => (
                <th key={h} className="text-left font-normal py-1 pr-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.n} className="border-t border-gray-800">
                <td className="py-1 pr-3">{r.n}</td>
                <td className="py-1 pr-3">{r.date}</td>
                <td className="py-1 pr-3">{fmt(r.pressure_psia, 2)}</td>
                <td className="py-1 pr-3">{fmt(r.cum_oil_stb, 0)}</td>
                <td className="py-1 pr-3">{fmt(r.F_rb, 1)}</td>
                <td className="py-1 pr-3">{fmt(r.Eo_rb_stb, 7)}</td>
                <td className="py-1 pr-3">{fmt(r.Efw_rb, 7)}</td>
                <td className="py-1 pr-3">{fmt(r.Et_rb, 7)}</td>
                <td className="py-1 pr-3">{r.F_over_Et == null ? '-' : fmt(r.F_over_Et, 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TileGrid>
        <Tile label="OOIP from the slope" value={fmt(result.estimated_ooip_stb, 1)} unit="stb" />
        {recon && <Tile label="Geoscience volumetric STOIIP" value={fmt(recon.volumetric, 1)} unit="stb" />}
        <Tile label="R-squared" value={sci(result.r_squared, 12)} />
        <Tile label="Intercept" value={sci(result.regression_intercept, 4)} unit="rb" />
        <Tile label="Depletion drive index" value={sci(result.final_ddi, 9)} />
        <Tile label="Segregation drive index" value={sci(result.final_sdi, 9)} />
        <Tile label="Water drive index" value={sci(result.final_wdi, 6)} />
        <Tile label="Drive indices sum" value={sci(result.final_drive_index_sum, 9)} />
        <Tile label="Efw share of Et at the last survey" value={fmt(last.efwShare * 100, 6)} unit="%" />
        <Tile label="Drive mechanism" value={result.drive_mechanism} />
        <Tile label="Aquifer strength" value={result.aquifer_strength} />
        <Tile label="Validation tier" value={result.validation_tier} />
      </TileGrid>

      {dataset === 'typed' && aquiferModel === 'none' ? (
        <Note>
          Your tank: every number above comes from the table you typed, through the same engine.
          Check each survey against its source before you read a tile.
        </Note>
      ) : aquiferModel === 'none' ? (
        <Note>
          F/Et is the same number at every survey, and that constancy IS the straight line. The
          slope lands on the volumetric booking the geoscience courses derived from a map and a
          contact, by a route whose measurements are entirely independent. The two chains do
          share the constants Boi and Swi, so a PVT error would move both answers together.
        </Note>
      ) : (
        <Note>
          The engine was handed an aquifer this tank does not have. Watch the OOIP: the regression
          spends the new freedom on the aquifer term and the oil in place goes with it, while
          R-squared stays high enough to look healthy. A good fit is not a correct model.
        </Note>
      )}
    </PanelShell>
  );
};

export default TankExplorer;
