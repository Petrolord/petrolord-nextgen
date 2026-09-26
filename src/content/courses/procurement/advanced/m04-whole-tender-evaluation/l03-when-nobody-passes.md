# When nobody passes

{{panel:pr-contract-calculator}}

An evaluation can end without an award. Every bid can fail the technical envelope, or every bid that passed it can be rejected at the commercial stage. A tool that always names a winner would hide both outcomes, and both are findings a committee has to report. The engine returns each as a result with a reason, and this lesson reads the difference between that and a refusal.

## Nobody passes the technical envelope

Run the well services tender with a stated pass mark of 90. The highest technical percentage among the bids is WS3's 85.000000, so no bid passes. The engine returns an award of null and a commercial envelope of null, with its reason, verbatim:

> no bid passed the technical envelope; no commercial envelope is opened

No price is opened for any bid, which is the point of the two envelopes: a bid that fails on quality never has its price seen, so price cannot pull a weak technical offer back in.

## Every opened bid is rejected

Run the same tender with a stated maxWeeks of 5. Four bids pass the technical envelope, and every one offers completion in more than five weeks, so every one is nonresponsive at the commercial stage. The award is null, with the reason:

> every opened bid was rejected at the commercial stage

Each late bid carries its own exclusion, in the engine's words:

> WS1: offers completion in 6 weeks, beyond the maximum 5 weeks; the bid is nonresponsive

> WS2: offers completion in 8 weeks, beyond the maximum 5 weeks; the bid is nonresponsive

> WS3: offers completion in 7 weeks, beyond the maximum 5 weeks; the bid is nonresponsive

> WS5: offers completion in 9 weeks, beyond the maximum 5 weeks; the bid is nonresponsive

Here "responsive" is exact. After the technical envelope these four bids were responsive; after the schedule check none is.

## A result with a reason, and a refusal

Both outcomes above are results. The call was well formed, the engine ran every stage it could, and it reports that no bid survived. The ranking function on its own behaves differently. Handed a list in which every bid is rejected, `rankTender` refuses, because it has been asked to rank nothing:

> bids has no bid left to score: every bid is rejected

The distinction matters in a report. "No award: no bid passed the technical envelope" is an outcome of the evaluation, and the committee may re-tender. A refusal means the evaluation was never run on the inputs given, and the inputs have to be fixed first. Say "returned with the reason" for the first and "refused" only for the second.

## Exercise

Open the contract calculator on the view "The whole tender, any award basis", which loads the materials tender. Find the highest technical percentage among its bids in the course's tables, set `passMark` one above it and read the award, the lowest evaluated cost tile and the reason. Restore the pass mark. Then change the `schedule` to a `minWeeks` of 5 and a `maxWeeks` of 7, below every materials bid's delivery weeks, and read the award, the reason and every exclusion with its stage. Say which exclusions came from the technical envelope and which from the commercial stage.
