# The loop, and its trail

Four links in this chain form a circle. The tube-side film needs a tube count, because it needs how fast the fluid is going and that depends on how many tubes it is shared between. The count needs an area. The area needs the coefficient. The coefficient needs the film. There is no first link.

{{panel:fc-exchanger-explorer}}

## Four links and no start

A circle of dependencies is usually a problem and here it is not, because the map is a contraction. Put any count in, go round once, and the count that comes out is closer to the answer than the one that went in. Plain iteration settles, with no solver, no bisection and no derivative.

What makes this worth a lesson is that the studio shows you the trail. Watching the count settle teaches the shape of the chain better than a sentence about it does.

## Why there is a ladder

The loop needs a count to start from, and the studio does not use one. It walks a ladder of seeds, 2, 12, 60 and 300 tubes, and the first seed that evaluates is the one that starts the loop.

The reason is the film. The film door has a band it refuses to answer in, because in that band no correlation this module carries applies, and it says so rather than guessing. A single seed can land in that band, and a loop that cannot take its first step has no answer at all.

ORON's ladder is 4, 24, 120 and 600. Every seed on the studio ladder is a multiple of 2 and every seed on ORON's is a multiple of 4, which are their pass counts. A seed the pass count does not divide is a count the bundle cannot have.

## Two trails

| case | passes | seed ladder | trail of counts | passes of the loop |
| --- | --- | --- | --- | --- |
| the studio case | 2 | 2, 12, 60, 300 | 2, 60, 72, 74 | 4 |
| ORON | 4 | 4, 24, 120, 600 | 4, 56, 64 | 3 |

On both cases the first seed evaluated, so each trail starts on the first rung of its own ladder.

## What the trail shows

Look at the studio trail as a sequence of steps rather than as four numbers. From 2 it goes to 60, which is a long way. From 60 it goes to 72, which is much shorter. From 72 it goes to 74, shorter again. Then it stops, because the count it produced is the count it was given.

That shrinking step is the contraction, visible. It is also why nobody has to choose a tolerance here: the count is a whole number, so the iteration does not creep towards an answer, it lands on one and repeats it. ORON's trail does the same in one pass fewer, from 4 to 56 to 64.

A trail is also a diagnostic. A loop that oscillates between two counts, or walks off upwards, is telling you something about the case rather than the arithmetic. This tier ends here because the loop is the one thing in the chain that cannot be understood a link at a time.

## Exercise

Write out both trails and, for each, the size of every step in tubes. Say which step is the largest in each case and where the steps stop shrinking. Then explain in your own words why the seed ladder exists, and why every number on it is a multiple of the pass count.
