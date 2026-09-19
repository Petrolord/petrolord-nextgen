# Ethane plus and propane plus

characteriseGas reports the liquids in the gas twice, on two cuts. This lesson reads the two cuts, what separates them, and the column the course prints for the gap.

{{panel:gasvalue-flare-explorer}}

## Two cuts, two names

gpmC2Plus is the liquid content of ethane and heavier. gpmC3Plus is the liquid content of propane and heavier. Both are gallons of liquid per thousand standard cubic feet, and both are built by the same basis sentence:

"Derived from the composition and the component liquid densities: gallons per Mscf follows from the moles in a thousand cubic feet, the molar mass and the liquid density."

The two cuts sum over different rows of the reference table. gpmC2Plus sums over every recoverable component: C2, C3, IC4, NC4 and C5. gpmC3Plus starts at propane: C3, IC4, NC4 and C5. The one row in the first and outside the second is C2, ethane, with a molar mass of 30.07 lb/lbmol and a liquid density of 2.971 lb/gal.

## The gap is the ethane

The course prints both cuts and the gap between them:

| gas | gpmC2Plus (ethane and heavier) | gpmC3Plus (propane and heavier) | gpmC2Plus minus gpmC3Plus (the ethane) |
| --- | --- | --- | --- |
| EGBEMA | 5.9942 | 3.2205 | 2.7737 |
| OGUTA | 1.3157 | 0.4890 | 0.8268 |
| studio opening gas | 5.0897 | 2.6894 | 2.4003 |

The last column is gpmC2Plus minus gpmC3Plus, and the table names it: the ethane. On EGBEMA it is 2.7737 gallons per thousand standard cubic feet. On OGUTA it is 0.8268. On the studio's opening gas it is 2.4003.

Read the column against each sheet's ethane. EGBEMA's sheet carries C2 0.104. OGUTA's carries C2 0.031. The studio's opening gas carries C2 0.09. Each ethane figure in the gallon table is that gas's ethane, turned into gallons by the basis sentence.

## Which cut the tier reads next

The two cuts are read for different things in the rest of this module.

The richness word is read off gpmC3Plus. The third lesson of this module reads where it changes from lean to moderate and from moderate to rich, and each of those edges is a value of gpmC3Plus.

The mass ceiling in the fifth lesson is on propane and heavier too. The engine reports c3PlusKgPerMscf, the part of the mass of one Mscf that is propane and heavier. On EGBEMA it is 6.6647 kg.

"Propane and heavier" is the engine's basis wording for both, and it is the cut to quote when a lesson in this course names the C3+ figures. "Ethane and heavier" is the wording for gpmC2Plus.

## One missing density reaches both cuts

Propane is in both cuts. The fourth lesson of this module reads what happens when propane's liquid density is left blank: the engine returns gpmC2Plus null and gpmC3Plus null, and the richness word null, with missingLiquidDensity C3. Neither cut is reported as a partial sum.

## Reading the two cuts in the explorer

Load EGBEMA in the flare explorer and read gpm C2+ and gpm C3+. Then load OGUTA and the studio's opening gas and read the two cuts for each against the table above.

## Exercise

Read EGBEMA's row: gpmC2Plus 5.9942, gpmC3Plus 3.2205, and the gap column 2.7737. Say which components each cut sums over, what the table names the gap column, and which of the two cuts the richness word is read off.

Self check: gpmC2Plus sums over ethane and heavier, C2, C3, IC4, NC4 and C5. gpmC3Plus sums over propane and heavier, C3, IC4, NC4 and C5. The gap column is gpmC2Plus minus gpmC3Plus, and the table names it the ethane, 2.7737 on EGBEMA. The richness word is read off gpmC3Plus.
