# The height the wetted area stops at

{{panel:fc-fire-drum-explorer}}

A pool fire heats the shell it can reach. Above some height the flame no longer wets the vessel, and area above that height contributes nothing to the duty. API 521 carries a limit for this, and it is 25 ft above grade.

## The limit as this package holds it

No copy of the standard sits in this package, so the 25 ft height is held for literature. It is taught as a stated limit with its reference named, and it is never derived here and never argued with. Every engine that types a published limit owes the reader that admission, and this one makes it in the plainest possible way: the height limit arrives as a note attached to every pool fire duty the route returns.

The note reads `wetted area counts only to 25 ft above grade (API 521); truncate the level before calling`. Those are the engine's own words, quoted here so a learner recognises them on the screen.

## Why the engine cannot apply it

Read the note again and notice what it asks for. The limit is 25 ft above GRADE. The wetted area route is told a diameter, a length, an orientation and a liquid level. It is never told where grade is.

A vessel sitting on a plinth, a vessel on a platform two decks up, a vessel in a bunded pit: all three can carry the same liquid level and present completely different amounts of shell below 25 ft above grade. The plot elevation is the missing input, and the engine does not invent it. So the truncation is the caller's job, the note says so, and the note is on every duty rather than only on the ones the engine suspects.

That is a better design than a guess. A route that silently clipped a level at 25 ft would be wrong for every vessel whose bottom tangent sits above grade, and it would be wrong without saying anything.

## Where the limit bites hardest

| orientation | what the limit does |
| --- | --- |
| horizontal | usually nothing, because the shell is low and the level is clamped at the diameter |
| vertical | often everything, because a tall tower can carry liquid far above the flame's reach |

A horizontal vessel a few feet across rarely has shell above 25 ft unless it is mounted high. A vertical tower is the opposite case: the wetted area rises with the level for as long as the vessel does, and the reachable part stops long before the vessel does.

The published set has one row that sits exactly on the limit. A vertical vessel 6.000000 ft across and 25.000000 ft long, wetted to 25.000000 ft, returns 471.2389 ft2. That row is the whole tower wetted, and it is also the largest height this set exercises. A caller with a taller tower is past the limit and has to trim.

## The reading habit

Two things go in your notes for every fire case. The level you typed, and the grade elevation you trimmed it against. A wetted area without both of those beside it cannot be checked by anyone, including you next month.

## Exercise

Quote the engine's note on the height limit and say which piece of information it needs that the route is never given. Then name the published vertical row that sits on the limit with its three geometry figures and its area, and say which orientation the limit usually bites hardest on.
