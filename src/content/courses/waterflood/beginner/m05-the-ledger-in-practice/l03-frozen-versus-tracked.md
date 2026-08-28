# Frozen versus tracked

The machinery is built. This lesson runs it, reports the number, and then spends most of its length on what to do with a number that turns out to be tiny.

## The result

Recompute the whole Ekene ledger with $B_o$ read off the interpolated pressure track period by period, instead of frozen at 1.21584:

$$\text{cumulative VRR, frozen } B_o = 1.034899536109$$
$$\text{cumulative VRR, tracked } B_o = 1.0349459620241488$$

The difference is

$$\frac{1.0349459620241488}{1.034899536109} - 1 = 0.004486031110162436 \text{ percent}$$

Forty five parts per million. On a field where the fourth decimal place of the VRR is never going to change a decision, the frozen convention cost nothing measurable.

## Why it is so small

Two reasons multiply.

The flood-era pressure range is narrow. The track runs from 2088.9530115439275 to 2123.4461408278908 psia, a span of 34.5 psi. Over that span $B_o$ moves by $1.2 \times 1.2\times10^{-5} \times 34.5 = 4.97\times10^{-4}$, which is 0.04 percent of 1.216.

And the convention was chosen near the middle of that range. Freezing at 2100 psia when the true pressures run 2089 to 2123 means the worst-case error in any single period is about half the span, so about 0.02 percent, and the errors on either side of 2100 partially cancel in the cumulative.

Two effects, each an order of magnitude, giving a result three orders below the frozen value.

## The direction

The tracked value is slightly HIGHER. Most of the record sits above 2100 psia, where $B_o$ is slightly below 1.21584, so the tracked produced voidage is slightly smaller, so the ratio is slightly larger. That sign is predictable from the pressure history alone and is worth predicting before you compute, as a check on the machinery.

{{panel:wf-ledger-explorer}}

Toggle the button and watch the pink cumulative line. If you cannot see it move, that is the finding.

## What to do with a null result

The temptation, having built machinery that turns out not to matter, is to either bury it or to keep it because it was work. Both are wrong.

**Report it.** "We tested the frozen-factor convention against a pressure-tracked one and it moves the cumulative VRR by 0.0045 percent" is a sentence that ends an argument permanently. Without it, someone raises the question again every year.

**Keep the machinery, use the convention.** The tracked path exists, is tested, and can be run on demand. The reported number stays the frozen one, because it is simpler and now demonstrably adequate. That is the right resting state: the more complex option available and not used, for a stated reason.

**Note the conditions under which the answer would change.** This result is specific to a narrow, undersaturated pressure range. Three changes would break it: falling below the bubble point, where $B_o$ curves and $B_g$ appears; a much wider pressure swing; or a convention frozen at the edge of the range rather than the middle. Write those down next to the result, because the next person will have a different field.

## The general shape of this argument

Sensitivity analysis has two useful outcomes and one useless one. The useful outcomes are "this matters, here is how much" and "this does not matter, here is how little". The useless one is not doing it and carrying the uncertainty forward as an unquantified worry.

The 0.004486031110162436 percent is a small number that does real work: it converts an open question into a closed one. Most of the value of a sensitivity study is in the questions it lets you stop asking.

## A caution about precision

Do not report 0.004486031110162436 percent to a colleague. Report 0.0045 percent, or "well under a hundredth of a percent". The full precision belongs in the record because it is what the engine produced and it is reproducible; the communicated version should carry only the digits that mean anything. Quoting sixteen digits of a number whose inputs are a six-point interpolated pressure track is a claim you cannot support.

## The misconception to avoid

"Since the difference is negligible, the pressure track was a waste of time." The pressure track is load-bearing for the entire previous module: it is how you check whether the VRR kept its promise, where the trough is, and whether the tank assumption holds. Its use as a source of formation volume factors is a side application that happens to be negligible on this field. Two different jobs, two different verdicts.

## Exercise

First, predict the sign of the frozen-versus-tracked difference for a field whose flood-era pressure is entirely BELOW the freezing pressure, and check your reasoning against the Ekene case where most of the record is above it.

Second, estimate the pressure range over which the frozen-versus-tracked difference on an undersaturated oil with $c_o = 1.2\times10^{-5}$ per psi would reach 0.1 percent of the cumulative VRR. State the assumption you had to make to answer.
