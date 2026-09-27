# Ratios that are only reported

{{panel:farmout-valuation-calculator}}

A ratio of a stated price to a computed value is easy to misread. The Ekene Deep price is 2.026914 times the risked value per percent. This lesson reads what such a ratio can and cannot say.

## What a computed figure does not say

Every figure the engine returns rests on stated terms. An EMV is what the stated chance and payoffs produce. A value per percent is a stated value divided by 100. A transaction ratio is a stated price over a computed value. None of them forecasts what a partner will pay, and none is a statement of market value. Each depends on the stated discount rate and base year, and each is quoted with its terms for that reason.

The Ekene Deep ratio of 2.026914 on the risked basis becomes 0.236774 on the success-case basis (engine, interest-ekene-success-case), with the same price. A reader who is not told the basis cannot tell which one they are reading.

## No ratio on a value at or below 0

A ratio over a value that is 0 or negative means nothing, and the engine does not print one. On the golden case interest-negative-emv the prospect's risked EMV at 100 percent is -30000000.000000, so the risked value per percent is -300000.000000 (engine):

| golden case | risked per percent | success case per percent | value of 25% (risked) | price (stated) | price over value per percent |
| --- | --- | --- | --- | --- | --- |
| interest-negative-emv | -300000.000000 | 1600000.000000 | -7500000.000000 | 1000000.000000 | none |

The engine still reports the price per percent, 40000.000000, and says why the ratio is missing:

> stated price 1000000 for 25%: 40000 a percent, 4000000 for 100%; no price-to-value ratio, the risked value per percent being -300000, at or below 0

A buyer who pays 1000000.000000 for an interest whose risked value is -7500000.000000 is paying for something the stated terms do not show: a different view of the chance, a strategic reason, or a term outside the call. The engine cannot see any of those and does not guess.

## Why reported and never graded as market truth

The course grades a ratio only as what it is: the engine's return value on the stated price and the stated prospect. HMRC's manual notes that an interest in a producing field is generally sold for cash or shares:

> "The consideration for the disposal of an interest in a producing field is generally in the form of cash or shares." (HMRC Oil Taxation Manual OT30023)

A consideration in shares, or in a royalty or net profit interest, would need its own value before any ratio could be taken, and the engine values none of those.

## Writing a ratio into a report

A report that quotes a transaction ratio names the price and the interest it was stated for, the value basis, the chance of success, the well costs and the success-case value with its rate and base year. It says the ratio is reported only.

## Exercise

Open the valuation calculator on the view "A price for a working interest" and start from "A risked value below 0". Read the tiles and the reason that explains the missing ratio. Raise "Chance of success, percent (stated)" step by step and find where the risked value per percent turns positive and the ratio appears. Then start from "The Ekene Deep price, risked", switch "Value basis (stated)" between its two settings and write one sentence for each ratio saying what it compares.
