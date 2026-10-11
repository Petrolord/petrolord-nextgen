# The fluids at Ekene conditions

Whether the seismic can see the oil starts with how different oil and brine are as fluids at the reservoir's temperature and pressure. The engines compute both from stated conditions by Batzle and Wang (1992), then mix them in the pore space by Wood's average. Every figure below moves with the conditions, so a study names them first.

## The conditions and their conversions

The Ekene Sand conditions are stated with the kit: 180 degF, 3200 psia, brine salinity 0.035000 as a weight fraction of NaCl, oil 32 API, gas-oil ratio 400 scf/stb and gas gravity 0.750000. The engines work in SI, so the panel converts before it calls them:

| input | as stated | as the engine receives it |
| --- | --- | --- |
| temperature | 180 degF | 82.222222 degC |
| pressure | 3200 psia | 22.063223 MPa |
| gas-oil ratio | 400 scf/stb | 71.243043 L/L |
| oil gravity | 32 API | reference density 0.865443 g/cc (`apiToRho0`) |

One MPa is 145.037738 psi.

## Brine and live oil

| fluid | density kg/m3 | Vp m/s | bulk modulus GPa |
| --- | --- | --- | --- |
| brine (`brine`) | 1005.203569 | 1627.503313 | 2.662550 |
| live oil (`liveOil`) | 754.214377 | 1063.400328 | 0.852881 |

The brine is both denser and stiffer than the live oil. Bulk modulus is the property substitution turns on, and here the brine's stands far above the oil's. The Rock Physics course derives the Batzle-Wang relations and how temperature, pressure, salinity and dissolved gas move each one.

## The pore fluid at a saturation

Pores in the oil leg hold both fluids. `woodMix` mixes them as a uniform mix: the moduli by Wood's (Reuss) average, the densities by their volume fractions.

| Sw | bulk modulus GPa | density kg/m3 |
| --- | --- | --- |
| 0.200000 | 0.987056 | 804.412216 |
| 0.500000 | 1.291926 | 879.708973 |
| 0.800000 | 1.869288 | 955.005731 |
| 1.000000 | 2.662550 | 1005.203569 |

The density climbs in even steps with Sw. The modulus does not: at Sw 0.500000 it sits much nearer the oil's than the brine's, and it rises fastest only near full brine. At the oil-leg mean Sw of 0.574254 the pore fluid's modulus is 1.398867 GPa. The Wood average stays close to the softer phase until the brine fraction is high, which is why even a modest oil saturation softens the pore fluid a long way.

## What this means for the second question

A large contrast between the pore fluid and brine is the raw material of a fluid effect. The rock frame then decides how much of it reaches the velocities, which is what substitution measures in the next lesson. A study that misstates the conditions moves both fluids and every figure built on them.

## Refusals

The fluid engines refuse inputs that have no physical answer, and the panel prints each message unchanged:

> Temperature (degC) and positive pressure (MPa) required.

> Salinity must be a weight fraction in [0, 0.5).

> API gravity must be in (0, 100).

> Saturations must sum to 1.

They came from a pressure of 0 MPa, a salinity of 0.6, an oil gravity of 0 API and saturations of 0.6 and 0.6.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set View to "Fluids and substitution" and Data to "Ekene pack: Ekene-1", and check the brine and live oil rows against the table above. Raise "Temperature, degF (stated)" and say which fluid's bulk modulus moves more. Restore 180, then change "Gas-oil ratio, scf/stb (stated)" and watch the live oil row while the brine row stays put. Restore 400. Finally set "Pressure, psia (stated)" to 0 and read the refusal the panel prints, then restore 3200.
