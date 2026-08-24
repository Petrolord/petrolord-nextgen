# The shift is one subtraction

Flattening looks like a graphics operation and is not one. It is a single subtraction per well, done once when you set the datum, and everything the panel draws afterwards is that one number added to a measured depth. If you can do the subtraction on paper you can predict the whole picture.

## The rule, and the order it runs in

$$shift = datum - md(top)$$

where $md(top)$ is that well's measured depth for the flattening top and $datum$ is the depth you chose to force that top onto. Then, for any pick in that well:

$$displayed = md + shift$$

The order of the first subtraction is not a convention you can flip. The datum comes first. Reverse it and every sign in the section reverses with it, the deepest well appears to move down instead of up, and the flattening top no longer lands on the datum. That failure is loud, which is the good news: the check for it is built into the algebra, and the next section shows why.

## The four Ekene wells

This tier flattens on TOP_A at a 1450 m datum. The four TOP_A picks are 1500, 1512, 1495 and 1530 m. Subtract each from 1450.

* Ekene-1: $1450 - 1500 = -50$ m
* Ekene-2: $1450 - 1512 = -62$ m
* Ekene-3: $1450 - 1495 = -45$ m
* Ekene-4: $1450 - 1530 = -80$ m

Four subtractions, four shifts, and the flattening operation is finished. Nothing else about the wells is consulted. The TOP_SAND picks played no part, the BASE_SAND picks played no part, and the fact that Ekene-4 has no TOP_B played no part, because the shift is derived from the flattening top and from nothing else.

That Ekene-4 value of -80 m is one of the six graded numbers, with a tolerance of 0.01, so reproduce it cold. It is negative. It is not 80, and it is not $1530 - 1450$. Write the sign every time you write the number.

## Why the sign carries information

A shift is a signed displacement along a downward-increasing depth axis, so its sign says which way the column moved on the display. Negative moves a well up the panel toward shallower displayed depths. Positive moves it down.

Rank the four by magnitude and the ranking is a structural statement. Ekene-4 takes the largest move at -80 m and Ekene-3 the smallest at -45 m, which is exactly right, because Ekene-4 sat deepest on TOP_A and had furthest to travel to reach the datum while Ekene-3 sat shallowest and had least. If your deepest well ever comes out with the smallest move, the subtraction has been run backwards.

The four shifts spread from -45 to -80 m, a range of 35 m, which is the structural relief on TOP_A. That is not a coincidence and it is a useful check. The spread of the shifts always equals the relief on the flattening top, because the datum is a constant and subtracting a constant from a set of picks preserves the spread of that set.

## Applying a shift to another depth

A well's shift belongs to the well, not to the surface it came from, so the same number applies to every pick in that column.

Ekene-2's shift is -62 m, and its TOP_SAND is picked at a measured 1565 m, so:

$$displayed = 1565 + (-62) = 1503$$

Ekene-2's TOP_SAND draws at a displayed depth of 1503 m on the section flattened on TOP_A at 1450 m. That value is graded, with a tolerance of 0.01, and the full sentence is the answer rather than the bare number. Nothing in the Ekene-2 wellbore is at 1503 m. Its TOP_SAND is at a measured 1565 m and always was.

Do the same for the other three TOP_SAND picks and they display at 1498, 1496 and 1510 m for Ekene-1, Ekene-3 and Ekene-4. Read those four displayed depths as a group: 1498, 1503, 1496 and 1510 m. They are not equal, and they should not be, because TOP_SAND is not the surface that was levelled. What separates them on the display is the thickness of the interval between TOP_A and TOP_SAND, which is the reading this tier is built toward.

## The construction guarantee

Substitute the first formula into the second, for the flattening top itself:

$$displayed = md + (datum - md) = datum$$

The measured depth cancels. This is algebra rather than approximation, and it does not depend on the numbers, so it holds for every well and every dataset. On this tier's setting, all four TOP_A picks display at exactly 1450 m however deep they truly are.

That gives you the first check to run on any flattened panel, before any interpretation. Look at the flattening surface. If it is not one perfectly flat line at the datum depth, the shifts are wrong or a well lacks the flattening top, and nothing else on the panel is worth reading until you know which.

Be clear about what the check does not cover. It confirms the arithmetic was applied. It says nothing about whether the picks feeding it were correct, because a wrong pick produces a wrong shift that still lands its own surface exactly on the datum.

Try it yourself: the panel below runs the same engine, with the flattening top and the datum under your control.

{{panel:wc-flatten-explorer}}

## Exercise

Compute all four Ekene shifts for the tier setting from the pick table alone, writing each subtraction out in full with its sign. Then use Ekene-4's shift to place two of that well's other picks on the display, and state each result as a full sentence naming the datum. Finally, say what would change about the four shifts if the datum depth were moved and the flattening top left alone.

Self-check: the shifts are $1450 - 1500 = -50$, $1450 - 1512 = -62$, $1450 - 1495 = -45$ and $1450 - 1530 = -80$ m. Ekene-4's TOP_A is at a measured 1530 m and displays at 1450 m, the datum, by construction. Its TOP_SAND is at a measured 1590 m and displays at 1510 m on the section flattened on TOP_A at 1450 m. Moving the datum depth changes all four shifts by the same amount in the same direction, so the picture slides along the axis and the spread of the shifts stays at 35 m.
