// Rule 4 sweep: every relational claim in digest.txt, checked against the engine.
const ROOT='/root/wt-fc4-nextgen/packages/engines';
const G=await import(`${ROOT}/engines/facilities/gasProcessing.js`);
const F=await import('/root/fc-wip-gasprocessing/fc4_fields.mjs');
const fsmod=(await import('node:fs')).default;
const fs=fsmod;
const DIGEST_TEXT=fs.readFileSync('/root/fc-wip-gasprocessing/digest.txt','utf8');
const GOLD=JSON.parse(fs.readFileSync(`${ROOT}/test-data/facilities/goldens/gasprocessing_cases.json`,'utf8'));
const OB_SAT=G.saturatedWaterContent(F.OBIAFU_LINE);
const teg=(o)=>G.tegPackage({...F.OBIAFU,inletLbMMscf:OB_SAT.lbPerMMscf,...o});
let bad=0; const ck=(claim,ok,detail)=>{ if(!ok) bad++; console.log(`${ok?'OK  ':'FAIL'}  ${claim}${detail?'  ['+detail+']':''}`); };

// C1 S5: "The last column does not move down that table" (duty per gal vs rate)
{const v=F.OBIAFU_RATE_SWEEP.map(q=>teg({gasMMscfd:q}).dutyBtuPerGal);
 ck('S5 duty per gallon is identical at every rate', v.every(x=>x===v[0]), `min=${Math.min(...v)} max=${Math.max(...v)}`);}
// C2 S6: "the Btu a gallon falls while the MMBtu an hour rises"
{const rows=F.OBIAFU_RATIO_SWEEP.map(c=>teg({circulationGalPerLb:c}));
 const duty=rows.map(r=>r.dutyBtuPerGal), reb=rows.map(r=>r.reboilerMMBtuHr);
 const dtyFalls=duty.every((x,i)=>i===0||x<duty[i-1]);
 const rebRises=reb.every((x,i)=>i===0||x>reb[i-1]);
 ck('S6 duty per gallon falls monotonically as the ratio rises', dtyFalls, `${duty[0].toFixed(2)} -> ${duty.at(-1).toFixed(2)}`);
 ck('S6 reboiler MMBtu/hr rises monotonically as the ratio rises', rebRises, `${reb[0].toFixed(4)} -> ${reb.at(-1).toFixed(4)}`);
 const sens=rows.map(r=>r.sensiblePerGal), vap=rows.map(r=>r.vaporPerGal);
 ck('S6 sensible per gallon is the SAME at every ratio', sens.every(x=>x===sens[0]), `${sens[0]}`);
 ck('S6 overhead per gallon falls as the ratio rises', vap.every((x,i)=>i===0||x<vap[i-1]), `${vap[0].toFixed(2)} -> ${vap.at(-1).toFixed(2)}`);}
