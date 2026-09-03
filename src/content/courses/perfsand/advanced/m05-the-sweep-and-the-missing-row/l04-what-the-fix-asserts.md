# What the fix asserts

The guards now standing, and how to read a sweep from here on.

{{panel:ps-sand-explorer}}

## In the engine

Two tests. One drives nine step sizes, dividing and not, and asserts that every sweep starts at the interval top, ends at the interval bottom, has strictly increasing stations and puts no station past the bottom.

The other builds the weakened profile, runs it at a dividing step and a non-dividing one, and asserts that both find the governing row at the interval bottom, that both margins are negative, and that the two agree.

The second is the one that would fail loudly on a regression, because it is aimed at the consequence rather than at the mechanism. Its assertion is about a SIGN.

## In the golden

A ragged case at a thirty metre step, so the comparison exercises the endpoint rather than only the well-behaved case.

## In the oracle

The visit list is built explicitly rather than as a loop, and the endpoint rule is self-asserted at nine step sizes before anything is written.

## In the app

A guard driving the Sanding tab's own step parameter through seven values, each asserted to start at the interval top and end at its bottom.

## How to read a sweep now

The last row is the interval bottom, always, whatever step you typed. If it is not, something is wrong.

That is a one-line check a reader can run on any sweep output from any tool, and it is worth running, because this class of defect is not unique to this engine.

## The habit worth carrying

When a routine walks a range in steps, check both ends of the output. The start is nearly always right because it is the initial value. The end is where the off-by-one lives.

That is not about sand control and it is not about this engine.

## Exercise

List the four places a guard now stands and say what each one asserts.

Say which guard is aimed at the consequence rather than the mechanism, and why that is the more valuable of the two.

Then state the one-line check a reader can run on any interval sweep, and say why the end is riskier than the start.
