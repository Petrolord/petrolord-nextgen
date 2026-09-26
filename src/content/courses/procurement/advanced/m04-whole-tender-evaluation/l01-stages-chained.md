# Stages chained in one call

{{panel:pr-contract-calculator}}

The earlier tiers ran each stage of an evaluation as its own call: the technical envelope, the arithmetic, the evaluated cost, the combined score, the content rule. A real evaluation runs them in order, and each stage decides which bids the next one sees. The engine's `evaluateTender` chains them in one call, so the order is fixed and every exclusion is recorded with the stage that made it.

## The order of the stages

The engine's stages basis, in its own words:

> technical envelope (mandatory requirements, then the pass mark), then the commercial envelope of the passing bids only, then the award

In detail, `evaluateTender` runs `technicalEvaluation` on every bid, then `evaluatedCosts` on the bids that passed and on no others, then either `rankTender` for a combined award or the lowest evaluated cost, with `contentPreference` when Nigerian content is stated. A bid that leaves at one stage never reaches the next, and its price envelope is never opened if it leaves at the first.

## The well services tender, stage by stage

With the fixture settings (pass mark 70; omission rule average; schedule minWeeks 6, maxWeeks 10, ratePerWeek 0.005; a combined award at technical weight 0.7, priceMethod lowest-ratio, technicalMethod relative), the one call returns:

| stage | what it holds |
| --- | --- |
| technical.passed | WS1, WS2, WS3, WS5 |
| commercial.bids, evaluated cost ascending | WS5, WS2, WS1, WS3 |
| commercial.lowestEvaluatedCost | WS5 |
| ranking.bids, combined score descending | WS3, WS1, WS2, WS5 |
| award | WS3 |
| excluded | WS4 (technical), WS6 (technical) |

The technical and commercial objects in the chain are the same objects the separate calls return. Nothing is recomputed differently because it was chained.

The award reason is "WS3 has the highest combined score". The two exclusions keep the reasons the technical envelope gave them:

> WS4: technical score 65 is below the pass mark 70; the commercial envelope is not opened

> WS6: failed the mandatory requirement signed-bid-form; the bid is not scored and its commercial envelope is not opened

## What the chain refuses

The award basis has no default, because it decides everything after the commercial envelope:

> award must be 'lowest-cost' or 'combined'; there is no default

The chain also refuses a combination outside the engine's reading of the Act. Section 14 of the Nigerian Oil and Gas Industry Content Development Act 2010 (Act No. 2, commenced 22 April 2010, read on 2026-09-26) works at the commercial stage of a lowest evaluated cost award. Asked to apply it inside a combined award, the engine refuses and says what to do instead:

> nigerianContent applies s.14 at the commercial stage of a lowest-cost award; with award 'combined' state Nigerian content as a rated criterion with its weight instead

## Exercise

Open the contract calculator on the view "The whole tender, any award basis". It loads the materials tender with each bid's Nigerian content and the points reading of s.14. Read the tiles "Award", "Lowest evaluated cost" and "Passed the technical envelope", and the one exclusion with its stage. Change `award` to "combined" and read the refusal. Then delete the `award` line and read the second refusal. A refusal is an object with `error` and `field` and nothing else: say why that is safer than an award computed on a guessed basis.
