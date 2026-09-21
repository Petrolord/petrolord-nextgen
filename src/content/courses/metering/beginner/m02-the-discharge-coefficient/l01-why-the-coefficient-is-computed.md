# Why the coefficient is computed rather than assumed

Every orifice flow has a discharge coefficient in it. It is the factor that
turns the ideal flow through a hole into the flow a real plate in a real pipe
passes, and it is the one term in the equation that people are tempted to treat
as a number they already know.

## The number people already know

The habit is to take a coefficient of about 0.61 and move on. It is not a
ridiculous habit. Across a lot of ordinary runs the coefficient does sit near
there, which is exactly why the habit survives. The problem is that the
coefficient is a function of the beta and of the Reynolds number, and the run
you are looking at is a particular beta at a particular Reynolds number.

This module implements the Reader-Harris/Gallagher equation for a flange-tapped
orifice and evaluates it. Across the cells of the sweep in the next lesson that
sit inside the published beta range, this lesson prints the span:

   largest, at beta 0.750000 and Reynolds 5e+3                0.668050
   smallest, at beta 0.750000 and Reynolds 5e+7               0.595385
   difference (first less second)                      0.072666
   ratio (first over second)                           1.122048

Those two cells are on the same beta. Only the Reynolds number changed between
them. A quantity that moves by that difference over a sweep is not a constant,
and the span of the table is the measurement of that rather than an opinion
about it.

## What the engine does about it

It refuses to assume one anywhere it needs one. The permanent loss relation
needs the coefficient of the run, and rather than filling in a plausible value
it takes the coefficient as a required argument and says why when it is missing:

   > permanent loss needs the discharge coefficient of this run. This module exists to show
     that it is not a constant 0.61, so it will not assume one

Read that as a design position rather than as an inconvenience. The alternative
is a function that always answers, using a number nobody chose, in a result that
looks exactly like one where the coefficient was computed properly. You would
have no way of telling the two apart on the screen.

## What this costs you, and what it buys

It costs an extra call. You compute the flow first, take the coefficient the
result gives you, and hand that to the loss calculation. It buys a chain in
which every downstream number traces back to one evaluated coefficient, so when
somebody asks where 0.602223 came from on the ABOH run there is an answer, and
the answer is the same one that produced the flow.

Module four prints what the assumption would have cost on that same run, using
the run's own coefficient against an assumed 0.610000, so the size of the
shortcut is printed rather than asserted.

## Exercise

The refusal above names the module's purpose in its own message. Say what a
caller who cannot obtain a coefficient should do, given that this function will
not proceed without one.
