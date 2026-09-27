# Earning events

{{panel:farmout-deal-calculator}}

A farm-out need not turn on one well. A drill-to-earn deal states a list of earning events, each a piece of work with its own gross cost, share paid, participating interest earned and cap. The farminee earns interest event by event, and the vesting rule, the subject of the next two lessons, says when that interest becomes its own. This lesson reads the events of the Ekene Deep drill-to-earn, which is synthetic like every Ekene term.

## Two events on the Ekene Deep prospect

The fixture states two events. EKO holds 70.000000 percent and PA 30.000000; FIN is the farminee. Each event's interest earned sits on top of what earlier events earned, so the interest held after an event grows from event to event.

| event | gross cost | share paid | earned | held after | promote points | promote ratio | cap state | farminee pays | farmor pays | carry |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ekene Deep-1 exploration well | 40000000.000000 | 40.000000 | 20.000000 | 20.000000 | 20.000000 | 2.000000 | none | 16000000.000000 | 12000000.000000 | 8000000.000000 |
| Ekene Deep-2 appraisal well | 30000000.000000 | 45.000000 | 15.000000 | 35.000000 | 10.000000 | 1.285714 | exactly | 13500000.000000 | 7500000.000000 | 3000000.000000 |

## Each event is priced on its own

The exploration well has no cap. FIN pays 40.000000 percent for 20.000000 percent held after it: a promote of 20.000000 points, a ratio of 2.000000. The appraisal well is cheaper per point. FIN pays 45.000000 percent, but it holds 35.000000 after the event, so the promote is 10.000000 points and the ratio 1.285714. A promote is always measured against the interest held after the event, and the appraisal well's carry of 3000000.000000 reaches its carry-amount cap exactly, the boundary from the last module.

## The farmor can give only what it holds

Each event's interest earned comes out of the farmor's interest alone, so the engine checks the running total against it. A second event asking for more than is left is refused, and the message counts what is already earned:

> events[1].earnedPct must be at most 30, the farmor's interest 70 less 40 already earned; got 35

## What the texts call the two orders

HM Revenue and Customs, Oil Taxation Manual, page OT30021 (2 February 2021, Open Government Licence v3.0, read on 2026-09-27), separates two orders of work and assignment. Of a farm in it says:

> "The assignment is normally made, subject to government consent, before the work is undertaken and is called a Farm in." (HMRC Oil Taxation Manual OT30021)

The engine's two vesting rules are those two orders, and the next two lessons take each.

## Exercise

Work in the course's own deal calculator.

1. Open the view "Caps, overrun rules and drill-to-earn" and start from "Ekene drill-to-earn, both events". Check each event's held after, promote and carry against the table.
2. With the control "event 2: share the farminee pays, percent (stated)", set the share to 30 and read the refusal: which interest does it measure the share against?
3. Set the share back to 45. With "event 2: participating interest earned, percent (stated)", set the interest to 5. Read the appraisal well's promote, its carry and its cap state, and explain why the carry did not rise with the promote.
