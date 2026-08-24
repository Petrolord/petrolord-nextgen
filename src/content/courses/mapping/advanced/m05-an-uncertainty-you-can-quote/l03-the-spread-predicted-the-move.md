# The spread predicted the move

The jackknife was computed from six wells and no new data. Then a seventh well arrived. This lesson checks the one against the other, and the check is the strongest evidence in the tier that the method is worth running.

## The test

The jackknife said the mapped depth at P-1 sits somewhere in

$$[\,1541.9392,\ 1549.7084\,]\ \mathrm{m}$$

a range of 7.77 m, based on nothing but the six wells already drilled.

Ekene-7 was then drilled at (1500, 1500), 141 m from P-1, and added to the control. The seven-well map reads **1547.105224609375 m** at P-1.

That value is **inside the range**, at 66.5 percent of the way from its bottom to its top.

## Why this is not trivial

Three ways it could have failed.

**The move could have been outside the range.** A new well 141 m away is a large perturbation to a six-well map, and there was no guarantee that its effect at P-1 would land inside a range computed by removing wells that are all several hundred metres further off.

**The move could have been negligible.** If P-1 had barely shifted, the jackknife would have looked alarmist: a 7.77 m spread quoted around an answer that turned out to be stable to a few centimetres.

**The move could have been in the wrong part of the range.** Landing at 66.5 percent, well away from either edge, is a better outcome than landing at 99 percent, which would have suggested the range was only just wide enough.

The actual result is the middle case in every respect: a substantial move of 4.49 m, comfortably inside a range that was neither too tight nor absurdly wide.

## What it licenses

**The jackknife spread is a usable prior for the effect of new control.** On this field, a range computed by removing existing wells contained the effect of adding a new one. That is not a theorem and it is one successful test, so it should be stated as such.

**It is available before drilling.** That is what makes it worth the trouble. A number that can be quoted at the point a decision is made is more useful than one that arrives afterwards, even if the later number is better.

**It survives being checked.** The most common fate of an uncertainty estimate is that nobody ever tests it. This one was tested and it held.

## What it does not license

**One successful test is not a validated method.** The same caution the tier applied to two residuals applies here: $n = 1$.

**It says nothing about a location far from the new well.** P-1 is 141 m from Ekene-7. A location a kilometre away moved much less, and whether the jackknife would have bracketed that smaller move is untested.

**It does not make the range a probability distribution.** The seven-well value landing at 66.5 percent of the range does not mean there was a 66.5 percent chance of it landing below. Six values are not a distribution and the next lesson is about exactly that confusion.

## The pattern worth reusing

The two numbers that made the check possible were both recorded **before** the well:

- the six-well prediction at Ekene-7, 1543.3271484375 m,
- the jackknife range at P-1, 1541.9392 to 1549.7084 m.

Neither is recoverable after the seventh well is added to the control, because the map that produced them no longer exists. Writing them down is the whole discipline, and it costs one line in a notebook.

> Before a well is drilled, record what the current map predicts at the well and what your uncertainty estimate is at the location that matters. Both become testable the day the pick arrives.

## Worked example

A team records a jackknife range of 12 m at a prospect and a predicted depth of 2450 m at a planned well. The well comes in at 2451 m and the prospect moves by 0.3 m. What has been learned?

That the map was already well constrained near that well and the jackknife was conservative there. The blind residual of 1 m is small, and the prospect barely moved, so the 12 m range overstated the sensitivity at that location.

That is a useful outcome and it is not a failure. A conservative range that proves conservative is safer than a tight one that proves optimistic, and one test does not calibrate the method in either direction.

## Exercise

State the jackknife range at P-1, the seven-well value, and where in the range it falls. Then name the two numbers that had to be recorded before the well for the check to be possible.

As a self-check: the jackknife range is 1541.9392 to 1549.7084 m, a spread of 7.77 m, and the seven-well map reads 1547.1052 m at P-1, which is inside the range at 66.5 percent of its width. The two numbers recorded beforehand were the six-well prediction at Ekene-7 of 1543.3271484375 m and the jackknife range itself, neither of which can be recovered once the seventh well is in the control set, because the map that produced them has been replaced.
