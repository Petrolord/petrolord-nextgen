# Positions as holdings

{{panel:farmout-valuation-calculator}}

An EMV says what a position is worth on average. It says nothing about how far the outcome can fall from that average. A farm-out moves money and risk between the sides, and this module measures the risk each side carries. Portfolio choice and its risk measures belong to the portfolio course; this course uses the canonical portfolio engine to compare a farmor's position before and after a deal.

## What the engine uses

The engine hands the positions to the portfolio engine and says so in its basis:

> portfolioRiskMetrics from engines/economics/portfolio.js: EMV and standard deviation closed form (success/failure mixtures, equal pairwise correlation); the chance of a loss and the low and high cases from its seeded Monte Carlo (lib/stats mulberry32, a one-factor Gaussian copula)

Two figures are closed form: the EMV and the standard deviation. The others come from seeded draws, and the next lessons treat them as estimates.

## A holding

A position is a list of holdings, and each holding is a success or a failure:

> a holding succeeds with its stated chance, worth its success value (with its stated standard deviation) or loses its fail cost; a certain amount is a holding with chanceOfSuccessPct 100 and standard deviation 0

That last clause is how cash enters a position. A cash bonus received for certain is a holding that always succeeds and never varies.

## The Ekene farmor, before and after

On the Ekene Deep prospect (synthetic) the fixture states EKO's two positions. Drilling alone, EKO holds its 70.000000 percent of the prospect. After the farm-out, EKO holds 40.000000 percent of the prospect and, as a certain holding, the cash it receives. The EMVs match the deal calculator's, because the payoffs are the same (engine):

| golden case | position | EMV |
| --- | --- | --- |
| risk-ekene | EKO drills Ekene Deep alone (70%) | 18418808.982316 |
| risk-ekene | EKO after the farm-out (40% and the cash) | 19833033.704181 |

Nothing new is computed about value. What the risk view adds is the shape of the outcomes around each EMV.

## What a holding must state

Every term of a holding is stated. A holding with no standard deviation on its success value is refused:

> positions[0].holdings[0].successStdDev must be a finite number at or above 0; got nothing

A fail cost is a cost, entered as a figure at or above 0; a negative one is refused:

> positions[0].holdings[0].failCost must be a finite number at or above 0; got -1

A standard deviation of 0 is accepted and means the success value is known exactly. The stated standard deviation is a judgement about the prospect's range; the engine takes it and adds none of its own.

## Exercise

Open the valuation calculator on the view "Risk sharing: spread, the chance of a loss, the low and high cases" and start from "The Ekene farmor alone and after the farm-out". Read the box: find the two positions and list each one's holdings with their chance of success, success value, standard deviation and fail cost. Identify the certain holding and say what it stands for. Read the EMV column and compare each figure with the farmor's EMVs in the view "The value of the deal to each side". Then delete the standard deviation from one holding in the box and read the refusal.
