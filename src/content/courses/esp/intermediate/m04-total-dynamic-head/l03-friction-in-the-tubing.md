# Friction in the tubing

The friction term is not modelled here. It is what is left when the other two are taken out.

{{panel:pd-lift-explorer}}

## The identity

Discharge pressure less the tubing column less the wellhead pressure is the friction, exactly. On the published gassyOffshore design that reads 184.6713 psi, and the friction the breakdown quotes as a pressure is 184.6713 psi. They agree because they are the same statement.

Divided by the gradient of the pumped fluid, 0.3736183828 psi/ft, the same 184.6713 psi is 494.277929 ft of head.

| Case | Friction, psi | Friction, ft | Share of the head |
| --- | --- | --- | --- |
| gassyOffshore | 184.6713 | 494.277929 | 9.9286 percent |
| highWaterCut | 22.1880 | 50.510182 | 1.3302 percent |
| QUA-IBOE-4 | 107.7284 | 348.061930 | 8.6321 percent |
| IBENO-2 | 36.6616 | 87.157303 | 12.0202 percent |

## What being a residual means

Everything in the three part reading follows from the two pressures, the gradient and the pump depth, plus one wellhead pressure. That wellhead pressure is the only separate input: 400.0 psia on gassyOffshore, 30.0 psia on highWaterCut, 220.0 psia on QUA-IBOE-4 and 180.0 psia on IBENO-2, all of them teaching inputs supplied so the split can be shown rather than fields the goldens carry.

So the friction bucket is where every error lands. Get the discharge pressure wrong and the head moves, but the split moves entirely in the friction term, because the net lift is built from the intake pressure and the wellhead term from the wellhead pressure. Neither of those notices.

## It is the small term more often than people expect

Friction is 1.3302 percent of the requirement on highWaterCut, a design putting 4098.400000 bbl/d through the pump. It is 9.9286 percent on gassyOffshore at 2750.400000 bbl/d. The largest share of the four is 12.0202 percent on a teaching well whose whole requirement is 725.090193 ft, where the friction is only 87.157303 ft in absolute terms.

Share and size are different questions, and a friction share on its own says nothing about the tubing.

## The mistake

Computing a friction from a pipe correlation and adding it to a head that already contains it. The discharge pressure was measured or marched at the design rate, so the friction is already inside the difference between the two pressures. Adding a second one double counts a term that is 494.277929 ft on gassyOffshore.

## What it refuses

This module has no tubing in it. It will not take a tubing size, a roughness and a rate and return a friction, and it will not tell you that the friction it reports is unreasonable for the string. The figure is arithmetic on numbers already supplied, and the discharge pressure that produced it is an input: a flowing traverse result whose honest source is a march up the tubing at the design rate with the gas that is actually still in the stream.

## Exercise

Take each case in the panel and reconstruct the friction pressure from the discharge pressure, the tubing column and the wellhead pressure.

Then convert it to feet and check it against the friction the breakdown reports.
