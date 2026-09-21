# Methane from the methane

The flare's second species is methane. This lesson reads which methane the rule counts, and the figure a shortcut gives when it counts something else.

{{panel:gasvalue-flare-explorer}}

## The CH4 half of the rule

The engine's basis sentence gives the methane as: CH4 = the methane in the gas times one less the destruction efficiency. It closes with a second sentence on what is left out: "Unburned ethane and heavier carry no GWP here."

The methane that escapes is the methane in the gas times one less the destruction efficiency.

## EGBEMA's methane

EGBEMA's gas carries methaneMoleFraction 0.7420, and its flare study gives a destruction efficiency of 0.97. The engine reports flareCh4Tonnes 1136.490 tonnes a year. The flare weighs its methane at 16.043 kg/kmol, the figure the engine exports in FLARE_MOLAR_MASS.

A probe on a gas that is all methane, at EGBEMA's volume, days and efficiencies, gives the methane half on its own:

| probe | flareCo2Tonnes | flareCh4Tonnes |
| --- | --- | --- |
| all methane, EGBEMA efficiencies | 133751.879 | 1531.658 |

The all-methane gas escapes 1531.658 tonnes of methane a year, and EGBEMA's gas 1136.490. The destruction efficiency is 0.97 for both. The probe gas is all methane, and EGBEMA's carries methaneMoleFraction 0.7420.

## The shortcut the engine does not take

Beside the engine's methane, the course prints the figure the flare gives if every unburned carbon atom is counted as methane. It is computed as the lb-mol a year (scfPerYear over SCF_PER_LBMOL) times carbonPerMol (every carbon atom, the CO2's included) times one less the destruction efficiency, weighed at FLARE_MOLAR_MASS.CH4 and converted with LB_PER_KG:

| methane, t/yr | value | over the engine's |
| --- | --- | --- |
| the engine (methane in the gas) | 1136.490 | 1.0000 |
| every unburned carbon counted as methane | 2083.055 | 1.8329 |

The last column prints each figure over the engine's: 1.0000 for the engine and 1.8329 for the shortcut.

Read the two formulas side by side. The engine's methane starts from the methane in the gas, methaneMoleFraction 0.7420 on EGBEMA. The shortcut starts from carbonPerMol, 1.3600 on EGBEMA, which counts every carbon atom, the CO2's included. Both multiply by one less the destruction efficiency. The unburned ethane and heavier that the shortcut counts are the ones the engine's sentence names: they are not methane and carry no GWP here.

## Where the methane goes next

Methane is the species the GWP multiplies: CO2e is the CO2 plus the methane times the GWP. Module five reads it at the study's GWP of 29.8, where EGBEMA's flareCo2eTonnes is 215946.438 tonnes a year.

## Reading it in the explorer

The flare explorer shows the engine's methane and, beside it, the every-unburned-carbon figure, labelled as the reading the engine does not use. Set up EGBEMA's flare and read both, and the ratio between them.

## Exercise

Read the shortcut table: the engine, 1136.490 tonnes of methane a year at 1.0000, and every unburned carbon counted as methane, 2083.055 at 1.8329. Say which methane the engine counts, which count of carbon the shortcut starts from, what the last column measures, and what the engine's sentence says about unburned ethane and heavier.

Self check: the engine counts the methane in the gas, times one less the destruction efficiency. The shortcut counts every unburned carbon atom as methane: the lb-mol a year times carbonPerMol, the CO2's carbon included, times one less the destruction efficiency, weighed at FLARE_MOLAR_MASS.CH4. The last column is each figure over the engine's: 1.8329 for the shortcut. The engine's sentence: unburned ethane and heavier carry no GWP here.
