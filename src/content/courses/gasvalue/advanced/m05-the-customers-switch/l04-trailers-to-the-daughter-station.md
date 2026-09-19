# Trailers to the daughter station

IBAFO is a mother station. It also sends CNG by trailer to daughter stations, and the trailers make a cycle: load, run out, stand on station, run back. `assetFloat`, the function that counted KANO's cylinders, counts IBAFO's trailers on the same rule.

{{panel:gasvalue-rollout-explorer}}

## The rule

"Little's Law: assets in the system = throughput x time in the system." Assets in the system = throughput times time in the system. The cycle is the sum of its stage days, and the fleet is the ceiling of (the assets in circulation plus the spares allowance), the spares allowance being the assets in circulation times the spares fraction.

IBAFO's trailers to its daughter stations: 4 trips a day, spares 0.1. All invented.

| IBAFO trailers: stage (input) | days (input) | share of the cycle |
| --- | --- | --- |
| Loading | 0.2 | 0.1111 |
| Run out | 0.3 | 0.1667 |
| On station | 1 | 0.5556 |
| Run back | 0.3 | 0.1667 |

## What the engine returns

| IBAFO trailers: field | value |
| --- | --- |
| cycleDays | 1.8000 |
| inCirculation | 7.2000 |
| sparesAllowance | 0.7200 |
| fleetRequired | 8 |
| spareCapacityUnits (what the ceiling adds) | 0.0800 |
| dominantStage | On station |

Read down the result. cycleDays is 1.8000, over the four stages typed. inCirculation is 7.2000 trailers, and sparesAllowance, the 0.1 typed expressed in trailers, is 0.7200. fleetRequired is 8, a whole number. spareCapacityUnits, what the ceiling adds, is 0.0800. dominantStage is On station, with a share of 0.5556.

## What the ceiling adds

A fleet is counted in whole trailers, and fleetRequired prints 8. The field labelled what the ceiling adds, spareCapacityUnits, prints 0.0800 on IBAFO. On KANO's cylinders the same field printed 0.0000, with fleetRequired 98496.

## Where the trailers are

On station prints 0.5556 of the cycle. Run out and Run back print 0.1667 each, and Loading 0.1111. The engine names On station as dominant.

## Two floats on one rule

Set IBAFO's trailers beside KANO's cylinders. KANO's cycle is 28.5000 days, with 3200 cylinders a day and spares of 0.08; IBAFO's is 1.8000 days, with 4 trips a day and spares of 0.1. KANO's dominant stage is At the customer at 0.8421 of the cycle; IBAFO's is On station at 0.5556. The rule, the fields and the refusals are the same function's on both.

## A stage left out

The rule refuses a cycle with a stage missing:

| probe | engine |
| --- | --- |
| KANO's cycle with "At the customer" left blank | REFUSED: No duration for At the customer. A stage left out shrinks the fleet by the assets in it, so the fleet is not sized without it. |
| no stages | REFUSED: At least one cycle stage with a duration is required. |
| a negative spares allowance | REFUSED: The spares allowance cannot be negative. |

The probe was run on KANO's cycle, and the refusal names the stage it found blank. A cycle with no stages is refused, and so is a negative spares allowance.

## From station to customer

This module has followed the gas from IBAFO's banks to a bus on the forecourt and to the operator's payback. The trailers carry gas from the same mother station on to its daughter stations, and the float rule that counted KANO's cylinders sizes them.

In practice, a trailer operator reads the dominant stage as the first place to look for time to save on each round trip.

## In the explorer

Open IBAFO's trailer float. Read cycleDays, inCirculation, sparesAllowance, fleetRequired and spareCapacityUnits. Change the time On station and read the fleet and the dominant stage again.

## Exercise

Read IBAFO's trailers: cycleDays 1.8000, inCirculation 7.2000, sparesAllowance 0.7200, fleetRequired 8, spareCapacityUnits 0.0800 and dominantStage On station at 0.5556. Say what the engine's rule multiplies, what spareCapacityUnits reports, and quote KANO's figure for the same field beside IBAFO's.
