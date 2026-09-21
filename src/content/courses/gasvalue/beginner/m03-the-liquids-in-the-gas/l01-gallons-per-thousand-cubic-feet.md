# Gallons per thousand cubic feet

Module two read the gas as a heating value, a carbon count and a mass. This module reads the liquid in it. characteriseGas reports that liquid in gallons per thousand standard cubic feet, and the engine states exactly how the figure is built.

{{panel:gasvalue-flare-explorer}}

## The engine's basis sentence

The engine's basis sentence for the liquids reads:

"Derived from the composition and the component liquid densities: gallons per Mscf follows from the moles in a thousand cubic feet, the molar mass and the liquid density."

Spelled out for one component, the steps are these. Take the moles in a thousand standard cubic feet. Multiply by the component's mole fraction and its molar mass. Divide by its liquid density. Then sum over the recoverable components. The two figures the engine reports, gpmC2Plus and gpmC3Plus, are both gallons of liquid per thousand standard cubic feet built this way.

## What the sentence draws on

Every input the sentence names is already on the page.

The moles in a thousand standard cubic feet come from module one: a standard cubic foot counts gas at 60 F and 14.696 psia, so a volume of gas is a number of moles.

The mole fraction is the normalised analysis from module one.

The molar mass and the liquid density are columns of the reference table:

| code | molar mass lb/lbmol | liquid density lb/gal | recoverable as NGL |
| --- | --- | --- | --- |
| C1 | 16.043 | none | false |
| C2 | 30.07 | 2.971 | true |
| C3 | 44.096 | 4.233 | true |
| IC4 | 58.122 | 4.695 | true |
| NC4 | 58.122 | 4.872 | true |
| C5 | 72.15 | 5.253 | true |
| N2 | 28.014 | none | false |
| CO2 | 44.01 | none | false |

The recoverable components are the rows marked true: C2, C3, IC4, NC4 and C5. Methane, nitrogen and carbon dioxide carry no liquid density and are not summed.

The engine's note on the table applies here: heating values and liquid densities are typical: the gas analysis and the certificate govern, and a measured value should replace these. Every gallon figure in this module is built on the typical densities.

## The three gases

| gas | gpmC2Plus (ethane and heavier) | gpmC3Plus (propane and heavier) |
| --- | --- | --- |
| EGBEMA | 5.9942 | 3.2205 |
| OGUTA | 1.3157 | 0.4890 |
| studio opening gas | 5.0897 | 2.6894 |

EGBEMA carries 5.9942 gallons of ethane and heavier and 3.2205 gallons of propane and heavier in every thousand standard cubic feet. OGUTA carries 1.3157 and 0.4890. The studio's opening gas carries 5.0897 and 2.6894.

## A figure derived from the composition

The word the engine uses is derived: derived from the composition and the component liquid densities. The figures are computed from the analysis and the reference table by the steps above. A density that is missing leaves them missing, and the fourth lesson of this module reads that case. The second lesson reads the gap between the two gallon figures, and the third reads the richness word the engine reads off gpmC3Plus.

GAL_PER_FT3 is the engine's constant for US gallons in one cubic foot, 7.480519. It is among the constants flareToValue exports beside SCF_PER_LBMOL and LB_PER_KG.

## Reading the liquids in the explorer

Load EGBEMA in the flare explorer and read gpm C2+ and gpm C3+. Then load OGUTA and the studio's opening gas and read the same two figures against the table above.

## Exercise

Read EGBEMA's two figures, gpmC2Plus 5.9942 and gpmC3Plus 3.2205, and the basis sentence. Name the three things the sentence says gallons per Mscf follows from, name the components the engine sums over, and say which column of the reference table marks them.

Self check: gallons per Mscf follows from the moles in a thousand cubic feet, the molar mass and the liquid density, with each component weighted by its mole fraction. The engine sums over the recoverable components, C2, C3, IC4, NC4 and C5, which the recoverable as NGL column marks true.
