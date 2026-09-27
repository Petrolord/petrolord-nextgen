import React, { useState } from 'react';
import { PanelShell, SelectField, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';
import { ViewMode } from './materialsViews';

// The stock calculator (Professional): quantity discounts (all-units and
// incremental), safety stock and the reorder point or order-up-to level for
// normal demand at a cycle service level or a fill rate, and the stock level
// for Poisson demand. Every figure is a return value of the vendored engine
// (engines/supplychain/inventory.js) through materialsLab; the Suite's
// Materials & Spares Planner runs the same engine.

export const MODES = [
  ['quantityDiscount', 'Quantity discounts'],
  ['safetyStock', 'Safety stock for normal demand'],
  ['poissonStock', 'Stock for Poisson demand'],
];

export const STARTS_OF = {
  quantityDiscount: [['qdCasing', 'The casing on the Ekene register, all-units'], ['qdCasingIncremental', 'The casing, incremental'], ['qdCapliceIncremental', 'Lecture 8 slides 13 to 15, incremental'],
    ['qdCapliceAllUnits', 'Lecture 8 slide 12, all-units'], ['qdTie', 'Two candidates tied on cost']],
  safetyStock: [['ssChokeBeans', 'The choke bean set, cycle service level'], ['ssChokeBeansFill', 'The choke bean set, fill rate'], ['ssLeadTimeOnly', 'Lead-time spread alone'],
    ['ssCapliceIfr95', 'Lecture 11 slide 24, fill rate 0.95'], ['ssCaplicePeriodic', 'Lecture 12 slide 6, periodic review'], ['ssFloor', 'A floor on the safety factor'], ['ssCertain', 'Certain demand']],
  poissonStock: [['psPsvKits', 'The PSV kits on the Ekene register'], ['psCapliceFill', 'Lecture 13 slides 11 and 12, fill rate'], ['psLamps', 'MIL-HDBK-338B, the lamps'],
    ['psExactlyMet', 'A target met exactly'], ['psFillWithReview', 'A fill rate under periodic review']],
};

const StockCalculator = ({ initialMode = 'safetyStock', initialCase = null, initialText = null, initialBlock = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Stock calculator"
      subtitle="Quantity discounts, safety stock and the reorder point or order-up-to level at a stated cycle service level or fill rate, and the stock level for Poisson demand."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        <ViewMode key={mode} view={mode} starts={STARTS_OF[mode]} initialCase={initialCase} initialText={initialText} initialBlock={initialBlock} />
      </div>
      <Note>Every number on this calculator is a return value of the vendored engine, the same engine the Materials &amp; Spares Planner runs in the Suite. A service level always names its measure. The Ekene register is synthetic; paste your own inputs, or a whole case file, to replace it.</Note>
    </PanelShell>
  );
};

export default StockCalculator;
