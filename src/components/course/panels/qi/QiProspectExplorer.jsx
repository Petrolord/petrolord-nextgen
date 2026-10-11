import React from 'react';
import { PanelShell, Note } from '@/components/course/panels/petrophysics/panelKit';

// The prospect explorer (qi-prospect-explorer). Its views arrive with its tier's lessons; until
// then it lists what each view will run and which part of the Ekene teaching
// pack it will read, and computes nothing.

export const MODES = [['overview', 'What this explorer will run']];

const QiProspectExplorer = () => (
  <PanelShell title="Prospect explorer" subtitle="Properties from impedance and the prospect (Expert).">
    <div className="text-sm text-pl-text">
      <p className="mb-2">The views of this explorer, each over the vendored engines and the Ekene teaching pack:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><span className="font-medium">Properties from impedance</span>: a linear transform and its interval, left-out wells, Bayesian facies and the confusion matrix. It reads the logs at the four wells.</li>
        <li><span className="font-medium">Prospects</span>: crest, spill and closure, anomaly conformance and the QI assessment. It reads a stated depth grid.</li>
      </ul>
    </div>
    <Note>The Suite&apos;s QI Studio runs the same engines. This explorer&apos;s calculations open with its tier&apos;s lessons.</Note>
  </PanelShell>
);

export default QiProspectExplorer;
