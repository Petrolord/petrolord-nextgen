# Which one and where

One comparison against one pressure picks the correlation, and the sentence it prints has been wrong about that pressure.

{{panel:pd-droplet-explorer}}

## One number decides

The Coleman pressure limit is 1000.0 psia. Strictly below it the recommendation is coleman, at it or above it turner.

| Pressure, psia | Recommendation | Rounded to whole | Printed to one decimal |
| --- | --- | --- | --- |
| 980.00 | coleman | 980 | 980.0 |
| 999.04 | coleman | 999 | 999.0 |
| 999.88 | coleman | 1000 | 999.9 |
| 999.96 | coleman | 1000 | 1000.0 |
| 1000.00 | turner | 1000 | 1000.0 |
| 1000.04 | turner | 1000 | 1000.0 |
| 1000.50 | turner | 1001 | 1000.5 |
| 1500.00 | turner | 1500 | 1500.0 |
| 2500.00 | turner | 2500 | 2500.0 |

The branch is unambiguous. Every row does what the comparison says.

## The sentence that argued with its own branch

The recommendation comes with a reason. At 999.88 psia it now reads "At 999.9 psia wellhead this well sits inside the low-pressure range Coleman's data covered, where the unadjusted equation fitted better."

It used to round that pressure to a whole number, so 999.88 psia printed at 1000, under a branch that by construction never fires at 1000: at 1000.00 psia the answer is turner. The reader saw a well on the limit and a message explaining why it was below it. The display contradicted the branch that produced it.

This is a family rather than an incident. A diagnostic string that rounds harder than the test that used it will eventually print a value on the wrong side of its own threshold, and the same shape has been fixed across these production modules more than once.

## One decimal narrows it by ten, and does not close it

The fix prints one decimal. It shrinks the collision rather than removing it: at 999.96 psia the pressure prints as 1000.0, the limit prints as 1000.0, and the branch still returns coleman. That well is 0.0400 psi from the limit, where 999.04 psia is 0.9600 psi away and prints as 999.0.

Anything inside 0.05 psi of the limit still renders as the limit. The class of wells that can produce a contradictory sentence is ten times smaller and it is not empty.

## What it refuses

It returns guidance, not a decision. It does not switch the correlation for anybody, and it cannot see which station the pressure came from. The sentence used to hardcode the word wellhead for any station at all, and the label is now supplied by the caller, which is an admission that the pressure need not be a wellhead one.

So the function answers which correlation. Which pressure to give it is not a question it can answer, and that is the one worth carrying forward.

## Exercise

Read the recommendation and the printed reason at 999.04, 999.88 and 999.96 psia. Say which of the three a reader could not verify from the sentence alone, and what they would have to ask for.
