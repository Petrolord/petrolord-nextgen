# The eleven metre disagreement

Subtract one prediction from the other.

$$1682 - 1671 = 11$$

The spread between the two estimates is 11 m. It is one of the six graded readings in this tier, to a tolerance of 0.01 m, and it is the number the rest of the course is built on. This lesson finds out exactly where it comes from, because a quantity you can only observe is much less useful than one you can account for.

## It is not arithmetic error

Rule that out first, since it is the explanation most people reach for.

Every step in both branches is exact. The A-to-B intervals of 140, 150 and 133 m sum to 423, which divides by 3 to give 141 m with nothing left over. The SAND-to-B intervals of 92, 97 and 87 m sum to 276, which divides by 3 to give 92 m, again exactly. Both anchors are integers. Both predictions are integers. There is no rounding anywhere in either chain, so there is no accumulated rounding to blame, and 11 m is not the residue of sloppy division.

The gap is real and it is in the geology.

## Where the 11 m comes from

Write the two predictions out as expressions rather than numbers. Let $A_4$ and $S_4$ be Ekene-4's measured TOP_A and TOP_SAND, and let the bars denote three well means.

$$\text{layer-cake} = A_4 + \overline{(A \to B)}$$

$$\text{from TOP\_SAND} = S_4 + \overline{(S \to B)}$$

Subtract the first from the second and the mean terms collect:

$$\text{spread} = (S_4 - A_4) - \left[\overline{(A \to B)} - \overline{(S \to B)}\right]$$

Now read each piece. The first bracket is Ekene-4's own TOP_A to TOP_SAND interval, which is $1590 - 1530 = 60$ m. The second bracket is $141 - 92 = 49$ m, and that is not a new quantity either. In every well, the A-to-B interval is the A-to-SAND interval plus the SAND-to-B interval, so the difference of the two means is the mean A-to-SAND interval across the three contributing wells, which is 48, 53 and 46 m averaging to 49 m.

So the spread is

$$60 - 49 = 11$$

## What that identity says

Read that as an identity rather than as an approximation. It is not a rule of thumb that happens to land near 11 m on this section, and it is not an estimate of where the gap roughly comes from. It is an exact algebraic consequence of the two constructions, so it holds for any well, any pair of markers and any set of contributing wells, with no error term left over.

What it says is that the disagreement between the two methods measures exactly one thing: how far the target well's section above TOP_SAND departs from the same stretch in the wells you borrowed from. Nothing else enters. Not TOP_B's structural position, not how deep Ekene-4 sits, not the length of either projection, not the spread of the input intervals.

That turns something the previous module argued qualitatively into a quantity. The layer-cake route assumes Ekene-4 is average over the A-to-SAND stretch. It is not average there. It carries 60 m where the contributing wells average 49 m, so it is 11 m thicker than the route assumed, and the route's prediction comes out 11 m shallower as a result. The from TOP_SAND route never makes that assumption, because it starts below the stretch in question.

The 11 m is the price of the assumption the layer-cake method made, measured in metres.

## If every interval were constant

Now run the identity on a section that does not grow. If the A-to-SAND interval were the same in all four wells, then Ekene-4's 60 m would equal the three well mean exactly, the bracket would be zero, and the two predictions would agree exactly rather than approximately. The same follows if Ekene-4 merely happened to sit on the mean while the other wells varied, since the identity looks only at the target well against the average of the carriers.

That is worth stating as a general result rather than a curiosity. On a true layer cake, every anchor gives the same answer, all these methods collapse into one, and predicting a missing pick is close to free. The methods only separate when the surfaces bounding the borrowed intervals are not parallel.

So the disagreement is not evidence that one of your methods is broken. It is evidence that the section grows, which the Professional tier established independently by measuring an A-to-SAND growth range of 14 m across the four wells. The two observations are the same observation reached from different directions.

## The size tracks the size of the growth

The identity also tells you that the disagreement scales with the growth rather than being some fixed property of the technique. Ekene-4 sits 11 m above the contributing mean on the upper interval, and the predictions differ by 11 m. Had Ekene-4's upper interval been 5 m from the mean rather than 11, the two predictions would have been 5 m apart. Had it sat exactly on the mean, they would have coincided.

This is why the spread deserves to be reported alongside the prediction rather than buried. It is a readout of how far the section departs from the layer-cake assumption at the well you care about, expressed directly in the units of the answer.

One warning about the direction. The identity is signed. Ekene-4's upper interval is thicker than the mean, so the from TOP_SAND estimate lands deeper than the layer-cake estimate. In a well that ran thin over that stretch the order would reverse. Do not memorise which method gives the deeper answer, because it is a property of this well rather than of the methods.

The panel below shows both predictions and the spread between them.

{{panel:wc-prediction-explorer}}

## Exercise

Using the identity rather than by rerunning the two predictions, work out what the spread would be if Ekene-4's TOP_SAND had been picked at 1580 m instead of 1590 m, with every other pick unchanged. Then check your answer by recomputing the from TOP_SAND prediction directly, and say why the layer-cake prediction does not move.

Self-check: Ekene-4's A-to-SAND interval would be 1580 minus 1530, which is 50 m, and the three well mean A-to-SAND is unchanged at 49 m, so the spread would be 50 minus 49, which is 1 m. Checking directly, the from TOP_SAND prediction becomes 1580 plus 92, which is 1672 m estimated, and 1672 minus 1671 is 1 m, which agrees. The layer-cake prediction does not move because it is built from Ekene-4's TOP_A of 1530 m and the mean A-to-B interval of 141 m, and neither of those involves Ekene-4's TOP_SAND at all. Note how much closer the two methods would agree in that case, which is the identity saying that a well sitting nearer the average upper thickness is a well where the anchor choice matters less.
