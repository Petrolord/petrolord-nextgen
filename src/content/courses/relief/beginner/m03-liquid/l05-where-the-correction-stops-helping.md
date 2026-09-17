# Where the correction stops helping

{{panel:fc-sizing-explorer}}

One divided by the correction is the sum of three terms in the Reynolds number. This lesson prints what each of those three terms is worth across the range, because that is the only honest way to say that one of them has a band it matters in.

## The three terms, term by term

| Reynolds (stated) | Kv clamped | Kv unclamped | intercept term | inverse-root term | inverse-three-halves term | the last term as a fraction of the sum |
| --- | --- | --- | --- | --- | --- | --- |
| 10.000000 | 0.078479 | 0.078479 | 0.993500 | 0.910104 | 10.838707 | 0.850608 |
| 30.000000 | 0.277403 | 0.277403 | 0.993500 | 0.525449 | 2.085910 | 0.578639 |
| 92.000000 | 0.594542 | 0.594542 | 0.993500 | 0.300052 | 0.388415 | 0.230929 |
| 300.000000 | 0.815911 | 0.815911 | 0.993500 | 0.166161 | 0.065962 | 0.053819 |
| 3000.000000 | 0.954079 | 0.954079 | 0.993500 | 0.052545 | 0.002086 | 0.001990 |
| 100000.000000 | 0.997395 | 0.997395 | 0.993500 | 0.009101 | 0.000011 | 0.000011 |
| 196000.000000 | 0.999995 | 0.999995 | 0.993500 | 0.006501 | 0.000004 | 0.000004 |
| 300000.000000 | 1.000000 | 1.001245 | 0.993500 | 0.005254 | 0.000002 | 0.000002 |

The last column is the whole lesson. The steepest term carries most of the sum at a Reynolds number of 10.000000 and is worth almost nothing by 3000.000000. So the fit has a band it does real work in, and outside that band the steepest of its three coefficients could move a long way without changing an answer.

That is also the reason the published liquid set includes a row at a Reynolds number of 92.428866. Without a case down there, the steepest term of the fit would never be exercised by any published case at all, and the nearest printed term row, at 92.000000, puts that term at 0.230929 of the sum. The digest prints no term row at 92.428866 itself, so this lesson quotes none.

## Why a band has to be shown rather than asserted

It is easy to write that a coefficient only matters at low Reynolds numbers, and almost as easy to be wrong about where low starts. The table above settles it by evaluating each term, so the claim is a reading rather than an opinion. This is worth copying as a habit: when somebody tells you a term in a correlation is negligible, ask what it is worth at the conditions you actually have.

## The clamp, and what it is protecting against

Read the last row of the table. By a Reynolds number of 300000.000000 the clamped and the unclamped corrections have parted company. The raw fit keeps rising through one and asymptotes to 1.006542523506, and a correction above one would let a viscosity correction add capacity to a valve.

The clamp holds the correction at 1.000000 above a Reynolds number of 196282.561354814417, which was found by bisecting the point where the raw fit crosses one. The raw fit is exported alongside the clamped one so the asymptote stays inspectable, and the clamp is a stated convention of this engine rather than something derived.

## The held item, said plainly

The three coefficients of this fit are held for literature. No route in this package derives them, and the validation oracle shares the same three coefficients on purpose, which means the oracle cannot check them either. What the oracle does check is the Reynolds constant, derived from the definition of a Reynolds number, and the leading constant of the area equation, checked against the published SI form.

So of everything in this module, the correction curve itself is the part standing on a published fit and nothing else. Nothing graded in this course rests on it.

## Exercise

Read the last column and say between which two Reynolds numbers the steepest term stops mattering. Then say what the clamp prevents, name the Reynolds number it starts acting at, and say why the raw fit is exported as well.
