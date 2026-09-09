# What a convention cannot tell you

Four settings, three NPVs, one field. The convention tells you how to read the ledger; it cannot tell you what the ledger is worth.

{{panel:ec-time-explorer}}

## One field, several readings

AKATA reports an NPV of 72534830.66 USD on the nominal basis with end-year discounting, 69159247.46 on the nominal basis with mid-year, 72534830.66 on the real basis with end-year and 70188970.32 on the real basis with mid-year. The rows were not changed between those runs. The production is the same 9680000.00 bbl of oil, the revenue the same 857602518.80, the tax the same 148425219.46. Only the rule for placing each row in time changed.

So "the NPV of AKATA" is not a number. "The NPV of AKATA on the real basis, end-year, at 10 percent nominal, valued in 2029" is a number, and it is 72534830.66. Every reported NPV carries that sentence, printed or not.

## What a convention can tell you

It can tell you the direction of a change. Mid-year scales every discounted row toward zero by one factor, so a positive NPV shrinks and a negative one shrinks in magnitude too.

It can tell you what is invariant. The IRR is 29.2361 percent and the discounted payback 3.961607 years in all four runs. The totals, 141637829.18 nominal and 117362408.71 real, have no exponent to shift.

## What it cannot tell you

It cannot tell you which convention is true. The rows the engine discounts are years, and nothing in a year row records when within that year the cash moved. Choosing mid-year is a claim about the field, that cash flows evenly through the year, and the engine will not check it.

It cannot tell you whether a difference is real. Two readings of one field, 72534830.66 and 69159247.46, differ by a convention; two fields read under the same convention differ by their ledgers. Only the second difference means anything.

It cannot rescue a comparison that mixes conventions. multiyear_pia_real reports a headline NPV of 203250580.21 and multiyear_pia_midyear_real, the same field, 196677221.27; at 5 percent their profiles read 222922734.92 and 217550313.27. Set those side by side without their conventions and a reader sees two projects. There is one.

## The mistake

The careful mistake is precision without provenance. A reader reports 70188970.32 to the cent and omits that it is real basis, mid-year. The next reader, holding 72534830.66 from the same field, concludes that one of them made an arithmetic error and starts hunting for it. Both are right, and the hunt finds nothing, because the difference was never in the arithmetic.

## What the engine refuses

It refuses to report a convention-free NPV, and it refuses to pick the convention for you. Where none is given it discounts end-year, and a default is still a choice the reader has to be told.

## Exercise

Write the full sentence that names 70188970.32, with its basis, convention, discount rate and valuation year. Then say which of IRR, discounted payback and NPV would change if only the convention changed.
