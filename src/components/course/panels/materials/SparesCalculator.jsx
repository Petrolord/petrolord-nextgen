import React, { useState } from 'react';
import { PanelShell, SelectField, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';
import { ViewMode } from './materialsViews';

// The spares calculator (Expert): insurance spares by the engine's stated
// one-for-one model, the stock level for a slow-moving spare on Poisson
// demand, and lead-time risk by the canonical seeded Monte Carlo, whose
// figures are sampled and ungraded. Every figure is a return value of the
// vendored engine (engines/supplychain/inventory.js) through materialsLab; the
// Suite's Materials & Spares Planner runs the same engine.

export const MODES = [
  ['insuranceSpares', 'Insurance spares'],
  ['poissonStock', 'A slow-moving spare on Poisson demand'],
  ['leadTimeRisk', 'Lead-time risk by Monte Carlo (ungraded)'],
];

export const STARTS_OF = {
  insuranceSpares: [['insEspMotor', 'The ESP motor on the Ekene register'], ['insHandbookMean', 'The handbook lamps as orders outstanding'], ['insSearchLimit', 'The cheapest stock on the search limit'],
    ['insTie', 'Two stocks tied on cost']],
  poissonStock: [['psPsvKits', 'The PSV kits on the Ekene register'], ['psLamps', 'MIL-HDBK-338B, the lamps'], ['psFillWithReview', 'A fill rate under periodic review']],
  leadTimeRisk: [['ltrMechSeal', 'The mechanical seal on the Ekene register'], ['ltrOtherSeed', 'The same seal on another seed'], ['ltrEqualToStock', 'Demand equal to the stock'],
    ['ltrLeadTimeOnly', 'A constant demand and a sampled lead time']],
};

const SparesCalculator = ({ initialMode = 'insuranceSpares', initialCase = null, initialText = null, initialBlock = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Spares calculator"
      subtitle="Insurance spares by the engine's one-for-one model, a slow-moving spare on Poisson demand, and lead-time risk by the canonical seeded Monte Carlo, printed with its seed and draws, sampled and ungraded."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        <ViewMode key={mode} view={mode} starts={STARTS_OF[mode]} initialCase={initialCase} initialText={initialText} initialBlock={initialBlock} />
      </div>
      <Note>Every number on this calculator is a return value of the vendored engine, the same engine the Materials &amp; Spares Planner runs in the Suite. The Ekene register is synthetic; paste your own inputs, or a whole case file, to replace it.</Note>
    </PanelShell>
  );
};

export default SparesCalculator;
