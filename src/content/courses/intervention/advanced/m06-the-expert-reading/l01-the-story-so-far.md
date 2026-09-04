# The story so far

A Chan diagnosis is a straight line fitted to part of a plot. Everything difficult about this module follows from that: the part is chosen, and the line is graded as though the part were the whole.

## The window is the analyst's, and it decides the money

On the teaching well ELELENWO-4, 38 samples with not one datum changed, the derivative slope moves from 1.229355999 at a `lateFraction` of 1.00 to 1.600276347 at 0.20, a range of 0.370920348. The threshold separating channelling from displacement is 1.3, so somewhere in that range the water shutoff turns from candidate to blocked. The dial has a default of 0.5, no guidance, no sweep helper, nothing in the return object that names its effect, and a silent clamp to 0.1 through 1.0 documented nowhere.

## The samples that disagree are removed before the line is drawn

The derivative fit is built from the late samples whose derivative is positive, so a ratio that has turned back down after a rate cut is read on the samples from before the turn. On that same well the discarded stretch fitted alone has a fit quality of 0.999955540052 as a fraction, cleaner than the 0.998513658 the engine reported for the verdict it gave. The count of removed samples is computed two lines later and read only on branches this case never reaches.

## A missing column is an answer here, not a gap

`Number(null)` is 0, and the filter requires a finite time and a finite ratio, never a finite derivative. A history exported without the Bourdet derivative column takes the flat branch and returns "nothing on this well for an intervention to fix". The same history spelled `undefined` returns not determined. Same missing data, opposite answers, and the reassuring one is the spelling every JSON export and every SQL null produces.

## The guards sit where the arithmetic breaks, not where the well does

`skinPiMultiplier` refuses only at the pole. Its refusal text advertises a different limit, that real treatments reach about -3 to -5 on acid and -5 to -6 on a fracture, and everything between is accepted in silence. On the teaching geometry an after-skin of -5 returns 6.292734624 and -6.8 returns 26.457156986, a factor of 4.204397383 with no warning and no note. In the other direction, a ratio rising exactly logarithmically has an exactly constant derivative and is refused with "the fit explains only 0.0 percent of it", on data with no scatter in it.

## And none of the verdicts is checked

The golden publishes histories, slopes, skin pairs, a geometry floor and a power law. It publishes no expected mechanism, confidence, verdict or block reason.

## Exercise

Write the four questions this tier asks of any returned diagnosis: which window, which samples survived, which column was read, and which assertion would have caught it wrong. Name a finding each one catches.
