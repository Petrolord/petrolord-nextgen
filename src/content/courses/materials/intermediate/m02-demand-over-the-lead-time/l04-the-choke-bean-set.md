# The choke bean set

{{panel:materials-stock-calculator}}

This lesson works one stock item from its stated inputs to its reorder point, the way the capstone asks for a figure: every input named, every figure read off the engine, the reason read beside it. The item is the tungsten carbide choke bean set, CHK-BEAN, on the Ekene register. Like every item there, its figures are synthetic, written for this platform by a stated script.

## The stated inputs

| input | stated value |
| --- | --- |
| demand a period, mean | 3.3333 |
| demand a period, standard deviation | 1.6 |
| lead time | 2.5 |
| lead time, standard deviation | 0.5 |
| review period | 0 |
| service measure | cycle service |
| cycle service level | 0.95 |
| order quantity | 12 |
| safety factor reading | none |
| safety factor floor | 0 |
| rounding | up to a multiple of 1 |

The periods are months. The order quantity of 12 is carried in the case, and a cycle service target does not use it; a fill rate would. The engine holds none of these figures. Remove any one and the call is refused by name.

## What the engine returns

| figure | engine |
| --- | --- |
| protection period | 2.5 months |
| demand over the protection period | 8.333250 |
| sigma | 3.029476 |
| safety factor k | 1.644854 |
| safety stock | 4.983044 |
| reorder point | 13.316294 |
| held as | 14.000000 |
| achieved cycle service at the held level | 0.969295 |

The engine's reason, verbatim:

> a cycle service level of 0.95 gives k = Phi^-1(0.95) = 1.644854; safety stock 4.983044 over a demand of 8.33325 with sigma 3.029476 gives the reorder point s 13.316294, held as 14 (up to a multiple of 1)

The reason prints each computed figure to six decimals with the trailing zeros dropped, so the demand reads 8.33325 there. The field is 8.333250, and the lesson reasons with the field.

## Reading it as a policy

When the stock of choke bean sets falls to 14, a new order is placed. Until it lands the shelf expects to lose 8.333250 sets on average, and the safety stock of 4.983044 sets covers the cycles in which demand or the lead time runs high.

Rounding up does more than tidy the figure. The held level sits above the exact reorder point, so the service it achieves, 0.969295, is above the stated target of 0.95. The engine reports the achieved figure beside the target so the difference is visible.

## What the figure does not say

A reorder point is what the stated demand, spreads, lead time and service target need. It is no forecast of what the field will use, no audit of the stock on the shelf and no supplier's promise. It changes whenever a stated input changes, which is why the course quotes it with its inputs. The safety stock and the reorder point are named apart throughout this course: the safety stock is the margin k times sigma, and the reorder point is the whole level at which an order goes out.

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "The choke bean set, cycle service level". Check every control against the stated inputs above, then read every tile against the second table.

Now set the control "Rounding rule (stated)" to none. Confirm that the held figure becomes the exact reorder point 13.316294 and that the achieved cycle service drops back to the target. Restore the rule to up to a multiple, with a multiple of 1. Finally, set the service measure control to not stated and read the refusal, which names the two measures the engine accepts.
