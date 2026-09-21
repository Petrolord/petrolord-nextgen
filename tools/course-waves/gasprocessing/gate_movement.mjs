// Every graded field, run against the pre-repair engine and the repaired one.
// The claim "this field does not move" is MEASURED here, never reasoned about.
import fs from 'fs';
import { execFileSync } from 'child_process';
const OLD='/tmp/eng-pre', NEW='/root/wt-fc4-nextgen/packages/engines';
fs.mkdirSync(`${OLD}/engines/facilities`,{recursive:true});
fs.mkdirSync(`${OLD}/engines/production`,{recursive:true});
fs.writeFileSync(`${OLD}/package.json`,'{"type":"module"}');
const sh=(p)=>execFileSync('git',['-C','/root/petrolord-engines','show',`709172f:${p}`],{encoding:'utf8',maxBuffer:1e8});
fs.writeFileSync(`${OLD}/engines/facilities/gasProcessing.js`,sh('engines/facilities/gasProcessing.js'));
fs.writeFileSync(`${OLD}/engines/production/gasProperties.js`,sh('engines/production/gasProperties.js'));
const A=await import(`${OLD}/engines/facilities/gasProcessing.js`);
const B=await import(`${NEW}/engines/facilities/gasProcessing.js`);
const F=await import('/root/fc-wip-gasprocessing/fc4_fields_capstone.mjs');
const {IKOT_ABASI_LINE:L,IKOT_ABASI:I,OTUMARA_ABSORBER:OA,OTUMARA_REQUIRED_REMOVAL:OR,OTUMARA:O,OTUMARA_RETUNED_LEAN_LOADING:ORL,ESCRAVOS:E}=F;
const run=(G,kremserIsObject)=>{
  const sat=G.saturatedWaterContent(L);
  const pk=G.tegPackage({...I,inletLbMMscf:sat.lbPerMMscf});
  const kf=G.kremserFractionRemoved(OA);
  const st=G.kremserStagesFor({absorptionFactor:OA.absorptionFactor,fractionRemoved:OR});
  const am=G.aminePackage(O), rt=G.aminePackage({...O,leanLoading:ORL});
  const mu=G.jouleThomsonFPerPsi({pPsia:E.p1Psia,tF:E.tF,gasSg:E.gasSg,cpBtuLbmolF:E.cpBtuLbmolF});
  const dr=G.jtDrop(E);
  const wi=G.saturatedWaterContent({pPsia:E.p1Psia,tF:E.tF});
  const wo=G.saturatedWaterContent({pPsia:E.p2Psia,tF:dr.t2F});
  return {
    'beginner/inletLbMMscf':sat.lbPerMMscf, 'beginner/waterLbDay':pk.waterLbDay,
    'beginner/circGpm':pk.circGpm, 'beginner/circGpd':pk.circGpd,
    'beginner/sensiblePerGal':pk.sensiblePerGal, 'beginner/tegReboilerMMBtuHr':pk.reboilerMMBtuHr,
    'intermediate/fractionRemoved':kremserIsObject?kf.fractionRemoved:kf,
    'intermediate/stagesNeeded':st.stages, 'intermediate/acidMolesDay':am.acidMolesDay,
    'intermediate/circGpm':am.circGpm, 'intermediate/reboilerMMBtuHr':am.reboilerMMBtuHr,
    'intermediate/circGpmRetuned':rt.circGpm,
    'advanced/dzdT':mu.dzdT, 'advanced/waterInLbMMscf':wi.lbPerMMscf,
    'advanced/muFPerPsi':mu.muFPerPsi, 'advanced/dropF':dr.dropF,
    'advanced/t2F':dr.t2F, 'advanced/waterOutLbMMscf':wo.lbPerMMscf,
  };
};
const {STABLE}=await import('/root/fc-wip-gasprocessing/fc4_capstone.mjs');
const BASE = 379.49 / B.LBMOL_SCF;          // the standard-base factor, measured
const CAUSE = {
  base: 'the module\'s standard base: a typed 379.49 scf per lbmol became the value derived from the package gas constant at 14.696 psia and 519.67 degR, so every MOLAR quantity moves by the ratio of the two',
  baseMinusSpec: 'the same standard base, AMPLIFIED: the inlet water content moved with it and the outlet spec is typed, so their difference moves by more than either',
  coefficient: 'the Joule-Thomson identity carries no z in the denominator, and the Btu packaging became exact, so the coefficient moves by z times the packaging correction',
  march: 'the coefficient above, compounded with the march taking the half-step TEMPERATURE as well as the half-step pressure, which makes it second order',
  arrival: 'a consequence of the cooling alone: the arrival is a typed inlet temperature minus the cooling, so nothing independent moves it',
  arrivalAndBase: 'two causes multiplied: the arrival temperature moved with the march, and the water content at that temperature moved with the standard base',
};
const EXPECT = {
  'beginner/inletLbMMscf':'base', 'beginner/waterLbDay':'baseMinusSpec',
  'beginner/circGpm':'baseMinusSpec', 'beginner/circGpd':'baseMinusSpec',
  'beginner/tegReboilerMMBtuHr':'baseMinusSpec',
  'intermediate/acidMolesDay':'base', 'intermediate/circGpm':'base',
  'intermediate/reboilerMMBtuHr':'base', 'intermediate/circGpmRetuned':'base',
  'advanced/waterInLbMMscf':'base',
  'advanced/muFPerPsi':'coefficient', 'advanced/dropF':'march',
  'advanced/t2F':'arrival', 'advanced/waterOutLbMMscf':'arrivalAndBase',
};
const a=run(A,false), b=run(B,true);
console.log('field'.padEnd(32),'pre-vendoring'.padStart(22),'now'.padStart(22),'  ratio            cause');
let moved=0, held=0, bad=0;
const heldKeys=[];
for(const k of Object.keys(b)){
  const same = a[k]===b[k];
  if(same){ held++; heldKeys.push(k);
    console.log(k.padEnd(32), String(a[k]).padStart(22), String(b[k]).padStart(22), '  HOLDS');
    if(EXPECT[k]){ console.log(`   MISMATCH: ${k} is listed with a cause but did not move`); bad++; }
    continue; }
  moved++;
  const r=b[k]/a[k];
  const cause=EXPECT[k];
  if(!cause){ console.log(`   UNEXPLAINED MOVEMENT: ${k} moved by ${r} and no cause is declared`); bad++; }
  console.log(k.padEnd(32), String(a[k]).padStart(22), String(b[k]).padStart(22), ' ', r.toPrecision(17), cause||'NONE');
}
// The declared STABLE set must be EXACTLY what held. This is the check that
// catches a stability claim reasoned about instead of measured.
const missing=STABLE.filter(k=>!heldKeys.includes(k));
const extra=heldKeys.filter(k=>!STABLE.includes(k));
if(missing.length){ console.log('  FAIL declared stable but MOVED:', missing.join(', ')); bad+=missing.length; }
if(extra.length){ console.log('  FAIL held but not declared stable:', extra.join(', ')); bad+=extra.length; }
// Every 'base' field must move by exactly the measured base factor.
for(const [k,c] of Object.entries(EXPECT)){
  if(c!=='base') continue;
  const r=b[k]/a[k];
  if(Math.abs(r-BASE)>1e-12){ console.log(`  FAIL ${k} is attributed to the standard base but moved by ${r}, not ${BASE}`); bad++; }
}
console.log(`\ngate_movement: ${moved+held} graded fields measured against the pre-vendoring engine; ${moved} moved, ${held} held; ${Object.keys(EXPECT).length} causes declared; ${Object.keys(CAUSE).length} distinct cause texts; ${bad} finding(s)`);
console.log(`the standard-base factor, measured: ${BASE.toPrecision(17)}`);
if(moved+held!==18){ console.log('  GATE REFUSES: it did not measure all eighteen fields'); process.exit(2); }
process.exit(bad?1:0);
