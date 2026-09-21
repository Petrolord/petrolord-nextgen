# Plan, schedule and actual

The Professional tier ended with a month's plan and the schedule it cascades into. This tier asks the question a refinery manager asks at the end of that month: what happened, and what did each gap do to the margin? To answer it the engine needs the plan and the month's record in a form it can lay side by side. The stream model gives it one form for both.

{{panel:refinery-variance-explorer}}

## Three ledgers, one shape

The stream model names three ledgers:

| ledger | what an event in it records |
| --- | --- |
| plan | a movement the plan intends |
| schedule | a planned movement placed on a date |
| actual | a movement that was recorded as it happened |

A plan event, a scheduled event and a recorded actual are the same shape, marked by their ledger. Each carries a material, an event type, a quantity in barrels and a value. The ledger mark is the only thing that tells them apart. Because the shape is shared, the engine can read a schedule event and an actual event with the same code, and the question "what differs between them" has a precise answer: the quantity, the value, or both.

## Nine event types

Every event has one of nine types:

receipt, delivery, transfer, unit_run, blend, burn, flare, vent, loss.

A receipt brings a material in, such as a crude cargo arriving. A delivery sends a product out to a buyer. A unit_run records a unit processing a quantity of its feed. Burn, flare and vent are the ways hydrocarbon leaves the site as combustion or release, and loss covers what goes missing. The next lesson reads how each type sets the direction of its quantity.

## The ODIOMA case

This tier works one invented record end to end. ODIOMA, Odioma Petroleum Refining Ltd, has two crudes, a crude unit and a reformer, and four products. Its plan is cascaded from the period start 2027-03-01 over 31 days with a cargo size of 350000.00 bbl, and that cascaded plan is the plan ledger the actuals are read against. The crude names on this record, Escravos (illustrative) and Forcados (illustrative), are labels on invented yields and prices. Every price and cost in this tier is illustrative and in US dollars.

The month then happened, and the actual ledger records what it did: one aggregated movement for each material and type. Module 2 matches the two ledgers and splits each gap. Module 3 turns those gaps into effects on margin.

## Why one shape matters

A variance is only as good as the match beneath it. If the plan were written in one structure and the actuals in another, each comparison would need its own translation, and each translation is a place for a sign or a unit to slip. With one shape the match is a join on material and type, and the arithmetic is the same on every line.

The shape also carries the course's organising sentence. The plan finds a margin per barrel of crude, the schedule dates it, and the actuals are read against it line by line. The three ledgers are those three steps written down in one form.

## Exercise

Name the three ledgers and say which one the ODIOMA actuals are read against. Then read the ODIOMA plan's period start, its length in days and its cargo size, and say what fixing the period start to 2027-03-01 means for anyone who reruns the schedule and compares their dates with yours.
