# Checking against a closed form

The one case with an answer nobody has to compute, and what it settles.

{{panel:td-string-explorer}}

## The case

The vertical well, tripping out. No curvature, no inclination, therefore no side force, therefore no friction. The hookload is the buoyed weight of the string:

    air weight   = 896824.4970405255 N
    buoyed weight = 896824.4970405255 x 0.8165605095541402 = 732311.468284047 N

That is a hand calculation. Sum the mass, multiply by gravity, multiply by the buoyancy factor.

## The three answers

| source | hookload | difference from the closed form |
|---|---|---|
| the closed form | 732311.468284047 N | 0 |
| this engine | 732311.4682840434 N | -3.6088749766349792e-9 N |
| the published oracle | 732354.090721511 N | 42.6224374640733 N |

The engine reproduces the closed form to about four nanonewtons, which is floating-point noise on a number of this size.

The oracle, which is an independent implementation that generated the goldens this course checks against, is 42.6 N away.

## What that establishes

That on the one case a third party can settle, the engine is right and the oracle carries a discretisation error of its own.

That matters because the two implementations disagree elsewhere too, by comparable amounts, and without this case there would be no way to say which of them was closer to the truth. Two implementations agreeing tells you they agree. Two disagreeing tells you at least one is wrong. A closed form tells you which.

## Why the oracle is off at all

It integrates the same equations with a fourth-order Runge-Kutta scheme on its own grid. On a case with no friction that scheme still discretises the weight integral, and its residual is 42.6 N in 732 kN, which is six parts in a hundred thousand.

That is a perfectly respectable error for a numerical oracle. It is simply not zero, and on this one case zero was available.

## The habit

Whenever a model has a degenerate case with a closed-form answer, run it first.

It costs one run, it exercises the whole input path, and it catches unit errors, sign errors and setup errors before any of the interesting cases are trusted. In this course the vertical well is that case, and it is the reason the vertical well is in the fixture set at all.

## The limitation of the habit

A degenerate case exercises the parts of the code that are active in it. The vertical well never touches the friction terms, the curvature terms or the direction cosines, so passing it says nothing about any of them.

It is a necessary check and not a sufficient one, which is what module 5 of the Professional tier is for.

## Exercise

Do the closed-form calculation yourself for the vertical well: three components, three lengths, three weights per metre, standard gravity 9.80665, buoyancy factor from 1440 kg/m3 mud.

Get 732311.468284047 N. Then say which parts of the engine that check did NOT exercise.
