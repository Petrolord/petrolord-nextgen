import { register } from 'node:module';
register('/root/qi-wip-qi/qi_loader.mjs', import.meta.url);
const { LAB: L } = await import('/root/qi-wip-qi/qi_engine.mjs');
const { usabilityMatrix, suggestedIssues } = await import('@suite/pages/apps/QIStudio/services/usability.js');
const AV = await import('@petrolord/engines/engines/rockphysics/avo.js');
const P = L.PACK; const h = P.headers['Ekene-1'];
const mk = (name, { curves = h.curves, cs = h.checkshots, kb = h.kb_m, sv = h.surveyStations } = {}) => ({
  well: { id: name, name, kb_m: kb, checkshots: Array.from({ length: cs }, (_, i) => ({ i })), deviation: Array.from({ length: sv }, (_, i) => ({ i })) },
  logs: curves.map((c) => ({ mnemonic: c, start_md_m: h.start_m, stop_md_m: h.stop_m })),
  zones: [{ name: 'Ekene Sand', top_md_m: h.ekeneTop_m, base_md_m: h.ekeneBase_m }] });
const show = (label, w) => { const m = usabilityMatrix([w], ['Ekene Sand']); const c = m.rows[0].cells[0]; const iss = suggestedIssues(m); console.log(label, c.grade, JSON.stringify(Object.fromEntries(c.items.map(i => [i.key, i.grade]))), iss.map(i => i.area + ':' + i.severity).join(',')); };
console.log('Ekene-1 curves', h.curves);
show('E1 as is', mk('E1'));
show('E1 +PHIT/VSH/SW', mk('E1p', { curves: [...h.curves, 'PHIT', 'VSH', 'SW'] }));
show('new no shear', mk('N', { curves: [...h.curves.filter(c => c !== 'DTS'), 'PHIT', 'VSH', 'SW'] }));
show('1 checkshot + no kb', mk('C', { curves: [...h.curves, 'PHIT', 'VSH', 'SW'], cs: 1, kb: null }));
show('1 checkshot', mk('C1', { cs: 1 }));
{ const w = mk('U', { curves: [...h.curves, 'PHIT', 'VSH', 'SW'], cs: 1, kb: null }); w.well.depth_ref_elev_m = null; w.well.depth_ref_kind = null; show('1 cs + unset elev (columns)', w); }
show('no survey', mk('S0', { sv: 0 }));
console.log('class of (0.000627,-0.001871):', AV.avoClass(0.000627, -0.001871), ' (0.170742,-0.563558):', AV.avoClass(0.170742,-0.563558), ' (-0.05,0.1):', AV.avoClass(-0.05, 0.1));
