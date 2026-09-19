# The upper tail, solved directly

{{panel:ss-intervals-explorer}}

Two routes to the same chi-square upper quantile on 2 degrees of freedom, measured at six tail probabilities:

| upper tail q | upper-tail route | lower-tail route at 1 - q | exact | lower route error |
| --- | --- | --- | --- | --- |
| 0.025000 | 7.377758908228 | 7.377758908228 | 7.377758908228 | 0 |
| 1e-4 | 18.420680743952 | 18.420680743953 | 18.420680743952 | 1.14e-14 |
| 1e-8 | 36.841361487905 | 36.841361477855 | 36.841361487905 | 2.73e-10 |
| 1e-12 | 55.262042231857 | 55.262086475787 | 55.262042231857 | 8.01e-7 |
| 1e-15 | 69.077552789821 | 69.079151984682 | 69.077552789821 | 2.32e-5 |
| 1e-17 | 78.287893161798 | none | 78.287893161798 | none |

The upper-tail route stays close to exact all the way down. The lower-tail route loses digits as q shrinks and at 1e-17 cannot be asked at all.

## Two ways to ask one question

The Garwood upper limit needs the point with probability alpha/2 above it. There are two ways to ask for that point. The lower-tail route asks for the point with probability 1 minus alpha/2 below it. The upper-tail route asks for the point with alpha/2 above it directly. The engine takes the second route, with `chiSquareQuantileUpper`. On 2 degrees of freedom the upper quantile is exactly minus 2 ln q, which is why the exact column can be derived and each route can be checked against it.

## Why the lower-tail route fails

To use the lower tail you must first form 1 minus q. When q is tiny, that subtraction throws away most of q's digits, because a double can only hold so many figures and the leading 1 takes them. At 1e-8 the lower route already carries a relative error of 2.73e-10. At 1e-15 its error is 2.32e-5. At 1e-17 the number 1 minus q rounds to exactly 1, and a quantile at probability 1 has no finite answer, so the route cannot even pose the question. The upper-tail route never forms 1 minus q, so it never loses those digits. That is the whole of the design choice as the engine makes it: solve the smaller tail directly.

## What happens at 95 percent

At the confidence this course uses most, the two routes agree. With confidence 0.95 the engine forms alpha as 1 minus 0.95, which in double precision is 0.050000000000000044, and alpha over 2 is 0.025000000000000022. And 1 minus 0.025 is 0.975, which is the double 0.975 exactly. So at q of 0.025 there is no rounding problem to avoid, and the first row of the table shows both routes giving 7.377758908228 to the last digit printed.

The reason for the upper-tail route is therefore the rest of the table. An engine that serves any confidence a caller types, and whose limits must hold at very small tail probabilities, needs the route that stays exact there.

## What it means for you

At everyday confidence levels you will never see the difference. It matters to a reader who checks the engine against another tool at an extreme confidence and finds a mismatch in the later digits: the tool that forms 1 minus q is the one that has lost them.

## Exercise

From the table, take the lower-tail route's figure at 1e-12, 55.262086475787, and subtract the exact figure, 55.262042231857. Divide the difference by the exact figure and compare your answer with the printed error of 8.01e-7. Then state in one sentence why the same subtraction at 1e-17 has no answer.
