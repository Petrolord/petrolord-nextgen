// QI course teaching pack: the kit's petrophysical interpretation curves at the wells (kit v3 wells,
// byte-identical in v4 per __tests__/fixtures/ekene-v3-wells.sha256.json). Written to stdout as JSON.
import { buildKit } from './build.mjs';
import { LOCKED, OBORO } from './spine.mjs';
const kit = buildKit();
const out = { generator: 'tools/demo-dataset buildKit()', owc_m: LOCKED.owc_m, gwc_m: OBORO.gwc_m, wells: {} , fluids: {} };
for (const name of ['Ekene-1', 'Ekene-2', 'Ekene-3', 'Ekene-4', 'Ekene-9']) {
  const b = kit.built.find((x) => x.well.name === name);
  const rows = b.rows.filter((r) => r.md >= 1440 && r.md <= 1700);
  out.wells[name] = rows.map((r) => [Number(r.md.toFixed(4)), r.layerKey, r.phit, r.vsh, r.sw]);
}
for (const [k, f] of Object.entries(kit.fluids)) out.fluids[k] = JSON.parse(JSON.stringify(f));
process.stdout.write(JSON.stringify(out));
