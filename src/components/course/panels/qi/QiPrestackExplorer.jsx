import React from 'react';
import { PanelShell, Note } from '@/components/course/panels/petrophysics/panelKit';

// The prestack explorer (qi-prestack-explorer). Its views arrive with its tier's lessons; until
// then it lists what each view will run and which part of the Ekene teaching
// pack it will read, and computes nothing.

export const MODES = [['overview', 'What this explorer will run']];

const QiPrestackExplorer = () => (
  <PanelShell title="Prestack explorer" subtitle="From the tie to AVO on the seismic (Professional).">
    <div className="text-sm text-pl-text">
      <p className="mb-2">The views of this explorer, each over the vendored engines and the Ekene teaching pack:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><span className="font-medium">Wavelets and the tie</span>: statistical and well wavelets, phase and correlation, the bulk shift and the field wavelet. It reads the full-stack traces at Ekene-1 to Ekene-4 and their checkshots.</li>
        <li><span className="font-medium">Gathers and their QC</span>: NMO stretch and the stretch mute, residual moveout and fold. It reads the NMO-corrected CDP gathers next to Ekene-1.</li>
        <li><span className="font-medium">Angles from velocity</span>: Dix interval velocity, Walden&apos;s angle, angle gathers, partial stacks and the usable angle. It reads the published RMS velocity table and the gathers.</li>
        <li><span className="font-medium">AVO</span>: the Shuey fit from near, mid and far, the background trend, the fluid factor and AVO at the wells. It reads the near, mid and far stack traces at the four wells.</li>
      </ul>
    </div>
    <Note>The Suite&apos;s QI Studio runs the same engines. This explorer&apos;s calculations open with its tier&apos;s lessons.</Note>
  </PanelShell>
);

export default QiPrestackExplorer;
