import React, { useState } from 'react';
import { PanelShell, SelectField, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';
import { ViewMode } from './materialsViews';

// The register calculator (Associate): criticality classes from stated
// criteria and weights, ABC classes by annual usage value, the economic order
// quantity with its stated rounding, and slow-moving and obsolete stock. Every
// figure is a return value of the vendored engine
// (engines/supplychain/inventory.js) through materialsLab; the Suite's
// Materials & Spares Planner runs the same engine.

export const MODES = [
  ['criticality', 'Criticality classes'],
  ['abcClassification', 'ABC by annual usage value'],
  ['eoq', 'The economic order quantity'],
  ['slowMoving', 'Slow-moving and obsolete stock'],
];

export const STARTS_OF = {
  criticality: [['critEkene', 'The Ekene register, its stated criticality policy'], ['critAtCutoff', 'A score exactly on a class minimum'], ['critJustBelow', 'A score just below a class minimum'],
    ['critOverride', 'A maximum score on the override criterion'], ['critOverrideOneBelow', 'One below the maximum on the override criterion'], ['crit12Digit', 'Twelve significant digits']],
  abcClassification: [['abcEkene', 'The Ekene register, at-or-below'], ['abcEkeneCrossing', 'The Ekene register, include-crossing'], ['abcExactAtOrBelow', 'Shares exactly on the cut-offs, at-or-below'],
    ['abcExactCrossing', 'Shares exactly on the cut-offs, include-crossing'], ['abcTies', 'Two items tied on value']],
  eoq: [['eoqBaryte', 'Baryte on the Ekene register'], ['eoqHarris', 'Harris 1913, his first lot'], ['eoqHarrisStud', 'Harris 1913, the stud to the nearest whole number'],
    ['eoqCaplice', 'Lecture 8 slide 9 of the ESD.260J check'], ['eoqHoldingDirect', 'A holding cost stated directly'], ['eoqHalf', 'An EOQ exactly halfway between two multiples']],
  slowMoving: [['smEkene', 'The Ekene register, its stated bands'], ['smBoundaries', 'The band and cover boundaries']],
};

const RegisterCalculator = ({ initialMode = 'criticality', initialCase = null, initialText = null, initialBlock = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Register calculator"
      subtitle="Criticality classes from stated criteria and weights, ABC classes by annual usage value, the economic order quantity with a stated rounding rule, and slow-moving and obsolete stock by stated bands."
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

export default RegisterCalculator;
