# Updip helps, a little

The gravity number of the designed case is 0.019367108489507776. This lesson runs the full Welge construction with that correction switched on and prices exactly what ten degrees of dip buys the Ekene flood at field rate. The answer is: something real, measurable, and small. Learning to say "small" with a straight face is an Expert skill, and this lesson is where you practice it.

## The construction, repeated with dip

Nothing about the Welge machinery changes. The engine builds the corrected $f_w$ curve, finds the saturation where the secant from (Swc, 0) is steepest, and reads the front from the tangency. Only the curve underneath has moved. On the designed case the updip results are:

| quantity | flat (Associate tier) | updip 10 degrees |
| --- | --- | --- |
| front saturation Swf | 0.6372 | 0.6376 |
| fw at the front | 0.8682763300877854 | 0.8682854818839988 |
| pore volumes at breakthrough QiBt | 0.33077027444818546 | 0.33122746608174053 |
| displacement efficiency at breakthrough EDbt | 0.5088773453049006 | 0.5095807170488317 |

The graded quantity of this module's capstone is the updip EDbt, 0.5095807170488317. Set it against the flat 0.5088773453049006 and the whole story is in the third decimal place: gravity at this rate buys about 0.0007 of displacement efficiency at breakthrough, roughly seven hundredths of a saturation point. The front moved one grid step, from 0.6372 to 0.6376. The ceiling did not move at all: EDmax stays 0.6153846153846154, because endpoints alone set the ceiling and gravity does not touch endpoints.

{{panel:sc-design-explorer}}

Put the panel in dip mode with the designed defaults and read the EDbt tile against the base tile. Toggle the dip between 0 and 10 degrees a few times and watch which tiles move and by how much. Then look at the two fw curves near the toe: the separation is visible at low saturation and gone by the front. That picture is the mechanism of this whole module.

## Why so little

Two things suppress the effect. First, the correction is $G k_{ro}$, and by the front region $k_{ro}$ has decayed to 0.07157160000000001, so the curve the tangent actually touches has barely moved. Second, the Ekene flood is already favorable: at M 1.2 the flat front is sharp and efficient, sitting at 0.6372 against a ceiling of 0.6153846153846154 in ED terms, so there is little room for gravity to improve what viscosity has already done. Gravity matters most where floods are worst: a heavy oil case at high M has a long rarefied toe that a gravity term can visibly steepen. A good screening habit is to compute $G k_{ro,max}$ before anything else; here it is about 0.017, and a correction under two percent of the numerator was never going to move the front by much.

## Distinguishable by design

The capstone grades the updip EDbt at a tolerance of 0.0005, and the flat value sits 0.0007 away. That is deliberate. Submitting the Associate-tier number, the one every learner of this course knows by heart, fails the field. The tolerance was chosen so that the only way through is to actually run the corrected construction. When you build acceptance criteria of your own, copy this trick: place the tolerance so that the most tempting wrong method lands outside it.

## The misconception: dip as a rescue

The error this lesson exists to prevent is strategic, not arithmetic: seeing a marginal flood forecast and reaching for the structure map to save it. On a favorable-mobility flood at field rate, dip adjusts the third decimal of EDbt. It does not rescue anything. If a project economics case only works because of the gravity term, the project does not work. The honest uses of the term are ranking (two injection line placements, updip against downdip, lesson 4), rate design (lesson 3, where the term genuinely responds), and screening for gravity-stable opportunities (lesson 5). What the term is not is a free efficiency upgrade. The engine will happily print 0.5095807170488317, and the engineer's job is to notice that the flat case already printed 0.5088773453049006 and to report the difference as what it is.

## Exercise

First, compute the gain in EDbt from the table above as a difference, then express it as a fraction of the flat value, and state in one sentence whether that fraction survives rounding to two significant figures in a management summary.

Second, the front moved from 0.6372 to 0.6376, exactly one step of the 0.0004 Welge scan grid you met at the Associate tier. Explain why a physically continuous change in the curve produces a quantized change in the reported front, and what that implies about comparing Swf values between two nearly identical cases.