// C3/C4/C5: the golden ratios are NO LONGER one, and that is the claim.
// Every quantity that passes through the standard molar volume carries the
// gap between the engine's field-unit gas constant and the oracle's SI one;
// every quantity that does not, carries none of it. The digest asserts the
// molar rows all carry ONE number and the mass rows none, so both halves of
// that are checked here.
{const molar=[],mass=[];
 GOLD.teg.forEach(row=>{const r=G.tegPackage(row);
   mass.push(r.waterLbDay/row.waterLbDay, r.circGpm/row.circGpm, r.dutyBtuPerGal/row.dutyBtuPerGal, r.reboilerMMBtuHr/row.reboilerMMBtuHr);
   molar.push(r.btexLbDay/row.btexLbDay);});
 ['MDEA','DEA','MEA'].forEach((id,i)=>{const row=GOLD.amine[i];const r=G.aminePackage({...row,amineId:id});
   molar.push(r.acidMolesDay/row.acidMolesDay, r.circGpm/row.circGpm, r.reboilerMMBtuHr/row.reboilerMMBtuHr);});
 const LIQ=[G.TEG_LB_PER_FT3,G.TEG_LB_PER_FT3,G.amineSolutionLbPerFt3('MDEA')];
 GOLD.contactor.forEach((row,i)=>{const r=i<3?G.contactorDiameter({...row,rhoLLbFt3:LIQ[i]})
   :G.contactorDiameter({gasMMscfd:row.gasMMscfd,pPsia:row.pPsia,tF:row.tF,gasSg:row.gasSg,ksFtS:row.ksFtS});
   molar.push(r.rhoG/row.rhoG); mass.push(r.qActFt3S/row.qActFt3S);});
 const spread=Math.max(...molar)-Math.min(...molar);
 ck('S17 every molar row carries the same ratio to the last bit', spread<1e-15, `${molar.length} molar rows, spread ${spread.toExponential(3)}`);
 ck('S17 that one ratio is NOT one, which is what says the route is independent', molar[0]!==1, `signature ${molar[0].toPrecision(15)}`);
 ck('S17 no mass row carries the molar signature', mass.every(v=>Math.abs(v-1)<1e-15), `${mass.length} mass rows, worst ${Math.max(...mass.map(v=>Math.abs(v-1))).toExponential(2)}`);
 ck('S8 the TEG mass columns sit at one and the BTEX column does not',
    GOLD.teg.every(row=>{const r=G.tegPackage(row);return r.waterLbDay/row.waterLbDay===1 && r.btexLbDay/row.btexLbDay!==1;}));
 ck('S12 the amine contactor case is sized against an AMINE solution, not glycol',
    Math.abs(G.amineSolutionLbPerFt3('MDEA')-G.TEG_LB_PER_FT3)>1,
    `MDEA solution ${G.amineSolutionLbPerFt3('MDEA').toFixed(3)} vs glycol ${G.TEG_LB_PER_FT3.toFixed(3)} lb/ft3`);
 ck('S12 the last two published contactor cases exercise the branch the app takes',
    GOLD.contactor.slice(3).every(row=>G.contactorDiameter({gasMMscfd:row.gasMMscfd,pPsia:row.pPsia,tF:row.tF,gasSg:row.gasSg,ksFtS:row.ksFtS}).zSource.includes('DAK')));}
