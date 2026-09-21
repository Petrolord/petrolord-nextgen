// RECON probes P1 to P14 (findings F2 to F7): each line one engine call, printed as JSON.
const E = `${process.env.MD_ENGINES || '/root/wt-et-carbon-nextgen/packages/engines'}/engines/downstream`;
const CA = await import(`${E}/carbonAbatement.js`); const EE = await import(`${E}/energyEfficiency.js`);
const j=(x)=>JSON.stringify(x);
// P1 errored measure silently dropped from the curve
const ok=CA.abatementCost({label:'A',capitalCost:1000,tonnesAbatedPerYear:100,lifeYears:5,discountRate:0.1,annualSavings:0});
const bad=CA.abatementCost({label:'B',capitalCost:'',tonnesAbatedPerYear:500,lifeYears:5,discountRate:0.1});
const cv=CA.abatementCurve({measures:[ok,bad],targetTonnes:400});
console.log('P1', j({total:cv.totalAbatementTonnes,steps:cv.steps.length,meets:cv.meetsTarget,residual:cv.residualToTargetTonnes,keys:Object.keys(cv).filter(k=>/refus|drop|error|skip|invalid/i.test(k))}));
// P2 negative activity in an emission line
const f=CA.makeFactor({label:'x',value:2,unit:'t/t',gas:'CO2',source:'s',version:'1'});
const g=CA.makeGwpSet({label:'AR6',values:{CH4:29.8}});
const ln=CA.emissionLine({label:'neg',activity:-100,factor:f,gwpSet:g});
const inv=CA.buildInventory({lines:[ln],gwpSet:g});
console.log('P2', j({t:ln.tCo2e,blocked:ln.blockedBy,total:inv.totalTonnes,reportable:inv.reportable}));
// P3 negative GWP accepted
console.log('P3', j(CA.makeGwpSet({label:'x',values:{CH4:-5}})));
// P4 lowercase basis
const st=EE.combustionStoichiometry({components:EE.FUEL_REFERENCE.filter(r=>r.code==='CH4').map(r=>({...r,moleFraction:1,lhvMJKmol:r.typicalLhvMJKmol,hhvMJKmol:r.typicalHhvMJKmol}))});
const ea=EE.excessAirFromFlueOxygen({stoichiometry:st,dryO2Percent:3});
const base={stoichiometry:st,excessAir:ea,stackTempC:200,combustionAirTempC:25,flueGasCpKJkgK:1.1,waterVapourCpKJkgK:1.95,waterLatentHeatKJkg:2442,radiationLossPercent:1.5};
const a=EE.stackLossEfficiency({...base,basis:'HHV'}), b=EE.stackLossEfficiency({...base,basis:'hhv'}), c=EE.stackLossEfficiency({...base,basis:'LHV'});
console.log('P4', j({HHV:a.efficiencyPercent,hhv:b.efficiencyPercent,hhvBasisLabel:b.basis,LHV:c.efficiencyPercent}));
// P5 blank unburned loss / negative radiation
console.log('P5', j({blankUnburned:EE.stackLossEfficiency({...base,basis:'LHV',unburnedLossPercent:''}).efficiencyPercent,negRad:EE.stackLossEfficiency({...base,basis:'LHV',radiationLossPercent:-3}).efficiencyPercent}));
// P6 condensate target below current
console.log('P6', j(CA && EE.condensateReturnValue({steamTonnesPerHour:20,currentReturnFraction:0.7,targetReturnFraction:0.4,condensateTempC:90,makeupTempC:25,boilerEfficiencyFraction:0.85,fuelCostPerGJ:8,waterCostPerTonne:0.6,treatmentCostPerTonne:1.2,hoursPerYear:8760})).slice(0,300));
// P7 trap at low pressure still "choked"
const t=EE.steamTrapLoss({orificeDiameterMm:3,upstreamPressureBarA:1.2,dischargeCoefficient:0.7,steamDensityKgM3:0.7,specificHeatRatio:1.135,hoursPerYear:8760});
console.log('P7', j({choked:t.choked,kgh:t.kgPerHour}));
// P8 path over-abated
const p=CA.decarbonisationPath({baselineTonnes:1000,measures:[{label:'x',tonnesAbatedPerYear:1500,startYear:2026}],startYear:2026,endYear:2027,targetByYear:{2027:700}});
console.log('P8', j(p.rows.map(r=>[r.year,r.emissionsTonnes])));
// P9 abatementCost fractional/zero life with capex 0 & tonnes 0
console.log('P9', j(CA.abatementCost({label:'z',capitalCost:0,tonnesAbatedPerYear:0,annualSavings:5})));
// P10 intensity on a non-reportable inventory
console.log('P10', j(CA.carbonIntensity({inventory:inv,denominatorValue:10,denominatorUnit:'t',boundaryLabel:'site'})).slice(0,200));
// P11 excessAirSaving target efficiency lower than current (target O2 above current)
// P12 priceSaving capex=0
console.log('P12', j(EE.priceSaving({energySavedGJ:1000,fuelCostPerGJ:8,emissionFactorKgCo2ePerGJ:56,implementationCost:0})));
// P13 combustion with omitted eta and DE of 1 -> unburnedNote null
console.log('P13', j(CA.combustionCo2FromCarbon({fuelKmolPerYear:1000,carbonPerKmolFuel:1})));
// P14 emissionLine scope '3'
console.log('P14', j(CA.buildInventory({lines:[CA.emissionLine({label:'s3',scope:3,activity:1,factor:f,gwpSet:g})],gwpSet:g}).blockedLines));
