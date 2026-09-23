# Reversals against the stated direction

{{panel:dq-checks-explorer}}

An index has a direction. A log recorded going down the hole has depths that increase; a log recorded coming up has depths that decrease; a production sheet has dates that increase. `indexCheck` does not guess which. You state the direction, and a reversal is a step against it.

On the EKENE-7 splice, declared increasing, there is 1 reversal, at entry 5. The index goes from 8522.000000 ft at entry 4 back to 8521.500000 ft at entry 5. Its reason, verbatim: "index goes from 8522 to 8521.5, against the increasing direction".

| splice summary | count |
| --- | --- |
| missing | 1 |
| duplicates | 2 |
| reversals | 1 |
| irregular steps | 3 |
| monotonic | false |

## One entry, two flags

Entry 5 is flagged twice, under the rules duplicate-index and reversal. It returns to a depth entry 3 already holds, so it is a duplicate, and it steps backward, so it is a reversal. The two rules answer different questions. The duplicate rule asks whether this depth has been seen before; the reversal rule asks whether this step goes the right way. A step back onto an earlier depth fails both, and the engine reports both, so you see both problems at once.

The result also carries `monotonic`, which is false for the splice. An index is monotonic when every step runs in the stated direction, and one reversal is enough to break it.

## A log recorded upward

Direction is a statement, and the same numbers can be right or wrong depending on it. Take the index 8410, 8409.5, 8409, 8408.5, 8408, a stated input. Declared decreasing, it reads 0 reversals, with an expected step of 0.500000. Every step goes the stated way.

Declare the same index increasing and the engine refuses, because no step runs in the stated direction:

> index has no step in the increasing direction: nothing to infer an expected step from

The message gives the reason: the expected step is inferred from the steps that run in the stated direction, and here there are none. A stated direction that no step follows is the first thing to recheck.

## Why direction is the caller's

The engine takes the direction as a statement from the caller. Stating it puts a fact you know, how the log was recorded, into the check, and every reversal is then measured against that fact. A guess from the data would be weakest in exactly the files that need the check most, the ones that change direction partway.

## What a reversal asks of you

A reversal on a spliced log often marks the overlap between two runs. The fix is a decision: which run to trust across the overlap, and where to cut. The engine does not make it. It points at entry 5 and says, in its own words, which way the index went.

## Exercise

Open the checks explorer on the index view. It opens on the EKENE-7 splice, direction increasing. Read the Reversals tile and find entry 5 in the flag table. Now replace the whole index with 8410, 8409.5, 8409, 8408.5, 8408 and read the result with the direction still increasing. Copy the refusal. Then set the direction to decreasing and read the Reversals and Expected step tiles.
