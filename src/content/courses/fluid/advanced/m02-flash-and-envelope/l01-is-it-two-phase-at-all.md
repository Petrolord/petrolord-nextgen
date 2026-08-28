# Is it two phase at all

Before splitting a mixture you have to know whether it splits. That question has its own algorithm and it is not the flash.

{{panel:fluid-tuning-explorer}}

## Why it is a separate question

A flash calculation finds the split that satisfies equal fugacities. Given a single-phase mixture it will happily converge on a trivial answer where the liquid and vapour compositions are identical and the split is meaningless.

Worse, it can converge on that trivial solution for a mixture that IS two phase, if the starting estimate is poor. So a flash on its own cannot be trusted to tell you the number of phases.

## Michelsen's stability test

The question in the right form: is the single-phase mixture stable, or does adding an infinitesimal amount of some other phase lower the total Gibbs energy.

If a trial phase of any composition would lower the energy, the mixture is unstable and it will split. If no trial phase does, it is stable and a single phase is the answer.

The test is run from BOTH sides: a vapour-like trial phase and a liquid-like one. A mixture can be unstable in one direction and not the other, and testing only one side misses cases.

## Why both sides

Consider a mixture that is mostly liquid at a pressure just below its bubble point. A vapour-like trial phase lowers the energy, because a small amount of gas wants to form. A liquid-like trial phase does not, because there is nothing for a second liquid to be.

Test only the liquid side and you conclude the mixture is stable, which is wrong. The engine runs both, and the harness has cases specifically for that asymmetry.

## What the test returns

A yes or no, and when the answer is yes, a trial composition that is a good starting estimate for the flash.

That second output matters. The stability test does most of the work of finding where the second phase is, and handing its trial composition to the flash as an initial guess makes the flash converge far faster and far more reliably.

So the two calculations are a pair rather than a check followed by the real work.

## Where it is hardest

Near the critical point, where the two phases become similar and the energy surface flattens. The test can struggle to distinguish a genuinely stable mixture from one that is marginally unstable, and it can take many iterations to decide.

The engine's phase envelope tracing is built on the stability flag, and its documentation records that near-critical truncation is a known limit: very narrow two-phase windows can be missed.

That limit is stated rather than hidden, which is the pattern.

## Wilson's estimate

Both the stability test and the flash need somewhere to start. The standard starting estimate is Wilson's correlation for K values, from the critical properties and the acentric factor:

$$\ln K_i = \ln\frac{p_{ci}}{p} + 5.37(1 + \omega_i)\left(1 - \frac{T_{ci}}{T}\right)$$

It is not accurate and it does not need to be. It puts the light components above one and the heavy ones below, which is enough for an iteration to take over.

## The misconception to avoid

"If the flash converges, the mixture is two phase." A flash can converge on a trivial solution where both phases have the mixture's own composition, which satisfies equal fugacities exactly and means nothing. Detecting the trivial solution after the fact is possible and fragile; running a stability test first is how it is actually done.

## Exercise

First, state the stability question in one sentence and say why it must be run from both the vapour and the liquid side.

Second, explain in two sentences why the stability test and the flash are better thought of as a pair than as a check followed by the calculation.
