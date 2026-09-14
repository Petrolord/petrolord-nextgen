# EVPI peaks where the decision turns

On the EKPAN lottery EVPI is largest at the success probability where Drill and Farm out are worth the same, 0.228571, and it reaches 61.7143 million USD there. The peak sits at the switch, well away from the probability where the two outcomes are equally likely.

{{panel:ec-information-explorer}}

## The sweep

| success probability | emvPrior | evWithPerfect | evpi |
| --- | --- | --- | --- |
| 0.050000 | 4.7500 | 18.2500 | 13.5000 |
| 0.100000 | 9.5000 | 36.5000 | 27.0000 |
| 0.150000 | 14.2500 | 54.7500 | 40.5000 |
| 0.200000 | 19.0000 | 73.0000 | 54.0000 |
| 0.228571 | 21.7143 | 83.4286 | 61.7143 |
| 0.250000 | 31.2500 | 91.2500 | 60.0000 |
| 0.300000 | 53.5000 | 109.5000 | 56.0000 |
| 0.350000 | 75.7500 | 127.7500 | 52.0000 |
| 0.400000 | 98.0000 | 146.0000 | 48.0000 |
| 0.500000 | 142.5000 | 182.5000 | 40.0000 |
| 0.700000 | 231.5000 | 255.5000 | 24.0000 |
| 0.900000 | 320.5000 | 328.5000 | 8.0000 |

## Two straight lines

Left of the switch the prior best action is Farm out. Perfect information changes it only on Success, where Drill nets 365.0000 against the farm-out's 95.0000, so EVPI grows with the success probability: 13.5000 at 0.050000, 27.0000 at 0.100000, 54.0000 at 0.200000. Right of the switch the prior best action is Drill. Perfect information changes it only on Dry hole, from -80.0000 to 0.0000, so EVPI shrinks as the dry hole becomes rarer: 60.0000 at 0.250000, 52.0000 at 0.350000, 8.0000 at 0.900000. At 0.350000 the check is 0.650000 x 80.0000 = 52.0000.

## The switch

Drill is worth 445 p - 80 and Farm out 95 p. They are equal at p = 80 / 350 = 0.228571. There both are worth 21.7143, so emvPrior is 21.7143, evWithPerfect is 83.4286, and 83.4286 less 21.7143 is 61.7143. The prior decision is least settled there: whichever action is chosen, the action it rules out is worth exactly as much, so the prior choice is wrong in whichever outcome favours the other one. Knowing the outcome is worth most where the decision without it is balanced.

## An engine detail at the switch

At 0.228571 the engine reports Farm out as best. That is floating-point residue: 80 / 350 has no exact binary image, and Drill comes out below Farm out in the last binary digits. The EVPI of 61.7143 is the same whichever of the two is named.

## Where it does not peak

At 0.500000, where Success and Dry hole are equally likely, EVPI is 40.0000, well under the 61.7143 at the switch. The peak is located by the payoffs and the drill cost through the switch probability, so a change to the farm-out terms or the cost would move it, and the outcome probabilities alone cannot locate it.

## The mistake

A sampled sweep is easy to misread. The rows at 0.200000 and 0.250000 give 54.0000 and 60.0000, and a reader with only round probabilities would put the peak at 0.250000 and 60.0000. The row at 0.228571 exists because the switch was computed first, and it holds the largest value. A second error treats EVPI as a property of the prospect alone. The 52.0000 at 0.350000 would be 61.7143 if the geologist's estimate moved to 0.228571, with the payoffs and every survey unchanged.

## Exercise

From the sweep, write EVPI at 0.200000, 0.228571 and 0.350000 as evWithPerfect less emvPrior. Name the prior best action on each side of 0.228571 and the outcome in which perfect information changes it, and explain why EVPI at 0.500000 is below its value at the switch.
