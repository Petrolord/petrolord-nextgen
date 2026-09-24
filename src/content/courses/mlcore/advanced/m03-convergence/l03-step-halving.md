# Step halving

{{panel:ml-diagnose-explorer}}

A Newton step jumps to the top of a quadratic fitted to the log likelihood at the current coefficients. Near the solution that quadratic is a close match and the step is excellent. Far from it, the quadratic can be a poor match, and a full step can overshoot and land somewhere worse. The engine guards against that with step halving, and it states the rule exactly.

| the halving rule | as stated |
| --- | --- |
| when a step is halved | when it lowers the penalised log likelihood by more than 1e-12 x (1 + \|l\|) |
| how many times | up to 30 halvings of one step |
| the boundary | strict: a fall of exactly that amount is not halved |
| what convergence reads | the full step, before any halving |
| halvings on the Ekene pay fit | 0 |

## The rule

After computing a full Newton step the engine tries it. If the penalised log likelihood at the new coefficients has fallen by more than 1e-12 x (1 + |l|) where l is the current log likelihood, the step is halved and tried again, up to 30 times. The comparison is strict, so a fall of exactly that allowance is kept. The engine's basis states it:

> Newton-Raphson (IRLS) from beta = 0; a step is halved while it lowers the penalised log likelihood by more than 1e-12 x (1 + |log likelihood|), up to 30 halvings

The word penalised matters. With l2 above zero, the quantity guarded is the log likelihood less the penalty, the same objective the fit maximises. With l2 at zero the two are the same.

## Why the full step decides convergence

Convergence is judged on the FULL step, before any halving. That ordering is deliberate. A halved step is smaller than the full one by a factor of two for each halving, and after enough halvings any step is tiny. If the rule read the halved step, a fit stuck far from its answer could halve its way below tol and report converged true. Reading the full step means the rule asks the right question: if the engine took the Newton step it believes in, how far would the coefficients move? Only when that answer is at most tol does the fit stop.

## What the Ekene fit shows

On the pay fit every one of the 10 steps was taken whole: the halvings column of the trace reads 0 on every row. From beta = 0 the log likelihood went from -46.305377 after the first step to -24.507027 at the last, and no step lowered it by more than the allowance. The count is printed on every row so that you can see when a fit is different.

## Reading a halving when you see one

If a trace shows halvings, read each one as the engine protecting the likelihood: at that step the full Newton step would have lowered it. A halving says the quadratic was a poor guide at that point. A trace with many halvings, or a step that uses all 30, is a reason to look again at the fit: at the conditioning of the features, at their units and at the separation test.

## Exercise

Open the panel on the convergence view with the pay rows. Run the fit at the default tol and maxIter and read the halvings column. Then build a small table of your own with one feature in large units and a 0 or 1 target that is not separated, run it, and write down the number of halvings on each step. Say in one sentence whether convergence was read from the full step or the halved one.
