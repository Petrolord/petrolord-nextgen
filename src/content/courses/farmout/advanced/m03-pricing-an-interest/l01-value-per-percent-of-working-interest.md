# Value per percent of working interest

{{panel:farmout-valuation-calculator}}

A farm-out is paid in work and cash. A sale of an interest is paid in cash alone, and both sides need a figure to price it against. The engine's figure is the value per percent of working interest, computed from the same prospect terms the deal calculator uses. It is a computed value on stated terms and no market price.

## The rule

The engine states it in its basis:

> value per percent = the 100% figure / 100; the risked figure is the EMV of the 100% position (rollback from engines/economics/decisionTree.js); the success-case figure is the success-case value less the success well cost

The 100 percent position is the prospect held whole: the success-case value less the success well cost on a success, less the dry-hole cost on a dry hole. The engine rolls that back at the stated chance of success and divides by 100.

## The Ekene Deep interest

On the Ekene Deep prospect (synthetic), the success-case value at 100 percent is 271250337.041807, the well costs 46000000.000000 on a success and 40000000.000000 as a dry hole, and the chance of success is 25.000000 percent (engine):

| golden case | 100% success | 100% dry hole | 100% EMV | risked per percent | success case per percent | value of 30% (risked) |
| --- | --- | --- | --- | --- | --- | --- |
| interest-ekene-risked | 225250337.041807 | -40000000.000000 | 26312584.260452 | 263125.842605 | 2252503.370418 | 7893775.278136 |

The engine's reasons, verbatim:

> 100% position: success 225250337.04 (success-case value 271250337.04 less the success well cost 46000000), dry hole -40000000; risked EMV at 25% 26312584.26
> per percent of working interest: risked 263125.84, success case 2252503.37; 30% on the risked basis is worth 7893775.28

## What the figure leaves out

The value per percent is the value of a heads-up working interest: each percent pays its own share of the well and nothing more. It carries no promote, no bonus and no reimbursement. Take the value of 30.000000 percent, 7893775.278136, and subtract the bonus of 2000000.000000 and the reimbursement of 3600000.000000: the result prints as 2293775.278136, which is how FIN's EMV in the deal calculator prints when it pays 30.000000 percent of the well for 30.000000 percent. The promote on top of that is what took FIN's EMV below 0 in the deal as offered.

## The Penn State figures

Priced as a 10.000000 percent working interest, the drill yourself or farm out problem of Penn State EME 801, Lesson 6 (numbers only, CC BY-NC-SA 4.0) gives a 100 percent success of 500000.000000, a dry hole of -250000.000000 and an EMV at 35.000000 percent of 12500.000000. The risked value per percent is 125.000000 and the working interest is worth 1250.000000 (engine, interest-psu-10pct).

## What the engine refuses

The working interest priced is stated, above 0 and at most 100:

> interestPct must be a number above 0 and at most 100; got 0

Every value here depends on the stated discount rate and base year behind the success-case value, the well costs and the chance. The cash flow course teaches how that value is built.

## Exercise

Open the valuation calculator on the view "A price for a working interest" and start from "The Ekene Deep price, risked". Read the six tiles from the 100 percent success to the value of the working interest. Change "Working interest priced, percent (stated)" and confirm that the value of the interest moves in proportion while the per-percent tiles do not. Then change "Chance of success, percent (stated)" and read which tiles move. Finally set the working interest to 0 and read the refusal.
