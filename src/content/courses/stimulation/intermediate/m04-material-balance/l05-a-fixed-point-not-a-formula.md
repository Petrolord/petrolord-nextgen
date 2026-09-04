# A fixed point, not a formula

The balance cannot be written down and evaluated. It has to be converged.

{{panel:st-frac-explorer}}

## The circle

Follow the dependencies round.

The Nolte factor needs efficiency. Efficiency is fracture volume over injected volume, so it needs pump time. Pump time comes from the quadratic, whose leakoff term contains the Nolte factor.

Each of the three is defined in terms of the next. There is no order in which you can evaluate them once and be done, which is why the engine does not try.

## How the engine handles it

It guesses. Efficiency starts at 0.5, which is a deliberately neutral guess in the middle of the range.

With that guess it computes a Nolte factor, solves the quadratic for pump time, and computes the efficiency that pump time implies. If the new efficiency differs from the old by more than one part in a million million, it takes the new one and goes round again. It gives up after 200 passes.

The published case converged in 9 iterations. That is quick, and it is quick for a reason you already met. The Nolte factor moves only between four thirds and half of pi across the whole efficiency range, so each pass changes the factor very little, and the loop contracts fast.

The zero leakoff case is the one exception. There is nothing to correct, so the engine returns the closed form answer in 0 iterations.

## What that means for you

Three things.

First, you cannot differentiate the balance to get a sensitivity. There is no single expression to differentiate. If you want to know how efficiency responds to the leakoff coefficient, you sweep it and read the table, which is exactly what the digest for this course does.

Second, the outputs are a consistent set or they are nothing. Efficiency, pump time and injected volume satisfy each other by construction. If a design sheet quotes numbers that do not close, someone has edited one of them by hand after the fact, and that is a real and common defect to look for.

Third, iteration counts are provenance. A case that converged in 9 passes is a healthy case. One that hit the 200 pass cap would be telling you the inputs are somewhere the approximation was never meant to go.

## Exercise

Take the published numbers and check that the fracture volume of 36.143836842230584 m3 divided by the product of 0.053 m3/s and 3945.2291680655526 s returns the published efficiency of 0.1728566723633056.

Then check that the injected volume less the fracture volume gives the lost volume of 172.95330906524367 m3, and say what it would mean if either check failed.
