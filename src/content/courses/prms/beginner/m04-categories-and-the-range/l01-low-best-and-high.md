# Low, best and high estimates

{{panel:prms-classification-calculator}}

The class says how likely a project is to go ahead. It says nothing about how much the project will recover, and that quantity is never known exactly. The framework asks for three estimates that span the range of what is reasonably possible: a low, a best and a high (PRMS 2.2.2.2). This module reads them and the labels each class gives them.

## Three estimates, three labels in each class

| class | low | best | high |
| --- | --- | --- | --- |
| Reserves | 1P | 2P | 3P |
| Contingent Resources | 1C | 2C | 3C |
| Prospective Resources | 1U | 2U | 3U |

The number counts up with the estimate: 1 for the low, 2 for the best, 3 for the high. The letter names the class: P for Reserves, C for Contingent, U for the undiscovered quantities of Prospective Resources.

## The Ekene Main Reserves

The course's case "Ekene Main Reserves, stated cumulatively" states three estimates in MMbbl. The engine's `categorize` function returns them with their labels:

| label | case | probability label | value (engine) |
| --- | --- | --- | --- |
| 1P | low | P90 | 8.890000 |
| 2P | best | P50 | 16.650000 |
| 3P | high | P10 | 24.990000 |

The low estimate carries the label P90 and the high carries P10. Why the smallest figure carries the largest number is the subject of the next module; for now, read P90 as the low estimate every time.

## The order is a rule

The low may not exceed the best, and the best may not exceed the high. An estimate set that breaks the order is refused, and the message restates the convention:

> estimates must be ordered low <= best <= high (the P90 low estimate, the P50 best, the P10 high: P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS.); got {"low":10,"best":8,"high":12}

Equal estimates are allowed, since each sign in the rule reads "at or below". A later lesson shows what the engine says when all three are equal.

## Every estimate is stated

The engine does not estimate anything. It takes the three figures you state, with the class, the method and the unit, and puts each in its place. The figures themselves come from work the academy teaches elsewhere: a decline curve from the decline curve analysis course, a map and rock properties from the reservoir volumetrics course. Where the range comes from a distribution, the uncertainty course teaches how to build one.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The categories of a set of estimates", and start from "Ekene Main Reserves, stated cumulatively". Read the cumulative table and match each row to the table above. Change the "low estimate (stated)" control to a figure above the best estimate and read the refusal. Then set all three estimates to one figure of your choice and read what comes back. Restore the Ekene figures before you move on.
