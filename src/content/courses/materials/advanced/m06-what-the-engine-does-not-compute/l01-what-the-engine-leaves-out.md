# What the engine leaves out

{{panel:materials-spares-calculator}}

A calculation is only as good as the questions it is honest about. The inventory engine computes nine things: criticality, ABC classes, the EOQ, quantity discounts, safety stock, Poisson stock, insurance spares, lead-time risk and slow-moving stock. This lesson lists what it leaves to other courses, or to the planner, and what it takes in their place.

## Stated inputs in place of answers

| not computed here | what the engine takes instead | the course that owns it |
| --- | --- | --- |
| tendering, bid evaluation and contract types | a stated price schedule and discount type | the procurement course |
| terminal and depot stock, product supply and tankage | nothing: the engine holds materials and spares | the supply course |
| failure rates from field data and reliability modelling | a stated failure rate a year | the rotating course, and the reliability parts of the academy |
| distributions, correlation and Monte Carlo as a subject | the canonical seeded sampler, applied to lead-time risk | the uncertainty course |
| discounting and NPV | nothing: no figure here is discounted | the cash flow course |
| a demand forecast | a stated demand and its standard deviation | none: the demand is a stated input |
| a repair loop, multi-echelon stock or partial production loss | the one-for-one model with one unit down a waiting failure | none: a different model, named and left out |

Each row is a seam. Where a lesson touches one, it names the course in a sentence and moves on.

## What that means for the spares figures

The ESP motor's 2 failures a year are a stated number. Estimating them from run lives is a reliability question, and the engine does not attempt it. The motor's 185000 is a stated price; how that price was tendered is the procurement course's question. Its cheapest stock of 4 spares is costed in money of one year, and nothing is discounted over the years the spares sit on the shelf.

## Nothing it does not know

The engine reads no key it does not know. Every function publishes the keys it accepts, and a misspelt or extra key is refused with the path to it and the full list, verbatim for the insurance call:

> holdingCost is not an accepted key; the accepted keys at the top level are failuresPerYear, leadTimeDays, daysPerYear, unitCost, holdingRate, downtimeCostPerDay, maxSpares

A key that is dropped silently would leave a planner believing an input was read. The refusal makes that impossible, and it comes before any other check.

## It writes no policy

The engine computes the figures a policy states. It does not decide which items to stock, at which cycle service level or fill rate, under which criticality scheme, with which cut-offs and bands. Those are the planner's, written down and reviewed; the last lessons of this module set out how.

## A computed figure, read honestly

A criticality class is what the stated criteria, weights and minimums give. An EOQ is the cheapest lot for the stated costs. A number of spares is the cheapest for the stated failure rate and costs. None is a forecast of what will fail or be used, an audit of the register or a supplier's promise, and each is quoted with its inputs for that reason.

## Exercise

Open the spares calculator on the view "Insurance spares" and start from "The ESP motor on the Ekene register". In the box, add the key "holdingCost" with any number beside the stated inputs, predict the refusal, and compare it with the quotation above. Remove the key. Then, for each of the seven inputs, write one line saying whether it is a policy choice, a price, or a figure another course of the academy produces, and name that course.
