# Working the capstone

A method you can run on any roster, and three checks that catch the mistakes people actually make.

{{panel:wi-envelope-explorer}}

## The method

**One. Split the roster by envelope.** Every element declares primary, secondary or both. An element declared both goes into the primary list AND the secondary list. It is one piece of hardware occupying two seats, and it is counted in both envelope counts. Miss that and every number after it is short.

**Two. Roll each envelope up.** Take the worst status in the list. Any failed element makes the envelope failed. Otherwise any degraded or not verified element makes it degraded. All verified makes it intact. An empty list is empty, which is a different word from intact and a very different one from failed.

**Three. Count seats against physical elements.** Add the primary count to the secondary count to get the seat total, then count the distinct pieces of hardware on the roster. The gap between them is the independence you do not have.

**Four. Categorise.** Feed the two envelope verdicts, and the flow potential flag, into the category. Envelope verdicts only. If you find yourself passing a word like verified or not verified, you have skipped step two and the engine will refuse you.

## The three checks

**The seat arithmetic must close.** Seat total minus distinct element count equals the number of shared elements, exactly. Not approximately. If the difference is not the count of elements declared both, you have either double counted something or dropped it from one list.

**An envelope holding a not verified element cannot be intact.** This is the check people fail, because a roster with no failures and no degradations looks clean. Not verified is degradation as far as the roll up is concerned. Scan for it before you accept an intact.

**Empty is not a small number.** An envelope with zero elements is empty, and on a flowing well that alone rules out green whatever the other envelope says.

## Order of work

Do the split and the seat arithmetic first, on paper, before touching the panel. It is the only step that is pure bookkeeping, and if it does not close then nothing downstream is worth computing.

Then roll up, then categorise, and compare against the panel. Where you disagree, the disagreement is almost always a shared element counted once.

## Exercise

Take any roster in the panel. Split it by envelope by hand and write the two counts, the distinct count and the seat total.

Check the seat arithmetic closes, then roll up both envelopes and predict the colour before you read it.
