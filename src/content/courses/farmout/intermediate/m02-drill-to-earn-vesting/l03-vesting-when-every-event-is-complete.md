# Vesting when every event is complete

{{panel:farmout-deal-calculator}}

The second vesting rule, "all-events", vests nothing until every event is completed. It is the order HMRC's manual calls an earn-in: the work done before the assignment. The Ekene Deep drill-to-earn states this rule, and this lesson runs it at each count of completed events.

## The rule in the engine's words

> nothing vests until every event is completed (an earn in: the work before the assignment, HMRC OT30021)

HMRC's manual draws the same line in its own words:

> "In contrast, an agreement under which the work obligation is to be completed before the assignment is generally referred to as an earn-in." (HMRC Oil Taxation Manual OT30021)

The engine takes the idea and names the rule; the deal chooses it.

## The Ekene Deep drill-to-earn under "all-events"

| events completed | vested | farminee paid | farmor paid | carry | consideration | equivalent working interest | interests after |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | 0.000000 | none | EKO 70.000000; PA 30.000000; FIN 0.000000 |
| 1 | 0.000000 | 16000000.000000 | 12000000.000000 | 8000000.000000 | 8000000.000000 | 40.000000 | EKO 70.000000; PA 30.000000; FIN 0.000000 |
| 2 | 35.000000 | 29500000.000000 | 19500000.000000 | 11000000.000000 | 11000000.000000 | 42.142857 | EKO 35.000000; PA 30.000000; FIN 35.000000 |

With one event completed the reason reads:

> vesting "all-events": 1 of 2 events completed; nothing vests

## Paid and not yet vested

The middle row is the one to read slowly. FIN has paid 16000000.000000 for the exploration well and holds 0.000000 percent of the licence. Under "per-event" the same payment vests 20.000000 percent. Nothing about the money differs between the two rules; only the moment the interest passes. PA's position differs under neither: it pays its own 30.000000 percent of each well, and the vesting rule is a term between the farmor and the farminee alone.

With both events completed, FIN has paid 29500000.000000 on 70000000.000000 of gross cost and holds 35.000000 percent. Its equivalent working interest is 42.142857 percent: the heads-up interest that would cost it the same. The consideration to EKO is the two carries:

> consideration to EKO: carry 11000000 + cash bonus 0 + past-cost reimbursement 0 (0% of 0) = 11000000

## Who carries what under each rule

Under "all-events" the farmor keeps its whole participating interest until the programme is done, so a farminee that stops early earns nothing for the work it paid. The farminee carries that risk. Under "per-event" the farmor carries the risk of a partner that leaves after the first well. The engine reports both states and decides neither.

## A rule the engine does not accept

The engine accepts two vesting rules and refuses any other word by name:

> vesting must be one of "per-event", "all-events"; got "on-signing"

## Exercise

Work in the course's own deal calculator.

1. Open the view "Caps, overrun rules and drill-to-earn" and start from "Ekene drill-to-earn, no event completed". Read the vested interest and the reasons.
2. With the control "Events completed (stated)", step the count through 1 and 2. At each step read the vested interest, the farminee paid and the participating interests after.
3. At a count of 1, switch "Vesting (stated)" between the two rules and write down which figures move and which stay.
4. In the box, change the vesting word to `"on-signing"` and read the refusal.
