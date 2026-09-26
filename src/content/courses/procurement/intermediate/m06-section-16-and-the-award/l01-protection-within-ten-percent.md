# Protection within ten percent

{{panel:pr-award-calculator}}

Section 16 of the Nigerian Oil and Gas Industry Content Development Act 2010 (Act No. 2, commenced 22 April 2010, as enacted; read on 2026-09-26) works differently from s.14. Section 14 can select a bid. Section 16 protects one: a Nigerian indigenous company with capacity, whose bid is within 10 percent of the lowest, is not to be disqualified solely because it is not the lowest. It never makes that company the winner.

## The engine's rule

The engine states the rule in its basis:

> 100 x (C - Cmin) <= 10 x Cmin for a Nigerian indigenous company with capacity (Nigerian Oil and Gas Industry Content Development Act 2010 s.16)

C is the bid's evaluated cost. The margin is inclusive: a bid exactly 10 percent above the lowest is within it. The margin is the engine's stated constant INDIGENOUS_MARGIN_PCT, 10, cited to s.16.

Whether a bidder is a Nigerian indigenous company, and whether it has capacity, is stated by the caller for each bid, as true or false. Text is refused:

> bids[0].indigenous must be true or false when given

Both are findings the evaluation committee makes and records.

## The materials tender

MS3 is the only materials bid stated as indigenous with capacity. It has the highest evaluated cost of the four responsive bids, 581453.933847, and the highest overall content, 86.240876. It is outside the s.14 group, 6.445634 percent above MS4, so s.14 does not reach it. Section 16 does:

| bid | above the lowest, percent | within the margin |
| --- | --- | --- |
| MS3 | 6.445634 | true |

The engine's reason, verbatim:

> MS3 is a Nigerian indigenous company with capacity, 6.445633844982776% above the lowest evaluated cost, within 10 percent: it is not disqualified solely because it is not the lowest (s.16)

MS3 stays in the evaluation. The award still goes to whichever bid s.14 and the lowest evaluated cost select, and that is never MS3 on this tender. Protection keeps a bid in the evaluation and gives it nothing more.

## At the margin

Stated bids: the lowest, LO, at 3000000; I10 at 3300000, exactly 10 percent above; I11 one unit more; and NC, within the margin but stated without capacity.

| bid | above the lowest, percent | within the margin |
| --- | --- | --- |
| I10 | 10.000000 | true |
| I11 | 10.000033 | false |

I10 is protected and I11 is not. NC does not appear in the s.16 rows at all: the section applies only to a company stated as both indigenous and with capacity. The selected bid is LO.

## Two sections, two outputs

The engine keeps the sections apart: s.14 returns a leader, a lead and a selected bid; s.16 returns rows for the indigenous bids with capacity, each with its percentage and whether it is within the margin.

## Exercise

Open the award calculator on the view "Sections 14 and 16, both readings". It starts on the materials bids. Read the s.16 table and the declared block for section 16. Then set MS3's indigenous flag to false and read the s.16 table again. Replace the bids with LO, I10, I11 and NC, with evaluated costs as stated above (NC anywhere inside the margin) and contents of your choosing, giving I10 and I11 both flags true, NC indigenous true and capacity false, and LO both false. Read the s.16 rows and the selected bid under each reading.