// C4 S14: the march, the coefficient and the four-state water table
{const F2=F;
 const mu=G.jouleThomsonFPerPsi({pPsia:F2.AGBADA.p1Psia,tF:F2.AGBADA.tF,gasSg:F2.AGBADA.gasSg,cpBtuLbmolF:F2.AGBADA.cpBtuLbmolF});
 const lo=G.jouleThomsonFPerPsi({pPsia:F2.AGBADA_P_SWEEP[0],tF:F2.AGBADA.tF,gasSg:F2.AGBADA.gasSg,cpBtuLbmolF:F2.AGBADA.cpBtuLbmolF});
 ck('S14 the coefficient does NOT vanish as the pressure falls', lo.muFPerPsi>0.2*mu.muFPerPsi, `at ${F2.AGBADA_P_SWEEP[0]} psia ${lo.muFPerPsi.toFixed(6)} against ${mu.muFPerPsi.toFixed(6)} at ${F2.AGBADA.p1Psia}`);
 const prod=F2.AGBADA_CP_SWEEP.map(cp=>cp*G.jouleThomsonFPerPsi({pPsia:F2.AGBADA.p1Psia,tF:F2.AGBADA.tF,gasSg:F2.AGBADA.gasSg,cpBtuLbmolF:cp}).muFPerPsi);
 ck('S14 the heat capacity times the coefficient does not move', Math.max(...prod)-Math.min(...prod)<1e-12, `spread ${(Math.max(...prod)-Math.min(...prod)).toExponential(2)}`);
 const d=G.jtDrop(F2.AGBADA), ref=G.jtDrop({...F2.AGBADA,steps:F2.AGBADA_STEP_REFERENCE});
 ck('S14 the default 20-step march is within 1e-4 of the converged answer', Math.abs(d.dropF/ref.dropF-1)<1e-4, `${(d.dropF/ref.dropF-1).toExponential(3)}`);
 ck('S14 the inlet coefficient is NOT the mean the cooling delivered', d.muInletFPerPsi!==d.muMeanFPerPsi, `inlet/mean ${(d.muInletFPerPsi/d.muMeanFPerPsi).toFixed(9)}`);
 const wIn=G.saturatedWaterContent({pPsia:F2.AGBADA.p1Psia,tF:F2.AGBADA.tF});
 const wLetDownOnly=G.saturatedWaterContent({pPsia:F2.AGBADA.p2Psia,tF:F2.AGBADA.tF});
 const wCold=G.saturatedWaterContent({pPsia:F2.AGBADA.p2Psia,tF:d.t2F});
 ck('S14 letting down WITHOUT cooling lets the gas hold MORE water', wLetDownOnly.lbPerMMscf>wIn.lbPerMMscf, `${wLetDownOnly.lbPerMMscf.toFixed(3)} against ${wIn.lbPerMMscf.toFixed(3)}`);
 ck('S14 the cold separator gas holds LESS than the inlet gas', wCold.lbPerMMscf<wIn.lbPerMMscf, `${wCold.lbPerMMscf.toFixed(3)} against ${wIn.lbPerMMscf.toFixed(3)}`);
 ck('S14 a deeper let-down still answers, and cools less per psi', !G.jtDrop({...F2.AGBADA,p2Psia:F2.AGBADA_DEEP_P2_PSIA}).error);
 const cold=G.jtDrop({...F2.AGBADA,tF:F2.AGBADA_COLD_INLET_F,p2Psia:F2.AGBADA_COLD_P2_PSIA});
 ck('S14 a COLD inlet kills the march and hands back the step, pressure and temperature it died at',
    !!cold.error && cold.diedAtStep>0 && cold.diedAtPsia>0 && Number.isFinite(cold.diedAtF),
    `died at step ${cold.diedAtStep} of ${cold.steps}`);}
// C5 S4: the three limits on the water answer
{const F2=F;
 ck('S4 the fit REFUSES above its upper edge', !!G.saturatedWaterContent({pPsia:500,tF:F2.FIT_ABOVE_HIGH_EDGE_F}).error);
 ck('S4 the fit ANSWERS at exactly its upper edge', !G.saturatedWaterContent({pPsia:500,tF:F2.FIT_HIGH_EDGE_F}).error);
 ck('S4 a plausible typed gas temperature above the band is refused BY NAME',
    /Magnus/.test(G.saturatedWaterContent({pPsia:950,tF:F2.GAS_ABOVE_FIT_F}).error||''));
 ck('S4 inside the published band there is no note at all',
    G.saturatedWaterContent({pPsia:500,tF:F2.FIT_PUBLISHED_HIGH_EDGE_F}).warning===null);
 ck('S4 just outside the published band the engine answers WITH a note',
    !!G.saturatedWaterContent({pPsia:500,tF:F2.FIT_PUBLISHED_JUST_OVER_F}).warning);}
// C6 S6: the lean strength is not inert, and does not set the spec
{const F2=F;
 const at=(lw)=>G.tegPackage({...F2.OBIAFU,inletLbMMscf:OB_SAT.lbPerMMscf,leanTegWtPct:lw});
 const a=at(99), b=at(95);
 ck('S6 the lean strength MOVES the loop water balance', a.leanWaterLbPerGal!==b.leanWaterLbPerGal && a.richTegWtPct!==b.richTegWtPct,
    `lean water ${a.leanWaterLbPerGal.toFixed(6)} vs ${b.leanWaterLbPerGal.toFixed(6)}`);
 ck('S6 the lean strength does NOT move the circulation or the duty', a.circGpm===b.circGpm && a.dutyBtuPerGal===b.dutyBtuPerGal);
 ck('S6 the engine states the outlet spec is typed', /typed/.test(a.outletSpecBasis||''), a.outletSpecBasis);
 ck('S6 a low enough ratio floods the loop and the engine says so',
    /LEAN strength/.test(G.tegPackage({...F2.OBIAFU,inletLbMMscf:OB_SAT.lbPerMMscf,circulationGalPerLb:F2.RATIO_THAT_FLOODS_THE_LOOP}).warning||''));}
