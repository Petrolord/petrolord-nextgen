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
  for (const [path, load] of entries) {
    it(path.split('/panels/')[1], async () => {
      const mod = await load();
      const Panel = mod.default;
      expect(Panel, `${path} has no default export`).toBeTruthy();
      expect(() => renderToStaticMarkup(React.createElement(Panel))).not.toThrow();
    });
  }
});
