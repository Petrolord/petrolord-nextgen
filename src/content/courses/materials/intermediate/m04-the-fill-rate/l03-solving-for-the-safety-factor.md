# Solving for the safety factor

{{panel:materials-stock-calculator}}

Under a cycle service level, k comes straight from the inverse normal. Under a fill rate there is no such inverse: the engine knows the target on G and has to find the k that meets it. This lesson shows how it searches, what it returns, and the one case in which it refuses to search at all.

## Bisection to the last binary digit

G falls steadily as k rises, so the engine can bracket the answer and halve the bracket again and again. Its numerics, verbatim:

> Phi^-1 by Wichura AS241; Phi through the regularised incomplete gamma (engines/hse/safetyStats.js); the fill-rate k by bisection to the last binary digit

The search stops only when the bracket cannot be halved any further in the computer's arithmetic. The engine returns the smallest k whose loss is at or below the target, so the safety stock is no larger than the target needs.

## The same item, two targets

On the choke bean set, with the same sigma of 3.029476:

| service measure | stated level | safety factor k | reorder point |
| --- | --- | --- | --- |
| cycle service level | 0.95 | 1.644854 | 13.316294 |
| fill rate | 0.98 | 1.026327 | 11.442483 |

The fill rate is the higher number, and it asks for less stock. The two measures are different targets: a fill rate counts the units short against the order quantity each cycle brings, and a cycle service level counts the cycles with any shortage at all. Comparing the two stated levels as if they were on one scale is the mistake the vocabulary rule of this course exists to prevent.

## The published fill-rate column

Lecture 11 slide 24 of Caplice, MIT ESD.260J (Fall 2006, MIT OpenCourseWare, CC BY-NC-SA 4.0) also prints safety stocks for the item fill rate, on the same weekly data as the last module, with an order quantity of 228. The engine, solving for k by bisection with no table reading:

| item fill rate | safety factor (engine) | safety stock (engine) | printed |
| --- | --- | --- | --- |
| 0.99 | 1.985166 | 512.349286 | 513 |
| 0.90 | 0.969058 | 250.102945 | 252 |
| 0.80 | 0.571295 | 147.444755 | 148 |

Each of these rows agrees with the slide to within 2 units. The 0.95 row is left out here on purpose: it is the subject of the next lesson.

## Certain demand sets no factor

A fill rate protects against uncertainty. With no demand spread and no lead-time spread, demand over the protection period is certain, a reorder point at that demand is never short, and there is nothing for k to solve. The engine refuses the call by name:

> demandSd and leadTimeSd are both 0, so demand over the protection period is certain and a fill rate sets no safety factor

A cycle service target on the same certain demand is accepted, and a later lesson shows what it returns.

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "The choke bean set, fill rate". Confirm k 1.026327. Set the control "Service measure (stated)" to cycle service, leaving the level at 0.98, and read how far k rises when the same number is read as a cycle service level. Restore the fill rate.

Then set both "Demand a period, standard deviation (stated)" and "Lead time, standard deviation (stated)" to 0 and read the refusal. Restore them.

Finally start from "Lecture 11 slide 24, fill rate 0.95", set the level to 0.99, 0.90 and 0.80 in turn, and confirm the three rows of the table against the printed figures.
