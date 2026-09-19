# The Odioma month end to end

This lesson reads the whole ODIOMA month in one pass, from the plan to the last unit, the way a planner would present it at a month-end review. Every figure has appeared in modules 1 to 3. The point here is the order in which they are read.

{{panel:refinery-variance-explorer}}

## Step 1: the plan

The plan is ODIOMA's month, solved on two crudes, Escravos (illustrative) and Forcados (illustrative), a crude unit, a reformer and four products. It is cascaded from the period start 2027-03-01 over 31 days with a cargo size of 350000.00 bbl, and summed by material and type into the plan ledger. The plan's total crude is 1000000.00 bbl, its margin 4776300.00 and its gross margin per barrel 4.7763. That is the figure the month is judged against.

## Step 2: what the month did

The actual ledger records one movement for each material and type. The escravos receipt reads 735000.00 bbl. The forcados receipt reads 0.00 bbl and a bill of 212000.00. The crude unit ran 735000.00 bbl and the reformer 131000.00 bbl. The four products were all delivered, and an lpg delivery of 9000.00 bbl for 441000.00 appears that the plan never carried.

## Step 3: the matched lines

attributeVariance matches the two ledgers on material and type. Eight lines match. Each splits into a volume variance, a price variance and an unexplained term, and each carries a direction and a margin effect.

| material | margin effect |
| --- | --- |
| escravos | -11607000.00 |
| forcados | 30508000.00 |
| cdu | 319550.00 |
| reformer | 169800.00 |
| gasoline | -5427700.00 |
| jet | -3731500.00 |
| diesel | -9590800.00 |
| fuel_oil | -6092800.00 |

The lpg delivery is listed as unmatched and folded into no line.

## Step 4: the headline

The headline total is on margin: -5452450.00. Its parts are a volume variance on margin of -3949690.00, a price variance on margin of -1290760.00 and an unexplained on margin of -212000.00. The sum of every line's total variance as recorded, -44233150.00, is not reported as a headline, because it adds money spent less to money received less.

## Step 5: the ledger margins

reconcilePeriod reads each ledger's margin. The plan margin is 4776300.00 and the actual margin -235150.00, a margin variance of -5011450.00. The margin variance less the margin total of the matched lines is 441000.00, and the unmatched movements come to 441000.00. The gap is the lpg sale.

## Step 6: the units

The crude unit ran 735000.00 bbl against a plan of 1000000.00 bbl, 73.50 percent of plan. The reformer ran 131000.00 bbl against 190000.00 bbl, 68.95 percent of plan. The app reports the gap and does not say why it happened.

## The story the figures support

Read in order, the figures describe a month in which one of the two crudes did not arrive. The crude unit ran 735000.00 bbl, the same figure as the Escravos receipt, and every product line sold fewer barrels than planned. On margin, the crude not bought helped and the products not sold hurt, and the month closed with an actual margin of -235150.00 against a plan margin of 4776300.00. What stopped the Forcados cargo, and what the 212000.00 bill was for, are questions for the planner. The engine's job ends at showing where to look.

## Exercise

Read the headline margin total and its three parts, then the margin variance across the ledgers. Say what explains the gap between those two totals and read the figure the engine prints for it. Then read the Forcados margin effect beside the four product margin effects, and say what the pair of observations suggests happened in the month.
