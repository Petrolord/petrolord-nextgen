# Working the capstone

Six numbers, from the allocation matrix through the pattern ledgers to the injectivity and water-arrival diagnostics. This lesson walks the mechanism for each and names the mistake most likely to produce a near-miss.

## What you are given

The 216 per-well ledger rows and the surveillance rows. The allocation matrix: Ekene-2 to Ekene-6 0.45, Ekene-1 0.30, Ekene-3 0.15; Ekene-4 to Ekene-3 0.40, Ekene-6 0.35, Ekene-5 0.10. The two patterns: North holding Ekene-1 and Ekene-6, South holding Ekene-3 and Ekene-5. The frozen factor set. The 2050 psia injection reference. A three-period window and a target VRR of 1.0 where advice is asked for.

## Field 1: out-of-zone injection

Total the injected volume, allocate it through the matrix, and report the remainder that lands on no producer. Equivalently: for each row, multiply the injected volume by one minus that injector's row sum, and total.

The check: your answer should be close to twelve percent of the total injected, because the two row shortfalls of 0.10 and 0.15 combine with the 0.6 to 0.4 injection split to give exactly 0.12.

The likely mistake is applying a single average shortfall to the field total rather than each injector's own shortfall to its own volume. On Ekene the split is fixed so those agree, but the habit is wrong and on a field with varying splits it would not.

## Fields 2 and 3: North and South cumulative VRR

Build each pattern's periods, then run the same voidage calculation you already know. Production sums over the pattern's producers only. Injection is the allocation-weighted share of BOTH injectors, not just the one in the pattern's name.

That last point is the likely mistake. The North element receives 0.75 of Ekene-2's water AND 0.35 of Ekene-4's. Using only Ekene-2 gives a North cumulative VRR that is too low by roughly a third.

The check: North should be well above the field value and South well below, and the two produced voidages should be within a few percent of each other.

## Field 4: South recommended injection

Compute the South element's rolling VRR over the last three periods, take the scale as target over current, and apply it to the average allocated injection into the element over those same three periods.

Two mistakes to avoid. Using the cumulative VRR rather than the rolling one gives a slightly different scale, and on this element the two are close enough that the error is a near-miss rather than an obvious failure, which is worse. And the baseline is the ALLOCATED injection into the pattern, not the raw injection of the injectors that feed it.

The check: the scale should be above 1.6 and the result should be an increase of roughly two thirds.

## Field 5: the Hall slope ratio for Ekene-4

Build the Hall plot on pressure ABOVE the 2050 psia reference, not on the absolute wellhead pressure. Divide the points into thirds, fit a least squares slope to the first third and to the last third, and take the ratio.

This field exists to test the convention. On absolute pressure you get 1.0669369155108472 and on above-reference you get the graded answer. The prompt states the reference explicitly, so read it.

The check: the answer should be recognisable as a simple ratio of two injectivity indices, and the two fitted slopes should be recognisable as their reciprocals.

## Field 6: the Chan late-time slope on Ekene-6

Build the water oil ratio series for Ekene-6 from the surveillance rows, take its derivative with respect to time, and fit the late-time slope on log-log axes. Classify it against the thresholds: at or above 0.4 is channelling, at or below 0.0 is coning, between them is transitional.

Two mistakes to avoid, and both return a plausible number rather than an obvious failure. The first is fitting the slope of the WOR itself instead of the slope of its derivative. The second is reading the FIELD curve, which the engine also produces, rather than the Ekene-6 producer curve. The field number is the aggregate of every producer and it is close enough to Ekene-6's to look right.

The check: the answer should sit well above the 0.4 channelling threshold, and it should be the LARGER of the two producer slopes the engine returns. Only two producers get a curve at all. Ekene-1 has six wet months against a ten-point minimum and Ekene-5 has never broken through, so a run that returns three or four producer curves has picked up something that is not water arrival.

## Using the panel

{{panel:wf-pattern-explorer}}

Set the target to 1.0 and the window to 3, which are the capstone settings, and step through both patterns. Fields 1 to 4 are all readable in the tiles. Fields 5 and 6 are diagnostics rather than ledger quantities, so they are not in this panel; work those from the definitions above.

## The general advice

Every one of these six is a composition of things you did in the Associate tier with one new input. When a number is wrong, check the new input first: the allocation, the pattern definition, the window, the pressure convention. The voidage arithmetic underneath is the same arithmetic that already worked.

## Exercise

First, for each of the six fields, write down the single input that would have to be wrong to produce a plausible but incorrect answer, and how you would detect it.

Second, compute field 1 two ways, once by allocating row by row and once by applying the twelve percent shortcut, and confirm they agree. Then state the field condition under which they would not.
