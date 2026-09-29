// TEST-ONLY. Batch 3C (docs/scope/DesignSystem-Rollout.md section 3): every
// reservoir course panel (DCA, material balance, SCAL, waterflood,
// simulation, fluid, well test) in its opening state and in the states a
// learner reaches with one or two actions, shared by the legacy test (outside
// a scope, the unmigrated course reader and handbook) and the theme test
// (inside a scope, the learning pages). The actions use roles, visible text
// and values only, so the same scenes run against the pre-migration panels
// when the legacy fixture is captured.
import React from 'react';
import FitExplorer from '@/components/course/panels/dca/FitExplorer';
import TypeCurveExplorer from '@/components/course/panels/dca/TypeCurveExplorer';
import UncertaintyExplorer from '@/components/course/panels/dca/UncertaintyExplorer';
import TankExplorer from '@/components/course/panels/mbal/TankExplorer';
import AquiferExplorer from '@/components/course/panels/mbal/AquiferExplorer';
import PdExplorer from '@/components/course/panels/mbal/PdExplorer';
import DisplacementExplorer from '@/components/course/panels/scal/DisplacementExplorer';
import JFunctionExplorer from '@/components/course/panels/scal/JFunctionExplorer';
import ScalDesignExplorer from '@/components/course/panels/scal/DesignExplorer';
import LedgerExplorer from '@/components/course/panels/waterflood/LedgerExplorer';
import PatternExplorer from '@/components/course/panels/waterflood/PatternExplorer';
import FloodDesignExplorer from '@/components/course/panels/waterflood/DesignExplorer';
import DeckExplorer from '@/components/course/panels/sim/DeckExplorer';
import StructureExplorer from '@/components/course/panels/sim/StructureExplorer';
import BuildExplorer from '@/components/course/panels/sim/BuildExplorer';
import CorrelationExplorer from '@/components/course/panels/fluid/CorrelationExplorer';
import StudyExplorer from '@/components/course/panels/fluid/StudyExplorer';
import TuningExplorer from '@/components/course/panels/fluid/TuningExplorer';
import BuildupExplorer from '@/components/course/panels/welltest/BuildupExplorer';
import DiagnosticExplorer from '@/components/course/panels/welltest/DiagnosticExplorer';
import RegressionExplorer from '@/components/course/panels/welltest/RegressionExplorer';
import { TRANSIENT_FIXTURES } from '@/components/course/panels/welltest/welltestLab';

const combo = (t, i, value) => t.fireEvent.change(t.screen.getAllByRole('combobox')[i], { target: { value } });
const spin = (t, i, value) => t.fireEvent.change(t.screen.getAllByRole('spinbutton')[i], { target: { value } });
const text = (t, i, value) => t.fireEvent.change(t.screen.getAllByRole('textbox')[i], { target: { value } });
const click = (t, name) => t.fireEvent.click(t.screen.getByRole('button', { name }));

