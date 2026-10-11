import React from 'react';
import { PanelShell, Note } from '@/components/course/panels/petrophysics/panelKit';

// The inversion explorer (qi-inversion-explorer). Its views arrive with its tier's lessons; until
// then it lists what each view will run and which part of the Ekene teaching
// pack it will read, and computes nothing.

export const MODES = [['overview', 'What this explorer will run']];

const QiInversionExplorer = () => (
  <PanelShell title="Inversion explorer" subtitle="Inversion at the wells (Expert).">
    <div className="text-sm text-pl-text">
      <p className="mb-2">The views of this explorer, each over the vendored engines and the Ekene teaching pack:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><span className="font-medium">The forward model</span>: the convolutional model, the low-frequency model and the wavelet scale. It reads the full-stack traces and the logs at the four wells.</li>
        <li><span className="font-medium">Post-stack inversion</span>: model-based and sparse-spike inversion, coloured inversion, blind wells and quantiles across realisations. It reads the full-stack traces at the four wells.</li>
        <li><span className="font-medium">Simultaneous inversion</span>: Fatti&apos;s three parameters, angle wavelets and blind wells per parameter. It reads the near, mid and far stack traces at the four wells.</li>
      </ul>
    </div>
    <Note>The Suite&apos;s QI Studio runs the same engines. This explorer&apos;s calculations open with its tier&apos;s lessons.</Note>
  </PanelShell>
);

export default QiInversionExplorer;
