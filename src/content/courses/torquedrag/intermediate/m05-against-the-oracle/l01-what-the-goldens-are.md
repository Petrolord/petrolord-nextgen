# What the goldens are

An independent implementation, and why one exists at all.

{{panel:td-friction-explorer}}

## What is in the file

Five wells, each with its survey, its string, its hole geometry and its mud, and for each of them the expected hookload, surface torque, maximum tension and minimum tension for four or five operations, plus tension and torque at six depth checkpoints.

More than a hundred published values in all.

## Where they came from

From a separate program that integrates the same equations with a fourth-order Runge-Kutta scheme and computes the attitude between stations by spherical linear interpolation of the tangent vectors.

Different language, different integration order, different author. That is the point.

## Why an independent implementation rather than a hand check

Because there is nothing to check by hand.

The soft-string model has no closed-form solution on a real survey. There is no textbook example with a printed answer to four decimals, the way the Well Design and Surveys course has for minimum curvature.

So the only available check is a second implementation, and the value of the check is exactly proportional to how independent that implementation is.

## What agreement proves and does not prove

**It proves** that two people reading the same equations wrote code that produces the same numbers. That eliminates transcription errors, sign errors, unit errors and misread formulae, which between them are most of the defects that occur.

**It does not prove** the equations describe a drill string. Both implementations share the soft-string assumption, the Coulomb friction model, and the omission of dynamics. Agreeing with each other says nothing about any of that.

That is the same verification-versus-validation distinction the Well Design and Surveys course draws around the error model, and it applies here identically.

## What DISAGREEMENT proves

That at least one of them is wrong.

Which is more useful than it sounds, because it turns a vague worry into a specific number that can be chased. The next three lessons chase it.

## The tolerance the goldens claim

The file's own description says the JS engine must agree to a relative tolerance of 1e-4 on summaries and checkpoints.

It mostly does. Where it does not, the reason is worth a lesson of its own.

## Exercise

Open the panel's oracle view and read the four tiles: the number of values checked, the worst relative disagreement, the worst absolute one, and where the worst relative one occurs.

Write down all four before reading the next lesson.
