# The conditioning behind the fit

The fit reports two things about itself and they answer two different questions. R squared says how well the curve describes the points. The condition number says how well the linear system behind the curve could be solved at all. A fit can score well on one and badly on the other.

{{panel:fc-pump-explorer}}

## The figure, and where it sits

For OKONO the 1-norm condition number of the normal-equation matrix comes back as 334.938111, and the conditioning note comes back as null, meaning the engine had nothing to warn about.

A single number like that is hard to read on its own, so here it is across a spread of the point sets this course fits:

| point set | condition number | R squared | droops |
| --- | --- | --- | --- |
| the OKONO catalogue | 334.938111 | 0.999985896 | true |
| a rising set | 308.014664 | 1.000000000 | false |
| three identical heads | 304.750000 | null | false |
| the published curve goldens, first | 366.680892 | 0.999754151 | true |
| the published curve goldens, last | 360.837617 | 0.999983354 | true |

Across every point set this course fits successfully, 7 of them, the reported figure runs from 304.750000 to 366.680892. OKONO sits comfortably inside that. A few hundred is simply what this kind of fit costs.

## Why a few hundred

The engine solves the least-squares problem through the normal equations, which squares the condition number of the underlying design matrix. That squaring is the price of solving it that way, and it is paid up front.

The engine reduces the bill by fitting in the normalised variable rather than in raw gpm. Raw flows run from zero to nineteen hundred and their squares run to several million, which would spread the matrix entries over many orders of magnitude before the squaring even started.

A condition number is a bound on how far a small disturbance in the readings can be amplified on its way into the answer. It is a worst case and it is a bound, so a healthy one is a promise and an unhealthy one is a warning.

## What it costs in digits

Double precision carries about sixteen decimal digits. A condition number of this size costs the coefficients two or three of them, which is why the coefficients of this module are quoted to six decimals rather than to fifteen. It is also why the figure is reported rather than hidden: a reader who knows the fit cost three digits knows not to argue about the fourth.

## Two questions, two answers

Look at the table again and read the second and third rows across. The rising set scores a perfect R squared at a condition number of 308.014664. The identical-heads set has no R squared at all at a condition number of 304.750000. Neither of those point sets is a usable pump curve, and the condition number is untroubled by both. Conditioning is a statement about the arithmetic. Usability is a statement about the physics, and the droops column is where that one is answered.

## The mistake

Reading a healthy condition number as a healthy result. It says the linear system was solvable. It does not say the points were worth fitting, and it does not say the curve that came out is a head curve.

## Exercise

Give the OKONO condition number and the range the reported figure takes across the seven point sets this course fits. Then name the step in the solve that squares the condition number, and say what the engine does to reduce the damage that squaring causes.
