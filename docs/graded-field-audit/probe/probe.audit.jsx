/* global process */
// B5 PROBE (audit harness, not a product test). Drives every course panel in a
// real DOM: renders it, then replays every <select> option and every button,
// one and two actions deep, and records every number the learner can SEE,
// with the precision it is printed at. Output: $B5_OUT/<course>.json.
//
// Run it on its own config, never in CI (an audit harness, not a product test):
//   npm i --prefix /tmp/b5jsdom jsdom          (once; jsdom is not a repo dependency)
//   B5_JSDOM=/tmp/b5jsdom/node_modules/jsdom/lib/api.js B5_OUT=/root/b5/probe \
//   B5_COURSES=carbon,dca npx vitest run --config docs/graded-field-audit/probe/vitest.probe.config.js
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
const { JSDOM } = await import(process.env.B5_JSDOM || '/root/b5/harness/node_modules/jsdom/lib/api.js');

const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true, url: 'http://localhost/' });
const w = dom.window;
for (const k of Object.getOwnPropertyNames(w)) {
  if (k in globalThis) continue;
  try { globalThis[k] = w[k]; } catch { /* read-only */ }
}
globalThis.window = w; globalThis.document = w.document; globalThis.navigator = w.navigator;
globalThis.HTMLElement = w.HTMLElement; globalThis.Element = w.Element; globalThis.Node = w.Node;
globalThis.getComputedStyle = w.getComputedStyle.bind(w);
class RO { observe() {} unobserve() {} disconnect() {} }
globalThis.ResizeObserver = RO; w.ResizeObserver = RO;
w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
w.HTMLCanvasElement.prototype.getContext = () => null;
w.scrollTo = () => {};
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const OUT = process.env.B5_OUT || '/root/b5/probe';
const ONLY = (process.env.B5_COURSES || '').split(',').filter(Boolean);
const CAP = Number(process.env.B5_CAP || 250);

const panels = {
  ...import.meta.glob('/src/components/course/panels/**/*Explorer.jsx'),
  ...import.meta.glob('/src/components/course/panels/**/*Lab.jsx'),
};

const NUM = /[-−]?\d{1,3}(?:,\d{3})+(?:\.\d+)?(?:[eE][-+]?\d+)?|[-−]?\d*\.?\d+(?:[eE][-+]?\d+)?/g;

function harvest(text, sink, state) {
  for (const m of text.matchAll(NUM)) {
    const raw = m[0];
    if (sink.has(raw)) continue;
    const s = Math.max(0, m.index - 60);
    sink.set(raw, { ctx: text.slice(s, m.index + raw.length + 40).replace(/\s+/g, ' '), state });
  }
}

describe('b5 probe', () => {
  it('probes panels', async () => {
    const { render, cleanup, fireEvent, act } = await import('@testing-library/react');
    const React = (await import('react')).default;
    fs.mkdirSync(OUT, { recursive: true });
    const byCourse = {};
    for (const [p, load] of Object.entries(panels)) {
      const course = p.split('/panels/')[1].split('/')[0];
      if (ONLY.length && !ONLY.includes(course)) continue;
      (byCourse[course] ||= []).push([p, load]);
    }
    for (const [course, list] of Object.entries(byCourse)) {
      const result = {};
      for (const [p, load] of list) {
        const name = p.split('/panels/')[1];
        const sink = new Map();
        let renders = 0; let errors = 0;
        let Comp;
        try { Comp = (await load()).default; } catch (e) { result[name] = { error: String(e).slice(0, 200) }; continue; }
        const mount = () => render(React.createElement(Comp));
        const listActions = (c) => {
          const acts = [];
          c.querySelectorAll('select').forEach((sel, i) => {
            [...sel.options].forEach((o) => acts.push({ t: 's', i, v: o.value, label: o.textContent.slice(0, 40) }));
          });
          c.querySelectorAll('button').forEach((b, i) => acts.push({ t: 'b', i, label: (b.textContent || '').slice(0, 40) }));
          return acts;
        };
        const apply = (c, a) => {
          if (a.t === 's') { const el = c.querySelectorAll('select')[a.i]; if (el) fireEvent.change(el, { target: { value: a.v } }); }
          else { const el = c.querySelectorAll('button')[a.i]; if (el) fireEvent.click(el); }
        };
        const visit = (seq) => {
          if (renders >= CAP) return null;
          renders += 1;
          let acts = null;
          try {
            const { container } = mount();
            for (const a of seq) act(() => apply(container, a));
            const txt = container.textContent || '';
            const vals = [...container.querySelectorAll('input')].map((x) => x.value).join(' | ');
            harvest(txt + ' | ' + vals, sink, seq.map((a) => a.label).join(' > '));
            acts = listActions(container);
          } catch (e) { errors += 1; }
          cleanup();
          return acts;
        };
        const first = visit([]) || [];
        for (const a of first) {
          const second = visit([a]);
          if (!second) continue;
          if (a.t === 's' || /preset|case|well|dataset|field|scenario/i.test(a.label)) {
            for (const b of second) { if (renders >= CAP) break; visit([a, b]); }
          }
        }
        result[name] = { renders, errors, numbers: Object.fromEntries(sink) };
      }
      fs.writeFileSync(path.join(OUT, `${course}.json`), JSON.stringify(result));
    }
    expect(true).toBe(true);
  }, 3_600_000);
});
