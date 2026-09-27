# The capstone brief

{{panel:materials-stock-calculator}}

The Professional capstone asks this tier's question: service levels, safety stock and discounts. It gives you a synthetic register of its own, with its own items, price schedule, demands, spreads, lead times, review period and service targets, none of which appears in these lessons, and asks for six values the engine returns. This lesson says what it asks and where each value sits in the stock calculator.

## What the capstone gives you

The capstone card carries one case file with five blocks, each named for the view it belongs to: `quantityDiscount`, three safety stock blocks (`safetyStock:cycle-service`, `safetyStock:fill-rate` and `safetyStock:periodic`) and `poissonStock`. The card states in words every input a value depends on: the price bands and the discount type, each demand and its spread, each lead time and its spread, the review period, the service measure and level, the order quantity where a fill rate needs one, the safety factor reading and floor, and the rounding rule.

## The six values

| value | module | where to find it |
| --- | --- | --- |
| the quantity ordered under the price schedule | quantity discounts | the tile "Quantity ordered" |
| its total cost a year | quantity discounts | the tile "Total cost a year" |
| the safety stock at a cycle service level | the cycle service level | the tile "Safety stock" |
| the safety factor at a fill rate | the fill rate | the tile "Safety factor k, as used" |
| the order-up-to level under periodic review | periodic review | the tile "Reorder point or order-up-to level" |
| the expected units short a cycle on a Poisson item | Poisson demand for slow movers | the tile "Expected units short a cycle" |

All six are reported to six decimals, as the panel prints them. Each is a return value of the engine on the card's inputs, so there is exactly one right answer, and each is the same number under every reading the engine states. None is a Monte Carlo draw. The grading tolerance is set in one place in the platform, and you never type one.

## How to load the case

Paste the whole case file into the box of the view the value belongs to. The view offers the blocks it can read in the selector "Block of the case file"; choose the block, and every control above the box shows that block's inputs. The same case pasted into the Materials & Spares Planner gives the same figures, and the stock calculator carries the whole practical for a learner without a Suite seat.

## Things to check before you copy a figure

Check each control against the card: the discount type, which moves the order more than any price; the service measure beside every service level; the order quantity on the fill-rate block; the review period on the periodic block, which turns a reorder point into an order-up-to level; the safety factor reading and the floor; and the rounding rule, since the held figure and the exact figure sit in different tiles. Read the reasons: each names the measure, the target and the k it gave. If a view refuses the case, a control has been changed or mistyped: read the field the refusal names and restore the card's figure.

Insurance spares and lead-time risk are the Expert tier's question, and this capstone asks neither.

## Exercise

Rehearse in the stock calculator on figures this tier prints.

1. In "Quantity discounts", start from "The casing on the Ekene register, all-units" and read 120.000000 and 349720.000000.
2. In "Safety stock for normal demand", start from "The choke bean set, cycle service level" and read the safety stock, 4.983044; then from "The choke bean set, fill rate" and read k, 1.026327.
3. Set the review period on the first choke bean case to 1 and read the order-up-to level, 17.301878.
4. In "Stock for Poisson demand", start from "The PSV kits on the Ekene register" and read the expected units short a cycle at level 5, 0.022488.
