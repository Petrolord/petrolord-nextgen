# Heating value blends on moles

Module one read a standard cubic foot as a count of moles. This module reads what characteriseGas builds on that count, starting with the heating value of the gas in Btu per standard cubic foot.

{{panel:gasvalue-flare-explorer}}

## One rule for every property

The engine states one rule for the whole of this module: every property is a mole-weighted sum over the normalised analysis. The heating value is the mole-weighted heating value. The carbon per mole, the hydrocarbon carbon per mole and the mass in one Mscf follow the same rule, and the next three lessons read them.

Two words in that rule carry weight. The weights are moles. And the analysis is the normalised one: the scaled fractions from module one, so the short EGBEMA sheet would be read at C1 0.7411 and the full sheet at C1 0.7420.

## The three gases

EGBEMA is the associated gas from module one. OGUTA is a lean non-associated gas beside it: C1 0.925, C2 0.031, C3 0.012, IC4 0.002, NC4 0.003, N2 0.012, CO2 0.015. The studio's opening gas is C1 0.78, C2 0.09, C3 0.05, IC4 0.01, NC4 0.02, C5 0.01, N2 0.02, CO2 0.02.

characteriseGas gives each a heating value:

| gas | ghvBtuScf |
| --- | --- |
| EGBEMA | 1248.4110 |
| OGUTA | 1035.6050 |
| studio opening gas | 1210.7800 |

The component figures behind these come from the reference table: methane 1010 Btu/scf, ethane 1770, propane 2516, iso-butane 3252, n-butane 3263, pentanes plus 4010, and 0 for nitrogen and carbon dioxide. Each is the engine's typical figure.

## Two shortcuts beside the engine

The heating value is blended on moles. Two shortcuts sit beside it on EGBEMA, each computed from the same reference table:

| heating value, Btu/scf | value | minus the engine's |
| --- | --- | --- |
| the engine, on moles | 1248.4110 | 0.0000 |
| the same heating values weighted by mass | 1537.2878 | 288.8768 |
| the engine asked about the hydrocarbons alone (inerts left out and the rest scaled to one) | 1308.6069 | 60.1959 |

Both shortcuts read higher than the engine on this gas.

The first shortcut keeps the same component heating values and changes only the weights, from moles to mass. It gives 1537.2878 Btu/scf, and the difference column prints 288.8768 against the engine's 1248.4110.

The second shortcut is the engine's own rule on a different gas. The inerts are left out and the hydrocarbons are scaled to one before the heating value is formed. It gives 1308.6069 Btu/scf, and the difference column prints 60.1959. EGBEMA's analysis carries N2 0.018 and CO2 0.028, and the engine forms its figure over the whole normalised analysis, the inerts with their heating value of 0 included.

Neither shortcut is a figure the engine returns for EGBEMA. Each is the engine's reference table weighted a way the engine does not weight it, or applied to a gas the engine was not given.

## Reading the heating value in the explorer

The flare explorer shows the engine's heating value, and beside it the mass-weighted figure labelled as the reading the engine does not use. Load EGBEMA and read both. Then load OGUTA and the studio's opening gas and read the engine's figure for each against the table above.

## Exercise

Read the three rows of the shortcut table: the engine on moles, 1248.4110; weighted by mass, 1537.2878 with 288.8768 in the difference column; and the hydrocarbons alone, 1308.6069 with 60.1959. Say which figure characteriseGas returns for EGBEMA, what the difference column measures, and what this lesson says about both shortcuts on this gas.

Self check: characteriseGas returns 1248.4110 Btu/scf, the mole-weighted heating value over the normalised analysis. The difference column is each shortcut minus the engine's figure, 288.8768 for the mass weighting and 60.1959 for the hydrocarbons alone. Both shortcuts read higher than the engine on this gas.
