# Why a materials register

{{panel:materials-register-calculator}}

A field keeps thousands of parts on its shelves: motors, valves, seals, filters, casing, cement, oil in drums. Each one ties up money while it waits, and each one missing on the day it is needed can stop a well or a compressor. A materials register is the list that makes those two costs visible. It records, for every stock item, what it is, how much of it is used in a year, what one unit costs, how much is on hand, how long since it was last issued and how much goes out in a month. This course treats that list as the starting point for every stock decision.

## A policy you can write down

The course rests on one idea. A stock policy is a stated set of criteria, costs, demands, lead times, service targets and bands, and anything stated can be written down and computed. The engine behind this course, the vendored inventory engine, holds none of a register's figures and no default policy. You give it the register and the policy; it returns the figures the policy implies, with a reason beside each one.

At the Associate tier the question is criticality, classes and the order quantity. You will classify items by the consequence of running out, rank them by the money that flows through them, size an order with the economic order quantity and its stated rounding, and band stock that has stopped moving.

## Four functions, one calculator

| function | what it answers |
| --- | --- |
| `criticality` | the criticality class of each item from stated criteria and weights |
| `abcClassification` | the ABC class of each item by annual usage value |
| `eoq` | the economic order quantity and the quantity ordered |
| `slowMoving` | slow-moving and obsolete stock, write-down and excess |

Each function returns either a result or a refusal. A result carries a `basis` block, which names the rules applied and where they come from, and a reason for each item or figure, so the working can be printed and checked. A refusal names the input it would not accept.

## What a computed figure does not say

A criticality class is what the stated criteria, weights and minimums give. An ABC class is a stated cut-off applied to stated usage. An EOQ is the cheapest lot for the stated costs. None of these is a forecast of what will fail or be used, an audit of the register or a supplier's promise. That is why every figure in this course is quoted with the inputs it came from.

## Where this course stops

The Professional tier takes up safety stock, the cycle service level, the fill rate and discounts, and the Expert tier takes up spares and lead-time risk. Some questions belong to other courses of the academy. Tendering and bid evaluation are taught in the procurement course, terminal and depot stock in the supply course, and discounting in the cash flow course. This course takes a price, a demand and a cost as stated inputs and computes from there.

## Exercise

Open the register calculator. Set the View selector to "Criticality classes" and the Start from selector to "The Ekene register, its stated criticality policy". Find the basis block under the results and copy its source line. Then step the View selector through "ABC by annual usage value", "The economic order quantity" and "Slow-moving and obsolete stock", each on its Ekene start. For each view, write one sentence saying what the function answers, and copy the reason the engine prints for the first item or figure it returns.