// C8 S1/S10/S19: lean loading, rich loading and the swing are THREE numbers
// sharing no word. A writer met this as an ambiguity and refused to use
// either figure, which was right; this is the check that keeps them apart.
{
 const dig=DIGEST_TEXT.split('\n');
 const r=G.aminePackage(F.UBIE);
 const lean=F.UBIE.leanLoading, rich=r.richLoadingUsed, swing=rich-lean;
 ck('S10 the three loadings are three different numbers', lean!==rich && rich!==swing && lean!==swing,
    `lean ${lean} rich ${rich} swing ${swing}`);
 // Every prose line naming a swing must carry the DIFFERENCE, never a loading.
 const bad=dig.filter(l=>!l.startsWith('|') && /swing (of|to) [0-9]/.test(l))
              .filter(l=>!new RegExp(`swing of ${swing.toFixed(9)}|swing of ${swing}`).test(l));
 ck('S1/S19 no prose line calls a loading a swing', bad.length===0, bad.length? bad[0].slice(0,90):'0 offending lines');
 // The engine returns the rich it used and does NOT return the swing.
 ck('S10 the engine returns richLoadingUsed and returns no swing under any name',
    r.richLoadingUsed===rich && !('swing' in r) && !('loadingSwing' in r));
 ck('S10 the digest names all three before the section uses any of them',
    dig.some(l=>/THREE NAMES, AND THEY ARE THREE DIFFERENT NUMBERS/.test(l)));}
