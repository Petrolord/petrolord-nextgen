# What a flare emits

Modules one to three read EGBEMA's gas. This module burns it. The call is abatement, and this tier reads the half of it that says what the flare emits.

{{panel:gasvalue-flare-explorer}}

## EGBEMA's flare

EGBEMA flares 7.5 MMscfd on 355 days a year. The flare study gives a destruction efficiency of 0.97 and a combustion efficiency of 0.955, and the study uses a methane GWP of 29.8. Every one of those figures is invented and illustrative.

The engine turns the rate and the days into a year's volume. It reports scfPerYear 2662500000 for EGBEMA.

## The rule the engine follows

The engine follows 40 CFR 98.233(n), and its basis sentence states the rule in full:

"40 CFR 98.233(n): CO2 = the CO2 in the gas plus the combustion efficiency times the hydrocarbon carbon; CH4 = the methane in the gas times one less the destruction efficiency. Unburned ethane and heavier carry no GWP here."

The rest of this module reads the sentence part by part. The second lesson reads the combustion efficiency times the hydrocarbon carbon, the third reads the CO2 in the gas, the fourth reads the methane and the unburned ethane and heavier, and the fifth reads the two efficiencies side by side.

## What the engine reports

| EGBEMA flare | value |
| --- | --- |
| scfPerYear | 2662500000 |
| flareCo2Tonnes (t/yr) | 182079.024 |
| flareCh4Tonnes (t/yr) | 1136.490 |
| flareCo2eTonnes (t/yr) | 215946.438 |
| methaneShareOfFlareCo2e | 0.1568 |
| destructionEfficiency | 0.97 |
| combustionEfficiency | 0.955 |

The flare emits 182079.024 tonnes of CO2 a year and 1136.490 tonnes of methane a year. Its CO2e, at the study's GWP of 29.8, is 215946.438 tonnes a year, and the methane share of that CO2e is 0.1568. Module five reads the CO2e and the methane share.

The tonnes print to three decimals. That is the precision the engine itself reports for tonnes of CO2, methane and CO2e a year.

## Weighed at two molar masses

The flare's tonnes are weighed at the molar masses the engine exports in FLARE_MOLAR_MASS, and an all-CO2 flare and an all-methane flare give the same figures back. The reference table carries CO2 at its tabulated molar mass, 44.01, for the gas's mass and liquids. The flare's tonnes use these:

| species | molar mass kg/kmol the flare uses |
| --- | --- |
| CO2 | 44.009 |
| methane | 16.043 |

## Two species from one gas

The rule gives the flare two species, CO2 and methane, and CO2e is formed from them. The three gas terms in the rule, the CO2 in the gas, the hydrocarbon carbon and the methane in the gas, are the figures modules one to three read from the analysis: on EGBEMA, co2MoleFraction 0.0280, hydrocarbonCarbonPerMol 1.3320 and methaneMoleFraction 0.7420.

## Reading the flare in the explorer

The flare explorer takes the volume, the days, both efficiencies and the GWP as inputs, and each starts blank. Load EGBEMA's gas, type 7.5 MMscfd, 355 days, 0.97, 0.955 and 29.8, and read the CO2, the methane and the CO2e against the table above.

## Exercise

Read EGBEMA's flare: 7.5 MMscfd on 355 days, destruction efficiency 0.97, combustion efficiency 0.955, and the engine's flareCo2Tonnes 182079.024 and flareCh4Tonnes 1136.490. Say which efficiency the rule puts in the CO2 and which in the methane, and name the two terms of the CO2.

Self check: the CO2 is the CO2 in the gas plus the combustion efficiency times the hydrocarbon carbon, so the combustion efficiency, 0.955, is in the CO2. The methane is the methane in the gas times one less the destruction efficiency, so the destruction efficiency, 0.97, is in the methane. The two terms of the CO2 are the CO2 in the gas and the combustion efficiency times the hydrocarbon carbon.
