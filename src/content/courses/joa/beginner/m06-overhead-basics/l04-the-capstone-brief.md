# The capstone brief

{{panel:joa-account-calculator}}

The Associate capstone asks the tier's one question: interests and the joint account. It gives you a synthetic joint venture of its own, with its own parties, carry, months, budget and overhead scale, and asks for six values the engine returns. Each value tests a module of this tier. This lesson says what the capstone asks, where each value comes from in the account calculator, and how to rehearse on the Ekene joint venture first.

## What the capstone gives you

The capstone card carries one case file. It states every term a figure depends on: the parties and their participating interests; the carry, its carried percentage and its carriers; the months with their forecasts and actuals, the reconciliation lag, the negative call rule and the threshold; the budget items with the item tolerance, the budget tolerance and the unbudgeted allowance; and the overhead costs, exclusions and scales. The case file holds a block for each view under the keys `interests`, `cashCalls`, `budget` and `overhead`. Paste the whole file into any view of the account calculator and that view reads its own block.

## The six values

| value | what it tests | where to find it |
| --- | --- | --- |
| a named party's paying interest while another party is carried | paying and beneficial interests | the paying interest column in "Participating, paying and beneficial interests" |
| a named party's cash call for a named month | the forecast share and the adjustment | the call column of the per-party table in "Cash calls" |
| what a named party pays in a named month | the threshold and billing in arrears | the paid column of the same table |
| the allowed overrun of the budget | the budget tolerance | the "Allowed overrun" tile in "Budget control" |
| the operating overhead charge | a marginal scale with exclusions | the charge column of the first table in "Operator overhead" |
| the development overhead charge | a marginal scale | the same column |

All six are reported to six decimals, as the panel prints them. Each is the same number under every reading the engine states.

## Things to check before you copy a figure

In the interests view, read which party is carried and who carries it, and check that the paying interests total 100.000000. In the cash calls view, read the three controls: the lag decides which earlier month adjusts the call, and the threshold decides which months are called at all. Read the reasons for the month you are asked about and the months before it; a month below the threshold is billed in arrears the next month, so a payment can hold more than that month's call. In the budget view, read the "Held by" tile. In the overhead view, check each base against cost less exclusions before you read a charge.

## How your answers are checked

Every graded value is a return value of the engine on the card's terms, so there is exactly one right answer. Enter each value as the panel prints it. If a view refuses the case file, a term has been changed or mistyped: read the field the refusal names, restore the card's term and run it again.

## Rehearse on the Ekene joint venture

The Ekene figures are printed in this course, so it is a safe place to practise every step.

| step | Ekene figure |
| --- | --- |
| EKO's paying interest while NOC is carried | 50.000000 |
| EKO's cash call for January 2027 | 2000000.000000 |
| the allowed overrun of the 2027 budget | 3000000.000000 |
| the 2031 operating overhead charge | 1455000.000000 |
| the 2031 development overhead charge | 2000000.000000 |

For a payment, rehearse on the Ekene June 2027 rows: check for each paying party that its paid figure is its call plus its arrears billing for May.

## Exercise

Open the account calculator, the course's own calculator panel. Work the five Ekene steps in the table, one view at a time, and check each figure against the table. Then, in "Cash calls", read the June 2027 rows of the per-party table and write down each paying party's call, arrears billing and paid, and check that the three agree.
