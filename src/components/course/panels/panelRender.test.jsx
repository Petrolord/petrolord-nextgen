// EVERY course panel must RENDER. Not compute correctly, which each course's
// own lab test already pins, but render at all without throwing.
//
// This gate did not exist until DR10, and its absence hid a live crash in
// THIRTY of the eighty panels, spread across ten courses: all nine built
// Drilling courses and Well Test Analysis. The shared panelKit SelectField
// destructured its options as `([v, l])`, the array-pair form, while a great
// many panels pass `{ value, label }` objects. Array-destructuring an object
// throws "object is not iterable", so those panels died the instant their
// select rendered.
//
// Nothing caught it because every gate in the suite checked NUMBERS. The
// teaching labs pinned hundreds of engine values, the content lint checked
// that every panel id resolved in the registry, the migrations asserted their
// own preconditions, and not one of them ever mounted a component. All ten
// affected courses were seeded and held from go-live, so no learner had
// reached one, and the next production upload would have shipped all thirty.
//
// THE RULE: a suite that verifies what a component COMPUTES has said nothing
// about whether it RENDERS. One cheap smoke render per component is the
// difference between finding that in a test and finding it in production.
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

const panels = {
  ...import.meta.glob('/src/components/course/panels/**/*Explorer.jsx'),
  ...import.meta.glob('/src/components/course/panels/**/*Lab.jsx'),
};

describe('every course panel renders with no props', () => {
  const entries = Object.entries(panels);
  it('finds the panels', () => {
    expect(entries.length).toBeGreaterThan(70);
  });

  // Named rather than left to the glob, so a panel that is renamed, moved or
  // deleted fails here instead of quietly dropping out of the sweep.
  it('finds the PD4 rod pump panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('rodpump/StringExplorer.jsx');
    expect(names).toContain('rodpump/CardExplorer.jsx');
    expect(names).toContain('rodpump/BalanceExplorer.jsx');
  });
  it('finds the PD6 flow assurance panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('flowassurance/ThermalExplorer.jsx');
    expect(names).toContain('flowassurance/LineExplorer.jsx');
    expect(names).toContain('flowassurance/HydrateExplorer.jsx');
  });
  it('finds the PD7 network panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('network/TrunkExplorer.jsx');
    expect(names).toContain('network/NetworkExplorer.jsx');
    expect(names).toContain('network/FightExplorer.jsx');
  });
  it('finds the PD8 intervention panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('intervention/DiagnosticExplorer.jsx');
    expect(names).toContain('intervention/ChannelExplorer.jsx');
    expect(names).toContain('intervention/CandidateExplorer.jsx');
  });
  it('finds the FC3 rotating equipment panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('rotating/PumpExplorer.jsx');
    expect(names).toContain('rotating/SuctionExplorer.jsx');
    expect(names).toContain('rotating/CompressorExplorer.jsx');
  });
  it('finds the PD9 production surveillance panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('surveillance/LedgerExplorer.jsx');
    expect(names).toContain('surveillance/ExceptionExplorer.jsx');
    expect(names).toContain('surveillance/ReadingExplorer.jsx');
  });
  it('finds the FC2 line sizing panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('linesizing/LiquidExplorer.jsx');
    expect(names).toContain('linesizing/GasLineExplorer.jsx');
    expect(names).toContain('linesizing/WallPigExplorer.jsx');
  });
  it('finds the compliance (Compliance, Audit & Quality) panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('compliance/RegisterExplorer.jsx');
    expect(names).toContain('compliance/PlanExplorer.jsx');
    expect(names).toContain('compliance/ReadinessExplorer.jsx');
  });
  it('finds the refinery (Refinery Feasibility & Planning) panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('refinery/ScreenExplorer.jsx');
    expect(names).toContain('refinery/PlanExplorer.jsx');
    expect(names).toContain('refinery/VarianceExplorer.jsx');
  });
  it('finds the supply (Terminals, Depots & Fuel Supply) panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('supply/TankExplorer.jsx');
    expect(names).toContain('supply/DepotExplorer.jsx');
    expect(names).toContain('supply/PriceExplorer.jsx');
  });
  it('finds the FC8 metering, control valve and storage panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('metering/MeterRunExplorer.jsx');
    expect(names).toContain('metering/ChokingExplorer.jsx');
    expect(names).toContain('metering/VentingExplorer.jsx');
    expect(names).toContain('metering/WithheldExplorer.jsx');
  });
  it('finds the FC9 corrosion and integrity panels', () => {
    const names = entries.map(([p]) => p.split('/panels/')[1]);
    expect(names).toContain('corrosion/ChemistryExplorer.jsx');
    expect(names).toContain('corrosion/RateExplorer.jsx');
    expect(names).toContain('corrosion/InhibitorIntegrityExplorer.jsx');
  });
  // EVERY MODE, not only the default one. A panel with four views renders one
  // of them with no props, and the other three are exactly where a crash hides:
  // the sweep below mounted eighty panels and touched a quarter of their views.
  it('every FC9 corrosion view renders, not only the default one', async () => {
    const MODES = {
      'corrosion/ChemistryExplorer.jsx': ['fugacity', 'sour', 'ratio', 'absent'],
      'corrosion/RateExplorer.jsx': ['series', 'film', 'ph', 'wetting'],
      'corrosion/InhibitorIntegrityExplorer.jsx': ['programme', 'shear', 'allowance', 'binding'],
    };
    let rendered = 0;
    for (const [name, modes] of Object.entries(MODES)) {
      const entry = entries.find(([p]) => p.endsWith(`/${name}`));
      expect(entry, `${name} is not in the panel sweep`).toBeTruthy();
      const mod = await entry[1]();
      expect(mod.MODES.map((m) => m[0]), `${name} declares different modes`).toEqual(modes);
      for (const mode of modes) {
        expect(
          () => renderToStaticMarkup(React.createElement(mod.default, { initialMode: mode })),
          `${name} in the ${mode} view`,
        ).not.toThrow();
        rendered += 1;
      }
    }
    expect(rendered).toBe(12);
  });
  for (const [path, load] of entries) {
    it(path.split('/panels/')[1], async () => {
      const mod = await load();
      const Panel = mod.default;
      expect(Panel, `${path} has no default export`).toBeTruthy();
      expect(() => renderToStaticMarkup(React.createElement(Panel))).not.toThrow();
    });
  }
});
