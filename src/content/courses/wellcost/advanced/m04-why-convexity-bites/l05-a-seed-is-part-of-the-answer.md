# A seed is part of the answer

A sampled number that nobody can reproduce is not a result. It is an anecdote with decimal places.

{{panel:wc-risk-explorer}}

## Where the randomness comes from

The canonical sampler does not use the language's own random number generator. It builds a seeded generator from an integer you supply, and every draw in the run comes out of that one stream.

The consequence is simple and strong. The same seed, the same iteration count, the same distributions and the same engine give the same numbers, every time, on every machine. Change the seed and every figure moves a little. Change nothing else and nothing moves at all.

The golden case fixes both parts of that contract in the case document. It records 2,000 iterations and the seed 42, and it records them alongside the distributions rather than somewhere in a comment.

## What a seed is not

A seed is not a claim about the truth. Seed 42 is not more correct than any other seed, and quoting a seeded run does not make the spread real.

A seed is an audit handle. It lets a second person take your inputs, press run, and land on your figures to the last digit. If they land somewhere else, the disagreement is about the inputs or the engine, and that is a conversation worth having. Without a seed there is no disagreement to have, because there is nothing to compare.

It is also not a licence to shop. Rerunning until a seed gives a friendlier P50 and then reporting only that one is fraud with extra steps. The honest use is the opposite: rerun across several seeds to see how much the number wobbles, then quote one run and say which.

## What a reported number needs beside it

A risked cost that walks into an approval meeting should carry enough to be rebuilt from scratch.

| Recorded with the result | Why it is needed |
| --- | --- |
| Seed | Reproduces the exact draws |
| Iteration count | Sets how noisy the percentile is |
| Every distribution and its parameters | Defines what was actually assumed |
| Any correlation applied | Changes the spread without changing any mean |
| Engine and case version | Fixes what the deterministic evaluator did |

Drop any one of those and the number stops being checkable. In practice the seed is the one that goes missing first, because it feels like plumbing rather than content.

It is not plumbing. It is the difference between a result and a rumour.

## Exercise

Run the panel at the published seed, note the figures you would quote, then rerun at a different seed and record how far each one moved.

Then write the one line you would put under a risked total in an AFE pack so that a reviewer could reproduce it without asking you anything.