// C9: COUNTED CLAIMS AND DIRECTION CLAIMS ON ORDINARY PROSE LINES.
// Two of these shipped in one rebuild and the kit's heading sweep cannot see
// either, because both sat on a sentence beginning with a lowercase word and
// the kit surfaces only section titles, hash headings and capitalised
// markers. They are checked here, where the digest is read as text.
{
 const D=DIGEST_TEXT.split('\n');
 const WORDS={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12};
 const NOUN=/\b(refusals?|things?|names?|limits?|kinds?|routes?|columns?|items?|bullets?)\b/i;
 const badCounts=[];
 // A COUNTED CLAIM INTRODUCES A BLOCK, and in this digest that means the
 // line ENDS IN A COLON and the number sits directly on its noun. Without
 // both conditions the sweep matches "the last TWO COLUMNS together" and
 // "three amines, and every column", which are five false positives on this
 // file and would have made the check noise a reader learns to scroll past.
 // The word before the number must not be an article or a superlative,
 // which is what separates "four columns of it" from "the last two columns",
 // and the number must sit DIRECTLY on its noun, which is what separates
 // "four columns" from "an absorption factor of one every column climbs".
 const NOT_A_COUNT=/\b(the|last|every|all|these|those|first|same)$/i;
 D.forEach((l,i)=>{
   if(l.startsWith('|')||l.startsWith('#')) return;
   if(!l.trimEnd().endsWith(':')) return;
   const m=new RegExp(`\\b(${Object.keys(WORDS).join('|')})\\s+${NOUN.source}`,'i').exec(l);
   if(!m) return;
   if(NOT_A_COUNT.test(l.slice(0,m.index).trimEnd())) return;
   const claimed=WORDS[m[1].toLowerCase()], noun=m[2].toLowerCase();
   if(/column/.test(noun)){
     const hdr=D.slice(i+1,i+4).find(x=>x.startsWith('| '));
     if(!hdr) return;
     const cols=hdr.split('|').map(x=>x.trim()).filter(Boolean).length-1;
     if(cols!==claimed) badCounts.push(`line ${i+1}: claims ${claimed} ${noun}, table has ${cols}`);
   } else {
     let n=0;
     for(let k=i+1;k<D.length;k++){
       if(D[k].startsWith('- ')) n++;
       else if(n>0) break;
       else if(D[k].trim()==='' ) break;
     }
     if(n>0&&n!==claimed) badCounts.push(`line ${i+1}: claims ${claimed} ${noun}, block has ${n}`);
   }
 });
 ck('every counted claim in the digest matches what follows it', badCounts.length===0, badCounts.length?badCounts.join('; '):'0 miscounts');

 // DIRECTION. A sentence saying one quantity is a COST and another is BOUGHT
 // claims they move in OPPOSITE directions down the table under it. The
 // lean-loading table has every column falling together, because the duty per
 // gallon is a stated input and the duty is therefore the circulation in
 // other units.
 // A cost-and-buy sentence names TWO quantities and claims they move in
 // OPPOSITE directions. The first version of this check compared every
 // monotone column in the table and asked whether they all agreed, which is
 // the wrong question: the first column is the independent variable and the
 // swing is derived from it, so they disagree by construction and the check
 // passed its own founding case. It now finds the two columns the SENTENCE
 // names, by matching its words against the table's own headers, and asks
 // whether those two move the way the sentence says.
 const badDir=[];
 D.forEach((l,i)=>{
   if(!/costs? [^.]*\band buys\b|buys [^.]*\bback\b|costs? [^.]* to reach\b/i.test(l)) return;
   const all=[]; for(let k=i+1;k<D.length;k++){ if(D[k].startsWith('| ')) all.push(D[k]); else if(all.length) break; }
   if(all.length<4) return;
   const head=all[0].split('|').map(x=>x.trim()).filter(Boolean);
   const rows=all.filter((r,idx)=>idx>0 && !/^\| ---/.test(r))
                 .map(r=>r.split('|').map(x=>x.trim()).filter(Boolean));
   const dirOf=(c)=>{const v=rows.map(r=>parseFloat(r[c])); if(v.some(x=>!Number.isFinite(x))) return 0;
     if(v.every((x,k)=>k===0||x>v[k-1])) return 1;
     if(v.every((x,k)=>k===0||x<v[k-1])) return -1; return 0;};
   // Which column does each side of the sentence name?
   const find=(words)=>head.findIndex(h=>words.some(w=>h.toLowerCase().includes(w)));
   const costWords=/costs? ([a-z ]+?) (?:to reach|and buys)/i.exec(l);
   const buyWords=/buys ([a-z ]+?)(?: back|$|,)/i.exec(l);
   if(!costWords||!buyWords) return;
   const ci=find(costWords[1].trim().split(/\s+/).filter(w=>w.length>3));
   const bi=find(buyWords[1].trim().split(/\s+/).filter(w=>w.length>3));
   if(ci<0||bi<0||ci===bi) return;
   const cd=dirOf(ci), bd=dirOf(bi);
   if(cd!==0 && bd!==0 && cd===bd){
     badDir.push(`line ${i+1}: says "${costWords[1].trim()}" is a cost and "${buyWords[1].trim()}" is bought, but columns "${head[ci]}" and "${head[bi]}" both move the same way`);
   }
 });
 ck('no cost-and-buy sentence sits over a table whose columns all move together', badDir.length===0, badDir.length?badDir.join('; '):'0 backwards glosses');

 // And the positive statement the digest now makes in that place, MEASURED.
 const lo=G.aminePackage({...F.UBIE,leanLoading:F.UBIE_LEAN_SWEEP[0]});
 const hi=G.aminePackage({...F.UBIE,leanLoading:F.UBIE_LEAN_SWEEP[F.UBIE_LEAN_SWEEP.length-1]});
 ck('S10 a leaner lean lowers BOTH the circulation and the regenerator duty',
    lo.circGpm<hi.circGpm && lo.reboilerMMBtuHr<hi.reboilerMMBtuHr,
    `gpm ${lo.circGpm.toFixed(3)}<${hi.circGpm.toFixed(3)}, MMBtu/hr ${lo.reboilerMMBtuHr.toFixed(3)}<${hi.reboilerMMBtuHr.toFixed(3)}`);
 const ratios=F.UBIE_LEAN_SWEEP.map(ll=>{const r=G.aminePackage({...F.UBIE,leanLoading:ll});return r.reboilerMMBtuHr/r.circGpm;});
 ck('S10 the duty per gpm does not move with the lean loading, which is why',
    Math.max(...ratios)-Math.min(...ratios)<1e-12, `spread ${(Math.max(...ratios)-Math.min(...ratios)).toExponential(2)}`);
 ck('S10 that ratio IS the stated duty per gallon in other units',
    Math.abs(ratios[0]-(F.UBIE.dutyBtuPerGal*60/1e6))<1e-12, `${ratios[0]} vs ${F.UBIE.dutyBtuPerGal*60/1e6}`);}
