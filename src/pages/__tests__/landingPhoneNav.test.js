// The homepage header on phones. The phone rules for .nav-cta and .menu-btn
// once sat above the base rules. A media query adds no specificity, so the
// base rules won, the row stayed 391px wide and the menu button was pushed
// off a 360px screen. These checks pin the order and the shrink rules.
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const CSS = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '..', 'LandingPage.css'), 'utf8');

const strip = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Every `selector{...}` in the sheet, in source order, with the max-width of the media query around it. */
function rulesOf(css) {
  const src = strip(css);
  const out = [];
  let media = null; let depth = 0; let mediaDepth = -1; let i = 0; let start = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === '{') {
      const head = src.slice(start, i).trim();
      if (head.startsWith('@media')) {
        const m = head.match(/max-width:\s*(\d+)px/);
        media = m ? Number(m[1]) : 'other'; mediaDepth = depth;
      } else {
        const end = src.indexOf('}', i);
        out.push({ selector: head.replace(/\s+/g, ' '), body: src.slice(i + 1, end).trim(), media, index: out.length });
        i = end; depth -= 1;
      }
      depth += 1; start = i + 1;
    } else if (ch === '}') {
      depth -= 1; if (depth === mediaDepth) { media = null; mediaDepth = -1; }
      start = i + 1;
    }
    i += 1;
  }
  return out;
}

/** Phone rules (max-width 520 or less) that an equally specific base rule after them overrides. */
function shadowedPhoneRules(css) {
  const rules = rulesOf(css);
  const props = (body) => body.split(';').map((d) => d.split(':')[0].trim()).filter(Boolean);
  const bad = [];
  for (const phone of rules.filter((r) => typeof r.media === 'number' && r.media <= 520)) {
    for (const base of rules.filter((r) => r.media === null && r.selector === phone.selector && r.index > phone.index)) {
      const clash = props(phone.body).filter((p) => props(base.body).includes(p));
      if (clash.length) bad.push(`${phone.selector} @${phone.media}px: ${clash.join(', ')}`);
    }
  }
  return bad;
}

describe('homepage header on phones', () => {
  const rules = rulesOf(CSS);
  const find = (selector, media) => rules.filter((r) => r.selector === selector && r.media === media);

  it('reads the sheet', () => {
    expect(rules.length).toBeGreaterThan(150);
    expect(find('.ng-home .nav-cta', null).length).toBe(1);
  });

  it('no phone rule is overridden by a base rule after it', () => {
    expect(shadowedPhoneRules(CSS)).toEqual([]);
  });

  it('negative control: the old order is reported', () => {
    const old = '.ng-home .a{gap:1px}\n@media (max-width:420px){.ng-home .nav-cta{gap:6px}.ng-home .nav-cta .btn{padding:9px 13px}}\n'
      + '.ng-home .nav-cta{display:flex;gap:18px}\n.ng-home .nav-cta .btn{padding:10px 18px;font-size:14px}\n';
    expect(shadowedPhoneRules(old)).toEqual(['.ng-home .nav-cta @420px: gap', '.ng-home .nav-cta .btn @420px: padding']);
    const fixed = '.ng-home .nav-cta{display:flex;gap:18px}\n@media (max-width:420px){.ng-home .nav-cta{gap:6px}}\n';
    expect(shadowedPhoneRules(fixed)).toEqual([]);
  });

  it('at 420px and below the row tightens and the brand may shrink before anything overflows', () => {
    expect(find('.ng-home .nav', 420)[0].body).toBe('gap:12px');
    expect(find('.ng-home .nav-cta', 420)[0].body).toBe('gap:6px;flex:none');
    expect(find('.ng-home .nav-cta .btn', 420)[0].body).toBe('padding:9px 13px');
    expect(find('.ng-home .brand', 420).map((r) => r.body)).toContain('min-width:0');
    expect(find('.ng-home .brand span:last-child', 420)[0].body).toBe('min-width:0;overflow:hidden;text-overflow:ellipsis');
  });

  it('at 380px and below the button and wordmark step down once more', () => {
    expect(find('.ng-home .nav', 380)[0].body).toBe('gap:8px');
    expect(find('.ng-home .nav-cta .btn', 380)[0].body).toBe('padding:8px 11px;font-size:13px');
    expect(find('.ng-home .brand span', 380)[0].body).toBe('font-size:17px');
  });

  it('the desktop header is untouched', () => {
    expect(find('.ng-home .nav', null)[0].body).toBe('display:flex;align-items:center;justify-content:space-between;gap:24px;height:68px');
    expect(find('.ng-home .nav-cta', null)[0].body).toBe('display:flex;align-items:center;gap:18px;font:500 14px/1 var(--sans)');
    expect(find('.ng-home .nav-cta .btn', null)[0].body).toBe('padding:10px 18px;font-size:14px');
  });
});
