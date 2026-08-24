# Projecting from TOP_A

The mean interval is in hand and Ekene-4 has a TOP_A. Putting the two together is one addition, and it produces the tier's first prediction.

$$1530 + 141 = 1671$$

The layer-cake estimate for Ekene-4's TOP_B is 1671 m, predicted. It is graded to a tolerance of 0.01 m. The rest of this lesson is about what each of those three numbers is, because the addition is trivial and the bookkeeping around it is not.

## What each term is

**1530 m is a measurement.** It is Ekene-4's own TOP_A, picked on logs in that wellbore. It is the only part of the calculation that belongs to the well you are predicting into, and it anchors the result to that specific hole.

**141 m is a mean of three intervals measured in three other wells.** No part of it came from Ekene-4. It is the average of 140 m in Ekene-1, 150 m in Ekene-2 and 133 m in Ekene-3, and it is being transferred to a well that had no say in it.

**1671 m is neither a measurement nor an interval.** It is a predicted measured depth: a depth in Ekene-4's own reference frame, arrived at by inference rather than observation. Nothing in Ekene-4 was logged at 1671 m, because the hole ended above it.

The mixed parentage of that sum is the substance of the method. One term is local and certain, the other is borrowed and averaged, and all of the uncertainty in the result comes from the second term. If the mean interval is 8 m too small for this well, the prediction is 8 m too shallow, one for one. There is no damping.

## Say predicted, every time

Write it as a predicted depth in every place it appears: in a table, in a figure caption, in a sentence, in an email. The word costs nothing and its absence costs a great deal.

The reason is mechanical rather than moral. A tops table has a column for the well, a column for the top and a column for the depth. It has no column for how the depth came to be there. Put 1671 in that third column and the number is a pick within a week, because the only thing that ever marked it as an estimate was somebody's recollection. Every convention that keeps 1671 visibly separate from 1640, 1662 and 1628 is doing real work.

So Ekene-4's TOP_B slot stays blank, the correlation line on the section still stops after the third well, and the count of wells carrying all four tops stays at 3. The estimate lives beside the data: in the report, in a clearly named estimate column no downstream process reads as picks, or drawn in a distinct style under a legend entry that says estimated.

## Sanity checks on the result

A predicted depth should be interrogated before it is released. Four checks apply here and all of them pass, which is worth seeing.

**It is deeper than the deepest pick in the well.** Ekene-4's deepest logged surface is BASE_SAND at 1615 m and the prediction is 1671 m, which is 56 m below it. A predicted TOP_B shallower than a logged BASE_SAND would place a surface above another surface it is known to sit beneath, and that is a stratigraphic contradiction rather than a large uncertainty.

**It is below total depth.** The well stopped above TOP_B, which is why the pick is missing. A prediction inside the drilled interval would contradict the reason the pick is absent in the first place.

**It is consistent with the well's structural position.** Ekene-4 has the deepest TOP_A on the section at 1530 m, so a TOP_B deeper than the three logged values is what a coherent structure would produce. At 1671 m the prediction sits below Ekene-2's 1662 m, Ekene-1's 1640 m and Ekene-3's 1628 m. A prediction that came out shallower than all three would need an explanation before it could be used.

**The arithmetic is reversible.** Subtract 141 from 1671 and you get back to 1530, Ekene-4's TOP_A. That catches a mistyped interval and takes a moment.

Note what these checks do and do not establish. They confirm that 1671 m is not absurd. They cannot confirm that it is right, because there is no measurement to compare it against. A prediction passing every consistency check is still a prediction.

## What this estimate quietly assumes

Say the assumption in a sentence a reviewer could argue with: the TOP_A to TOP_B interval in Ekene-4 is the same as its average in the three wells that carry both surfaces.

That sentence carries the full 141 m of borrowed section, from TOP_A all the way down past TOP_SAND and BASE_SAND to TOP_B. It is a long transfer, and every part of the section inside it is assumed to behave in Ekene-4 as it does on average elsewhere. The next lesson takes that sentence apart with a fact about Ekene-4 that you already know.

The panel below performs this projection from the marker you select and shows the anchor depth, the mean interval and the resulting estimate.

{{panel:wc-prediction-explorer}}

## Exercise

Take the layer-cake method and apply it to a well that does not need it: predict Ekene-1's TOP_B from its own TOP_A using the mean interval of the other two carriers, then compare your answer with Ekene-1's logged TOP_B. State what the size and direction of the miss tell you about applying the same method to Ekene-4.

Self-check: the other two carriers give 150 m in Ekene-2 and 133 m in Ekene-3, a sum of 283 and a mean of 141.5 m. Predicting from Ekene-1's TOP_A gives 1500 plus 141.5, which is 1641.5 m, against a logged TOP_B of 1640 m. The method overshoots by 1.5 m in the one well where it can be checked. That is encouraging and it is thin evidence, because Ekene-1 happens to be the well nearest the mean interval, the test rests on two wells rather than three, and Ekene-4 is the well the section has already shown to be atypical, so a miss of 1.5 m here does not promise a miss of that size there.
