// EVERY H2 PANEL VIEW RENDERS, not only the default one. The shared
// panelRender.test.jsx mounts every *Explorer.jsx with no props, which reaches
// one view of four; a crash hides in the other three. This file mounts all
// twelve and asserts each panel declares exactly the views it is tested in.
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import * as Noise from './NoiseDosimeterExplorer.jsx';
import * as Protection from './ProtectionChemicalsExplorer.jsx';
import * as Heat from './HeatStressExplorer.jsx';

const PANELS = [
  ['NoiseDosimeterExplorer', Noise, ['criteria', 'tables', 'lex', 'shift']],
  ['ProtectionChemicalsExplorer', Protection, ['protectors', 'averages', 'mixture', 'reduction']],
  ['HeatStressExplorer', Heat, ['wbgt', 'limits', 'evidence', 'errata']],
];

describe('every H2 panel view renders, and renders its numbers', () => {
  let rendered = 0;
  PANELS.forEach(([name, mod, modes]) => {
    it(`${name} declares the views this test mounts`, () => {
      expect(mod.MODES.map((m) => m[0])).toEqual(modes);
    });
    modes.forEach((mode) => {
      it(`${name} in the ${mode} view renders numbers and no failure note`, () => {
        const html = renderToStaticMarkup(React.createElement(mod.default, { initialMode: mode }));
        rendered += 1;
        expect(html).not.toMatch(/did not return/);
        expect((html.match(/\d+\.\d{6}/g) || []).length, `${name} ${mode} prints too few figures`).toBeGreaterThan(8);
      });
    });
  });
  it('mounted all twelve views', () => {
    expect(rendered).toBe(12);
  });
});
