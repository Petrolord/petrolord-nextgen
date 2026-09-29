// TEST-ONLY. Batch 4B (docs/scope/DesignSystem-Rollout.md section 3): every
// panel the production II learning pages render (the course reader embeds
// them too), in every view its View select offers.
import React from 'react';
import StringExplorer from '@/components/course/panels/rodpump/StringExplorer';
import CardExplorer from '@/components/course/panels/rodpump/CardExplorer';
import BalanceExplorer from '@/components/course/panels/rodpump/BalanceExplorer';
import DropletExplorer from '@/components/course/panels/gaswell/DropletExplorer';
import ProfileExplorer from '@/components/course/panels/gaswell/ProfileExplorer';
import RemedyExplorer from '@/components/course/panels/gaswell/RemedyExplorer';
import ThermalExplorer from '@/components/course/panels/flowassurance/ThermalExplorer';
import LineExplorer from '@/components/course/panels/flowassurance/LineExplorer';
import HydrateExplorer from '@/components/course/panels/flowassurance/HydrateExplorer';

const PANELS = [
  ['StringExplorer', StringExplorer, ['objects', 'taper', 'note', 'typed', 'linkage', 'pump']],
  ['CardExplorer', CardExplorer, ['march', 'stretch', 'loads', 'power', 'fillage', 'typed']],
  ['BalanceExplorer', BalanceExplorer, ['envelope', 'convergence', 'balance', 'ignored', 'stress', 'typed']],
  ['DropletExplorer', DropletExplorer, ['station', 'balance', 'sweep', 'pair', 'threshold']],
  ['ProfileExplorer', ProfileExplorer, ['traverse', 'profile', 'rates', 'sizing', 'plunger']],
  ['RemedyExplorer', RemedyExplorer, ['seam', 'discarded', 'gradient', 'falling', 'nobody']],
  ['ThermalExplorer', ThermalExplorer, ['catalog', 'stack', 'insulation', 'burial', 'reference', 'mass']],
  ['LineExplorer', LineExplorer, ['balance', 'profile', 'target', 'cooldown', 'mass', 'margin']],
  ['HydrateExplorer', HydrateExplorer, ['jt', 'trench', 'reference', 'depression', 'dose', 'ceiling']],
];

/** Pick a view in the panel's first select (its View select). */
const pickView = (value) => ({ screen, fireEvent }) => {
  fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value } });
};

export const PROD4B_SCENES = PANELS.flatMap(([name, Panel, views]) => views.map((view) => ({
  name: `${name} ${view}`,
  element: <Panel />,
  act: pickView(view),
})));
