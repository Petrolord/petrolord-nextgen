# Conventions that are choices

{{panel:gsa-contract-calculator}}

Every figure the engine returns rests on stated terms, stated readings and a handful of conventions. A convention is the engine's choice where no text fixes one. A different choice would move a figure, so each is named in any report that quotes a figure resting on it. This lesson lists them, and the next two use the list.

## The conventions

| convention | the engine's choice | where it comes from |
| --- | --- | --- |
| the Btu | the International Table Btu, 1055.05585262 J | NIST SP 811 (2008) Appendix B |
| a mixed volume and heating value pair | one set of reference conditions, stated by the caller | engine convention |
| the day count | stated days, a calendar year, or a period with the end date excluded | engine convention |
| the make-up threshold | strictly above the Adjusted ACQ or the take-or-pay quantity | engine convention on the model agreement's "after Buyer has taken delivery of at least" |
| drawing make-up and carry-forward | first in first out | Commonwealth model GSA Articles 12.7 and 12.8 |
| the index window | the mean of averagingMonths months ending lagMonths months before the delivery month | engine convention |
| the reset | every month of a block carries the price of the block's first month, counted from `from` | engine convention |
| the four-decimal rule | the double normalised to 12 significant digits before the fifth decimal decides | Commonwealth model GSA Article 15.4 |
| the NPV | year-end flows discounted to the stated base year | the canonical npv of cashflow.ts |

Beside them sit the engine's stated readings: the seller shortfall against the quantity made available, the make-up right equal to the deficiency paid with none from the last year, and royalty on the value of gas delivered. A reading is where a text is open or odd; a convention is where no text speaks at all. A report names both.

## Three that move figures the most

**The index window.** A lag of zero ends the window at the delivery month itself; the model agreement ends it one month before the review month. The Ekene export feed (synthetic) states a lag of 1, so its window ends the month before the priced month, and its 2027-01 block averages 2026-07 to 2026-12. Change the lag and every export price moves.

**The reset.** A price reset every 3 months from 2027-01 holds each price for a block of three months. The block is counted from the first priced month, so the same formula priced from a different first month resets in different months.

**The NPV.** Year-end flows are a convention. Discounting each flow from the middle of its year would give a different present value on the same flows. The engine takes the canonical npv as it stands and states it.

**The four-decimal rule.** The model agreement's Article 15.4 rounds the fourth decimal up when the fifth is five or more. The engine computes the price in full, normalises the double to 12 significant digits, and only then reads the fifth decimal, so 11.234346 prices 11.234300 and 11.23459 prices 11.234600. A calculation that rounded in stages could land a different fourth decimal.

**First in first out.** Make-up and carry-forward are drawn oldest entry first, as the model's Articles 12.7 and 12.8 state. Drawing the newest first would let older entries expire sooner.

## Why the list matters

Two analysts can run the same contract terms and get different figures without either making a mistake, if they chose different conventions. The list lets a reader see at once whether a difference is a disagreement about the contract or a difference of convention.

## Exercise

Open the contract calculator on "Prices on an S-curve". It starts on Figure 51, which prices each month on its own JCC. Set from to 2026-04 and averagingMonths to 2, and read the two prices and their windows. Set lagMonths to 1 and read them again; then set lagMonths to 3 and read the refusal. For each change, state which convention moved the figure or stopped the call. Then open "The whole contract in money" and move baseYear from 2026 to 2027, and name the convention behind the change in each NPV.
