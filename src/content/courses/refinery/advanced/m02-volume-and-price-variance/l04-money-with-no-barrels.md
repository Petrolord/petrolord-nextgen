# Money with no barrels

One ODIOMA line breaks the pattern of the other seven. No Forcados barrels arrived in the month, and a bill did. This lesson reads how the engine splits a line like that and why it keeps the bill on its own.

{{panel:refinery-variance-explorer}}

## The line

| material | type | direction | plan quantity | actual quantity | plan value | actual value | volume variance | price variance | unexplained | total variance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| forcados | receipt | cost | 400000.00 | 0.00 | 30720000.00 | 212000.00 | -30720000.00 | 0.00 | 212000.00 | -30508000.00 |

Forcados (illustrative) is a label on an invented crude. The plan received 400000.00 bbl of it at 76.8000 a barrel. The actual ledger holds 0.00 bbl and a value of 212000.00.

## Taking the line apart

The volume variance is (actual quantity - plan quantity) x plan unit value. With 0.00 barrels received, it reads -30720000.00: the whole planned purchase priced at the plan's 76.8000.

The price variance is (actual unit value - plan unit value) x actual quantity. An actual unit value needs barrels to divide by, and there are none, so the lab prints it as 0.0000, the engine's figure when no barrels arrived, beside a plan unit value of 76.8000 and a quantity gap of -400000.00. The actual quantity is 0.00, so the price variance reads 0.00.

That leaves the 212000.00. The engine's third term is unexplained = total - volume - price, and it is zero unless money moved with no barrels. Here money moved with no barrels. The unexplained reads 212000.00, and the total variance is -30508000.00.

## Why it stands on its own

The engine could have hidden the bill. It could have folded 212000.00 into the volume variance, or invented a price for barrels that never came. Either way a reader would see a single figure and lose the fact that a real payment was made for nothing delivered. Keeping it in its own column means the question it raises stays visible: what was this money for?

A bill with no barrels on a crude line can mean several things in practice. It might be demurrage on a vessel that never discharged, a cancellation charge on a cargo, an inspection fee, or a cost posted to the wrong month. The engine cannot tell which, and does not try. It shows the figure where no one reading the line can miss it.

## What it means for the other terms

Because the unexplained takes the money with no barrels, the volume and price variances on this line stay clean. The volume variance is purely the barrels that did not come, at the plan's price. The price variance makes no claim, because no price was paid for a barrel. Every term keeps the meaning it has on the other seven lines.

The unexplained also survives into the totals. Module 3 reads the headline on margin, and its unexplained column reads -212000.00. On margin a cost gap counts with its sign reversed, which the next module explains, so money paid out with no barrels shows there as a negative figure.

## The Forcados crude is gone from the month

Read with the other lines, the Forcados row says one of ODIOMA's two crudes did not arrive at all. The escravos receipt reads 735000.00 bbl, the forcados receipt 0.00 bbl, and the crude unit ran 735000.00 bbl. The unit-run line names no crude.

## Exercise

Read the Forcados line's plan quantity, actual quantity, actual value, volume variance, price variance, unexplained and total variance. Say which term holds the money with no barrels, and why the price variance is 0.00. Then say what a planner should ask when an unexplained figure appears on a crude receipt line, and why the engine leaves that question to the planner.
