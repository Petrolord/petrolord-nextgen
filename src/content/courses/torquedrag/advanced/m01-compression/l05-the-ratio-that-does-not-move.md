# The ratio that does not move

One constant, and what it tells you about both limits.

{{panel:td-buckling-explorer}}

## The observation

Divide the helical limit by the sinusoidal one, at any inclination, in any hole, for any pipe:

    221381.40399328814 / 121077.5102803284 = 1.8284271247461903
    90127.07006567506 / 49292.131387618676 = 1.8284271247461903
    307700.37411621853 / 168286.92265158307 = 1.8284271247461903
    221381.40399328814 / 121077.5102803284 = 1.8284271247461903
    90127.07006567506 / 49292.131387618676 = 1.8284271247461903
    221381.40399328814 / 121077.5102803284 = 1.8284271247461903
    90127.07006567506 / 49292.131387618676 = 1.8284271247461903

The same number to sixteen digits.

## What it is

    2 sqrt(2) - 1 = 1.8284271247461903

An exact constant with no physics in it.

## Why

Because both limits come from the same expression with a different numerical coefficient in front. Everything that varies, EI, weight, inclination, clearance, is in the shared part, and the ratio cancels it all.

That is a structural fact about the pair of formulas, not a coincidence of these inputs.

## Why it is worth knowing

**As a check.** Any implementation whose ratio is not 1.8284271247461903 has one of the two formulas wrong, and that is a one-second test on any software.

**As a shortcut.** Compute one limit and you have both.

**As a warning.** It means the two limits are not independent pieces of information. Software that reports both is reporting one number twice, and a design margin expressed against the helical limit is the same margin expressed against the sinusoidal one, scaled.

## What the constant is not

It is not universal across the literature. Different published derivations give different helical coefficients, depending on the boundary conditions assumed and whether the pipe is taken to be in a straight or a curved hole. Values between about 1.4 and 2.8 times the sinusoidal limit appear in print.

So the ratio is fixed WITHIN this implementation, and a different implementation may use a different one. Comparing a helical limit from one source against one from another without checking the coefficient is a mistake.

## The honest summary

Two limits, one shape, one constant between them. The shape is where the physics is, and the constant is a modelling choice that this engine makes consistently and that others make differently.

## Exercise

Verify the ratio yourself at three inclinations and two hole sizes using the panel.

Then look up one published helical buckling criterion, note its coefficient, and compute how much a design margin would change if that coefficient were used instead.
