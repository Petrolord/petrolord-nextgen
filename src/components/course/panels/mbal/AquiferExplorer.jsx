import React, { useMemo, useState } from 'react';
import { fetkovichMarch, AHMED_1010 } from './tankLab';
import { PanelShell, NumField, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Aquifer explorer: Fetkovich constants from editable geometry, with a toggle
// between the pseudo-steady-state denominator and plain ln(reD) so the 47
// percent error in the productivity index is something the learner can see
// rather than be told about. The marching table is checked against the
// printed column of Ahmed Example 10-10.

const fmt = (v, d = 4) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d }) : '-');
const sci = (v, d = 6) => (Number.isFinite(v) ? Number(v).toPrecision(d) : '-');

const FIELDS = [
  ['h_ft', 'Aquifer thickness h (ft)'],
  ['phi', 'Porosity'],
  ['ct_psi', 'Total compressibility ct (1/psi)'],
  ['pi_psia', 'Initial pressure (psia)'],
  ['k_md', 'Permeability k (md)'],
  ['theta_deg', 'Encroachment angle (deg)'],
  ['muw_cp', 'Water viscosity (cp)'],
  ['re_ft', 'Reservoir radius re (ft)'],
  ['ra_ft', 'Aquifer radius ra (ft)'],
  ['reD', 'Radius ratio reD'],
  ['dt_days', 'Time step (days)'],
];

const AquiferExplorer = () => {
  const g = AHMED_1010.given;
  const [vals, setVals] = useState(() => Object.fromEntries(FIELDS.map(([k]) => [k, String(g[k])])));
  const [pss, setPss] = useState(true);

  const out = useMemo(() => {
    const nums = {};
    for (const [k] of FIELDS) {
      const n = Number(vals[k]);
      if (!Number.isFinite(n) || n <= 0) return { error: `Enter a positive number for ${k}` };
      nums[k] = n;
    }
    if (nums.ra_ft <= nums.re_ft) return { error: 'The aquifer radius must exceed the reservoir radius' };
    try {
      return fetkovichMarch({ ...nums, usePseudoSteadyState: pss });
    } catch (e) {
      return { error: e.message };
    }
  }, [vals, pss]);

  const set = (k) => (v) => setVals((s) => ({ ...s, [k]: v }));
  const atBook = FIELDS.every(([k]) => Number(vals[k]) === g[k]);

  return (
    <PanelShell
      title="Aquifer explorer (Fetkovich)"
      subtitle="Constants from geometry, then the engine's own marching scheme, against the printed table of Ahmed Example 10-10."
    >
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {FIELDS.map(([k, label]) => <NumField key={k} label={label} value={vals[k]} onChange={set(k)} />)}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Productivity index denominator:</span>
        {[[true, 'ln(reD) - 0.75  (pseudo steady state)'], [false, 'ln(reD)  (the trap)']].map(([v, label]) => (
          <button key={String(v)} type="button" onClick={() => setPss(v)}
            className={`px-3 py-1.5 rounded-md border text-xs ${pss === v ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
            {label}
          </button>
        ))}
      </div>

      {out.error ? <Note>{out.error}</Note> : (
        <>
          <TileGrid>
            <Tile label="Wi, full circle" value={fmt(out.constants.WiFull, 0)} unit="bbl" />
            <Tile label="Wi, wedge share" value={fmt(out.constants.WiWedge, 0)} unit="bbl" />
            <Tile label="Angle fraction" value={sci(out.constants.fAngle, 9)} />
            <Tile label="Wei" value={fmt(out.constants.Wei, 0)} unit="bbl" />
            <Tile label="Denominator" value={sci(out.constants.denom, 9)} />
            <Tile label="J" value={sci(out.constants.J, 9)} unit="bbl/d/psi" />
            <Tile label="J*pi/Wei" value={sci(out.constants.JpiOverWei, 6)} unit="1/d" />
            <Tile label="Decay over one step" value={sci(out.constants.decay, 9)} />
          </TileGrid>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-gray-300">
              <thead className="text-gray-500">
                <tr>
                  {['n', 'engine We (MMbbl)', 'printed We (MMbbl)', 'printed dWe', 'printed pr_bar'].map((h) => (
                    <th key={h} className="text-left font-normal py-1 pr-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {out.We.map((w, i) => {
                  const p = out.printed.find((r) => r.n === i);
                  return (
                    <tr key={i} className="border-t border-gray-800">
                      <td className="py-1 pr-3">{i}</td>
                      <td className="py-1 pr-3">{fmt(w / 1e6, 6)}</td>
                      <td className="py-1 pr-3">{p ? p.We_MMbbl : '-'}</td>
                      <td className="py-1 pr-3">{p ? p.dWe_MMbbl : '-'}</td>
                      <td className="py-1 pr-3">{p ? p.pr_bar_psia : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Note>
            {atBook && pss
              ? 'At the book\'s own geometry with the pseudo-steady-state denominator, the engine reproduces the printed influx column. Two bookkeeping traps sit in these tiles: the angle fraction belongs to Wei rather than to the quoted Wi, and the denominator carries the 0.75.'
              : pss
                ? 'You have moved off the published geometry, so the printed column no longer applies. Change one input at a time and watch which constant it moves.'
                : 'The denominator is now plain ln(reD). Compare J against the pseudo-steady-state value: the error is not a rounding difference, it is close to half, and it propagates into every influx step.'}
          </Note>
        </>
      )}
    </PanelShell>
  );
};

export default AquiferExplorer;
