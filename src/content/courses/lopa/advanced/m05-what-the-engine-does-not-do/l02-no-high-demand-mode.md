# No high demand mode

Every band this engine reports is a LOW DEMAND band. A low demand safety instrumented function sits waiting, is called on rarely, and is characterised by the average probability that it fails when a demand arrives. That average is the PFDavg, and it is meaningful because the function spends nearly all of its life untested and unchallenged. When demands arrive often, the quantity that characterises the function is a dangerous failure rate per hour. An average probability no longer describes the function, and the standard calls for a different calculation. This engine does not perform it.

## The limit, in the engine's own terms

| not in the engine | why, from the engine header | what the analyst does instead |
| --- | --- | --- |
| high demand or continuous mode, PFH | every band here is low demand | uses a PFH method when the demand rate is high; a low demand PFDavg is the wrong quantity there |

The engine exports a low demand band table and nothing else. Its `silFromPfdAvg` takes a PFDavg and returns a low demand band, and its band convention names IEC 61508-1 Table 2 and the IEC 61511-1 low demand columns. There is no second table, no per hour band and no export that would let a caller ask for one.

## Why the wrong mode is a silent error

A PFDavg computed for a function that is actually in high demand still returns a number. It still falls in a band. Nothing about the output announces that the mode was wrong, because the engine was never told the demand rate and has no way to check it. That is the shape of the risk here. The architectural constraint is missing in a way an analyst notices, because nothing is returned for it at all. The demand mode is missing in a way an analyst can fail to notice, because a plausible answer is returned to a question that should not have been asked.

## Where the check belongs

The check belongs before the verification, in the layer of protection analysis. A demand rate is what the analysis produces: the initiating event frequency, reduced by the enabling conditions, the conditional modifiers and the credited protection layers, is the frequency of demands on the safety instrumented function. If that frequency is high compared with the proof test frequency, the low demand treatment is the wrong treatment and a per hour method is needed. The row that produced the required PFDavg is therefore also the evidence that the mode is right, and a verification note that carries the row carries that evidence with it.

## Nothing here is graded

No capstone grades a per hour figure, a demand rate or a mode. This course grades low demand quantities only. The limit is taught so that a learner reads a band with the mode in mind, and so that a verification note written to this standard records that the function was treated as low demand and why that treatment applies.

## Exercise

Take a safety instrumented function whose proof test interval is 8760 hours. Decide what demand frequency per year you would want to see on the layer of protection analysis row before you were comfortable treating it as low demand, and write the rule you used. Then write the one sentence a verification note would carry to record the mode decision and the row that supports it.
