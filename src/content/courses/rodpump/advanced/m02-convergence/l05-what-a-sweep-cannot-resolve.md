# What a sweep cannot resolve

A sweep has a floor. Below it the ordering of adjacent rows is set by the grid, and the floor is different at every speed.

{{panel:pd-balance-explorer}}

## Measure the floor before reading the rows

The floor on the worst section loading is the spread the node count alone produces at the speed being read. On ODUMA-4 it is 2.104178 percentage points at 10.2 spm, 4.283675 at 10.4 spm, 0.936333 at 10.6 spm and 6.553883 at 10.8 spm, over six node counts from 60 to 1920.

It is not a constant, so it cannot be measured once and carried. At the shipped grid the loading reads 85.051352 percent at 10.2 spm and 89.649462 percent at 10.4 spm, and a reader has to clear both floors, 2.104178 and 4.283675 percentage points, before calling that difference real.

## What the same sweep does resolve

The loading reads 78.955358 percent at 9.0 spm and 99.637760 percent at 11.0 spm. That movement is far larger than any node spread on this well, so the sweep resolves the direction across its range even where it cannot rank neighbours.

## The question it cannot answer at all

Where does the rod go into compression? The reported minimum load at the shipped grid reads -359.286455 lb at 11.0 spm, 1464.558895 lb at 11.2 spm, 855.932624 lb at 11.4 spm and -1115.467356 lb at 11.6 spm. The sign changes twice in four contiguous rows.

Worse, the reported minimum is read off the decimated card. At 12.0 spm it reads 45.754029 lb where the march found -466.104183 lb, and at 12.5 spm it reads 504.816493 lb where the march found -27.487266 lb. So the sweep is being asked to locate a sign change in a column that is sampled well enough to lose the sign.

## Convergence is not the discriminator

Every row of that speed sweep reports converged. The flag says the march settled into a repeating stroke on the grid it was given, which is true and is not the question. A row can be converged, periodic and warning free while sitting inside the grid noise.

## What it refuses

The sweep refuses to rank rows that differ by less than the grid spread, and it refuses to say what that spread is. Nothing in the return prices it. The only way to know the floor is to hold the well fixed, move a parameter with no physical content, and see how far the answer travels.

## Exercise

Take the loading at 10.2 and 10.4 spm at the shipped grid, then take the node spread at each of those speeds.

Say whether the difference between the two speeds clears both floors, and what you would report if it cleared only one.
