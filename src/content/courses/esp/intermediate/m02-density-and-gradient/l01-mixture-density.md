# Mixture density

Density is a mass over a volume, so a mixture density is the sum of three masses over the sum of three volumes. It is never an average of the three densities, and on a real well it is not close to one.

{{panel:pd-lift-explorer}}

## The liquid first

Oil and water are combined at depth, not at the tank. The published golden design gassyOffshore carries oil at 48.00 lbm/ft3 and water at 64.00 lbm/ft3 at a water cut of 0.5000, which invites the midpoint. What the module returns is a liquid density at depth of 55.35135135 lbm/ft3, because the two tank rates are equal while the two in situ rates are 1440.000000 bbl/d of oil against 1224.000000 bbl/d of water. The volume factors moved the weighting before the density was ever computed. The published golden design highWaterCut runs the other way: 51.00 and 65.00 lbm/ft3 at a water cut of 0.9000 give 63.46425073 lbm/ft3, close to the water.

## Then the gas

The free gas at depth is added as a third stream with its own density.

| Case | Liquid at depth, lbm/ft3 | Gas, lbm/ft3 | Whole stream, lbm/ft3 |
| --- | --- | --- | --- |
| gassyOffshore, published | 55.35135135 | 6.0000 | 50.53658537 |
| highWaterCut, published | 63.46425073 | 4.2000 | 63.25602186 |
| QUA-IBOE-4, teaching | 52.07097187 | 5.5000 | 40.01990521 |

That density, and only that density, becomes the gradient the head calculation divides by, so an error here is an error in feet of head on every stage in the stack.

Gas is light and it is bulky, so a small mass in a large volume pulls the mixture down hard. On the teaching well QUA-IBOE-4, which is not a published case, 882.000000 bbl/d of gas at 5.5000 lbm/ft3 takes the mixture from 52.07097187 down to 40.01990521 lbm/ft3.

## The density the design uses

The whole stream density is not the design number. The pump swallows the liquid plus whatever gas survived the separator, so its density is computed separately: 53.80104712 lbm/ft3 on gassyOffshore, 44.56935579 lbm/ft3 on QUA-IBOE-4, and 63.25602186 lbm/ft3 on highWaterCut, where the two agree because nothing was vented.

## The mistake

Weighting by water cut, or by tank rates, or by anything other than in situ volumes. On gassyOffshore all three start from equal oil and water and land near the midpoint of 48.00 and 64.00 lbm/ft3, when the answer is 55.35135135 lbm/ft3.

## What it refuses

The three densities are caller inputs at intake conditions. No correlation produces them and nothing checks the pressure they were evaluated at. There is no slip: the mixture is treated as homogeneous, so the gas is assumed to travel at the liquid velocity through the whole intake calculation.

## Exercise

Compute the liquid density at depth for gassyOffshore from the two in situ rates and the two densities, then read it in the panel.

Then compute what a water cut weighting of 48.00 and 64.00 lbm/ft3 would have given, and record the difference.
