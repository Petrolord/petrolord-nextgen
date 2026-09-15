# Size to the power of

Capex scales with nameplate to the power 0.7 and annual operating cost to the power 0.6, so a facility two and a half times the size costs 1.899144 times the money and 1.732862 times the running cost. An exponent below one is the whole reason a bigger unit is the cheaper barrel of capacity.

{{panel:ec-schedule-explorer}}

## One vessel at two sizes

| quantity | at 60000 bopd | at 150000 bopd | factor |
| --- | --- | --- | --- |
| nameplate bopd | 60000 | 150000 | 2.500000 |
| capex | 1363.3524 | 2589.2031 | 1.899144 |
| annual operating cost | 55.7800 | 96.6591 | 1.732862 |

Both rows are the same FPSO type, so the only thing that changed between the columns is the number of barrels a day the unit is sized for. The money is million USD.

## Where 1.899144 comes from

The size factor is 2.500000. Raise it to the power 0.7 and the answer is 1.899144. Raise the same 2.500000 to the power 0.6 and the answer is 1.732862. Nothing else enters the calculation. An exponent of one would give a factor of 2.500000 on both rows, which is what a reader assumes when they price a bigger unit by multiplying, and it is 2589.2031 that the engine actually returns rather than the larger figure that proportional scaling produces.

## Operating cost bends further than capex

0.6 is a flatter exponent than 0.7, so the operating cost factor of 1.732862 is smaller than the capex factor of 1.899144. Crew, inspection and marine spread do not multiply with throughput the way steel does. Over the FPSO concept's 20.0000 year life that gap compounds: an operating cost of 55.7800 a year against one of 96.6591 a year is the difference the exponent decides.

## A type boundary is not a size step

The Deep tie-back holds a capex of 184.6717 at a nameplate of 25000, against the FPSO's 1363.3524 at 60000. Those two sit far further apart than any exponent on a size ratio would put them, because the type changed as well as the size. Each type carries its own base cost and the exponent works within a type, so comparing across types tells you what a tie-back is rather than what scale is worth.

## What the curve refuses

The curve reads a type and a nameplate and nothing else. It has no water depth, no mooring scope, no local content and no yard order book in it. A costed number is built the other way, item by item: the plan's own ledger carries the FPSO hull and topsides at 1180.0000 and mooring and installation at 170.0000, two lines a person wrote and can defend. The curve cannot be interrogated that way, because there is nothing inside it to interrogate.

## The mistake

The mistake is arithmetic done in the head: 2.500000 times the nameplate, so 2.500000 times the money. That reasoning overprices the debottlenecked case and, run backwards, underprices a small unit. The second mistake is treating the exponent as an estimate of this particular vessel. It is a screening curve that knows a type and a nameplate, and it has never seen a shipyard quote.

## Exercise

State the capex and annual operating cost at both nameplates, and the three factors that connect them. Then say what the capex at 150000 bopd would have read if capex scaled in proportion instead of to the power 0.7, and name the figure the engine returns instead.
