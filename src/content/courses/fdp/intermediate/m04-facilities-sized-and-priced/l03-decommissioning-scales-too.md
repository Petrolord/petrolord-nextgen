# Decommissioning scales too

The decommissioning allowance is 15 percent of the capex the facility actually carries, so it inherits the size exponent from the capex and moves whenever the nameplate moves. A bigger vessel costs more to remove for the same reason it costs more to build.

{{panel:ec-schedule-explorer}}

## A fixed share of a moving number

| facility | nameplate bopd | capex | decommissioning | share of capex |
| --- | --- | --- | --- | --- |
| Egina FPSO | 60000 | 1363.3524 | 204.5029 | 0.150000 |
| Egina FPSO, debottlenecked | 150000 | 2589.2031 | 388.3805 | 0.150000 |
| Deep tie-back | 25000 | 184.6717 | 27.7007 | 0.150000 |

The share is the same 0.150000 on both FPSO rows. It is the same 0.150000 on the tie-back row too, across a change of type. What is not the same is the base it is taken from, and that is where the whole behaviour lives. Capex went from 1363.3524 to 2589.2031, a factor of 1.899144, and decommissioning went from 204.5029 to 388.3805 by that same factor.

## The exponent arrives second hand

Nobody told the decommissioning calculation about the power 0.7. It multiplies a capex that already carries the exponent, so the removal allowance ends up scaling to the power 0.7 as well. That is the correct behaviour, and it is worth naming, because a rule expressed as a flat percentage looks like it cannot scale until you ask which number it is a percentage of.

## What it used to do

Before the repairs made ahead of this course the allowance was 15 percent of the type's unscaled base cost rather than of the capex the facility carries. Two FPSOs of very different nameplate came back with the same removal figure, and the larger unit looked free to take away. Treat that as history. The published behaviour now reads 204.5029 against 388.3805.

## The plan's own provision is a different number

The plan's cost ledger carries a decommissioning provision of 260.0000 as an ABEX line. It sits in neither the CAPEX total of 2250.0000 nor the operating cost of 95.0000 a year, and the screening case charges it as the plan's end-of-life cost in the final production year. So the plan holds one removal figure that a person wrote and the facility card holds another that a curve produced, and an ABEX cost item replaces the card's estimate rather than being added to it. Reconciling them is planning work. Averaging them is not, and neither is quietly deleting whichever one is less convenient.

## The mistake

The mistake is to read the allowance as a funded liability. It is a share of a screening estimate, it carries no abandonment study, no well plugging scope and no regulatory basis, and on this plan it does not enter the screening NPV at all, because the ledger's own ABEX line of 260.0000 is what the case charges instead. Quoting 204.5029 as the cost of removing the vessel gives a precise answer to a question nobody has costed.

## Exercise

Give the capex and the decommissioning allowance for all three facilities, and the share of capex on the two FPSO rows. Then state the factor between the two FPSO capex figures, say whether the decommissioning figures moved by the same factor, and name the provision the plan's own cost ledger carries.
