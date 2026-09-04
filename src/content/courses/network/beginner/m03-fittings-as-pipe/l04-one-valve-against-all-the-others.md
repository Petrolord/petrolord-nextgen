# One valve against all the others

Ten fittings on one line, and one of them carries 69.204152 percent of the resistance. The other nine share what is left.

{{panel:pd-trunk-explorer}}

## The line

The teaching line this course carries is NPS 8 schedule 80, a 7.625 in bore, run at a friction factor of 0.017 with three standard 90 degree elbows, two branch tees, four ball valves and one globe valve on it. It is a teaching case, not a published one. Its sum of K is 14.450000 and its equivalent length is 540.104167 ft.

| Item | Count | K | Percent | Length, ft |
| --- | --- | --- | --- | --- |
| elbow90Std | 3 | 2.250000 | 15.570934 | 84.099265 |
| teeBranch | 2 | 2.000000 | 13.840830 | 74.754902 |
| ballValve | 4 | 0.200000 | 1.384083 | 7.475490 |
| globeValve | 1 | 10.000000 | 69.204152 | 373.774510 |

## Count is not cost

Four ball valves are four items and 1.384083 percent of the resistance, worth 7.475490 ft. One globe valve is one item and 373.774510 ft. The published coefficients say why: a fully open ball valve is 0.05 and a fully open globe valve is 10, on the same bore, with nothing else different. A globe valve turns the flow and pushes it through a seat, and the table prices that as the largest K it publishes.

## The rest of the list, for scale

Against a globe valve at 10, a swing check is 2, a branch tee is 1, a standard elbow is 0.75 and a gate valve is 0.15. One entry in the published table reaches double figures, and it is on this line.

## What it refuses

Every valve coefficient is the fully open one, so a globe valve part way shut is not in the module at all and cannot be reached by scaling the open figure. Position is refused as well: the sum of K is a sum, so a globe valve at the wellhead and a globe valve at the separator both give 540.104167 ft, and nothing in the file knows that two fittings close together interact. An unknown id is NaN and refuses the list, No resistance coefficient for reducer, rather than quietly leaving an item out.

## The mistake

Substituting one valve for another because a valve is a valve. Take the globe valve off that line and 373.774510 ft of the 540.104167 ft goes with it, which is more than the elbows, the tees and the ball valves put together at 84.099265 ft, 74.754902 ft and 7.475490 ft. That one item is the whole hydraulic design of the fitting list, and it is the item most often chosen by whoever is holding the valve catalogue.

## Exercise

In the panel, build three standard 90 degree elbows, two branch tees, four ball valves and one globe valve on a 7.625 in bore at a friction factor of 0.017, and write the sum of K and the length.

Then take the globe valve out, run it again, and say what you would attack next.
