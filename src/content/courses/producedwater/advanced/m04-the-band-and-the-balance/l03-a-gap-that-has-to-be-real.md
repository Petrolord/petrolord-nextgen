# A gap that has to be real

The last question to ask of any validation is the one almost nobody asks. What SHOULD the gap be? A tolerance chosen after the fact is not a test, and a gap of zero is often the worst result on the page.

{{panel:pw-device-explorer}}

## The measured gap

Here is the engine re-run at every published condition and compared with the golden value the oracle wrote, as a RELATIVE difference.

| group | rows | largest relative gap between the engine and the golden |
| --- | --- | --- |
| apiSeparator | 4 | 3.75e-14 |
| plateInterceptor | 3 | 4.24e-14 |
| hydrocyclone | 5 | 3.38e-13 |
| mediaFilter | 8 | 2.17e-5 |
| train, outlet concentration | 3 | 3.47e-3 |
| train, outlet droplet median | 3 | 1.80e-3 |

Read the last column downwards before you read anything else. The gaps in it are wildly unlike each other, and a single tolerance applied across the whole table would be either useless at the top or false at the bottom.

## The top three rows

The basin, the plate pack and the cyclone agree to rounding. That is the right answer for those three, because both routes are EXACT arguments about the same geometry. The engine inverts a balance; the oracle marches a droplet through the vessel and bisects on the size that just clears. Two closed arguments for one number should land on the same float.

Nothing is being tolerated on those rows. The gap is floating point noise, so anything materially larger would be a real disagreement to go and find.

## The train rows, and why larger is better

The train rows are larger by orders of magnitude, and this is where a careless reviewer tightens a tolerance and breaks a good gate.

The golden on those rows is not a second closed form. It is PARTICLE TRACKING: 400,000 droplets, each carrying a surviving weight through every stage, with no binning anywhere. A Monte Carlo of 400,000 samples carries its own sampling noise, and agreement at that level is the best a particle count can buy.

Identical to twelve decimals would be the WEAKER result on those rows, because that is what two copies of one calculation produce. If the train golden ever matched the engine to machine precision, the right conclusion would be that the oracle had stopped being independent.

## What a group is

Each row of that table is a golden GROUP, a family of published cases for one device or one quantity, run at conditions chosen to straddle whatever the family pins. The row count beside each one says how many cases carry the comparison, which is worth knowing before you quote a gap.

## The reading rule

So a gap is evidence in two directions, and both have to be checked.

A gap larger than the method justifies is a disagreement worth chasing. A gap SMALLER than the method justifies means the two sides are sharing something they were supposed to derive separately, and that is the quiet failure, the one that lets a bent engine and a bent oracle agree perfectly.

Before quoting any agreement, ask what the two routes were and what noise each carries.

## Exercise

For each of the six rows above, write down the two methods being compared and the noise floor you would expect from them.

Then pick the row whose gap you would most want to shrink, and say what would have to change to shrink it honestly.