export const RC3C_SCENES = [
  // DCA
  { name: 'FitExplorer', element: <FitExplorer /> },
  { name: 'FitExplorer custom window, linear', element: <FitExplorer />,
    act: (t) => { combo(t, 2, 'custom'); combo(t, 3, 'lin'); } },
  { name: 'FitExplorer invalid limit', element: <FitExplorer />, act: (t) => spin(t, 0, '0') },
  { name: 'TypeCurveExplorer', element: <TypeCurveExplorer /> },
  { name: 'TypeCurveExplorer empty pool', element: <TypeCurveExplorer />,
    act: (t) => t.screen.getAllByRole('checkbox').filter((c) => c.checked).forEach((c) => t.fireEvent.click(c)) },
  { name: 'UncertaintyExplorer', element: <UncertaintyExplorer /> },
  { name: 'UncertaintyExplorer invalid triangle', element: <UncertaintyExplorer />, act: (t) => spin(t, 2, '1e12') },
  // Material balance
  { name: 'TankExplorer', element: <TankExplorer /> },
  { name: 'TankExplorer pot aquifer', element: <TankExplorer />, act: (t) => combo(t, 1, 'pot') },
  { name: 'TankExplorer typed', element: <TankExplorer />, act: (t) => combo(t, 0, 'typed') },
  { name: 'TankExplorer typed invalid', element: <TankExplorer />,
    act: (t) => { combo(t, 0, 'typed'); spin(t, 0, ''); } },
  { name: 'TankExplorer dake', element: <TankExplorer />, act: (t) => combo(t, 0, 'dake') },
  { name: 'AquiferExplorer', element: <AquiferExplorer /> },
  { name: 'AquiferExplorer trap', element: <AquiferExplorer />, act: (t) => click(t, /the trap/) },
  { name: 'AquiferExplorer invalid', element: <AquiferExplorer />, act: (t) => spin(t, 0, '0') },
  { name: 'PdExplorer', element: <PdExplorer /> },
  { name: 'PdExplorer reD 5', element: <PdExplorer />, act: (t) => combo(t, 0, '5') },
  // SCAL
  { name: 'DisplacementExplorer', element: <DisplacementExplorer /> },
  { name: 'DisplacementExplorer textbook', element: <DisplacementExplorer />, act: (t) => click(t, /Load the textbook case/) },
  { name: 'DisplacementExplorer typed', element: <DisplacementExplorer />, act: (t) => click(t, /Type your own case/) },
  { name: 'DisplacementExplorer typed invalid', element: <DisplacementExplorer />,
    act: (t) => { click(t, /Type your own case/); spin(t, 0, '-1'); } },
  { name: 'JFunctionExplorer', element: <JFunctionExplorer /> },
  { name: 'JFunctionExplorer one plug', element: <JFunctionExplorer />, act: (t) => combo(t, 0, '1') },
  { name: 'JFunctionExplorer invalid', element: <JFunctionExplorer />, act: (t) => spin(t, 0, '0.9') },
  { name: 'ScalDesignExplorer', element: <ScalDesignExplorer /> },
  { name: 'ScalDesignExplorer printed', element: <ScalDesignExplorer />, act: (t) => combo(t, 0, 'fitPrinted') },
  { name: 'ScalDesignExplorer dip', element: <ScalDesignExplorer />, act: (t) => combo(t, 0, 'dip') },
  { name: 'ScalDesignExplorer polymer', element: <ScalDesignExplorer />, act: (t) => combo(t, 0, 'polymer') },
  { name: 'ScalDesignExplorer invalid', element: <ScalDesignExplorer />, act: (t) => spin(t, 0, '0.5') },
  // Waterflood
  { name: 'LedgerExplorer', element: <LedgerExplorer /> },
  { name: 'LedgerExplorer tracked', element: <LedgerExplorer />, act: (t) => click(t, /Bo frozen/) },
  { name: 'LedgerExplorer invalid', element: <LedgerExplorer />, act: (t) => text(t, 0, '0') },
  { name: 'PatternExplorer', element: <PatternExplorer /> },
  { name: 'PatternExplorer unrouted', element: <PatternExplorer />, act: (t) => combo(t, 0, 'Unrouted element') },
  { name: 'PatternExplorer absolute Hall', element: <PatternExplorer />, act: (t) => click(t, /Hall on pressure above/) },
  { name: 'FloodDesignExplorer', element: <FloodDesignExplorer /> },
  { name: 'FloodDesignExplorer forecast', element: <FloodDesignExplorer />, act: (t) => combo(t, 0, 'forecast') },
  { name: 'FloodDesignExplorer EV off', element: <FloodDesignExplorer />, act: (t) => click(t, /EV from the layer column/) },
  { name: 'FloodDesignExplorer invalid', element: <FloodDesignExplorer />, act: (t) => text(t, 0, '0') },
  // Simulation
  { name: 'DeckExplorer', element: <DeckExplorer /> },
  { name: 'DeckExplorer PROPS', element: <DeckExplorer />, act: (t) => click(t, /^PROPS$/) },
  { name: 'DeckExplorer invalid', element: <DeckExplorer />, act: (t) => spin(t, 0, '1000') },
  { name: 'StructureExplorer', element: <StructureExplorer /> },
  { name: 'StructureExplorer tapered, no wells', element: <StructureExplorer />,
    act: (t) => { combo(t, 0, 'tapered'); click(t, /well posts/); } },
  { name: 'StructureExplorer invalid', element: <StructureExplorer />, act: (t) => spin(t, 0, '1000') },
  { name: 'BuildExplorer', element: <BuildExplorer /> },
  { name: 'BuildExplorer validation', element: <BuildExplorer />, act: (t) => combo(t, 0, 'validation') },
  // Fluid
  { name: 'CorrelationExplorer', element: <CorrelationExplorer /> },
  { name: 'CorrelationExplorer out of range', element: <CorrelationExplorer />, act: (t) => spin(t, 2, '400') },
  { name: 'CorrelationExplorer invalid', element: <CorrelationExplorer />, act: (t) => spin(t, 0, '') },
  { name: 'StudyExplorer', element: <StudyExplorer /> },
  { name: 'StudyExplorer composition', element: <StudyExplorer />, act: (t) => click(t, /^Composition$/) },
  { name: 'StudyExplorer model', element: <StudyExplorer />, act: (t) => click(t, /^What the model says$/) },
  { name: 'StudyExplorer invalid', element: <StudyExplorer />, act: (t) => spin(t, 0, '0') },
  { name: 'TuningExplorer', element: <TuningExplorer /> },
  { name: 'TuningExplorer knobs', element: <TuningExplorer />, act: (t) => click(t, /^The knobs$/) },
  { name: 'TuningExplorer flash', element: <TuningExplorer />, act: (t) => click(t, /^Flash$/) },
  { name: 'TuningExplorer flash invalid', element: <TuningExplorer />,
    act: (t) => { click(t, /^Flash$/); spin(t, 1, '0'); } },
  // Well test
  { name: 'BuildupExplorer', element: <BuildupExplorer /> },
  { name: 'BuildupExplorer every point', element: <BuildupExplorer />, act: (t) => combo(t, 0, '0') },
  { name: 'BuildupExplorer your test', element: <BuildupExplorer />, act: (t) => click(t, /^Your test$/) },
  ...TRANSIENT_FIXTURES.map((f) => ({
    name: `DiagnosticExplorer ${f.id}`, element: <DiagnosticExplorer />, act: (t) => combo(t, 0, f.id),
  })),
  { name: 'RegressionExplorer', element: <RegressionExplorer /> },
  { name: 'RegressionExplorer phantom fault', element: <RegressionExplorer />,
    act: (t) => combo(t, 1, 'homogeneous-sealing-fault') },
  { name: 'RegressionExplorer production', element: <RegressionExplorer />, act: (t) => combo(t, 0, 'production') },
];

// Wrappers that held nothing but a pre-migration chart; the chart kit
// replaces the wrapper and the chart together.
const CHART_WRAPPERS = new Set(['overflow-x-auto', 'h-64 mt-3']);

/**
 * The class attributes of a rendered panel in document order, chart regions
 * left out: the white chart kit (data-canvas), a Recharts container, an <svg>
 * and the wrapper that held only a pre-migration chart. Everything else a
 * panel renders outside a scope must match the pre-migration panel exactly.
 */
export function chromeClasses(root) {
  const copy = root.cloneNode(true);
  const drop = [...copy.querySelectorAll('[data-canvas], .recharts-responsive-container, svg')];
  for (const el of drop) {
    if (!copy.contains(el)) continue;
    const wrap = el.parentElement;
    const onlyChartWrap = wrap && wrap !== copy && wrap.children.length === 1
      && CHART_WRAPPERS.has(wrap.getAttribute('class'));
    (onlyChartWrap ? wrap : el).remove();
  }
  return [...copy.querySelectorAll('[class]')].map((el) => el.getAttribute('class'));
}
