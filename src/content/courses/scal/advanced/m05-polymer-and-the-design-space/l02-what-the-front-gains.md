# What the front gains

Lesson 1 slowed the water down and predicted, from geometry alone, that the front must sharpen and breakthrough must arrive later in pore volume terms. This lesson runs the Welge construction on the thickened case and prices the prediction exactly. Every number below is the engine's own, from `analyzeDisplacement` with `polymerMuMult` 4 on the unchanged Ekene Corey set.

## The polymer Welge set, next to the base case

| quantity | base flood | polymer at multiplier 4 |
|---|---|---|
| effective water viscosity, cp | 0.5 | 2 |
| endpoint mobility ratio M | 1.2 | 0.3 |
| front saturation $S_{wf}$ | 0.6372 | 0.7044 |
| fractional flow at the front $f_{wf}$ | 0.8682763300877854 | 0.944618996806389 |
| tangent slope $f'_{wf}$ | 3.023246274678918 | 2.665403489860014 |
| pore volumes at breakthrough $Q_{iBt}$ | 0.33077027444818546 | 0.3751777184221064 |
| average saturation behind the front | 0.6807702744481854 | 0.7251777184221064 |
| displacement efficiency at breakthrough $E_{Dbt}$ | 0.5088773453049006 | 0.5771964898801638 |
| ultimate ceiling $E_{Dmax}$ | 0.6153846153846154 | 0.6153846153846154 |

Read the table twice, once for what moved and once for what did not.

## What moved

The front saturation jumps from 0.6372 to 0.7044. The shock now arrives at the producers carrying a much wetter mixture behind it, but the mixture behind the front is what has already been swept, and sweeping to a higher saturation before water shows up is precisely the win. Breakthrough itself is postponed from 0.33077027444818546 to 0.3751777184221064 pore volumes: the flood works longer in its clean, water-free phase.

The headline is the last movable row. Displacement efficiency at breakthrough rises from 0.5088773453049006 to 0.5771964898801638, a gain of about 0.068, close to seven saturation points of the oil column delivered by breakthrough rather than dribbled out afterwards through the long post-breakthrough tail. The same barrels exist in both floods; the polymer flood hands a far larger share of them over before the water cut begins to climb. Since the Welge identities still hold, you can check the machine: the average behind the front is $S_{wc} + Q_{iBt} = 0.35 + 0.3751777184221064 = 0.7251777184221064$, and dividing $(0.7251777184221064 - 0.35)$ by $0.65$ returns the graded 0.5771964898801638 exactly.

Notice also the tangent slope falling from 3.023246274678918 to 2.665403489860014. A shallower tangent is the geometric signature of the whole story: the tangency point has slid up and to the right along a curve that itself moved right.

## What did not move

$E_{Dmax}$ is identical in both columns: 0.6153846153846154, which is $(1 - 0.25 - 0.35)/(1 - 0.35)$ and contains no viscosity at all. Polymer changes how fast and how cleanly you approach the ceiling. It cannot raise the ceiling by a single barrel, because the ceiling is set by the endpoints, and the multiplier touches neither $S_{or}$ nor $S_{wc}$. The oil left behind at residual is left behind in both floods.

## At the panel

{{panel:sc-design-explorer}}

In polymer mode with the multiplier at 4, find the tangent construction drawn on both curves. Watch two things as you sweep the multiplier from 1 to 6. First, the tangency point walks up the polymer curve while the base tangent stays fixed: that walk IS the $S_{wf}$ column of this lesson. Second, the $E_{Dbt}$ tile climbs while the $E_{Dmax}$ tile never moves, whatever you do to the slider. The panel is the fastest way to internalize which numbers belong to the path and which to the destination.

## The misconception to avoid

The trap in this module is hearing "polymer improves recovery" and concluding that it raises ultimate recovery from the rock it sweeps. Within this one dimensional, homogeneous model it does not, and the table proves it: the ceiling row is untouched. What polymer buys here is timing and water handling, more of the recoverable oil before breakthrough and a shorter, cleaner tail after it. In a real heterogeneous field polymer can also improve volumetric sweep, but that mechanism lives in the Waterflood course's territory, not in this displacement model, and quoting this model as evidence for it is claiming a result the machinery cannot produce.

## Exercise

First, verify the polymer column's internal consistency the way an examiner would: from $f'_{wf}$ 2.665403489860014 alone, recompute $Q_{iBt}$, the average saturation behind the front, and $E_{Dbt}$, and confirm all three against the table.

Second, the base flood reaches breakthrough at 0.33077027444818546 pore volumes with efficiency 0.5088773453049006. State what fraction of the ULTIMATE ceiling each flood has achieved by its own breakthrough, base and polymer, and write one sentence on which flood leaves less work for the post-breakthrough phase.
