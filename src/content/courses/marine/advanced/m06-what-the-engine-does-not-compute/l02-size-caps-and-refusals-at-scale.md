# Size caps and refusals at scale

{{panel:marine-base-calculator}}

{{panel:marine-variability-calculator}}

The engine holds almost no figures of its own. Apart from the twelve-digit tie rule, the only numbers it states are its caps: the largest call of each kind it accepts. A cap is no domain figure. It says nothing about how many berths a base should have or how many draws a Monte Carlo needs; it keeps one call inside the time and memory a calculator can give it.

## What the engine is made of

The engine imports two canonical files, lib/stats/stats.js and lib/conventions/percentile.js, and nothing else, and it makes no network call. It exports, in full, its five functions (deckPlan, fleetSize, fleetVariability, shoreBase, voyagePlan) and three constants: `ACCEPTED_KEYS`, the input keys each function reads; `ACTIVITIES`, the three kinds of voyage time a weather factor can slow; and `DEFAULTS`, the caps below and the twelve-digit tie rule.

## The caps

| cap | value | the engine's message over the cap, verbatim |
| --- | --- | --- |
| `MAX_INSTALLATIONS` | 50 | installations has 51 entries; the cap is 50 |
| `MAX_PRODUCTS` | 20 | products has 21 entries; the cap is 20 |
| `MAX_ITEM_LINES` | 500 | items has 501 entries; the cap is 500 |
| `MAX_UNITS` | 2000 | items hold 2001 units in all; the cap is 2000 |
| `MAX_QUANTITY` | 1000 | items[0].quantity must be a whole number from 1 to 1000; got 1001 |
| `MAX_DECK_VOYAGES` | 500 | voyages must be a whole number from 1 to 500; got 501 |
| `MAX_BERTHS` | 100 | berths must be a whole number from 1 to 100; got 101 |
| `MAX_WEATHER_FACTOR` | 10 | weather.factor must be a finite number from 1 to 10; got 10.5 |
| `MAX_ITERATIONS` | 200000 | iterations must be a whole number from 1 to 200000; got 200001 |
| `MAX_DRAWS` | 2000000 | iterations must be at most 181818 with 11 voyage sets (iterations x voyage sets is capped at 2000000); got 181819 |

## The two caps of this tier's calculators

At the shore base, the berths run from 1 to 100, and the target search stops at 100 too: a target no count up to 100 meets is reported with no berth count. A base that truly needed a hundred berths would be a port, and its planner would want more than one queue. The refusal, verbatim:

> berths must be a whole number from 1 to 100; got 101

In the variability calculator, two caps work together. The draws may not pass 200000, and the draws times the voyage sets may not pass 2000000, because every draw sizes every set. A milk run is one set, so the first cap binds; a dedicated route over many installations has one set per installation, and the second cap can bind first. The refusal names the most draws the stated sets allow.

## The order of refusals

A call can be wrong in more than one way. The engine checks its accepted keys before it reads any input, so a box with an unknown key and a missing input is refused on the key first. On the Ekene base with the model removed and a key queue added, a stated probe, the engine's message, verbatim:

> queue is not an accepted key; the accepted keys at the top level are berths, arrivalsPerDay, workingHoursPerDay, service, model, targetMeanWaitHours

Fix that, and the missing model is refused next. A planner who clears refusals one at a time, in the order the engine gives them, reaches a clean call quickest.

## Staying inside the caps

The calculators stay well inside every cap. A learner who reaches one has usually typed a count where a rate belongs, or pasted a case twice. Read the field the message names and fix that one.

## Exercise

Open the shore base calculator on the view "The berth queue" and start from "Ekene supply base, M/M/c". Set Berths (stated) to 101 and read the refusal. In the input box, add a key queue and set Queue model (stated) to "not stated", run, and read which refusal comes first; remove the key and read the next. Then open the variability calculator on the view "The fleet under weather and demand variability", start from "Ekene week, PSV milk run, weather and demand", set Draws (stated) to 200001, and read the refusal.
