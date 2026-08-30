# Drag is a difference, not a force

A distinction that changes how the number is used.

## The confusion

People say "the drag is 300 kN" as if drag were a thing the model computes directly. It is not.

The model computes a hookload for each operation. Drag is what you get by subtracting two of them, and which two you subtract determines what the number means.

## The three differences in common use

**Pick-up drag** is pick up minus rotating off bottom. It is the extra force needed to overcome friction while moving up.

**Slack-off drag** is rotating minus slack off. It is the force friction contributes while moving down.

**Total swing** is pick up minus slack off, which is the sum of the two.

A report quoting "drag" without saying which is ambiguous by up to a factor of two.

## Why the two are not equal

On the slant well the pick-up drag is 283854.6955946804 N and the slack-off drag is 215415.90005711443 N. They differ by about 68 kN.

The friction COEFFICIENT is identical in both cases. What differs is the normal force, because the normal force depends on tension and the tension depends on which way the string is moving.

Tripping out, friction adds to the tension all the way up, so the string is more tensioned, so it presses harder into every curve, so friction is larger. Tripping in, the reverse. It is a positive feedback in one direction and a negative one in the other.

That is why the two drags diverge more as the well gets more deviated. On the horizontal well the pick-up drag is 310787.08592211816 N and the slack-off drag is 338945.1734047615 N, and there the ORDER has reversed.

## The reversal is worth a pause

On the horizontal well slack-off drag exceeds pick-up drag. That is because tripping in puts the string into COMPRESSION rather than tension, and a compressed string in a curve is pushed against the wall by a different mechanism, but the geometry keeps producing normal force from the weight term regardless.

The lesson is that the tidy ordering people carry in their heads, pick-up drag is the big one, is a property of moderately deviated wells and not a law.

## What to do with it

Use the DIFFERENCE, not the absolute value, when you are tracking hole condition. The absolute hookload grows every connection because the string is getting longer, and the growth swamps whatever you are trying to see.

Use the absolute value when you are checking a rating, because the derrick does not care what the friction contributed.

## Exercise

Compute all three differences for the build-and-hold well from the panel's numbers.

Then say which of the three you would plot against depth to monitor hole cleaning during a lateral, and why the other two would be worse for that purpose.
