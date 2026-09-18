# Rounding up twice

Divide the area you need by the surface of one tube and you get a number of tubes with a fraction on it. Nobody installs a fraction of a tube, so it has to be rounded. This module rounds it up twice, and the second rounding is the one worth understanding.

{{panel:fc-exchanger-explorer}}

## The seven cases

| case | area asked for, ft2 | one tube, ft2 | passes | tubes | tubes a pass |
| --- | --- | --- | --- | --- | --- |
| the studio case | 229.543151 | 3.141593 | 2 | 74 | 37 |
| ORON | 330.327560 | 5.235988 | 4 | 64 | 16 |
| published case 1, golden 160 tubes | 500.000000 | 3.141593 | 2 | 160 | 80 |
| published case 2, golden 638 tubes | 2000.000000 | 3.141593 | 2 | 638 | 319 |
| published case 3, golden 232 tubes | 1200.000000 | 5.235988 | 4 | 232 | 58 |
| published case 4, golden 274 tubes | 860.000000 | 3.141593 | 2 | 274 | 137 |
| published case 5, golden 274 tubes | 860.000000 | 3.141593 | 2 | 274 | 137 |

Five of those seven rows carry a golden tube count, written by the oracle on its own route, and on all five the engine and the golden are the same whole number.

## Once to a whole tube

The first rounding goes up to the next whole tube. Up rather than to nearest, and the reason is what the count is for. A count rounded down gives a bundle whose surface is below the surface the duty asked for, so the exchanger would be short of duty by construction. Rounding up can only give more surface than you needed.

## Again to a whole pass

The second rounding goes up to the next whole multiple of the pass count. A multi-pass bundle puts the same number of tubes in every pass, so a count that the pass number does not divide is not a bundle that can be built. On the studio case the passes are 2 and the count is 74, so 37 tubes go in each pass. On ORON the passes are 4 and the count is 64, so 16 go in each.

There is a second reason and it is the one that matters here. The count is fed back into the tube-side film, because the film depends on how fast the fluid goes and that depends on how many tubes it is divided between. A count that does not divide equally between the passes cannot be fed back, so the loop this tier closes would have nowhere to go. The pass rounding makes the count usable rather than merely buildable.

## Where the second rounding bites

Look at the studio row. The area over one tube, rounded up to a whole tube, is 74, and 2 divides 74, so the second rounding has nothing to do and the engine returns 74. On rows like that you cannot see the second rounding at all.

Published case 3 is where you can. Its area over one tube rounds up to a count that 4 does not divide, so the second rounding lifts it, and the answer is 232 tubes at 58 a pass. Both roundings ran on that row and only the second moved the number. This is why a count on its own is a poor thing to check an answer against: two different intermediate values can arrive at the same published count.

## Two refusals

Ask for a count at 3 passes and it refuses, naming what it carries: bundle constants for 1, 2, 4 and 6 tube passes only, and 3 was given. Ask at a zero area and it refuses that too, because a count needs a positive area.

## Exercise

For the studio case and for published case 3, divide the area by the per-tube surface and write down the unrounded figure, then apply both roundings in order. Say for each case which rounding moved the number and by how many tubes.
