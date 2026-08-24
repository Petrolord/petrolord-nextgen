# Salinity and gas gravity

Temperature and pressure are the state variables. They describe where the fluid is, and they are the two dials most people think of first. They are also only half the story. The other half is what the fluid is made of, and composition moves these properties as hard as the state variables do. This lesson takes the composition dial on each of the two end member fluids: the salt content of the brine, and the gravity of the gas.

## Brine against salinity

Hold the conditions at the Ekene values of 60 degC and 25 MPa, and change only the dissolved salt.

| salinity (wt%) | rho (kg/m3) | K (GPa) |
| --- | --- | --- |
| 0 | 994.0097 | 2.534420 |
| 3.5 | 1017.8250 | 2.697811 |
| 10 | 1063.6947 | 3.034253 |
| 20 | 1138.4297 | 3.611999 |

The 3.5 wt% row is the Ekene brine. Its salinity is usually written as 35,000 ppm, and the engine takes it as a weight fraction of 0.035, which is the same statement three ways. Learn to move between those forms without thinking, because field data arrives in all three.

Salt raises both numbers, and it raises them monotonically. There is no turning point here of the kind temperature produced. Dissolved ions add mass to the water and they also pull the surrounding water molecules into a tighter arrangement around themselves, so the liquid gets heavier and harder to compress at the same time.

The range in the table is not exotic. Fresh formation water at 0 wt% exists, most producing basins sit well inside this range, and the saltiest brines occur near salt bodies. Across that range the bulk modulus moves from 2.534420 GPa to 3.611999 GPa.

Compare that with the whole temperature sweep of the first lesson, where 20 to 100 degC moved the brine between 2.511437 and 2.697811 GPa. The salinity range moves the answer further than the temperature range does. Composition is not a second order correction sitting on top of the state variables. It is the same size of effect.

There is a trap hiding in that comparison. Fresh brine at 60 degC gives 2.534420 GPa, and Ekene brine at 20 degC gives 2.511437 GPa. Two very different mistakes land on almost the same number. If you only ever check the answer, a salinity error and a temperature error look alike. The defence is to check the inputs and not the output.

## Where a salinity comes from

Salinity is measured, not assumed. A produced water sample sent for analysis is the direct answer. Failing that, the petrophysics course produced formation water resistivity from a Pickett plot or from an SP deflection, and Rw at a known temperature converts to a salinity through standard charts. Nearby wells in the same aquifer are a reasonable fallback, and a regional average from a different aquifer is a guess you should label as one.

The number matters enough to chase. A brine quoted at the wrong salinity fails the capstone tolerance of 0.005 GPa on bulk modulus without coming close.

## Gas against gravity

Now the same treatment for gas, again at 60 degC and 25 MPa.

| gas gravity | rho (kg/m3) | K (MPa) |
| --- | --- | --- |
| 0.6 | 172.6668 | 55.7187 |
| 0.8 | 254.4526 | 73.5316 |
| 1.0 | 337.4248 | 119.8581 |

Gas gravity is the density of the gas relative to air at surface conditions, so it is a compact way of saying what the gas is made of. A gravity of 0.6 is close to dry methane, which is the Ekene case. Raise it toward 0.8 and 1.0 and you are describing a wetter gas carrying more ethane, propane and the heavier components, or a gas with a significant carbon dioxide fraction.

Both columns rise with gravity, and they rise steeply. The density goes from 172.6668 kg/m3 to 337.4248 kg/m3 and the modulus from 55.7187 MPa to 119.8581 MPa. Heavier molecules mean more mass per cubic metre, and they also collide harder under compression, so the gas resists squeezing more.

The consequence is the same as the pressure lesson reached. A rich gas is a less spectacular seismic target than a dry gas at the same depth, because it is both heavier and stiffer, so its contrast against the brine is smaller. Two accumulations at identical depth with identical porosity can look quite different on seismic for no reason other than what the gas is made of.

Gas gravity comes from a gas chromatography analysis in a PVT report, or from a separator sample. When there is no sample at all, 0.6 is a defensible default for a dry gas province, and it should be recorded as a default rather than passed off as data.

## The four dials

You now have all four inputs the Batzle and Wang fluid engine takes for these two fluids: temperature, pressure, salinity for the brine, and gravity for the gas. The live oil adds two more, its stock tank density and its gas oil ratio, which the next lesson takes up.

Every one of them changes the answer by more than the capstone tolerances. None of them is optional. A fluid is only defined once all of them are on the page.

## Exercise

Write down the two composition ranges in this lesson with the bulk modulus at each end, then answer this: two gas discoveries sit at the same depth in the same basin, and one shows a much brighter seismic anomaly than the other. Give one composition reason, using numbers from the table.

As a self check: brine bulk modulus runs from 2.534420 GPa at 0 wt% salt to 3.611999 GPa at 20 wt%, and gas bulk modulus runs from 55.7187 MPa at gravity 0.6 to 119.8581 MPa at gravity 1.0. The composition reason for the difference in brightness is that the dull one may hold a richer gas. At gravity 1.0 the gas is 337.4248 kg/m3 and 119.8581 MPa, against 172.6668 kg/m3 and 55.7187 MPa at gravity 0.6, so it is both heavier and stiffer and therefore a weaker contrast against the brine case. A different brine salinity between the two fields would do something similar from the other side.
