# Live oil

The third fluid is the one people are most likely to get wrong, because the oil in the reservoir is not the oil that arrives at the tank. Between the pore and the tank, gas comes out of solution, and the fluid that is left behind is a different substance with different elastic properties.

## Live and dead

Dead oil is oil with no dissolved gas in it. That is what you have after the oil has been brought to surface and allowed to release its gas, and it is what a sample in an open beaker is.

Live oil is oil at reservoir conditions with gas still dissolved in it. That is what actually occupies the pore space, and it is what a seismic wave passes through. Live oil is what this course means whenever it says oil.

The amount of dissolved gas is the solution gas to oil ratio, the GOR, and the Ekene value is 50 L/L. That is fifty litres of gas, measured at surface conditions, dissolved in every litre of oil. The gas is not present as bubbles. It is in solution, distributed through the liquid, and the mixture behaves as a single phase.

## The three numbers

At 60 degC and 25 MPa, with a surface oil density of 0.85 g/cc, which is about 35 API, and a GOR of 50 L/L, the Batzle and Wang live oil relation returns

| Property | Value |
| --- | --- |
| density | 777.0630099023522 kg/m3 |
| bulk modulus | 1.1427945726905131 GPa |
| compressional velocity | 1212.7072294996883 m/s |

Notice where those sit. The density of 777.0630099023522 kg/m3 is below the brine density of 1017.8249875 kg/m3, which is why oil floats and why there is an oil leg above a water leg at all. The bulk modulus of 1.1427945726905131 GPa is below the brine modulus of 2.6978112899395996 GPa and far above the gas modulus of 55.71865290286663 MPa. Oil sits between the two, closer to brine than to gas.

The velocity of 1212.7072294996883 m/s is the lowest fluid velocity this course quotes, lower than the brine velocity of 1628.0555893189182 m/s, because oil is both lighter and softer than brine and the softness wins.

## What dissolved gas does

Hold the temperature at 60 degC, the pressure at 25 MPa and the surface density at 0.85 g/cc, and move only the GOR.

| GOR (L/L) | Density (kg/m3) | K (GPa) | vp (m/s) |
| --- | --- | --- | --- |
| 0 | 820.9856 | 1.475341 | 1340.5357 |
| 50 | 777.0630 | 1.142795 | 1212.7072 |
| 150 | 693.8631 | 0.715855 | 1015.7240 |

Every column falls as gas goes into solution. Dissolved gas makes the oil lighter and much softer at the same time, and the velocity falls faster than either, because it inherits the softening directly and gets only a partial offset from the reduced density.

The physical picture is worth holding. Gas molecules dissolved among the oil molecules push the liquid structure apart, which lowers the density, and they introduce compressible material into what was a nearly incompressible liquid, which lowers the bulk modulus. The two effects are the same event seen from two sides.

Look at the size of the change. Going from dead oil to the Ekene GOR of 50 L/L takes the modulus from 1.475341 to 1.142795 GPa. Going on to GOR 150 takes it to 0.715855 GPa. A GOR of 150 L/L is not an exotic reservoir, and by that point the oil modulus has moved a long way towards the gas end of the scale.

## Why this is the fluid most often quoted wrongly

Three habits produce the same error.

The first is using a laboratory density from a stock tank sample. That sample is dead, and its surface density of 0.85 g/cc is not the 777.0630099023522 kg/m3 the reservoir holds. The difference goes straight into the rock density and therefore into the impedance.

The second is quoting an oil modulus from a handbook. Handbook oil moduli are usually dead oil values at moderate conditions, and dead oil at these conditions has a bulk modulus of 1.475341 GPa against the live value of 1.142795 GPa.

The third is treating a high GOR oil as though it were a modest one. As the GOR climbs, the live oil moves steadily towards gas-like behaviour, and there comes a point where an oil leg and a gas leg produce seismic responses that are hard to tell apart. A high GOR oil is a genuinely difficult exploration target for exactly this reason, and knowing the GOR before you interpret is the only defence.

## Where oil sits in the ordering

Put the three moduli in order at the Ekene conditions. Brine at 2.6978112899395996 GPa. Live oil at 1.1427945726905131 GPa. Gas at 55.71865290286663 MPa.

Oil is softer than brine, so an oil sand is slower than a wet sand of the same rock, and that difference is real and sometimes visible. But the step from brine to oil is a step within the same order of magnitude, while the step from either of them to gas crosses more than one. That is the shape of the problem, and the next lesson makes it explicit.

## Exercise

Define live oil and dead oil in one sentence each, then state the Ekene live oil density, bulk modulus and velocity with their units. Then answer one question in a sentence. An interpreter uses a dead oil bulk modulus for a reservoir whose real GOR is 50 L/L. In which direction is the resulting rock too stiff or too soft, and by how much does the fluid modulus differ?

Self check: live oil is oil at reservoir conditions with gas still dissolved in it, and dead oil is the same oil after that gas has come out of solution at surface. The Ekene live oil has a density of 777.0630099023522 kg/m3, a bulk modulus of 1.1427945726905131 GPa and a compressional velocity of 1212.7072294996883 m/s. Using the dead oil value means using 1.475341 GPa where 1.142795 GPa is correct, so the pore fluid is treated as stiffer than it is, the modelled rock comes out too fast and too stiff, and the modelled fluid effect on the seismic response is understated.