// C7 S15: the contract is whole
{ck('S15 kremserFractionRemoved returns an OBJECT carrying an error',
    !!G.kremserFractionRemoved({absorptionFactor:0,stages:5}).error &&
    typeof G.kremserFractionRemoved({absorptionFactor:1.6,stages:6}).fractionRemoved==='number');}
// C6 S17:
// C6 S17: the two INDEPENDENT routes must NOT agree to twelve decimals
{const w=Math.max(...GOLD.water.map(row=>Math.abs(G.saturatedWaterContent(row).lbPerMMscf/row.lbPerMMscf-1)));
 const k=Math.max(...GOLD.kremser.map(row=>Math.abs(G.kremserFractionRemoved(row).fractionRemoved/row.fractionRemoved-1)));
 ck('S17 the water route does NOT agree exactly, which is what independence looks like', w>1e-12, `worst ${w.toExponential(3)}`);
 ck('S17 the water gap is inside the gate tolerance of 1e-2', w<1e-2, `worst ${w.toExponential(3)}`);
 ck('S17 the Kremser route agrees far more closely than the water route', k<w, `kremser ${k.toExponential(3)} vs water ${w.toExponential(3)}`);}
// C7 S9: continuity at unity
{const at=G.kremserFractionRemoved({absorptionFactor:1,stages:12}).fractionRemoved;
 const under=G.kremserFractionRemoved({absorptionFactor:1-1e-9,stages:12}).fractionRemoved;
 const over=G.kremserFractionRemoved({absorptionFactor:1+1e-9,stages:12}).fractionRemoved;
 ck('S9 the unity branch is continuous with both sides to 8 decimals', Math.abs(under-at)<1e-8&&Math.abs(over-at)<1e-8, `under-at ${(under-at).toExponential(2)} over-at ${(over-at).toExponential(2)}`);
 const gaps=[0.6,0.8,0.95].map(a=>G.kremserFractionRemoved({absorptionFactor:a,stages:200}).fractionRemoved-a);
 ck('S9 below unity 200 stages never pass the absorption factor', gaps.every(g=>g<=0), gaps.map(g=>g.toExponential(2)).join(' '));
 ck('S9 the gap is exactly zero at the lower factors and nonzero only near one', gaps[0]===0&&gaps[1]===0&&gaps[2]!==0, gaps.map(g=>g.toExponential(2)).join(' '));
 const above=[1,1+1e-9,1.2].map(a=>G.kremserFractionRemoved({absorptionFactor:a,stages:200}).fractionRemoved-a);
 ck('S9 at and above unity the gap is negative and goes more negative with the factor', above.every(g=>g<0)&&above[2]<above[0], above.map(g=>g.toExponential(2)).join(' '));}
