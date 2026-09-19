# Pricing a debottleneck

A stream value prices one more barrel of a stream. A planner also asks the same question of a unit: what is one more barrel of capacity worth? That is the price of a debottleneck, and the digest answers it for the Naphtha reformer by solving ABUA again at six capacities.

{{panel:refinery-plan-explorer}}

## The sweep

The reformer's capacity is stepped and everything else stays as typed. The digest prints the margin at each step, the change in margin and the change in capacity, and divides one by the other:

| reformer capacity (bbl) | reformer utilisation (percent) | margin | change in margin | change in capacity (bbl) | margin gained per extra barrel of capacity |
| --- | --- | --- | --- | --- | --- |
| 380000.00 | 100.00 | 6863271.83 | - | - | - |
| 400000.00 | 100.00 | 7018390.09 | 155118.26 | 20000.00 | 7.7559 |
| 420000.00 | 97.07 | 7077935.48 | 59545.40 | 20000.00 | 2.9773 |
| 440000.00 | 92.65 | 7077935.48 | 0.00 | 20000.00 | 0.0000 |
| 460000.00 | 88.63 | 7077935.48 | 0.00 | 20000.00 | 0.0000 |
| 480000.00 | 84.93 | 7077935.48 | 0.00 | 20000.00 | 0.0000 |

ABUA as typed has a reformer of 420000.00 bbl, the third row.

## Reading the steps

**From 380000.00 to 400000.00.** The reformer is full at both capacities, 100.00 percent. Every extra barrel of room is used, and the month gains 7.7559 dollars for each. Here the reformer is a bottleneck in the plain sense.

**From 400000.00 to 420000.00.** At 420000.00 the reformer reads 97.07 percent. The extra room was only partly used, and the gain per extra barrel of capacity is 2.9773. The step is averaged over 20000.00 bbl of capacity, some of which the plan does not fill.

**From 420000.00 upward.** The margin reads 7077935.48 at every capacity, the change in margin is 0.00, and the gain per extra barrel of capacity is 0.0000. The reformer's utilisation reads 92.65, 88.63 and 84.93 percent. It has room it does not use. The naphtha to fill it is not there: Module 3 found every barrel of naphtha already consumed by the reformer, and the naphtha comes from crude whose run the hydrotreater holds.

## Room is worth nothing until it is used

The lesson of the sweep is that capacity has value only while the plan would fill it. As typed, ABUA's reformer is not full, and another 20000.00 bbl of reformer capacity earns the month 0.0000 a barrel. The plan's list of units at capacity names only the Diesel hydrotreater, and the sweep agrees: expanding the reformer is spending on the wrong unit.

This is why a debottleneck is priced from the plan and never from the unit on its own. A reformer that ran at 100.00 percent in one month's plan can have room in another's, because a limit elsewhere has moved. The sweep reads the whole refinery each time.

## A step is an average

The gain per extra barrel is a change over a step of 20000.00 bbl. When the reformer fills partway through a step, as between 400000.00 and 420000.00, the figure averages a stretch where extra room earns and a stretch where it does not. Finer steps give a sharper figure. The digest's steps are the ones it prints, and the lesson quotes those.

## From a figure to a decision

The gain per barrel of capacity is a monthly figure from one month's plan. Whether a debottleneck is worth building needs its capital, its life and many months, and that is the kind of question the Expert tier values through the screening engine. What the plan offers is the first test: a unit whose extra barrel earns 0.0000 this month is not the unit to expand first.

## Exercise

Read the gain per extra barrel of capacity at each step: 7.7559, 2.9773, 0.0000, 0.0000 and 0.0000, beside the reformer's utilisation, 100.00, 97.07, 92.65, 88.63 and 84.93 percent. Say what the pair of columns shows about when reformer capacity is worth money, and which unit the plan's list of units at capacity points to instead.
