# Continuous review and the reorder point

{{panel:materials-stock-calculator}}

The EOQ answered how much to order. It said nothing about when, because at Associate demand was level and known. Real demand wanders, and a replacement order takes time to arrive. This module asks when to order.

## Continuous review

Under continuous review the stock is watched all the time. When it falls to a stated level, the reorder point s, an order of Q is placed. Until that order arrives, the shelf meets demand from what is left, so the reorder point must cover the demand that arrives before the new stock does.

The time that stock must cover is the protection period P: the lead time plus the review period, both stated inputs. A review period of 0 means continuous review, and P is the lead time alone.

## The reorder point has two parts

The demand over the protection period has a mean, the demand a period times P. If the reorder point were only that mean, the shelf would run out in roughly half of all cycles, whenever demand ran above its average. So the reorder point adds a margin:

* the mean demand over the protection period, and
* the safety stock, which in this course is always k times sigma, the safety factor times the standard deviation of demand over the protection period.

The next two lessons build sigma; the next module chooses k.

## The choke bean set

On the Ekene register (synthetic) the tungsten carbide choke bean set CHK-BEAN is used at 3.3333 sets a month, with a lead time of 2.5 months. The periods are months. The mean demand over the protection period is 8.333250 sets. At the stated cycle service level of 0.95, the engine returns a reorder point of 13.316294, held as 14.000000 under the stated rule of rounding up to a whole set. The margin above the mean is the safety stock, 4.983044 sets.

## A protection period of zero

With no lead time and no review period there is nothing to protect, and the engine refuses the policy by name:

> leadTime and reviewPeriod add to 0; the protection period must be above 0

## Exercise

Open the stock calculator, choose the view "Safety stock for normal demand" and start from "The choke bean set, cycle service level". Read the Policy tile, which names continuous review, and confirm that the protection period tile equals the stated lead time. Read the demand over the protection period, 8.333250, and check it by multiplying the demand a period by the lead time.

Confirm the reorder point 13.316294 and the held figure 14.000000. Then set the control "Lead time, periods (stated, 0 for continuous review)" to 0, with the review period still 0, and read the refusal.
