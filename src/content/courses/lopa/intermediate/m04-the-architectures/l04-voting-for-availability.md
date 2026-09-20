# Voting for availability, and its price

{{panel:lp-sif-builder}}

Voting arrangements are chosen for two reasons that pull against each other. One is the probability of failing to act when a demand arrives, which is PFDavg and which this engine computes. The other is the probability of acting when no demand exists, a spurious trip, which this engine does not compute at all. Every architecture in the table is a position taken on both, and only one of the two appears in the answer.

## The five, ranked

The EKULAMA channel with diagnostics in every architecture the engine knows.

| architecture | PFDavg | RRF | SIL | over the 1oo1 |
| --- | --- | --- | --- | --- |
| 1oo3 | 0.000264001209 | 3787.861448 | 3 | 0.049925 |
| 1oo2 | 0.000298987176 | 3344.625055 | 3 | 0.056541 |
| 2oo3 | 0.000369505528 | 2706.319458 | 3 | 0.069876 |
| 1oo1 | 0.005288000000 | 189.107413 | 2 | 1.000000 |
| 2oo2 | 0.010576000000 | 94.553707 | 1 | 2.000000 |

## The two out of two is the extreme case

A two out of two is the clearest example of buying availability with PFDavg. It needs both channels to agree before it acts, so a single channel demanding a trip is outvoted and the plant keeps running. It also fails to act as soon as either channel is dangerously failed, which is why its PFDavg of 0.010576000000 is exactly twice the single channel figure of 0.005288000000. On this channel that choice costs a whole band, from 2 down to 1.

## The two out of three is the compromise

A two out of three keeps the same protection against a single spurious demand and recovers most of the PFDavg, because two of its three channels must still be failed for it to miss a demand. It returns 0.000369505528 here against the one out of two at 0.000298987176. That is the price list in one line: a quarter more PFDavg for tolerance of one channel calling for a trip on its own.

## What the engine will not tell you

No number in the table above is a spurious trip rate. The engine returns PFDavg, its RRF, its band, the terms and the equivalent down times, and nothing about availability. A design review that picks a two out of three over a one out of two is making an availability argument the engine cannot check, and that argument belongs in writing beside the calculation. The same applies to the architectural constraint in the standards, which is a separate check this engine does not perform.

## Choosing with both numbers

In practice the sequence is simple. Establish the PFDavg the function has to achieve from the LOPA row. Find the architectures that meet it on the hardware available. Among those, choose on spurious trip tolerance, on the cost of the extra channels and on how believable the beta factor is for the arrangement. The engine narrows the field and the analyst chooses inside it.

## Exercise

Using the ranked table, compute how much PFDavg the move from a one out of two to a two out of three costs as a percentage, and how much the move from a one out of one to a two out of two costs. State which of the two purchases you would defend more easily to a reviewer, and give your reason in one sentence.
