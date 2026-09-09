# Newton and bisection

The engine's root finder carries a method statement: "Newton now falls back to bisection when unconverged and returns null when no sign change brackets a root." Each clause is a promise, and each promise has a limit.

{{panel:ec-time-explorer}}

## Newton

Newton starts at 10 percent, reads the NPV and its slope there, and steps to where a straight line through that point would cross zero. On late_payout, [-1000, 0, 0, 0, 0, 2500], the sampled curve reads 552.303308 at 10 percent, 418.567139 at 12, 242.941838 at 15, 4.693930 at 20 and -180.800000 at 25. The steps land close and converge fast: the reported root is 20.1124 percent, and the NPV there is printed as -0.000000, a rounded residual on the negative side of zero.

conventional_five_year, [-1000, 300, 300, 300, 300, 300], reads 137.24 at 10 percent and -102.82 at 20, and the root is 15.2382 percent. tiny_return, [-1000, 1001], reads 1.00 at 0 percent and -90.00 at 10, and the root is 0.1000 percent with residual -0.000000. The residual printed at every reported root is 0.000000 or -0.000000: the finder stops at a tolerance, not at an exact zero.

## Where Newton fails

An NPV curve is not a straight line. Toward -100 percent the discount factors blow up and the last flows dominate: late_payout reads 249999000.000000 at -90 percent and loss_making 44000.000000, so a Newton step that overshoots into that region is thrown far away. Where the curve flattens, the slope is near zero and a step is enormous. That is what "unconverged" means.

## Bisection

Bisection needs two rates with NPVs of opposite sign and halves the interval between them until the zero is pinned. It cannot diverge, and it cannot start without a bracket. two_roots_minus73_and_173, [-12500000, 37500000, -9000000], shows the shape.

| rate, percent | NPV |
| --- | --- |
| -75 | -6500000.000000 |
| -50 | 26500000.000000 |
| 10 | 14152892.561983 |
| 150 | 1060000.000000 |
| 175 | -53719.008264 |

There is a sign change between -75 and -50 and another between 150 and 175. The engine reports 173.6932 percent, the crossing Newton reaches walking downhill from 10 percent.

## The mistake

The careful mistake is to trust the residual as a proof of uniqueness. A residual of 0.000000 at 173.6932 percent proves that 173.6932 is a root; it says nothing about the interval from -75 to -50, where the same curve crosses zero again. The finder reports the root it reached, and its statement does not say which root that is when there are several.

## What it refuses

It refuses to return an unconverged Newton estimate: the fallback runs instead. It refuses to bisect without a bracket, and when no sign change is found it returns null rather than a guess. And it refuses to count roots, so a converged answer is one answer, not the answer.

## Exercise

For late_payout, read the sampled NPV at 20 and at 25 percent and say why a bracket exists there. Then read loss_making at -10 percent, 49.382716, and at 0 percent, -100.000000, and say where its root of -6.9926 percent had to lie before any finder ran.
