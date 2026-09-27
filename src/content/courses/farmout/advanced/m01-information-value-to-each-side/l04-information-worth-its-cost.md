# Information worth its cost

{{panel:farmout-valuation-calculator}}

EVII is what a signal is worth before anyone pays for it. A survey is worth buying only if EVII covers its cost, and the engine reports that comparison in a reason. The cost is a stated input: the engine sets no price for a survey.

## Three surveys on the same prospect

The three golden cases below value information for FIN on the Ekene Deep deal (synthetic). The first is the fixture's survey; the second states the same survey at a higher cost; the third states a signal that carries no information.

| golden case | EVII | information cost (stated) | EVII less the cost |
| --- | --- | --- | --- |
| info-ekene-farminee | 6745331.458602 | 1500000.000000 | 5245331.458602 |
| info-ekene-too-dear | 6745331.458602 | 9000000.000000 | -2254668.541398 |
| info-uninformative | 0.000000 | 0.000000 | 0.000000 |

EVII is the same in the first two rows. The cost does not change what the signal tells FIN or what FIN does after it; it is subtracted at the end. The engine's closing reasons, verbatim:

> EVII 6745331.46; less the information cost 1500000: 5245331.46; the information is worth buying
> EVII 6745331.46; less the information cost 9000000: -2254668.54; the information costs more than it is worth

## A signal that tells nothing

On info-uninformative both signals are equally likely under success and under a dry hole: 50.000000 percent given success and 50.000000 percent given a dry hole, each. After either signal the chance of success stays 25.000000 percent, FIN declines after both, and EVII is 0.000000 (engine). Its stated cost is also 0.000000, so the engine reports the boundary in words:

> EVII 0; less the information cost 0: 0; the information is worth exactly its cost

That reason is a result. It is no refusal: the call succeeded and the comparison landed exactly on its edge. Stated with any positive cost, the same uninformative signal would cost more than it is worth.

## Reading the comparison with care

EVII less the cost is an expectation over the stated signals at the stated chance of success. It depends on every term a side's positions depend on: the share paid, the interest earned, the cap, the bonus, the reimbursement, the assignor fees, the well costs and the success-case value. Change any of them and the EVII moves. Quote the net figure with the likelihoods, the cost and the side it belongs to.

The engine also does not decide who pays for the survey. A deal might have the farmor shoot it, the farminee pay for it as part of its obligation, or the two share it. Each is a set of terms the parties state, and each changes the positions the engine values. The engine takes the cost as the stated cost to the side valued.

## Exercise

Open the valuation calculator on the view "The value of information to one side" and start from "The Ekene survey to the farminee". Read the EVII tile and the "EVII less the cost" tile. Now raise "Cost of the information (stated)" step by step and watch the last reason. Find the cost at which the reason changes from worth buying to costing more than it is worth, and compare it with the EVII tile. Then start from "The survey at a cost above its worth" and confirm that EVII has not moved. Finally start from "An uninformative signal", read the per-signal table, and set a positive cost to see which reason the engine gives.
