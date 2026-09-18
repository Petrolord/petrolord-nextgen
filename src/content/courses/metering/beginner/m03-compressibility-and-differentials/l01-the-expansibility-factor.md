# The expansibility factor and what it is worth

A liquid arrives at the plate and leaves at very nearly the same density. A gas
does not. It expands as it drops through the pressure difference, so the density
at the throat is lower than the density you stated upstream, and the equation
carries a factor to account for it. That factor is the expansibility.

## What it depends on

Two things move it: the ratio of the differential to the static pressure, and
the specific heat ratio of the gas. The sweep below is at the ABOH beta.

| dP/P1 | k 1.1 | k 1.2 | k 1.3 | k 1.4 | k 1.66 |
| --- | --- | --- | --- | --- | --- |
| 0.001000 | 0.999666 | 0.999694 | 0.999717 | 0.999737 | 0.999779 |
| 0.005000 | 0.998329 | 0.998468 | 0.998585 | 0.998686 | 0.998892 |
| 0.010000 | 0.996657 | 0.996934 | 0.997169 | 0.997370 | 0.997781 |
| 0.020000 | 0.993310 | 0.993863 | 0.994331 | 0.994733 | 0.995553 |
| 0.040000 | 0.986608 | 0.987705 | 0.988636 | 0.989436 | 0.991070 |
| 0.080000 | 0.973165 | 0.975324 | 0.977162 | 0.978745 | 0.981991 |
| 0.150000 | 0.949509 | 0.953438 | 0.956800 | 0.959710 | 0.965716 |
| 0.250000 | 0.915403 | 0.921639 | 0.927022 | 0.931717 | 0.941507 |

The span across that whole table:

   largest, at dP/P1 0.001000 and k 1.66                      0.999779
   smallest, at dP/P1 0.250000 and k 1.1                      0.915403
   difference (first less second)                      0.084375
   ratio (first over second)                           1.092173

## What it is worth on a real run

An incompressible sizing sets the factor to one. Running the ABOH case both ways
is the measurement of what the factor buys on that meter:

   taken as incompressible, lb/hr                           24622.4751
   with the expansibility factor, lb/hr                     24602.3337
   difference (first less second)                       20.1414
   ratio (first over second)                           1.000819

That is the whole of it. One run, two treatments, and the difference printed
rather than described. On the ABOH sheet the returned expansibility was
0.999181, which belongs to that run's own differential, static pressure and
specific heat ratio.

## Why a small factor is still a factor

The temptation with a number close to one is to drop it, and the temptation gets
stronger the busier you are. Two arguments against it. The first is that this
run has a differential of 63.800000 in H2O against a static pressure of
815.200000 psia, and the ratio of those two is where this particular run sits on
the table above. A different service on the same plate sits somewhere else on
it, and the factor is not free to be ignored just because it was small once. The
second argument is that a meter is a commercial instrument. A systematic offset
on every ticket for a year is not the same kind of error as a random one,
because it always runs in the same direction and nothing averages it out.

## Where the factor comes from in the result

You do not supply the expansibility. The engine computes it from the
differential, the static pressure, the beta and the specific heat ratio, and
returns it on the result line so that it can be checked. That is the same
discipline as the discharge coefficient in module two. A factor that is returned
can be read, quoted and argued with. A factor that is buried inside a flow
figure cannot be, and the two runs above are only comparable because the engine
exposes which treatment it used.

## Exercise

Work out where the ABOH run sits on the table above, using its differential of
2.304922 psi and its static pressure of 815.200000 psia, and say which two
columns bracket a gas at the ABOH specific heat ratio of 1.270000.
