# Economics, a market, facilities and approvals

{{panel:prms-reserves-calculator}}

The last four criteria of PRMS 2.1.2.1 look outward from the project: does it pay, will anyone buy what it produces, can the product be moved, and does the law allow it. This lesson reads them in the engine's words, and the refusals that keep every criterion a stated fact.

## The four criteria

| criterion key | the engine's wording | section |
| --- | --- | --- |
| economicStatus | (4) positive economics (economic status "viable") | PRMS 2.1.2.1(4), 2.1.3.7.1 |
| market | (5) a reasonable expectation of a market for the sales quantities | PRMS 2.1.2.1(5) |
| facilities | (6) production and transportation facilities available or can be made available | PRMS 2.1.2.1(6) |
| approvals | (7) legal, contractual, environmental, regulatory and government approvals in place or forthcoming | PRMS 2.1.2.1(7) |

A market, facilities and approvals are each a stated true or false. Positive economics is read from another input: the stated economic status, one of viable, not-viable or undetermined. Only viable meets the criterion.

## Economics stated, and economics computed

In this view the economic status is a stated fact. A project whose economics have not been worked out yet is undetermined, and the golden input class-economics-undetermined shows what that does: every other criterion met, and the class is Contingent Resources with one blocker, economicStatus. A word the engine does not accept is refused, verbatim:

> economicStatus must be one of "viable", "not-viable", "undetermined"; got "positive"

Module four computes economics: the economic test of three technical forecasts through the canonical cash flow. The two meet in one place. When the best forecast fails that test, the engine's status says the project stays in Contingent Resources, economically not viable.

## A market and facilities for gas

Ekene East gas (EKN-3, synthetic) fails the market and the facilities. A gas discovery with no buyer and no pipeline is a common Contingent project, and the Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August 2021) names the same situation among the reasons a gas discovery can be significant without being commercial (s.318). The engine records the Nigerian declaration as a note beside the class and moves no class for it.

## Every criterion is stated

No criterion has a default. A criterion left out, or stated as anything other than true or false, is refused, verbatim:

> commerciality.market must be true or false (stated; no default); got nothing

> commerciality.approvals must be true or false (stated; no default); got "yes"

A misspelt criterion is refused as an unknown key, with the list of the keys the engine reads:

> commerciality.markets is not an accepted key; the accepted keys of commerciality are developmentPlan, financialAppropriations, timeFrame, market, facilities, approvals, firmIntention

This is what makes a class traceable. A reader of the result can see every criterion the classification rests on, each one as it was stated.

## Exercise

Work in the reserves calculator, in the view "Sub-classes and the commerciality criteria".

1. Start from "Economics undetermined". Read the class and the single blocker. Set "Economic status (stated)" to viable and read the refusal: the project now meets every criterion, and a Reserves project must state its project status. Name the two controls that would complete it.
2. Start from "EKN-3 development on hold". Set "(5) a reasonable expectation of a market (stated)" to not stated and read the refusal.
3. Set it back to false, then set "(6) production and transportation facilities (stated)" and the market control to true. Count the blockers that remain.
4. In the box, rename the key `approvals` to `approval` and read the refusal and the accepted keys it lists.
