# Where the verdict flips

Between two neighbouring settings of one optional argument, a squeeze stops being a candidate and becomes a block. No datum moves.

{{panel:pd-candidate-explorer}}

## The two rows either side of the line

On teaching well ELELENWO-4, a teaching case and not a published one, the derived sweep crosses the mechanism boundary between two neighbouring dial settings.

| lateFraction | Window starts, days | Derivative slope | Mechanism | Water shutoff |
| --- | --- | --- | --- | --- |
| 0.60 | 138.369943 | 1.387035000 | channelling | candidate |
| 0.70 | 76.510604 | 1.336892539 | channelling | candidate |
| 0.80 | 42.305954 | 1.292632524 | displacement | blocked |
| 0.90 | 23.392754 | 1.254360095 | displacement | blocked |

`channellingSlope` is 1.3. The flip happens because 1.336892539 sits above it and 1.292632524 sits below it. Every slope is fitted on the positive-derivative samples inside the window each row names.

## What the screening says on each side

At `lateFraction` 0.5, with the mechanism channelling, the water shutoff squeeze comes back a candidate with three reasons: that water cut is 75 percent and the derivative is climbing, which says the water has a path of its own; that a squeeze or a gel has somewhere to go and something to seal; and that the reading is low confidence, so confirm it with a production log before committing.

At `lateFraction` 0.9, with the mechanism displacement, the same well row returns the water shutoff blocked on one reason, "Water cut is 75 percent and the derivative is flat", with the block reason "The diagnostic says ordinary displacement. The water is arriving because the reservoir is swept, which is not a well problem and no treatment on this well will change it."

That is a categorical refusal. Nothing about the well changed between the two runs.

## The rest of the ranking moves too

At 0.5 the ranked order is matrix acid, water shutoff, recompletion as candidates, then hydraulic fracture, gas shutoff, artificial lift as consider, then rate reduction as no. At 0.9 recompletion falls from candidate to consider, because it is a candidate when the mechanism is channelling or the skin is above 8, and the water shutoff drops to the bottom of the list, blocked.

One optional argument moved two verdicts and reordered the list a planner reads first.

## The mistake

Recording the screening verdict without the window that produced it. A file that says "water shutoff: blocked" on this well is true and useless, because the same well at a different fraction says candidate with three reasons.

## What it refuses

The screening reads `diagnosis.mechanism.id` and nothing else about how the diagnosis was reached. It cannot see `lateFraction`, cannot see `lateFromT`, and issues both the candidate and the block with the same certainty.

## Exercise

Run ELELENWO-4 at `lateFraction` 0.70 and 0.80 and record the derivative slope, the mechanism and the water shutoff verdict at each.

Then say how far the slope moved between them, and what that distance is worth against a threshold of 1.3.
