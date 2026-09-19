# Cylinders in circulation

A carousel fills cylinders at the plant. A cylinder also travels out to a customer, stays there, and comes back. `assetFloat` counts how many cylinders KANO needs across that whole cycle. It uses Little's law, and it sizes the fleet from every stage of the cycle, each typed in days.

{{panel:gasvalue-rollout-explorer}}

## The rule

The engine's basis sentence: "Little's Law: assets in the system = throughput x time in the system." Assets in the system = throughput times time in the system. The fleet is the ceiling of that plus a spares allowance.

KANO's cylinders: 3200 a day, spares 0.08. The cycle has four stages, each typed in days:

| KANO cylinders: stage (input) | days (input) | share of the cycle |
| --- | --- | --- |
| At the customer | 24 | 0.8421 |
| In transit out | 1.5 | 0.0526 |
| At the plant | 1.5 | 0.0526 |
| In transit back | 1.5 | 0.0526 |

## What the engine returns

| KANO cylinders: field | value |
| --- | --- |
| cycleDays | 28.5000 |
| inCirculation | 91200.0000 |
| sparesAllowance | 7296.0000 |
| fleetRequired | 98496 |
| spareCapacityUnits (what the ceiling adds) | 0.0000 |
| dominantStage | At the customer |

cycleDays is 28.5000. inCirculation, the throughput times the time in the system, is 91200.0000 cylinders. sparesAllowance is 7296.0000. fleetRequired is 98496, printed as a whole number: it is a count. spareCapacityUnits, what the ceiling adds, is 0.0000 on KANO.

## Where the cylinders are

Read the share column. At the customer prints 0.8421. Each of the other three stages prints 0.0526. dominantStage names At the customer.

At the plant is one of the three stages at 0.0526. The carousel lessons sized the positions at the plant. This lesson counts the cylinders over the whole cycle of 28.5000 days, and the engine names the stage that dominates it: At the customer, at 24 days of the 28.5000.

## A stage left out

Every stage needs a duration, and the engine checks each one by name. Here is KANO's cycle with At the customer left blank:

| probe | engine |
| --- | --- |
| KANO's cycle with "At the customer" left blank | REFUSED: No duration for At the customer. A stage left out shrinks the fleet by the assets in it, so the fleet is not sized without it. |
| no stages | REFUSED: At least one cycle stage with a duration is required. |
| a negative spares allowance | REFUSED: The spares allowance cannot be negative. |

The first refusal gives its reason in the engine's words: a stage left out shrinks the fleet by the assets in it, so the fleet is not sized without it. The engine refuses the whole fleet when one stage has no duration.

## The spares

The spares allowance is an input, 0.08 on KANO, and the engine prints it as cylinders, 7296.0000. A negative allowance is refused. On KANO the rule prints fleetRequired 98496, and what the ceiling adds, spareCapacityUnits, prints 0.0000.

## The same rule elsewhere

The same function sizes IBAFO's CNG trailers in the customer's switch module. The rule and the fields are the same there: stages with durations, a cycle, a count in circulation, spares and a fleet printed as a whole number.

In practice, the cycle durations a study types come from the distributor's own tracking of its cylinders, stage by stage, over a season of deliveries and returns.

## In the explorer

Open KANO's cylinder float and read cycleDays, inCirculation, sparesAllowance and fleetRequired. Clear At the customer and read the refusal. Restore 24 and set the spares to 0 to read the fleet on the circulation alone.

## Exercise

Read KANO's float: the four stages with their days and shares, cycleDays 28.5000, inCirculation 91200.0000, sparesAllowance 7296.0000, fleetRequired 98496 and dominantStage At the customer. Say what Little's law multiplies, which stage the engine names as dominant and the share it prints for it, and what the engine answers when that stage is left blank, in its own words.
