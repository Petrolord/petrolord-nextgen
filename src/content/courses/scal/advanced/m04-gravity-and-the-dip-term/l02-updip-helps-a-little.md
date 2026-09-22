# Updip helps, a little

The gravity number of the designed case is 0.019367108489507776. This lesson runs the full Welge construction with the correction switched on and prices what dip buys the Ekene flood. The designed case's own answer, ten degrees at 2000 rb/d, is a capstone field, so the lesson prices a worked example beside it: five degrees updip at a slow 500 rb/d, where $G$ is 0.038882175395244155. The answer is: something real, measurable, and small. Learning to say "small" with a straight face is an Expert skill, and this lesson is where you practice it.

## The construction, repeated with dip

Nothing about the Welge machinery changes. The engine builds the corrected $f_w$ curve, finds the saturation where the secant from (Swc, 0) is steepest, and reads the front from the tangency. Only the curve underneath has moved. On the worked example the updip results are:

| quantity | flat (Associate tier) | updip 5 degrees at 500 rb/d |
| --- | --- | --- |
| front saturation Swf | 0.6372 | 0.6379999999999999 |
| fw at the front | 0.8682763300877854 | 0.8682921848421989 |
| pore volumes at breakthrough QiBt | 0.33077027444818546 | 0.3316855835254814 |
| displacement efficiency at breakthrough EDbt | 0.5088773453049006 | 0.5102855131161252 |

Set the worked updip EDbt, 0.5102855131161252, against the flat 0.5088773453049006 and the whole story is in the third decimal place: gravity at this slow rate buys about 0.0014 of displacement efficiency at breakthrough, roughly a seventh of a saturation point, and the front moves two grid steps, from 0.6372 to 0.638. The designed case, twice the sine at four times the rate, buys less, and its EDbt is the graded quantity of this module's capstone. The ceiling did not move at all: EDmax stays 0.6153846153846154, because endpoints alone set the ceiling and gravity does not touch endpoints.

{{panel:sc-design-explorer}}

Put the panel in dip mode, set the dip to 5 at 500 rb/d, and read the EDbt tile against the base tile. Toggle the dip between 0 and 5 degrees a few times and watch which tiles move and by how much; then set the designed case, 10 degrees at 2000 rb/d, for the capstone. Then look at the two fw curves near the toe: the separation is visible at low saturation and gone by the front. That picture is the mechanism of this whole module.

## Why so little

Two things suppress the effect. First, the correction is $G k_{ro}$, and by the front region $k_{ro}$ has decayed to 0.07157160000000001, so the curve the tangent actually touches has barely moved. Second, the Ekene flood is already favorable: at M 1.2 the flat front is sharp and efficient, sitting at 0.6372 against a ceiling of 0.6153846153846154 in ED terms, so there is little room for gravity to improve what viscosity has already done. Gravity matters most where floods are worst: a heavy oil case at high M has a long rarefied toe that a gravity term can visibly steepen. A good screening habit is to compute $G k_{ro,max}$ before anything else; here it is about 0.017, and a correction under two percent of the numerator was never going to move the front by much.

## Distinguishable by design

The capstone grades the designed case's updip EDbt at a tolerance of 0.0005, and the flat value sits outside it. That is deliberate. Submitting the Associate-tier number, the one every learner of this course knows by heart, fails the field. The tolerance was chosen so that the only way through is to actually run the corrected construction. When you build acceptance criteria of your own, copy this trick: place the tolerance so that the most tempting wrong method lands outside it.

## The misconception: dip as a rescue

The error this lesson exists to prevent is strategic, not arithmetic: seeing a marginal flood forecast and reaching for the structure map to save it. On a favorable-mobility flood at field rate, dip adjusts the third decimal of EDbt. It does not rescue anything. If a project economics case only works because of the gravity term, the project does not work. The honest uses of the term are ranking (two injection line placements, updip against downdip, lesson 4), rate design (lesson 3, where the term genuinely responds), and screening for gravity-stable opportunities (lesson 5). What the term is not is a free efficiency upgrade. The engine will happily print a dipped EDbt to sixteen figures, and the engineer's job is to notice that the flat case already printed 0.5088773453049006 and to report the difference as what it is.

## Exercise

First, compute the gain in EDbt from the table above as a difference, then express it as a fraction of the flat value, and state in one sentence whether that fraction survives rounding to two significant figures in a management summary.

Second, on the worked example the front moved two steps of the 0.0004 Welge scan grid you met at the Associate tier, from 0.6372 to 0.638, while the rate ladder of lesson 3 shows cases where EDbt moves and the front does not move at all. Explain why a physically continuous change in the curve produces a quantized change in the reported front, and what that implies about comparing Swf values between two nearly identical cases.
