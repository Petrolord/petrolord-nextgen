# Where scoring starts, and the mean squared error

{{panel:pf-smoothing-explorer}}

Every fit in this course is scored on its residuals, and the two methods with a trend score one fewer residual than simple smoothing does. That small difference decides how fits are compared. Add up the squared residuals and you get a total that depends on how many there were; divide by that count and you get a figure that can be set side by side.

## SSE and MSE

The SSE is the sum of the squared scored residuals. The MSE is the SSE divided by the number of scored errors only, and the basis says so:

    SSE / number of scored errors

Holt on EKENE-P1 at alpha 0.5 and beta 0.2 has SSE 29230.297102 over 46 scored errors, which is MSE 635.441241. The unscored month 1 residual, 0 by construction, is left out of both the sum and the count. Counting it would add nothing to the SSE and one to the divisor, flattering the MSE with a month the method was handed.

## Compare methods by MSE

Simple smoothing scores 47 errors on a 48-month well; Holt and the damped trend score 46, because they spend month 1 on the start. An SSE over 47 errors and one over 46 are sums of different numbers of terms. The MSE puts them on one footing. Every comparison of methods in this course uses the MSE.

Here are the three methods fitted, every parameter left free, on EKENE-P4:

| method | parameters | scoredFrom | SSE | MSE |
| --- | --- | --- | --- | --- |
| ses | alpha 0.528376 | 1 | 215501.852140 | 4585.145790 |
| holt | alpha 0.501603, beta 0.354191 | 2 | 278219.131326 | 6048.241985 |
| damped | alpha 0.388341, beta 0.109704, phi 0.800000 | 2 | 207120.428138 | 4502.618003 |

On this noisy well Holt's MSE, 6048.241985, is the highest of the three, above simple smoothing's 4585.145790 and the damped trend's 4502.618003. The damped trend, which the next module teaches, has the lowest MSE here. The figures give the order and nothing more; they do not say why.

## What an in-sample MSE says

Every MSE in this lesson is in-sample. It scores one-step forecasts over months the fit had already seen, and the fitted parameters were chosen to make it small. It says how well a method followed the history. It does not say how well the method's h-step forecast will match months to come; that needs forecasts scored on months the fit never saw, which is the Professional tier's question. A low in-sample MSE is where a forecast starts its case, and an Associate report says the numbers are in-sample.

## Reading `scoredFrom`

Every result carries `scoredFrom`, and it tells you three things at once: the index of the first scored residual, how many months the start used up, and so how many errors the MSE divides by. A 48-month series with `scoredFrom` 2 has 46 scored errors. With an initial trend given, Holt's `scoredFrom` drops to 1 and the count rises to 47. Read it before you divide or compare, and quote it beside every MSE you report, so a reader can check the divisor without refitting.

## Exercise

In the smoothing explorer choose "Three methods on one series" and load EKENE-P4. Read each method's parameters, SSE and MSE, and the index each is scored from. Divide each SSE by its count of scored errors and check the MSE. Then load EKENE-P1 and rank the three methods by MSE, and again by SSE, and note whether the order changes.
