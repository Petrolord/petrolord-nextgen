# Quality control

A correlation is an interpretation, and interpretations leave your desk and become somebody else's input. The mapping geologist contours your tops. The volumetrics run multiplies your thicknesses. Neither of them will re-check your picks. So the last thing you do before handing anything over is run a short list of checks, each one designed to catch a specific way correlations go wrong.

Six checks. None takes more than a minute, and each one has a clear pass condition.

## Name consistency

Count the distinct top names in the project and compare that count against the surfaces you believe exist. Ekene has four surfaces and should show four names: TOP_A, TOP_SAND, BASE_SAND, TOP_B.

If a fifth name appears, carrying a single well and nothing else, you have almost certainly found a typo rather than a discovery. A phantom surface with one well on it is what a mistyped name looks like from the software's side, because matching is by exact name and a name that does not match is a new surface. The fix is to correct the name in the tops table, not to invent geology that explains it.

## Ordering within each well

Inside every well, the surfaces must appear in the same stratigraphic order. TOP_SAND sits above BASE_SAND in Ekene-1, in Ekene-2, in Ekene-3 and in Ekene-4, without exception.

The check that catches a violation is arithmetic. Compute base minus top for the zone in each well. Every answer must be positive. A negative thickness is not a small error or an unusual case; it is impossible geology, and it means the two picks were swapped when they were entered. Software will happily draw it. Only you will notice.

## Thickness plausibility

Look at the spread of the zone thickness across the wells and ask whether it is a story you can tell.

The Ekene sand reads 32, 36, 29 and 25 m, so it ranges from 25 to 36 m, an 11 m spread on a mean near 30.5 m. That is a gentle, believable variation: the same sand body, thickening modestly in one direction. Nothing there needs explaining beyond ordinary depositional variation.

Now imagine one well reading 3 m, or 300 m. Either would be a demand for explanation. Three metres might be a genuine thin edge, or it might be a pick placed on the wrong log character. Three hundred metres might be a stacked sequence, or it might be a base pick that landed on the wrong surface entirely. The point of the check is not that extreme numbers are forbidden. It is that they must be accounted for out loud, and the ordinary ones do not have to be.

## Line behaviour

Watch how the correlation lines run across the panel. Lines belonging to different surfaces should never cross each other.

A crossing means that two surfaces swap order somewhere between two wells: one is above the other in the left well and below it in the right well. Ordinary layered stratigraphy does not do that. A crossing is a red flag, and the first suspect is a mis-entered pick in one of the two wells at either end of the crossing, not a real geological inversion.

## Missing-top accounting

Check that every statistic you quote is labelled with the number of wells behind it.

Three of the four Ekene wells carry TOP_B; Ekene-4 does not. So every TOP_B statistic in your report is a three-well number: its relief, its average spacing below the sand, anything else. Quote it as a four-well figure and you have not made an arithmetic mistake so much as a claim about data you do not have. The correlation line already shows the truth by stopping short of Ekene-4. Your write-up should agree with the picture.

## Datum sanity

The last check is the fastest, and it verifies that the view is doing what you asked. On a flattened panel, the datum top must display at exactly the datum depth in every well. Flatten Ekene on TOP_SAND at 1500 m and all four sand tops read 1500 m. Not 1499, not 1501.

If one well does not comply, there is a single likely reason: that well lacks the datum top, so there is no shift to compute for it, and it is drawn at its true depth alongside wells that have been moved. That well is the odd one out in the display, and any depth you read from it is on a different footing from its neighbours. Spot it here, before you read numbers off the panel, and not afterwards.

## Exercise

You receive a four-well correlation. The zone thickness in the third well computes to -7 m, and one correlation line crosses another between wells two and three. Which two checks have failed, and what is the single most likely cause?

Self-check: ordering within a well has failed, since a negative thickness is impossible and means the top and base picks in that well were entered swapped. Line behaviour has also failed, because the crossing is the same swap seen from the section view: with the two picks reversed in one well, the two lines must trade places between it and its neighbour. One data-entry error explains both symptoms, which is the usual pattern. Fix the picks, then re-run every check from the top rather than only the two that flagged.
