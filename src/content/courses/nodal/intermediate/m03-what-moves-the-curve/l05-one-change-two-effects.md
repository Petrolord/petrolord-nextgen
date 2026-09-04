# One change, two effects

Almost every lever moves the level of the outflow curve and the position of its bottom at once, usually in directions that disagree.

{{panel:pd-vlp-explorer}}

## Two quantities, not one

The level is what the tubing charges at the rates you care about. The bottom is where the curve turns. A change can improve one and damage the other, and a sensitivity reported as a single number has thrown that possibility away.

The reason is structural. The outflow sums a falling term and a rising one, and the slope is made of those same two terms, so anything touching either moves the height of the sum AND the rate where its slope crosses zero. Only a change additive in pressure and independent of rate moves the level alone, and there is exactly one of those.

## Three levers, three signatures

| BONNY-7 lever | Minimum rate, stb/d | Minimum bhp, psia |
| --- | --- | --- |
| wellhead 280 psia | 627.069742 | 1336.243252 |
| wellhead 490 psia | 627.069742 | 1546.243252 |
| friction 0.00032 | 845.667814 | 1309.348403 |
| friction 0.00128 | 455.992990 | 1656.374688 |
| lightening 187.50 stb/d | 561.403918 | 1159.998265 |
| lightening 1500.00 stb/d | 581.492476 | 2185.774480 |

A curve that moved bodily with its bottom at the same RATE was a wellhead change, and only that. FORCADOS-3 agrees, holding 1843.619418 stb/d at all four of its wellhead pressures. A bottom that slid left and lifted was a friction change. A bottom that lifted far while its rate barely moved, or moved the wrong way, was the column, whose rate stays inside 561.403918 to 646.294276 stb/d across that sweep.

None of this is an artefact of two constant instruments. In the built-in dry gas column, taking the rate to 9 MMscf/d raises the friction group to 0.00907182 and changes the pressure at every station, which changes the density, which changes the weight.

## What this refuses

A single number for a design change. A gas lift sensitivity is a pair at least: the demand and the threshold. An optimum, for gas lift or tubing size, because the instruments carry two constants, no injection rate and no bore. And what the well will do, which takes the reservoir's curve as well.

## The mistake

The two point sensitivity. Take BONNY-7's lightening constant at 187.50 and 750.00 stb/d and the threshold rises to 646.294276 stb/d. Take 750.00 and 1500.00 and it falls to 581.492476 stb/d. Take 187.50 and 1500.00 and almost nothing happens. Three pairs from one sweep, three stories, all correct.

Sweep, do not difference. Report the level and the threshold together. When a lever has a mechanism at each end, say which end you measured.

## Exercise

In the panel, run three sensitivities on BONNY-7: wellhead pressure across its four values, friction constant across its three, lightening constant across its four, recording the minimum rate and pressure each time.

Then name the only one a single number describes honestly, and say what a reader given only the pressure columns believes.
