# Dating a concept

A concept schedule is dated from the concept's own start date. The FPSO development is sanctioned on 2027-04-01 and reaches first oil on 2030-04-01, 36 months later, and that answer is the same today as it will be next year.

{{panel:ec-plan-explorer}}

## Two concepts, two dates

| concept | sanction | first oil | months |
| --- | --- | --- | --- |
| FPSO development | 2027-04-01 | 2030-04-01 | 36 |
| Subsea tie-back | 2027-04-01 | 2029-04-01 | 24 |

Both are sanctioned on the same day and they do not reach first oil together. The FPSO needs 36 months because a hull has to be converted, topsides fabricated and the whole vessel installed and commissioned. The tie-back needs 24 months because it hangs off a host that is already there. A full year of production separates them, and that year is worth money in every case the studio prices.

## The duration belongs to the concept type

The gap is a property of the concept type rather than of the date. A Platform sanctioned on 2027-04-01 reaches first oil on 2029-04-01, 24 months out, the same as the tie-back. Move the sanction date and the duration goes with it: an FPSO sanctioned on 2028-02-29 reaches first oil on 2031-03-01, still 36 months. That start date is a leap day, and the engine handles it by adding whole months and landing on a date that exists.

## No clock in the answer

The engine reads no clock. Every date in a concept schedule is derived from the start date somebody typed, so the same plan opened on any machine on any day gives the same first oil. That is why a concept with no start date is refused rather than dated from now: "the concept has no start date: enter one, or pass today to date the schedule from".

The refusal offers the alternative in the same sentence. If you want a schedule relative to today, you pass today in as an explicit input, and the answer then carries that date openly instead of picking it up from whatever machine ran the plan.

## A date is an agreement

Sanction on 2027-04-01 is not a prediction of when the board will meet. It is the anchor everything else hangs from, and a plan that moves it moves first oil by the same amount and takes the first revenue year with it. When somebody asks why the economics changed and nothing in the cost breakdown moved, the start date is the first place to look.

## The mistake

The mistake is a schedule that dates itself from the clock. It looks harmless, and it produces a plan whose first oil quietly slips every day nobody opens it, so two people reading the same plan a month apart see two different answers and neither can reproduce the other. The second mistake is to read 36 months as an estimate the studio made. It is the duration attached to the concept type, and it deserves the same scrutiny as any other typed figure.

## Exercise

Give the sanction date, first oil date and duration for both EGINA concepts. Then say what the engine returns for a concept with no start date and no today supplied, and explain in one sentence why dating from the clock instead would be a defect rather than a convenience.
