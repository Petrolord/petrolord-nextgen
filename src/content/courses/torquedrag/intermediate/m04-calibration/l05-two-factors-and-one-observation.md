# Two factors and one observation

An under-determined fit, and the three ways people handle it.

## The problem

There are at least two friction factors in any well: cased hole and open hole. There is usually one observation: the pick-up hookload at the current depth.

One equation, two unknowns. The fit is under-determined and no amount of bisection fixes that.

## Approach one: hold one fixed

Take a book value for the cased-hole factor, usually 0.25 or 0.20, and fit the open-hole one.

That is what this course does and what most software defaults to. It is defensible when most of the side force is in open hole, which is usual on a well where the shoe is above the build.

It is indefensible when the shoe is deep inside a build section, because then the cased factor is multiplying a large side force and holding it at a guess pushes the error into the open-hole fit.

The check is to look at where the side force is, which is a one-minute look at the profile.

## Approach two: fit at two depths

Take a hookload reading before the shoe is drilled out and another after several hundred metres of open hole.

The first depends almost entirely on the cased factor. The second depends on both, with the cased contribution already fixed by the first.

Two observations, two unknowns, and both are hookloads on the same string. This is the right way to do it and it requires only that somebody recorded the first reading.

## Approach three: fit hookload and torque together

Use a pick-up hookload and an off-bottom torque, and solve for both factors.

The two observations weight the two sections differently, because the torque integral carries the contact radius and the hookload does not, and because the cased and open sections generally have different pipe in them.

It works, it is more sensitive to the string description being right, and it is what a least-squares fit in commercial software is doing.

## The honest position

Any of the three is better than reporting one fitted number without saying what was held fixed.

The failure mode is a report that says "friction factor 0.38" with no statement of which section it applies to and what the other one was assumed to be. That number cannot be used by anyone else.

## The thing to watch

If the fitted open-hole factor changes a lot when you change the assumed cased-hole factor, the fit is poorly conditioned and the answer is not trustworthy. If it barely moves, the cased section is not contributing much and the assumption is harmless.

That sensitivity test costs two runs and it tells you how much the under-determination actually cost you.

## Exercise

On the build-and-hold well, fit an open-hole factor to a pick-up hookload of 1100000 N with the cased factor at 0.20, then at 0.25, then at 0.30.

Record how much the fitted value moves. Repeat on the horizontal well, and explain why the two wells behave so differently.
