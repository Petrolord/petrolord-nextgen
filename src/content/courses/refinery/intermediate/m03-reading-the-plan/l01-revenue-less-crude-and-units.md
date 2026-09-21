# Revenue less crude and units

A refinery plan answers one question first: what does the month earn? The plan's answer is its margin, and the course gives its definition in one line:

margin = product revenue - crude cost - unit operating cost.

This lesson reads each of the three terms for ABUA, where each comes from, and what the definition leaves out.

{{panel:refinery-plan-explorer}}

## The three terms

The plan prints them together:

revenue 172316812.90; crude cost 160350322.58; unit operating cost 4888554.84; margin 7077935.48

**Product revenue** is every product's volume sold at its price. The plan prints it product by product:

| product | volume (bbl) | revenue |
| --- | --- | --- |
| Gasoline | 346525.81 | 38464364.52 |
| Naphtha export | 0.00 | 0.00 |
| Jet A-1 | 288354.84 | 30421435.48 |
| Diesel (ULSD) | 630500.00 | 66076400.00 |
| Gasoil export | 0.00 | 0.00 |
| Fuel oil | 633129.03 | 37354612.90 |

Two products sell nothing. Naphtha export and Gasoil export are both in the configuration and both carry a price, and the plan sends none of either stream to them. Their naphtha and gasoil go through the reformer and the hydrotreater instead. The revenue line counts only what is sold.

**Crude cost** is every crude's volume at its cost: Bonny Light 26750322.58, Forcados 85360000.00 and Brass River 48240000.00, totalling the plan's 160350322.58.

**Unit operating cost** is every unit's throughput at its operating cost a barrel: Crude distillation 2536290.32, Naphtha reformer 1182264.52 and Diesel hydrotreater 1170000.00, totalling 4888554.84. Module 2 showed why the first of those is charged on every barrel of crude.

## What the margin is not

The margin is a month's contribution from running the refinery. It leaves things out, and a reader should know which.

It carries no fixed cost. Staff, insurance and overheads that the month pays whatever it runs are not terms in the formula. It carries no capital. The plan does not know what the refinery cost to build. It carries no tax and no financing. Each of those belongs to a different reading of the refinery, and the Expert tier takes up the one that values capital.

So a margin of 7077935.48 is the largest the month's crude, units and product prices give under ABUA's limits, measured against those three terms. It is not a profit, and nothing in this tier treats it as one.

## What the plan maximises

SECTION 12 prints it. planRefinery hands its linear programme to the solver with maximize: true, on an objective that counts each product barrel at its price, each crude barrel at minus its cost and each barrel through a unit at minus that unit's operating cost. The objective at ABUA's plan is 7077935.48, the plan's margin, and the course prints the same: true.

Every choice the plan makes, which crude, how much through which unit, which product gets which stream, moves one of the three terms. How the solution is found is the `crude` course's subject. What it finds is printed here.

## The formula under a change

SECTION 13 prints the margin under each of five changes, with its change from the plan as typed. The row for the Forcados cargo cancelled reads margin 4030705.04, a change of -3047230.44. Every figure in that row is a new balance of the same three terms, struck by a plan that has lost one of its crudes.

## Exercise

Read revenue 172316812.90, crude cost 160350322.58, unit operating cost 4888554.84 and margin 7077935.48. Say which term is the largest charge against revenue, and what that tells you about how sensitive the margin is to the crude cost a barrel. Then name the two products that sell 0.00 bbl and say where the plan sent their streams instead.
