# Boundaries, rule by rule

{{panel:pr-contract-calculator}}

Every rule the engine applies has an edge, and a bid that lands exactly on it is where disputes start. It is tempting to state one rule for all of them, such as "a flag fires strictly beyond its limit". That rule is false for this engine. Each check has its own boundary, taken from its source or stated as a convention, and the course probed every one with a call.

## The boundaries

| rule | exactly at the boundary | the engine's result |
| --- | --- | --- |
| arithmetic discrepancy | a gap equal to the tolerance (1 x 100.5 quoted 100, tolerance 0.5) | not corrected |
| technical pass mark | a score equal to the pass mark (WS5 at 70.000000) | passes |
| completion time | equal to maxWeeks | responsive, with the adjustment added |
| high value | an estimated cost equal to US$10000000 | high value |
| weighting range | a technical weight equal to the lower end of its range, 0.5 in cell a | inside |
| content minimum | content equal to the minimum (WS1 pumping at 95.000000) | meets it |
| s.14 group | exactly 1 percent above the lowest | in the group |
| s.14 lead, points | exactly 5 percentage points | applies |
| s.14 lead, relative | exactly 5 percent of the runner-up | applies |
| s.16 margin | exactly 10 percent above the lowest | protected |
| should-cost band | a ratio equal to either limit | inside, no flag |
| ALB absolute | exactly 20 percent below the estimate | flagged |
| ALB relative | a price equal to the mean less one SD | not flagged |
| contract margin | a margin of exactly 0.000000 | no loss |
| overrun | a cost equal to the planned cost | no overrun |

Read the column of results and the pattern breaks at once. A gap equal to the tolerance is not corrected, but a bid exactly 20 percent below the estimate is flagged. A price equal to the relative ALB limit is not flagged, because the relative test flags only a price below the limit. Each follows its own text: the absolute test says "20% or more below", the relative test "more than one standard deviation below". There is no shortcut. A reader who needs the boundary of a rule looks it up for that rule.

## When two figures tie

Ties have a boundary too. Two figures tie when they agree at 12 significant digits. The stated costs 1000000.0000001 and 1000000 are different doubles, and the engine returns both as typed, yet both round to the same twelve-digit key, so they tie and the stated tie-break decides: the lower evaluated cost, then the earlier receipt, then the bidder id. The costs 1000000.00001 and 1000000.0001 differ at the twelfth digit, so they do not tie, and the lower one ranks first. A tie is a stated rule, and `tieBrokenBy` names the rule that ordered each row.

One more boundary belongs to the doubles themselves. A limit a person types is compared in binary floating point, and the engine's oracle and the engine agree except within one unit in the last place of such a limit. Every probe above used figures exactly representable or far from that unit.

## The caps

The engine also caps the size of a call, and names the cap when it refuses. The one a learner can reach by typing is the iteration count:

> iterations must be a whole number from 1 to 200000

The others are 100 bids, 50 criteria, 5000 bill lines, 200 content items and 100 life-cycle years, and a panel stays well inside every one of them. Over the bid cap, for example, the message reads:

> bids has 101 entries; the cap is 100

## Exercise

Open the contract calculator on the view "Boundary probes". Run each probe at its edge: the arithmetic probe with a gap of 0.5 and a tolerance of 0.5; the pass mark probe with a score of 70 against a pass mark of 70; the abnormally low probe at 20 percent below; and the s.14 probe with contents of 70 and 75. Record each result, then move each input one step past its edge and record what changed. Finally, on the view "Contract types on one job", set `iterations` to 200001 and read the refusal.
