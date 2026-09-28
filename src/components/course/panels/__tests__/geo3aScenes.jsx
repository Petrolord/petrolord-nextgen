// TEST-ONLY. Batch 3A (docs/scope/DesignSystem-Rollout.md section 3): every
// geoscience I course panel, in its opening state and in the states a
// learner reaches with one or two actions, shared by the legacy test (outside
// a scope, the unmigrated course reader) and the theme test (inside a scope,
// the learning pages). The actions use visible text and values only, so the
// same scenes run against the pre-migration panels when the legacy fixture is
// captured.
import React from 'react';
import PorosityLab from '@/components/course/panels/petrophysics/PorosityLab';
import PickettExplorer from '@/components/course/panels/petrophysics/PickettExplorer';
import ShalySwLab from '@/components/course/panels/petrophysics/ShalySwLab';
import RwTriangulator from '@/components/course/panels/petrophysics/RwTriangulator';
import LasInspector from '@/components/course/panels/welldata/LasInspector';
import ImportExplorer from '@/components/course/panels/welldata/ImportExplorer';
import CampaignExplorer from '@/components/course/panels/welldata/CampaignExplorer';
import SectionExplorer from '@/components/course/panels/wellcorrelation/SectionExplorer';
import FlattenExplorer from '@/components/course/panels/wellcorrelation/FlattenExplorer';
import PredictionExplorer from '@/components/course/panels/wellcorrelation/PredictionExplorer';
import SyntheticExplorer from '@/components/course/panels/seismolord/SyntheticExplorer';
import ShiftExplorer from '@/components/course/panels/seismolord/ShiftExplorer';
import WedgeExplorer from '@/components/course/panels/seismolord/WedgeExplorer';
import MapExplorer from '@/components/course/panels/mapping/MapExplorer';
import IsochoreExplorer from '@/components/course/panels/mapping/IsochoreExplorer';
import ValidationExplorer from '@/components/course/panels/mapping/ValidationExplorer';

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
  { name: 'FlattenExplorer', element: <FlattenExplorer /> },
  { name: 'FlattenExplorer invalid datum', element: <FlattenExplorer />,
    act: (t) => t.fireEvent.change(t.screen.getByDisplayValue(/^1\d{3}(\.\d+)?$/), { target: { value: '5' } }) },
  { name: 'PredictionExplorer', element: <PredictionExplorer /> },
  { name: 'SyntheticExplorer', element: <SyntheticExplorer /> },
  { name: 'SyntheticExplorer invalid', element: <SyntheticExplorer />,
    act: (t) => t.fireEvent.change(t.screen.getAllByRole('spinbutton')[0], { target: { value: '0' } }) },
  { name: 'ShiftExplorer', element: <ShiftExplorer /> },
  { name: 'ShiftExplorer 40 Hz', element: <ShiftExplorer />, act: (t) => click(t, /^40 Hz$/) },
  { name: 'WedgeExplorer', element: <WedgeExplorer /> },
  { name: 'MapExplorer', element: <MapExplorer /> },
  { name: 'MapExplorer typed', element: <MapExplorer />,
    act: (t) => selectByValue(t, 'Ekene wells (teaching)', 'typed') },
  { name: 'IsochoreExplorer', element: <IsochoreExplorer /> },
  { name: 'ValidationExplorer', element: <ValidationExplorer /> },
];

/**
 * The class attributes of a rendered panel in document order, chart regions
 * left out: the white chart kit (data-canvas), a Recharts container, an <svg>
 * and the scroll wrapper that held a pre-migration <svg>. Everything else a
 * panel renders outside a scope must match the pre-migration panel exactly.
 */
export function chromeClasses(root) {
  const copy = root.cloneNode(true);
  const drop = [...copy.querySelectorAll('[data-canvas], .recharts-responsive-container, svg')];
  for (const el of drop) {
    const wrap = el.parentElement;
    const onlySvgWrap = el.tagName.toLowerCase() === 'svg' && wrap && wrap.children.length === 1
      && wrap.getAttribute('class') === 'overflow-x-auto';
    (onlySvgWrap ? wrap : el).remove();
  }
  return [...copy.querySelectorAll('[class]')].map((el) => el.getAttribute('class'));
}
