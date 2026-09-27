# The twelve-digit tie rule

{{panel:marine-base-calculator}}

{{panel:marine-variability-calculator}}

Decimal inputs are held in a computer as binary doubles, and most decimals have no exact binary form. Add 0.1 and 0.2 and the double that comes back sits a hair above 0.3. Divide 2.1 by 0.7 and the quotient lands one binary step above 3. An engine that compared such figures exactly would call a full deck overloaded and round three voyages up to four. The engine states one rule for every such comparison: two figures tie when they agree to 12 significant digits, the constant `DEFAULTS.TIE_DIGITS`.

## Where the rule acts

A capacity check passes when the twelve-digit figure of the load is at or below that of the capacity. A count rounded up is the ceiling of the twelve-digit figure. A binding tie goes to the first constraint in the stated order. In the variability calculator, a draw is short only when its vessel-days are strictly above the planned capacity at twelve digits.

| golden input | what the doubles give | what the engine returns |
| --- | --- | --- |
| voyage-decimal-sum-at-capacity | 0.1 plus 0.2 m2 on a 0.3 m2 deck | feasible, deck area at 1.000000 |
| fleet-decimal-ratio-2-1-over-0-7-is-three | 2.1 over 0.7, one step above 3 | 3 voyages |
| variability-at-capacity-is-not-short | a need of 14.000000 vessel-days against 14.000000 | probability short 0.000000 |

## The reading and its alternative

Reading three names the rule where it matters most: a count rounds up on its twelve-digit figure. The alternative, the ceiling of the raw double, would turn 2.1 over 0.7 into 4 voyages for what is plainly three voyages of demand. Neither is a law of arithmetic; the engine states one and the course names the other. No capstone field moves under either.

The rule does not blur real differences. A demand of 300.001 m2 against a 100 m2 voyage is a thousandth of a square metre over three voyages, which twelve digits see easily, and it rounds up to 4.

## At the shore base

The base target is met at or below it, and the golden input base-target-met-exactly-by-current puts a wait of 9.000000 hours against a target of 9: one berth meets it. The steady-state bound works the other way round: a berth utilisation of exactly 1 is refused, and the printed bound is moved to the accepted side, which the third lesson of this module reads.

## Exercise

Open the variability calculator on the view "The fleet under weather and demand variability" and start from "A need exactly at the planned capacity". Read the Planned capacity and Probability short tiles and the vessel-days table. Switch the start to "One vessel fewer" and read them again. Then open the shore base calculator on the view "The berth queue", start from "A target met exactly", and read the Fewest berths that meet it tile and the reason. Say for each which side of its boundary the engine put the figure on.
