# Methane from the methane

The flare's second species is methane. This lesson reads which methane the rule counts, and the figure a shortcut gives when it counts something else.

{{panel:gasvalue-flare-explorer}}

## The CH4 half of the rule

The engine's basis sentence gives the methane as: CH4 = the methane in the gas times one less the destruction efficiency. It closes with a second sentence on what is left out: "Unburned ethane and heavier are not methane and carry no GWP here."

The methane that escapes is the methane in the gas times one less the destruction efficiency. The ethane, propane, butanes and pentanes plus that escape unburned are not counted as methane, and in this engine they carry no GWP.

## EGBEMA's methane

EGBEMA's gas carries methaneMoleFraction 0.7420, and its flare study gives a destruction efficiency of 0.97. The engine reports flareCh4Tonnes 1136.490 tonnes a year. The flare weighs its methane at 16.043 kg/kmol.

A probe on a gas that is all methane, at EGBEMA's volume, days and efficiencies, gives the methane half on its own:

| probe | flareCo2Tonnes | flareCh4Tonnes |
| --- | --- | --- |
| all methane, EGBEMA efficiencies | 133751.879 | 1531.658 |

The all-methane gas escapes 1531.658 tonnes of methane a year. EGBEMA's gas, at the same volume, days and destruction efficiency, escapes 1136.490. In the rule, the destruction efficiency is 0.97 for both. The factor the two gases do not share is the methane in the gas: the probe gas is all methane, and EGBEMA's carries methaneMoleFraction 0.7420.

## The shortcut the engine does not take

A flare model can count every unburned carbon atom as methane. The course computes that figure for EGBEMA from the engine's own carbon per mole and prints it beside the engine's:

| methane, t/yr | value | over the engine's |
| --- | --- | --- |
| the engine (methane in the gas) | 1136.490 | 1.0000 |
| every unburned carbon counted as methane | 2083.055 | 1.8329 |

The last column prints the ratio of each to the engine's: 1.0000 for the engine and 1.8329 for the shortcut.

The shortcut is computed from the engine's own carbon per mole. The engine's figure starts from the methane in the gas, methaneMoleFraction 0.7420 on EGBEMA. The unburned ethane and heavier, which the shortcut counts as methane, are the ones the engine's sentence names: they are not methane and carry no GWP here.

## Where the methane goes next

Methane is the species the GWP multiplies: CO2e is the CO2 plus the methane times the GWP. Module five reads it at the study's GWP of 29.8, where EGBEMA's flareCo2eTonnes is 215946.438 tonnes a year.

The engine takes the rule as written. The methane that escapes is the methane in the gas, and the methane is set by the destruction efficiency alone.

## Reading it in the explorer

The flare explorer shows the engine's methane and, beside it, the every-unburned-carbon figure, labelled as the reading the engine does not use. Set up EGBEMA's flare and read both, and the ratio between them.

## Exercise

Read the shortcut table: the engine, 1136.490 tonnes of methane a year at 1.0000, and every unburned carbon counted as methane, 2083.055 at 1.8329. Say which methane the engine counts, what the shortcut counts instead, what the last column measures, and what the engine's sentence says about unburned ethane and heavier.

Self check: the engine counts the methane in the gas, times one less the destruction efficiency. The shortcut counts every unburned carbon atom as methane, from the carbon per mole. The last column is each figure over the engine's: 1.8329 for the shortcut. The engine's sentence: unburned ethane and heavier are not methane and carry no GWP here.
