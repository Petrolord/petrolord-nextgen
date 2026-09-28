// TEST-ONLY. Batch 3A (docs/scope/DesignSystem-Rollout.md section 3): every
// panel a geoscience I learning page renders (the reader embeds them too), in
// its opening state and in the states a learner reaches with one or two
// actions. The reader-only panels (well correlation flatten and prediction,
// seismolord, mapping) are batch 1C's and are tested in ReaderPanels.theme.
import React from 'react';
import PorosityLab from '@/components/course/panels/petrophysics/PorosityLab';
import PickettExplorer from '@/components/course/panels/petrophysics/PickettExplorer';
import ShalySwLab from '@/components/course/panels/petrophysics/ShalySwLab';
import RwTriangulator from '@/components/course/panels/petrophysics/RwTriangulator';
import LasInspector from '@/components/course/panels/welldata/LasInspector';
import ImportExplorer from '@/components/course/panels/welldata/ImportExplorer';
import CampaignExplorer from '@/components/course/panels/welldata/CampaignExplorer';
import SectionExplorer from '@/components/course/panels/wellcorrelation/SectionExplorer';

const selectByValue = ({ screen, fireEvent }, shown, value) => {
  fireEvent.change(screen.getByDisplayValue(shown), { target: { value } });
};
const click = ({ screen, fireEvent }, name) => fireEvent.click(screen.getByRole('button', { name }));

export const GEO3A_SCENES = [
  { name: 'PorosityLab', element: <PorosityLab /> },
  { name: 'PorosityLab invalid', element: <PorosityLab />,
    act: (t) => t.fireEvent.change(t.screen.getAllByRole('spinbutton')[0], { target: { value: '' } }) },
  { name: 'PickettExplorer', element: <PickettExplorer /> },
  { name: 'PickettExplorer fitted', element: <PickettExplorer />, act: (t) => click(t, /Fit water line/) },
  { name: 'ShalySwLab', element: <ShalySwLab /> },
  { name: 'RwTriangulator', element: <RwTriangulator /> },
  { name: 'RwTriangulator booked', element: <RwTriangulator />,
    act: (t) => {
      t.fireEvent.change(t.screen.getByPlaceholderText('your adopted Rw'), { target: { value: '0.05' } });
      click(t, /Book SAND_A/);
    } },
  { name: 'LasInspector', element: <LasInspector /> },
  { name: 'LasInspector raw', element: <LasInspector />, act: (t) => click(t, /Show raw file/) },
  { name: 'LasInspector dead curve', element: <LasInspector />, act: (t) => click(t, /nullheavy_20/) },
  { name: 'ImportExplorer', element: <ImportExplorer /> },
  { name: 'CampaignExplorer', element: <CampaignExplorer /> },
  { name: 'SectionExplorer', element: <SectionExplorer /> },
  { name: 'SectionExplorer typed', element: <SectionExplorer />,
    act: (t) => selectByValue(t, 'Ekene wells (teaching)', 'typed') },
  { name: 'SectionExplorer flattened', element: <SectionExplorer />,
    act: (t) => selectByValue(t, 'Structural (true MD)', 'flatten') },
];
