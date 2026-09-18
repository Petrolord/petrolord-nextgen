# The capstone worked

A reading is the whole chain on one exchanger, worked in order, with every figure named as computed or chosen at the step that produces it. Here it is on ORON, the second teaching exchanger of this course, which has four tube passes. Work it on paper before reading the values. The order is the lesson.

{{panel:fc-exchanger-explorer}}

## One, the capacity rates

The hot stream is 74000.0000 lb an hour at 0.620000 Btu per lb per degF, which is 45880.0000 Btu an hour per degF. The cold stream is 112000.0000 lb an hour at 0.990000, which is 110880.0000. Four chosen, two computed. The hot rate is the smaller, so on ORON the hot stream governs.

## Two, the duty

ORON states its hot outlet, so the basis comes back as `hot outlet`. The duty is 5046800.0000 Btu an hour and the cold stream leaves at 167.515873 degF. One figure chosen, two computed, and the engine names which of the three statings it worked from.

## Three, the driving force

Under counter flow the two ends are 177.484127 and 113.000000 degF and the log mean is 142.824087 degF. Check the limit here: the arithmetic mean of those ends is 145.242063 degF, and the log mean sits below it, as it must whenever the ends differ.

Under parallel flow the same four terminals give 130.108390 degF. One word changed, and the driving force went down.

## Four, the surface

The coefficient is 106.971929 Btu an hour per ft2 per degF, referred to the outside tube surface, and the correction factor is 1.000000 because the arrangement is counter. Divide the duty by those and by the log mean: 330.327560 ft2. The coefficient is the one figure this tier takes as given.

## Five, the tubes

One tube on ORON carries 5.235988 ft2. The surface over that, rounded up to a whole tube and then up to a whole multiple of the four passes, is 64 tubes at 16 a pass. Those 64 tubes carry 335.103216 ft2, which is 1.445734 percent above the surface asked for.

## Six, the loop

ORON's seed ladder is 4, 24, 120 and 600 tubes. Its trail is 4, then 56, then 64, converged in three passes. And the chain closes: the coefficient times the surface required, times the correction factor, times the log mean is 5046800.0000 Btu an hour, against a duty of 5046800.0000.

## What is checked

Six figures in a reading like this are worth checking against another person's work: the duty, the cold outlet, the log mean, the surface required, the surface of one tube and the margin over it. All six are continuous, so a comparison has a middle: it can be close, and how close means something.

The tube count is not on that list and that is not an oversight. A count is a whole number, so a comparison on it is exact or out by a whole tube. The count is the thing to understand. The margin is the thing to compare, because it cannot come out right unless the count and both roundings did.

## Exercise

Work all six steps on ORON from the four chosen figures, then run the self-consistency check. Then repeat the reading on the studio case from memory, and write down which figure you had to look up.
