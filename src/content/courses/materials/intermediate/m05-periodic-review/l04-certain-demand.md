# Certain demand

{{panel:materials-stock-calculator}}

Every safety stock so far has protected against a spread in demand, in the lead time, or both. Take both away and demand over the protection period is certain.

## Sigma of zero

A stated case: a demand of 10 a period with no spread, and a lead time of 3 periods with no spread, under continuous review at a cycle service level of 0.95. Demand over the lead time is certain, 30 units every cycle. The engine's reason, verbatim:

> a cycle service level of 0.95 gives k = Phi^-1(0.95) = 1.644854; safety stock 0 over a demand of 30 with sigma 0 gives the reorder point s 30, held as 30 (no rounding)

Sigma is 0.000000, so the safety stock, k times sigma, is 0.000000 whatever k is, and the reorder point is the demand over the lead time, 30.000000. Order when 30 units are left, and the last one leaves the shelf as the new order lands. This is the EOQ world of the Associate tier, where demand was level and known.

The engine still prints k, because the stated level still gives one. Raise the level to 0.99 and k rises; the safety stock stays at zero, because there is no spread for k to multiply.

## A fill rate is refused

A fill rate on the same certain demand is refused by name:

> demandSd and leadTimeSd are both 0, so demand over the protection period is certain and a fill rate sets no safety factor

With sigma at zero, the expected units short are zero for every k at or above zero, so every such k meets any target and the search has no answer to give.

Note the order of refusals on this case. A fill rate also needs an order quantity, and the engine checks for it first. With the order quantity left out, the refusal names it:

> orderQuantity is required for a fill rate (units short are measured against the quantity each cycle brings)

Only once an order quantity is stated does the certain-demand refusal appear.

## Where certain demand is honest

Few spares have certain demand, though a scheduled consumable with a contracted lead time may come close. For such an item the spreads may be stated as zero on purpose, with a service measure that suits them.

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "Certain demand". Confirm sigma, the safety stock and the reorder point 30.000000. Set the control "Service level (stated)" to 0.99 and confirm that the reorder point does not move while k does.

Then set the control "Service measure (stated)" to fill rate and read the refusal. Set "Order quantity (stated; needed for a fill rate)" to 10 and read the second refusal. Finally set the demand standard deviation to 1 and read what the fill rate now returns.
