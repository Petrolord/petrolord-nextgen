# The barrier outside the pipe

A perfect plug inside the casing seals nothing if the annulus behind it is open.

{{panel:wi-pa-explorer}}

## Two paths, one depth

At any depth in a cased hole there are two ways past. Inside the pipe, and outside it. A cement plug closes the first. The second is closed by cement in the annulus, or it is not closed at all.

A permanent barrier is supposed to seal the full cross section of the well. So the barrier at a given depth is a pair: the plug in the bore, and the annular cement behind the casing across the same interval. Grade one and ignore the other and you have graded half a barrier.

## What the engine checks

`annularBarrierCheck` takes an interval and a flag. `topMdM` and `bottomMdM` give the cemented length, `verifiedByLog` says whether a cement evaluation log has been run over it. It returns the required length, the actual length and a pass.

That is all it does. It knows nothing about the plug, nothing about the casing size and nothing about what is on the other side of the cement. Pairing the annular interval with the right plug interval is your job, and the engine will happily grade a cemented interval that has no plug anywhere near it.

## The published pairing

The worked case carries an annular interval from **2400 to 2440 m MD**, a length of 40 m. P1 reservoir primary runs 2380 to 2520 m MD. The annular interval overlaps the plug, which is the arrangement you want, and the two are graded separately.

## When there is no cement out there

The programme handles that case as an operation rather than a verdict. Phase 2 of the published abandonment programme is a single step: cut and retrieve casing above the deepest intermediate barrier where annular cement is absent.

That is the honest answer to an open annulus. You cannot argue an uncemented annulus into being a barrier. You remove the casing so that the plug you set is against formation and there is only one path again.

## What the engine refuses

If the interval has its bottom at or above its top, the engine throws. `Annular cement needs bottom below top.` There is no zero length annular barrier.

## Exercise

1. Grade the published annular interval and read the length back.
2. Sketch a plug and an annular interval that do not overlap, and say which depths are actually sealed on both paths.
3. For one casing string you know, state where the top of cement is and how it was established.
