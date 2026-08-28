import React, { useMemo, useState } from 'react';
import {
  goodOilMeasured, goodOilComposition, goodOilCharacterization,
  goodOilUntuned, goodOilStagesF, TIER,
} from './fluidLab';
import { PanelShell, Tile, TileGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Study explorer: Good Oil Co. Well No. 4 as a laboratory report, and what an
// untuned equation of state makes of it. The point is the gap between the two
// columns, and that the gap is documented rather than hidden.

const VIEWS = ['Composition', 'What the lab measured', 'What the model says'];

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d })
  : '-');

const StudyExplorer = () => {
  const [view, setView] = useState(VIEWS[1]);

  const out = useMemo(() => {
    try {
      return {
        lab: goodOilMeasured(),
        comp: goodOilComposition(),
        chr: goodOilCharacterization(),
        model: goodOilUntuned(),
        stages: goodOilStagesF(),
      };
    } catch (e) {
      return { error: e.message };
    }
  }, []);

  if (out.error) {
    return <PanelShell title="Study explorer"><Note>{out.error}</Note></PanelShell>;
  }

  const {
    lab, comp, chr, model, stages,
  } = out;
  const pct = (a, b) => (a / b - 1) * 100;

  return (
    <PanelShell
      title="Study explorer"
      subtitle="Good Oil Co. Well No. 4, Core Laboratories RFL 88001, against an untuned equation of state"
    >
      <div className="flex flex-wrap gap-1">
        {VIEWS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`px-2 py-1 text-xs rounded border ${
              v === view
                ? 'bg-[#BFFF00] text-black border-[#BFFF00]'
                : 'bg-transparent text-gray-300 border-gray-600 hover:border-gray-400'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === 'Composition' && (
        <>
          <div className="mt-4 rounded border border-gray-700 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-black/40 text-gray-400">
                <tr>
                  <th className="text-left p-2">Component</th>
                  <th className="text-right p-2">Mol fraction</th>
                  <th className="text-right p-2">Molecular weight</th>
                  <th className="text-left p-2">Kind</th>
                </tr>
              </thead>
              <tbody>
                {comp.map((c) => (
                  <tr key={c.key} className="border-t border-gray-800">
                    <td className={`p-2 ${c.isPseudo ? 'text-[#BFFF00]' : 'text-white'}`}>{c.key}</td>
                    <td className="p-2 text-right text-gray-200">{fmt(c.molFraction, 4)}</td>
                    <td className="p-2 text-right text-gray-200">{fmt(c.mw, 2)}</td>
                    <td className="p-2 text-gray-400">
                      {c.isPseudo ? 'one pseudo-component standing for everything heavier' : 'library component'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TileGrid>
            <Tile label="C7+ boiling point" value={fmt(chr.tbR, 2)} unit="degR, Soreide" />
            <Tile label="C7+ critical temperature" value={fmt(chr.tcR, 2)} unit="degR, Kesler-Lee" />
            <Tile label="C7+ critical pressure" value={fmt(chr.pcPsia, 2)} unit="psia, Kesler-Lee" />
            <Tile label="C7+ acentric factor" value={fmt(chr.omega, 5)} unit="Lee-Kesler" />
            <Tile label="C7+ volume shift" value={fmt(chr.shift, 5)} unit="Jhaveri-Youngren" />
            <Tile label="C7+ Watson K" value={fmt(chr.watsonK, 4)} />
          </TileGrid>
          <Note>
            A third of this fluid is one pseudo-component. Its seven properties were computed from
            two numbers, a molecular weight of {fmt(chr.mw, 0)} and a specific gravity of{' '}
            {fmt(lab.plusSg, 4)}, by four published correlations. That is where the model&apos;s
            uncertainty lives.
          </Note>
        </>
      )}

      {view === 'What the lab measured' && (
        <>
          <TileGrid>
            <Tile label="Reservoir temperature" value={fmt(lab.reservoirTempF, 0)} unit="F" />
            <Tile label="Bubble point" value={fmt(lab.bubblePointPsia, 2)} unit="psia" />
            <Tile label="Total GOR" value={fmt(lab.totalGorScfStb, 0)} unit="scf/stb" />
            <Tile label="Stock tank gravity" value={fmt(lab.stockTankApi, 1)} unit="API" />
            <Tile label="Formation volume factor" value={fmt(lab.boRbStb, 3)} unit="rb/stb" />
            <Tile label="Components reported" value={fmt(lab.componentCount, 0)} />
          </TileGrid>
          <Note>
            Every number above is tier <span className="text-white">measured</span>: {TIER.measured}.
            The separator test ran at {fmt(stages[0][1], 2)} psia and {fmt(stages[0][0], 0)} F, then to
            a stock tank at {fmt(stages[1][1], 2)} psia. The report lists one separator stage; the
            stock tank is implied, and forgetting it is the commonest way to reproduce this study
            wrongly.
          </Note>
        </>
      )}

      {view === 'What the model says' && (
        <>
          <div className="mt-4 rounded border border-gray-700 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-black/40 text-gray-400">
                <tr>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-right p-2">Lab</th>
                  <th className="text-right p-2">Untuned model</th>
                  <th className="text-right p-2">Error</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-800">
                  <td className="p-2 text-white">Saturation pressure (psia)</td>
                  <td className="p-2 text-right text-gray-200">{fmt(lab.bubblePointPsia, 2)}</td>
                  <td className="p-2 text-right text-gray-200">{fmt(model.saturationPressurePsia, 2)}</td>
                  <td className="p-2 text-right text-amber-400">
                    {fmt(pct(model.saturationPressurePsia, lab.bubblePointPsia), 2)} pct
                  </td>
                </tr>
                <tr className="border-t border-gray-800">
                  <td className="p-2 text-white">Total GOR (scf/stb)</td>
                  <td className="p-2 text-right text-gray-200">{fmt(lab.totalGorScfStb, 0)}</td>
                  <td className="p-2 text-right text-gray-200">{fmt(model.totalGorScfStb, 1)}</td>
                  <td className="p-2 text-right text-amber-400">
                    {fmt(pct(model.totalGorScfStb, lab.totalGorScfStb), 2)} pct
                  </td>
                </tr>
                <tr className="border-t border-gray-800">
                  <td className="p-2 text-white">Stock tank gravity (API)</td>
                  <td className="p-2 text-right text-gray-200">{fmt(lab.stockTankApi, 1)}</td>
                  <td className="p-2 text-right text-gray-200">{fmt(model.stockTankApi, 2)}</td>
                  <td className="p-2 text-right text-red-400">
                    {fmt(model.stockTankApi - lab.stockTankApi, 2)} API
                  </td>
                </tr>
                <tr className="border-t border-gray-800">
                  <td className="p-2 text-white">Formation volume factor (rb/stb)</td>
                  <td className="p-2 text-right text-gray-200">{fmt(lab.boRbStb, 3)}</td>
                  <td className="p-2 text-right text-gray-500">withheld</td>
                  <td className="p-2 text-right text-gray-500">no basis</td>
                </tr>
              </tbody>
            </table>
          </div>
          <TileGrid>
            <Tile label="Separator gas" value={fmt(model.separatorGorScfStb, 1)} unit="scf/stb" />
            <Tile label="Stock tank gas" value={fmt(model.stockTankGorScfStb, 1)} unit="scf/stb" />
            <Tile label="Surface gas gravity" value={fmt(model.surfaceGasGravity, 4)} />
            <Tile label="Stock tank gravity" value={fmt(model.stockTankSg, 4)} unit="specific" />
          </TileGrid>
          <Note>
            The formation volume factor is withheld rather than wrong. This model saturates at{' '}
            {fmt(model.saturationPressurePsia, 0)} psia, which is ABOVE the{' '}
            {fmt(lab.bubblePointPsia, 0)} psia the lab calls reservoir pressure, so on this model the
            fluid is not a single-phase oil there and a formation volume factor has nothing to be
            measured against. The engine declines to report one. Both remaining errors are documented
            untuned-equation-of-state biases rather than surprises.
          </Note>
        </>
      )}
    </PanelShell>
  );
};

export default StudyExplorer;
