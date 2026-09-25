# Drawing residuals with a seed

{{panel:pf-uncertainty-explorer}}

Every draw in the bootstrap comes from a single seeded stream, which is what lets two people run the same interval and get the same percentiles to the last bit.

## The draw rule, in the engine's words

For the teaching run the basis reads:

> 1000 paths; each step adds a residual drawn with replacement from the 46 scored in-sample residuals (index floor(u x 46), u from mulberry32(11), path by path, step by step) to the one-step forecast, and the simulated value updates the state; residuals are drawn as fitted without centring (their mean is not subtracted), so a method whose residuals have a non-zero mean drifts: on a declining well a flat method's paths can fall below its own point forecast

Take it a clause at a time. The generator is mulberry32, the canonical one in the platform's statistics library, started on the seed you give. Each draw u lies from 0 up to 1, and the index floor(u x 46) picks one of the 46 residuals in the pool, so every residual is equally likely and the same residual can be picked again. The order is path by path, step by step: path one takes its first draw, then its second, through all h steps, before path two begins. The last clauses, about the state and about centring, are the subject of the next three lessons.

## One stream, one answer

The same call returns the same percentiles bit for bit. A different seed is a different stream, and the percentiles move: damped on EKENE-P1, h 12, 1000 paths, with seed 12 gives P50 140.453203 at step 12 against 137.469798 with seed 11. Neither is the better answer: they are two draws of the same experiment.

## More paths, the same seed

| nSims | P90 step 12 | P50 step 12 | P10 step 12 |
| --- | --- | --- | --- |
| 100 | 0.000000 | 132.416487 | 308.081207 |
| 1000 | 0.000000 | 137.469798 | 324.803671 |
| 10000 | 0.000000 | 135.920627 | 314.738791 |

These are damped on EKENE-P1, h 12, seed 11. More paths steady the percentiles; they do not make the method right.

## What the engine refuses

The seed has no default. Leave it out, pass a negative number or pass 2.5, and the call is refused with the field `seed` named:

> seed must be a whole number from 0 to 4294967295

Both ends are accepted: seed 0 and seed 4294967295 each return an interval. The number of paths has its own rule. Leave `nSims` out and it is 1000; pass 0 or 100001 and the call is refused:

> nSims must be a whole number from 1 to 100000

There is no tolerance band on a percentile. The seed and nSims name a bootstrap exactly, and the quantile rule reads the sorted simulated values exactly, so a percentile quoted with its method, seed and paths has one right value.

## Exercise

Open the view "Seeds, paths and clipping" with EKENE-P1, method damped, h 12, and the seeds 11 and 12. Confirm the P50 at step 12 for each. Add three more seeds of your own and note how far the P50 moves across the five. Then go to "Bootstrap intervals", hold seed 11, and set the paths to 100, 1000 and 10000 in turn. Write down which percentile at step 12 moves least as the paths grow, and give each figure with its seed and paths.
