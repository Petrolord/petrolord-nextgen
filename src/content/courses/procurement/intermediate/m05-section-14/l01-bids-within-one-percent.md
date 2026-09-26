# Bids within one percent

{{panel:pr-award-calculator}}

Section 14 of the Nigerian Oil and Gas Industry Content Development Act 2010 (Act No. 2, commenced 22 April 2010, as enacted; read on 2026-09-26) acts at the commercial stage of a tender. Where bids come within 1% of each other, it prefers the one with the highest Nigerian content, provided its content is at least 5% higher than its closest competitor's. This module takes the section one phrase at a time, starting with which bids are "within 1 % of each other".

## The engine's reading

The Act's phrase leaves a question open: 1% of what, and each other in what sense? The engine states its reading in every s.14 result, verbatim:

> "within 1 % of each other at commercial stage" is read as within 1% of the lowest evaluated cost

So the group is every bid whose evaluated cost is no more than 1% above the lowest evaluated cost. The engine's basis writes it as 100 x (C - Cmin) <= 1 x Cmin. The limit is inclusive: a bid exactly 1% above the lowest is in.

This is one of the engine's declared readings. Another reading is possible, for example a chain of bids each within 1% of the next, which could stretch the group further above the lowest. The engine anchors the group on the lowest evaluated cost and prints that reading in every reason, so a reader who holds another reading can see exactly what was done.

## The materials tender

The four responsive materials bids, with their evaluated costs under the average omission rule, the delivery schedule and the five-year life cycle at 0.1:

| bid | evaluated cost | above the lowest (percent) | in the s.14 group |
| --- | --- | --- | --- |
| MS4 | 546244.982386 | 0.000000 | true |
| MS2 | 547863.577232 | 0.296313 | true |
| MS1 | 565746.220616 | 3.570054 | false |
| MS3 | 581453.933847 | 6.445634 | false |

MS2 is 0.296313 percent above MS4, so the group is MS4 and MS2. The group is the same under either reading of "at least 5% higher", which the third lesson of this module takes: the reading changes the lead test, never the group.

## At the edge of the margin

Two stated cases, each run under the points reading. The lowest is LO at 2000000.

| case | bids: evaluated cost at content | group | selected |
| --- | --- | --- | --- |
| exactly the margin above the lowest | LO 2000000 at 50%; E1 2020000 at 56% | LO, E1 | E1 |
| one unit more than the margin | LO 2000000 at 50%; E2 2020001 at 90% | LO | LO |

E1 is exactly 1% above LO and joins the group. E2 is one unit further and is out, however high its content. With only one bid in the group, s.14 is not engaged, and the engine returns the result with the reason, opening:

"only LO is within 1% of the lowest evaluated cost 2000000; s.14 is not engaged"

## Exercise

Open the award calculator on the view "Sections 14 and 16, both readings". It starts on the four responsive materials bids with their evaluated costs and overall contents. Read the group row under both readings. Then replace the bids with LO and E1 from the table above, each with a receipt time, an indigenous flag of false and a capacity flag of true, and read the group, the leader and the selected bid under each reading. Change E1's evaluated cost to 2020001 and read both reasons.