// C8 S13: BTEX linearity
{const a=teg({btexInletPpmv:60,btexAbsorbedFrac:0.1}).btexLbDay, b=teg({btexInletPpmv:180,btexAbsorbedFrac:0.1}).btexLbDay;
 const c=teg({btexInletPpmv:180,btexAbsorbedFrac:0.2}).btexLbDay;
 ck('S13 tripling the ppmv triples the pounds a day', Math.abs(b/a-3)<1e-12, `b/a=${(b/a).toFixed(12)}`);
 ck('S13 doubling the absorbed fraction doubles the pounds a day', Math.abs(c/b-2)<1e-12, `c/b=${(c/b).toFixed(12)}`);}
// C9 S18: "two of them do not know the rate exists"
{const q=[10,250].map(x=>teg({gasMMscfd:x}));
 ck('S18 the duty per gallon is rate independent', q[0].dutyBtuPerGal===q[1].dutyBtuPerGal);
 ck('S18 the saturated water content takes no rate argument at all', !('gasMMscfd' in F.OBIAFU_LINE));}
// C10 S11: the amine ranking claim
{const rows=F.UBIE_AMINE_IDS.map(id=>({id,r:G.aminePackage({gasMMscfd:F.UBIE.gasMMscfd,co2MolPct:F.UBIE.co2MolPct,h2sMolPct:F.UBIE.h2sMolPct,co2SpecMolPct:F.UBIE.co2SpecMolPct,h2sSpecMolPct:F.UBIE.h2sSpecMolPct,amineId:id,leanLoading:F.UBIE.leanLoading})}));
 const byCirc=[...rows].sort((a,b)=>a.r.circGpm-b.r.circGpm).map(x=>x.id);
 const byDuty=[...rows].sort((a,b)=>a.r.reboilerMMBtuHr-b.r.reboilerMMBtuHr).map(x=>x.id);
 const byRatio=[...rows].sort((a,b)=>(a.r.reboilerMMBtuHr/a.r.circGpm)-(b.r.reboilerMMBtuHr/b.r.circGpm)).map(x=>x.id);
 console.log(`      circulation order (low to high): ${byCirc.join(' < ')}`);
 console.log(`      duty order        (low to high): ${byDuty.join(' < ')}`);
 console.log(`      MMBtu/hr per gpm  (low to high): ${byRatio.join(' < ')}`);
 rows.forEach(x=>console.log(`      ${x.id}: gpm ${x.r.circGpm.toFixed(3)}  MMBtu/hr ${x.r.reboilerMMBtuHr.toFixed(3)}  per gpm ${(x.r.reboilerMMBtuHr/x.r.circGpm).toFixed(6)}`));
 ck('S11 all three orderings are the SAME ordering', byCirc.join()===byDuty.join()&&byDuty.join()===byRatio.join(), byCirc.join('<'));
 const same=rows.every(x=>Math.abs(x.r.reboilerMMBtuHr/x.r.circGpm - G.amineOf(x.id).heatBtuPerGal*60/1e6)<1e-12);
 ck('S11 the per-gpm column IS the table duty times 60 over a million', same);
 const cr=[[0,2],[1,2],[0,1]].map(([i,j])=>rows[i].r.circGpm/rows[j].r.circGpm);
 const dr=[[0,2],[1,2],[0,1]].map(([i,j])=>rows[i].r.reboilerMMBtuHr/rows[j].r.reboilerMMBtuHr);
 ck('S11 the circulation ratios and the duty ratios are NOT equal pairwise', cr.every((x,i)=>Math.abs(x-dr[i])>1e-6), cr.map((x,i)=>`${x.toFixed(4)} vs ${dr[i].toFixed(4)}`).join('; '));}
// C12 S2: the two-density claim
{ck('S2 the contactor liquid is DENSER than the default glycol input', 69.9>9.3*1728/231, `69.9 vs ${(9.3*1728/231).toFixed(6)}`);}
console.log(`\n${bad===0?'ALL CLAIMS HOLD':bad+' CLAIM(S) FAILED'}`);
process.exit(bad?1:0);
