# The margin effect

The previous lesson left two side totals that cannot simply be added. The engine solves it one line at a time, before any total is taken. Each line gets a margin effect: its total variance, signed by what it did to margin.

{{panel:refinery-variance-explorer}}

## The rule

marginEffect is the total with its sign set by what it did to margin: as it is on a revenue line, reversed on a cost line. The engine states the same rule in its own words for the headline total:

"margin: a revenue gap counts as it is, a cost gap with its sign reversed"

The rule is short because the direction column already did the hard work. A revenue line whose total is positive earned more, and more earned is more margin, so the sign stays. A cost line whose total is positive spent more, and more spent is less margin, so the sign flips.

## Every ODIOMA line on margin

| material | type | direction | total variance | margin effect |
| --- | --- | --- | --- | --- |
| escravos | receipt | cost | 11607000.00 | -11607000.00 |
| forcados | receipt | cost | -30508000.00 | 30508000.00 |
| cdu | unit_run | cost | -319550.00 | 319550.00 |
| reformer | unit_run | cost | -169800.00 | 169800.00 |
| gasoline | delivery | revenue | -5427700.00 | -5427700.00 |
| jet | delivery | revenue | -3731500.00 | -3731500.00 |
| diesel | delivery | revenue | -9590800.00 | -9590800.00 |
| fuel_oil | delivery | revenue | -6092800.00 | -6092800.00 |

Escravos (illustrative) and Forcados (illustrative) are labels on invented figures.

## Reading the column

After the flip, every figure in the margin effect column means the same thing. Positive helped the margin. Negative hurt it.

Five lines hurt. Escravos reads -11607000.00: the month bought more of it, and paid more per barrel, than the plan expected. The four product deliveries read -5427700.00, -3731500.00, -9590800.00 and -6092800.00: every product sold fewer barrels than planned, and each product line's total variance is negative. Module 2's volume and price columns show each line's parts.

Three cost lines helped. Forcados reads 30508000.00: the planned purchase of that crude did not happen, and money not spent on crude is margin kept. The line's total also carries the 212000.00 bill in its unexplained term. The crude unit reads 319550.00 and the reformer 169800.00: running fewer barrels cost less.

## A helpful figure is not good news

A positive margin effect is not a sign that the month went well on that line. Forcados helps the margin on its own line because the crude never arrived. The same month's four product lines read -5427700.00, -3731500.00, -9590800.00 and -6092800.00 on margin, and the crude unit ran 735000.00 bbl against a plan of 1000000.00 bbl. The margin effect of each line is read on that line. The story of the month is read across all of them.

This is why the engine reports each line's effect and leaves the explanation to the reader. The crude unit's 319550.00 is a lower operating bill. It is also a unit that ran 735000.00 bbl against a plan of 1000000.00 bbl.

## Why sign each line first

The engine signs each line before it adds. If it added first, a positive cost total and a positive revenue total would add together, and a figure that meant "spent more" would be treated like one that meant "earned more". Signing first puts every line in one unit of meaning, margin gained or lost, and only then are the lines added. The next lesson reads that sum.

## Exercise

Read the total variance and the margin effect of the reformer line and of the jet line. Say why the reformer's sign flips and the jet line's does not. Then read the Forcados margin effect and say why a positive figure on that line does not mean the month went well for ODIOMA.
