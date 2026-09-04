# Why you have to sample

If you cannot write the answer down, you have to count it. Sampling is not a sophistication, it is the fallback when the algebra runs out.

{{panel:wc-risk-explorer}}

## What sampling actually does

The method is unglamorous. Draw one value from each input distribution. Run the deterministic engine once on that set of values. Write down the total. Repeat, and repeat, and then sort what you collected.

The engine is doing nothing probabilistic. It is the same closed form evaluator used for the base case: a schedule walk, an NPT stretch, an item by item rollup. The randomness lives entirely in the inputs handed to it.

This is why the well cost engine holds no statistics of its own. Its own header says so, and says why: keeping the evaluator pure and deterministic is what makes every published percentile reproducible from the sampled inputs.

## Sample the inputs, never the outputs

The single most common mistake is to put a distribution on the answer. Somebody takes a base cost of 5,380,000 USD, guesses that it might be twenty per cent either way, and calls the result a risked estimate.

That is not a risked estimate. It is a hand drawn shape with a cost label on it. It knows nothing about the fact that 53.53 per cent of the golden base is per-day exposed and the rest is not, so it cannot tell you that a slip moves some lines and leaves others still.

Sampling the inputs preserves the structure. Sampling the output discards it and then asks you to trust the picture.

## How many draws

The golden case is configured for 2,000 iterations with the seed 42. More iterations do not make the answer more correct, they make it less noisy: the sampling error on a percentile falls roughly as one over the square root of the number of draws, so buying another decimal place costs a hundred times the work.

Judge convergence by rerunning with a different seed and watching whether the numbers you intend to quote move. If your P50 wanders by more than you would defend in a meeting, you need more draws, not a better story.

## What the engine still refuses

Sampling does not loosen the deterministic checks. A negative duration, a rate of penetration of zero, a cost basis it does not recognise: all of these still throw, and they throw on the realisation that produced them. A distribution whose lower bound reaches an invalid value will stop the run rather than quietly clip it.

## Exercise

Run the panel at the published iteration count, then run it again at a much smaller one and note which reported figures move the most.

Then write one sentence explaining why sampling a range around the finished total would have hidden the per-day and lump split.
