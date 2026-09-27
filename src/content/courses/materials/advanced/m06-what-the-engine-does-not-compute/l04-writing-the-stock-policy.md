# Writing the stock policy

{{panel:materials-spares-calculator}}

The engine computes the figures a stock policy states. It does not write the policy. This lesson sets out what a written policy names, item by item and rule by rule, so that every figure in it can be computed again by anyone with the engine and the document.

## What a policy names

A complete stock policy, as this course teaches it, names:

- the register, with each item's usage, cost, scores and stock (synthetic in this course);
- the criticality criteria, weights, scale, class minimums and override;
- the ABC cut-offs and boundary rule;
- for each ordered item, the demand, order cost, holding cost and rounding rule, and any price schedule with its discount type;
- for each stocked item, the demand and its spread, the lead time and its spread, the review period, the service measure and level, the order quantity, and the safety-factor rounding and floor;
- for each insurance spare, the failure rate, lead time, days a year, unit cost, holding rate, downtime cost and search limit;
- the slow-moving bands, write-downs and cover limit;
- each sampled figure with its seed and draws;
- each source applied, with its edition, licence and the date it was read;
- each reading the figures rest on.

## Two entries, written out

An insurance entry for the ESP motor: 2 failures a year, a lead time of 150 days, 365 days a year, a unit cost of 185000, a holding rate of 0.2, a downtime cost of 18000 a day, searched from 0 to 6 spares under the one-for-one model. The cheapest stock is 4 spares at 160003.732064 a year, with a probability of no shortage of 0.998413.

A lead-time risk entry for the mechanical seal: demand a day a triangle of 0.01, 0.016 and 0.03; lead time a triangle of 70, 90 and 160 days, one rate a lead time; a reorder point of 3. On seed 20270301 and 20000 draws, the stockout probability is estimated at 0.058600 and the reorder point for a cycle service level of 0.95 at 3.062282, both sampled.

Either entry can be handed to another planner, typed into the spares calculator or the Materials & Spares Planner, and checked figure by figure.

## What the policy decides

The figures are the engine's. The decisions are the planner's: whether four motors are worth their holding, whether the seal's reorder point rises to meet the target, which items carry insurance spares at all. A policy states each decision next to the figure that informed it, and the date it was reviewed.

## Where the tiers meet

A policy uses all three calculators: the register calculator classifies and sizes orders, the stock calculator sets safety stock and discounts, and the spares calculator sizes insurance spares and reads lead-time risk.

## Exercise

Open the spares calculator on the view "Insurance spares" and start from "The ESP motor on the Ekene register". Write the insurance entry above in your own words, then run it and check every figure it quotes. Switch to the view "Lead-time risk by Monte Carlo (ungraded)", start from "The mechanical seal on the Ekene register", and do the same for the second entry, adding the seed and draws beside each sampled figure. Finish each entry with one decision and the reading it rests on.
