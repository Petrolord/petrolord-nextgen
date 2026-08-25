# One well, two trends

The Associate tier ended module 4 with a finding that looked like a curiosity: the twelve shale picks fit a trend of 650.0000000000014 us/m at the mudline with a compaction constant of 0.7000000000000015 per km, while the well's own header says 656 us/m and 0.6 per km. The fit was exact, every pick sat on the fitted curve, and the conclusion was that the fit reads the data rather than the label.

At this tier that curiosity becomes the most consequential fact about the well. Eaton's ratio is measured against a trend. This well has two candidate trends, and they give different answers. Not slightly different: module 4 of this tier will show that running the same prognosis on the fitted trend more than doubles the overpressure at total depth and reports an onset at 120 m below the mudline, which is absurd on its face. Choosing the trend is the single largest decision in the method.

## Which trend the capstone uses

The capstone statement is explicit: run the pipeline on the well's own NCT, the 656/220/0.0006 of the header. Every graded number in this tier comes from that trend.

That is a deliberate choice with a physical justification, not an arbitrary one. The well's sonic was constructed on the header trend. Above 2500 m the log sits exactly on it; the encoded ramp below 2500 m was written as a departure from it. The header trend is, on this synthetic well, the true normal-compaction behaviour, in the way that only a synthetic well can have a true anything.

The fitted trend is not wrong as a fit. It is a perfect fit to the twelve picks it was given. It is wrong as a normal-compaction trend for this well, and the reason is worth stating carefully because it is the honest version of a problem every real well has: the picks carry information about where they were taken, and a fit generalises whatever bias the picking put in.

## The two curves, quantitatively

Both trends share the matrix time of 220 us/m. They differ at the mudline by 6 us/m, 656 against 650, and in the decay constant by a sixth, 0.6 against 0.7 per km. Small numbers. Here is what they do with depth.

At the mudline the gap is 6 us/m, the fitted trend below the header. At 2500 m the header trend reads 317.2847498247154 us/m, the number the Associate capstone graded. The fitted trend, decaying faster from a lower start, reads lower still. By total depth the header trend reads 259.5530276341839 us/m and the gap between the two trends has grown, because an exponential with a larger decay constant keeps pulling away.

The direction matters more than the size. The fitted trend sits below the header trend at every depth. A trend that reads low says the rock should be faster than it is, everywhere. Fed to Eaton, a low trend makes every ratio less than one, which makes every depth look at least slightly overpressured, from near the mudline down. That is where module 4's spurious 120 m onset will come from, and you can already see it coming with no computation at all.

## Why a synthetic well needs two trends

It would have been easy to build a golden well with one trend, where the picks fit the header exactly and the question never arises. That well would teach the mechanics of Eaton and nothing else, and its students would meet the trend problem for the first time on a live well with a rig waiting on the answer.

This well was built with the disagreement in it because the disagreement is the job. On a real well there is no header trend handed down from the construction of the earth. There are picks, made by a person, in shales chosen by a person, fitted by a routine, and every one of those choices moves the pressures. The two-trend structure of this well lets the tier show you exactly what the choice costs, with an answer key underneath.

So hold both trends in mind through the next two modules, which use the header trend throughout and say so each time. Module 4 then runs the other trend and counts the damage.

## Worked example

Evaluate both trends at 1000 m below mudline. The trend equation is $\Delta t_n(z) = \Delta t_{ma} + (\Delta t_{ml} - \Delta t_{ma}) e^{-cz}$.

Header trend: $220 + 436 \times e^{-0.6} = 220 + 436 \times 0.548812 = 459.282$ us/m to three decimals.

Fitted trend: $220 + 430 \times e^{-0.7} = 220 + 430 \times 0.496585 = 433.532$ us/m.

The gap at 1000 m is about 25.75 us/m, from 6 us/m at the mudline. The two trends do not run parallel; the fitted one drops away, and every metre of depth widens the disagreement the ratio will inherit.

## Exercise

Without computing anything, answer in two sentences: if the log sits exactly on the header trend at 1000 m, what will Eaton report there when run against the fitted trend, and why?

Self check: the log at 1000 m reads about 459 us/m, but the fitted trend says normal is about 434 us/m, so the ratio of trend to log is about 434 over 459, which is below one. Eaton will hand part of the stress budget to the fluid and report overpressure at a depth where the well is, by construction, exactly hydrostatic. A trend that is low everywhere manufactures overpressure everywhere; the size of the manufactured pressure, and the QC that catches it, are module 4's subject.
