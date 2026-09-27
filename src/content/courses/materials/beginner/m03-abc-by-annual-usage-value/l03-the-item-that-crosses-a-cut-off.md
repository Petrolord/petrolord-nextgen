# The item that crosses a cut-off

{{panel:materials-register-calculator}}

A cumulative share climbs in steps, one item at a time, and a step rarely lands exactly on a cut-off. Almost always one item carries the running total from below the line to above it. Which class does that item take? The texts leave it open, so the engine asks you to state a boundary rule, and it offers two.

## Two rules

Under **at-or-below**, the cumulative share including the item decides. The item that crosses 80 percent has a share above 80 once it is counted, so it falls into B.

Under **include-crossing**, the share before the item decides. The item that crosses 80 percent starts below 80, so it joins A, the higher class.

## CEM-G, the planted item

On the Ekene register, GL-VALVE brings the cumulative share to 78.753907. Class G cement comes next, and with it the share reaches 83.536840. CEM-G is the item that crosses the A cut-off. The engine's reason under each rule, verbatim:

> CEM-G: cumulative share 83.53684% is at or below 95% and above 80%

> CEM-G: cumulative share before it 78.753907% is below 80%

So CEM-G is B under at-or-below and A under include-crossing. Nothing about the cement changed; only the stated rule did.

The Ekene register has a second crossing item. SSV-ACT brings the share to 94.197214, and LUBE-OIL takes it to 95.654870, past the B cut-off. LUBE-OIL is C under at-or-below and B under include-crossing. Every other item takes the same class under both rules.

| id | share before it | cumulative share | at-or-below | include-crossing |
| --- | --- | --- | --- | --- |
| CEM-G | 78.753907 | 83.536840 | B | A |
| LUBE-OIL | 94.197214 | 95.654870 | C | B |

## A share exactly on a cut-off

On a stated case of three items worth 80.000000, 15.000000 and 5.000000, the cumulative shares land exactly on 80 and 95. Under at-or-below the first item, at exactly 80, is A. Under include-crossing the share before it is 0, so it is A as well, and the second item, whose share before it is exactly 80, is B. The two rules agree on every item here, because no item crosses a line.

## The rule is stated

The engine holds no default rule. Leave the rule out, or type a rule it does not know, and it refuses with a message that names both rules and what each one does:

> boundaryRule must be 'at-or-below' (the cumulative share including the item decides) or 'include-crossing' (the share before the item decides, so the item crossing a cut-off joins the higher class)

Neither rule is right in general. At-or-below keeps class A inside its stated share of value; include-crossing makes sure the stated share is fully covered by A. A policy picks one and writes it down, and the course quotes every ABC class with its cut-offs and rule.

## Exercise

Open the register calculator in "ABC by annual usage value". Start from "The Ekene register, at-or-below" and copy CEM-G's class and reason; then start from "The Ekene register, include-crossing" and do the same. Compare the class counts under the two rules and account for every difference. Next, start from "Shares exactly on the cut-offs, at-or-below" and "Shares exactly on the cut-offs, include-crossing" and copy each item's class. Last, set the Boundary rule control to not stated and copy the refusal.
