# The volume variance

A variance line holds a plan and an actual. The total variance on the line is the gap between their values. The engine splits that gap so a reader can see how much of it came from moving a different number of barrels. That part is the volume variance.

{{panel:refinery-variance-explorer}}

## The formula

volume variance = (actual quantity - plan quantity) x plan unit value

The plan unit value is the plan line's value per barrel: 78.9000 for Escravos (illustrative), 1.4000 for the crude unit, 110.5000 for gasoline, and so on through the plan ledger. The volume variance prices the change in barrels at the plan's own price. It answers one question: had every barrel moved at the price the plan expected, what would the difference in barrels alone have cost or earned?

## The ODIOMA volume variances

| material | type | plan quantity | actual quantity | quantity gap (bbl) | plan unit value | volume variance |
| --- | --- | --- | --- | --- | --- | --- |
| escravos | receipt | 600000.00 | 735000.00 | 135000.00 | 78.9000 | 10651500.00 |
| forcados | receipt | 400000.00 | 0.00 | -400000.00 | 76.8000 | -30720000.00 |
| cdu | unit_run | 1000000.00 | 735000.00 | -265000.00 | 1.4000 | -371000.00 |
| reformer | unit_run | 190000.00 | 131000.00 | -59000.00 | 3.1000 | -182900.00 |
| gasoline | delivery | 163400.00 | 112660.00 | -50740.00 | 110.5000 | -5606770.00 |
| jet | delivery | 136000.00 | 101200.00 | -34800.00 | 104.9000 | -3650520.00 |
| diesel | delivery | 334000.00 | 244000.00 | -90000.00 | 100.6000 | -9054000.00 |
| fuel_oil | delivery | 314000.00 | 210000.00 | -104000.00 | 60.2000 | -6260800.00 |

SECTION 20 prints the two terms the formula multiplies: quantity gap = actual quantity - plan quantity, and plan unit value = plan value / plan quantity.

## Reading the signs as recorded

On every line the sign of the volume variance follows the sign of the quantity gap. Escravos received 735000.00 bbl against a plan of 600000.00 bbl, and its volume variance is positive, 10651500.00. Every other line moved fewer barrels than its plan, and each of those volume variances is negative.

These signs are as recorded. A positive volume variance on a receipt means more crude was bought, and more crude bought is more cost. A negative volume variance on a delivery means fewer barrels were sold, and fewer barrels sold is less revenue. The same sign can mean opposite things for the margin depending on which side of the ledger the line sits. Module 3 is built on that fact. For now read every figure as a change in the line's own value.

## The Forcados line

Forcados (illustrative) planned 400000.00 bbl and received 0.00 bbl. Its quantity gap is -400000.00 and its volume variance -30720000.00, and the plan value on the line is 30720000.00. With an actual quantity of 0.00, the formula takes the whole planned quantity away at the plan's price of 76.8000 a barrel. Lesson 4 returns to this line, because something else happened on it.

## The units

The crude unit ran 735000.00 bbl against a plan of 1000000.00 bbl, and its volume variance at the plan's operating cost of 1.4000 a barrel is -371000.00. The reformer ran 131000.00 bbl against 190000.00 bbl, a volume variance of -182900.00 at 3.1000 a barrel. The crude unit's actual throughput reads 735000.00 bbl, and so does the escravos receipt: the only crude that arrived is the crude the unit ran.

## Why plan price

Pricing the barrel gap at the plan price keeps the volume variance free of any price change. Whatever the month's prices did, the volume variance is computed as if they had not moved. The price effect is left for its own term, which the next lesson reads, and each term can then be read without the other.

## Exercise

Read the diesel line: plan quantity, actual quantity, the plan value per barrel of 100.6000 and the volume variance. Say what the sign of the volume variance tells you about the barrels sold. Then read the escravos line and say why a positive volume variance on a receipt adds cost. Finally, read the crude unit's actual quantity beside the escravos actual quantity and say what the pair shows.
