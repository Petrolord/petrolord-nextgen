// Rule 4 sweep: every relational claim in digest.txt, checked against the engine.
const ROOT='/root/wt-fc4-nextgen/packages/engines';
const G=await import(`${ROOT}/engines/facilities/gasProcessing.js`);
const F=await import('/root/fc-wip-gasprocessing/fc4_fields.mjs');
const fs=await import('fs');
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
// C3 S8: "Every ratio is one to twelve decimals"
{const r=[]; GOLD.teg.forEach(row=>{const e=G.tegPackage(row);
 r.push(e.waterLbDay/row.waterLbDay,e.circGpm/row.circGpm,e.dutyBtuPerGal/row.dutyBtuPerGal,e.reboilerMMBtuHr/row.reboilerMMBtuHr,e.btexLbDay/row.btexLbDay);});
 ck('S8 every TEG engine/golden ratio rounds to 1.000000000000', r.every(x=>x.toFixed(12)==='1.000000000000'), `worst dev ${Math.max(...r.map(x=>Math.abs(x-1))).toExponential(3)}`);}
// C4 S10: amine ratios
{const r=[]; [['MDEA',0],['DEA',1]].forEach(([id,i])=>{const row=GOLD.amine[i];const e=G.aminePackage({...row,amineId:id});
 r.push(e.circGpm/row.circGpm,e.reboilerMMBtuHr/row.reboilerMMBtuHr);});
 ck('S10 every amine engine/golden ratio rounds to 1.000000000000', r.every(x=>x.toFixed(12)==='1.000000000000'), `worst dev ${Math.max(...r.map(x=>Math.abs(x-1))).toExponential(3)}`);}
// C5 S12: contactor ratios
{const r=GOLD.contactor.map(row=>G.contactorDiameter(row).diameterFt/row.diameterFt);
 ck('S12 every contactor engine/golden ratio rounds to 1.000000000000', r.every(x=>x.toFixed(12)==='1.000000000000'), `worst dev ${Math.max(...r.map(x=>Math.abs(x-1))).toExponential(3)}`);}
// C6 S17: the two INDEPENDENT routes must NOT agree to twelve decimals
{const w=Math.max(...GOLD.water.map(row=>Math.abs(G.saturatedWaterContent(row).lbPerMMscf/row.lbPerMMscf-1)));
 const k=Math.max(...GOLD.kremser.map(row=>Math.abs(G.kremserFractionRemoved(row)/row.fractionRemoved-1)));
 ck('S17 the water route does NOT agree to twelve decimals (it is independent)', w>1e-12, `worst ${w.toExponential(3)}`);
 ck('S17 the water gap is inside the gate tolerance of 1e-2', w<1e-2, `worst ${w.toExponential(3)}`);
 ck('S17 the Kremser route agrees far more closely than the water route', k<w, `kremser ${k.toExponential(3)} vs water ${w.toExponential(3)}`);}
// C7 S9: continuity at unity
{const at=G.kremserFractionRemoved({absorptionFactor:1,stages:12});
 const under=G.kremserFractionRemoved({absorptionFactor:1-1e-9,stages:12});
 const over=G.kremserFractionRemoved({absorptionFactor:1+1e-9,stages:12});
 ck('S9 the unity branch is continuous with both sides to 8 decimals', Math.abs(under-at)<1e-8&&Math.abs(over-at)<1e-8, `under-at ${(under-at).toExponential(2)} over-at ${(over-at).toExponential(2)}`);
 const gaps=[0.6,0.8,0.95].map(a=>G.kremserFractionRemoved({absorptionFactor:a,stages:200})-a);
 ck('S9 below unity 200 stages never pass the absorption factor', gaps.every(g=>g<=0), gaps.map(g=>g.toExponential(2)).join(' '));
 ck('S9 the gap is exactly zero at the lower factors and nonzero only near one', gaps[0]===0&&gaps[1]===0&&gaps[2]!==0, gaps.map(g=>g.toExponential(2)).join(' '));
 const above=[1,1+1e-9,1.2].map(a=>G.kremserFractionRemoved({absorptionFactor:a,stages:200})-a);
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
// C11 S4: the boiling point comparison
{const v=G.waterSatPsia(212)/14.6959487755142;
 ck('S4 the fit reads ABOVE the standard atmosphere at 212 degF', v>1, `ratio ${v.toFixed(6)}`);}
// C12 S2: the two-density claim
{ck('S2 the contactor liquid is DENSER than the default glycol input', 69.9>9.3*1728/231, `69.9 vs ${(9.3*1728/231).toFixed(6)}`);}
console.log(`\n${bad===0?'ALL CLAIMS HOLD':bad+' CLAIM(S) FAILED'}`);
process.exit(bad?1:0);
