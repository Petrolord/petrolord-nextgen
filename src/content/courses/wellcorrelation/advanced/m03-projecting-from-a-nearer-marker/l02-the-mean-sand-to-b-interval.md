# The mean SAND to B interval

This lesson produces one number, the mean TOP_SAND to TOP_B interval across the three wells that carry both surfaces. It is 92 m, and it is one of the six graded readings in this tier, to a tolerance of 0.01 m. Getting it takes three subtractions and a division. Understanding what it is worth takes the rest of the lesson, and that part matters more, because this average is the assumption the next prediction rests on.

## The three intervals

Only Ekene-1, Ekene-2 and Ekene-3 can contribute. Ekene-4 is the well you are predicting, so it has no TOP_B to measure to, and using it would be circular.

In each contributing well the interval is the TOP_B depth minus the TOP_SAND depth, both measured, both from that same wellbore.

Ekene-1: $1640 - 1548 = 92$ m.

Ekene-2: $1662 - 1565 = 97$ m.

Ekene-3: $1628 - 1541 = 87$ m.

Compute all three before looking at any of them. An interval read off a panel by eye is a guess, and the three numbers are close enough together that eye estimates would not separate them reliably.

## The mean

$$\frac{92 + 97 + 87}{3} = \frac{276}{3} = 92$$

The mean TOP_SAND to TOP_B interval is 92 m.

Two things about that result are worth pausing on. The sum divides exactly, so there is no rounding to declare, which is a small mercy and not something you should expect in general. And the mean happens to equal Ekene-1's own interval of 92 m exactly. That is a coincidence of this fixture rather than a feature of the method. A mean is not obliged to land on one of its inputs, and reading anything into the match would be a mistake. If Ekene-1's TOP_B had been picked one metre deeper the mean would be 92.33 m and nothing about the method would have changed.

## The spread of the inputs

Three numbers, 87, 92 and 97 m. The spread is the largest minus the smallest, $97 - 87 = 10$ m. Ekene-3 is the thin end and Ekene-2 the thick end.

Quote that spread whenever you quote the mean. A mean on its own hides how much its inputs disagreed, and the disagreement is the part that tells you how much the section varies over the stretch you are about to borrow.

## The tighter spread is itself evidence

Now compare. The previous module averaged the TOP_A to TOP_B intervals of 140, 150 and 133 m, which spread $150 - 133 = 17$ m, to a mean of 141 m. The intervals in this lesson spread 10 m.

Ten metres against seventeen is not a small difference in kind. It says that the stretch of section between TOP_SAND and TOP_B is more consistent from well to well than the stretch between TOP_A and TOP_B. Both stretches vary, so neither is a layer cake, but one of them varies less.

That is a piece of evidence about the section, and you got it for free while computing the mean. It carries two consequences.

The first is about the assumption you are making. Borrowing an interval means asserting that Ekene-4's value resembles the wells you measured. That assertion is safer when the measured wells agree with each other closely, because their agreement is the only direct evidence you have that the interval is stable in this area. A borrowed interval with a 10 m spread behind it is a smaller claim than a borrowed interval with a 17 m spread behind it.

The second is about where the extra variation in the longer interval comes from. The A-to-B interval contains everything the SAND-to-B interval contains, plus the A-to-SAND section on top of it. The Professional tier measured that upper stretch at 48, 53 and 46 m in these three wells, which is where a good part of the extra spread is coming from. The longer interval is not noisier at random. It is longer, and it has absorbed a variable stretch that the shorter one leaves out.

## What the spread is not

It is not an error bar on the mean, and it should not be quoted as one. It is the observed range of three measurements, and three is a small number. A fourth well carrying both tops could sit outside 87 to 97 m and would widen the range rather than tighten it, so treat 10 m as a statement about the wells in hand rather than about the field.

It is also not the uncertainty on the prediction you are about to make. That quantity arrives in the next module and it is produced a different way.

The panel below reports the mean interval alongside the three measurements it came from, so you can see the spread and the average together.

{{panel:wc-prediction-explorer}}

## Exercise

Recompute the mean TOP_SAND to TOP_B interval with Ekene-2 excluded, then say what the exclusion does to both the mean and the spread, and state the one condition under which dropping a well from an average like this would be defensible.

Self-check: with Ekene-2 gone the remaining intervals are 92 m in Ekene-1 and 87 m in Ekene-3, so the mean is 179 divided by 2, which is 89.5 m, and the spread falls from 10 m to 5 m. The mean has moved 2.5 m shallower and the apparent consistency has improved, which is the trap, since the spread narrowed because a measurement was removed rather than because the section became more uniform. Dropping a well is defensible only when there is an independent reason to believe its picks are wrong, such as a mispicked top, a depth reference error or a fault cutting out section, and never because its value is inconvenient or sits at the edge of the range. Ekene-2 offers no such reason here, so all three wells stay in and the mean remains 92 m.
