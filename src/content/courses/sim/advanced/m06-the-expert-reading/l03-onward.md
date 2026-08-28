# Onward

Three tiers, one deck, and no simulation. This last lesson is about what to carry.

## The three things this course taught

**Which section a number lives in, and what it does there.** A deck is six sections in a fixed order, and a keyword in the wrong one is a different deck. That sounds like trivia until the first time an error message points at a line that is not the line with the mistake in it.

**Where each number came from.** Nine hundred column depths from six measurements. A designed fluid rather than a correlated one, differing by several percent on the same oil. A layer column from a sweep analysis, rock curves from a Corey fit, a history from a monthly ledger. Every number in a deck is a measurement, a correlation, a convention or a decision, and being able to say which is the whole skill.

**What was decided, and by whom.** The clipping convention, the calibration target, the completion strategy, the control mode of the history. None of those is visible in the output and every one of them changes it.

## The three findings on Ekene

The deck reproduces the booked volume to within a tenth of a percent, because one free parameter was set so it would, at the cost of an oil area 57 percent larger than the booking's.

The deck's fluid is the field's designed fluid and not the correlated one, and the two differ by 2.4 percent on the formation volume factor and 5.5 percent on solution gas. Carrying the wrong one would have moved the oil in place, every voidage ratio and the mobility ratio at once.

And five of the six wells sit exactly where the grid can honour them, while Ekene-2 sits half a cell off the lattice and inherits a depth 0.68 m from its own log. That is a gridding loss rather than an interpolation loss, and no better interpolator fixes it.

## What to do next on a real deck

The order this course implies.

**Read the six sections and note their line ranges.** That gives you the shape before a single number.

**Run the four external comparisons.** Wells against the logs, volume against the booking, history against the production database, fluid and rock against the earlier analysis. An hour, and it catches the errors that otherwise surface after a month of history matching.

**Find what was calibrated.** Something usually was. If nothing was, ask why the model agrees with anything.

**Read the warnings once.** Decide which classes are expected, then watch for new ones.

**Ask what would falsify it.** If nothing could, the model is not making a claim.

## The habit that generalises

Every tier of this course came back to the same question in a different form: where did this number come from, and what was assumed to get it.

That question is not specific to decks. It is the question the material balance course asked about an oil in place, the SCAL course asked about a relative permeability curve, and the waterflood course asked about an allocation matrix. A deck is simply the place where all of those answers end up in one file, in plain text, where anybody can check them.

Which is the best argument for reading one.

## Exercise

First, write down the five steps you would take on an unfamiliar deck, in order, with the time you would allow for each.

Second, for the last model you worked on or read about, name one number that was a decision presented as a measurement, and say how you would have found out.
