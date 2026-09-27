# An approximation for several berths

{{panel:marine-base-calculator}}

M/M/c has a closed formula for its mean wait. M/D/c with more than one berth has none. Liu, Pantelidis, Tam and Chow (arXiv 2102.05851v2, 11 February 2021, CC BY 4.0) state that it has none, and print in their eq. (2) the approximation the engine uses, the one Cosmetatos published in 1975. The engine labels every M/D/c figure an approximation, and the course teaches it as one.

## The approximation

Write Wq for the mean wait, rho for the berth utilisation and c for the berths. As Liu et al. print it in eq. (2):

Wq(M/D/c) = Wq(M/M/c) / 2 x (1 + (1 - rho)(c - 1)(sqrt(4 + 5c) - 2) / (16 rho c))

Read in words: start from the M/M/c wait, halve it, then raise it by a correction. The halving is exact at one berth, as the next lesson shows. The correction grows with the idle share of the berths, (1 - rho), and with the berths beyond the first, (c - 1). It shrinks as the berths get busier, because rho sits in the denominator. At one berth the factor (c - 1) is zero and the correction vanishes.

## Two cases

| golden input | berths | berth utilisation (engine) | M/M/c wait, hours (engine) | M/D/c wait, hours (engine) |
| --- | --- | --- | --- | --- |
| ekene-base-mdc (and ekene-base-mmc) | 2 | 0.533333 | 3.180124 | 1.665786 |
| base-mdc-three-berths (M/M/c a stated probe) | 3 | 0.800000 | 1.078652 | 0.552578 |

On the Ekene base the ratio of the two waits is 0.523812: a half, plus a correction of a few hundredths. On the three-berth case, busier at 0.800000, the M/D/c wait is again a little over half the M/M/c wait.

## Read at second hand, and said so

The course did not read Cosmetatos's 1975 paper. It takes the formula as the arXiv paper prints it, cites that paper by equation, and says so. An approximation read at second hand is still usable when it is labelled: the engine's basis names the source and the word approximation, and the calculator repeats both.

## What approximate means here

An approximation is a formula built to track a mean wait that has no closed form; it is not the model's exact answer. The engine does not simulate the M/D/c queue to check it, and the course prints no error band for it, because no source it read gives one for these inputs. What the course can check is the one berth case, where the formula becomes exact, and the direction of the correction, which always leaves the M/D/c wait at or above half the M/M/c wait. A plan that quotes an M/D/c wait names the model, the berths, the arrivals, the working day, the service and the word approximation.

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Three berths, constant service". Read the Berth utilisation and Mean wait, hours tiles. Set Queue model (stated) to M/M/c, read the wait again, and divide the M/D/c wait by it. Then start from "Ekene supply base, M/D/c", repeat the comparison, and say which of the two cases carries the larger correction above one half, and which term of the formula explains it.
