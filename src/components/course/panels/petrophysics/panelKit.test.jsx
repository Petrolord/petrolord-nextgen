// The shared panel kit is used by every course. Nothing rendered it until a
// DR10 panel author server-rendered a DR9 panel to check it for stray dashes
// and watched it throw instead.
//
// SelectField destructured its options as `([v, l])`, the array-pair form.
// Array-destructuring an object throws "object is not iterable", so every
// panel passing `{ value, label }` crashed the moment its select rendered.
// Eight call sites across five panels were doing that, in Drilling Hydraulics,
// Geomechanics and Perforation & Sand Control. All three courses are seeded
// and all three are held from go-live, so no learner had reached one yet, and
// the very next deployment would have shipped them.
//
// The lesson is narrow and worth keeping: a shared UI component with two
// caller conventions has to accept both or reject one loudly. A gate suite
// that never RENDERS a component cannot see a render-time crash, however many
// numbers it pins.

import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { SelectField, NumField, Tile, TileGrid, Note, PanelShell } from './panelKit';

const render = (el) => renderToStaticMarkup(el);

describe('SelectField accepts both option shapes', () => {
  it('renders the array-pair form', () => {
    const html = render(
      <SelectField label="Gun" value="a" onChange={() => {}}
        options={[['a', 'Alpha'], ['b', 'Beta']]} />,
    );
    expect(html).toContain('value="a"');
    expect(html).toContain('Alpha');
    expect(html).toContain('Beta');
    expect((html.match(/<option/g) || []).length).toBe(2);
  });

  it('renders the object form, which used to throw', () => {
    const html = render(
      <SelectField label="Gun" value="a" onChange={() => {}}
        options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]} />,
    );
    expect(html).toContain('value="a"');
    expect(html).toContain('Alpha');
    expect(html).toContain('Beta');
    expect((html.match(/<option/g) || []).length).toBe(2);
  });

  it('the two shapes produce identical markup', () => {
    const pairs = render(
      <SelectField label="X" value="a" onChange={() => {}}
        options={[['a', 'Alpha'], ['b', 'Beta']]} />,
    );
    const objects = render(
      <SelectField label="X" value="a" onChange={() => {}}
        options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]} />,
    );
    expect(objects).toBe(pairs);
  });

  it('falls back to the value when a label is missing, in either shape', () => {
    expect(render(<SelectField label="X" value="a" onChange={() => {}} options={[['a']]} />))
      .toContain('>a</option>');
    expect(render(<SelectField label="X" value="a" onChange={() => {}} options={[{ value: 'a' }]} />))
      .toContain('>a</option>');
  });

  it('renders nothing rather than throwing when options are absent', () => {
    expect(() => render(<SelectField label="X" value="" onChange={() => {}} />)).not.toThrow();
  });
});

describe('the rest of the kit renders', () => {
  it('NumField, Tile, TileGrid, Note and PanelShell', () => {
    expect(render(<NumField label="Rate" value="" onChange={() => {}} placeholder="0.05" />)).toContain('Rate');
    expect(render(<Tile label="Skin" value="-1.23" unit="" />)).toContain('Skin');
    expect(render(<TileGrid><Tile label="A" value="1" /></TileGrid>)).toContain('A');
    expect(render(<Note>Careful.</Note>)).toContain('Careful.');
    expect(render(<PanelShell title="T"><span>body</span></PanelShell>)).toContain('body');
  });
});
