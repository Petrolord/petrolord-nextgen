# Twenty-five cells and one product

Five likelihood levels and five impact levels make a grid of twenty five cells. Every risk in the register sits in one of them, and because a score is the product of the two levels, every cell carries exactly one score and one band.

{{panel:rc-risk-explorer}}

## All twenty five cells

Likelihood runs down the side, highest at the top. Impact runs across. Each cell shows its score and its band.

| likelihood \ impact | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- |
| 5 | 5 Medium | 10 High | 15 Critical | 20 Critical | 25 Critical |
| 4 | 4 Low | 8 Medium | 12 High | 16 Critical | 20 Critical |
| 3 | 3 Low | 6 Medium | 9 Medium | 12 High | 15 Critical |
| 2 | 2 Low | 4 Low | 6 Medium | 8 Medium | 10 High |
| 1 | 1 Low | 2 Low | 3 Low | 4 Low | 5 Medium |

## Reading a cell

Pick a risk with likelihood 4 and impact 3. Go to the row for likelihood 4 and the column for impact 3. The cell reads 12 High: 4 times 3 is 12, and 12 falls in the "High" band. Every cell is read the same way. Nothing in the grid is a judgement; it is a multiplication table with a band written beside each product.

The top right cell, likelihood 5 and impact 5, scores 25, "Critical". The bottom left cell, likelihood 1 and impact 1, scores 1, "Low".

## One score, several cells

Because the rule is a product, the same score can appear in more than one cell. Likelihood 4 with impact 5 scores 20, and so does likelihood 5 with impact 4. Likelihood 4 with impact 3 scores 12, and so does likelihood 3 with impact 4. The product does not care which axis a level sits on. Two risks that share a score can therefore be very different risks: one likely and moderate, the other rare and severe. The band is the same because the score is the same.

## Cells in each band

Counted from the grid above, the cells in each band are:

| band | cells |
| --- | --- |
| "Critical" | 6 |
| "High" | 4 |
| "Medium" | 7 |
| "Low" | 8 |

Those four counts add to 25, one for every cell: 6 plus 4 plus 7 plus 8. Every cell has a band, and no cell on the grid bands "None", because every whole level from 1 to 5 multiplies with every other to give a positive score.

Look at where the "Critical" cells sit. All six are in the top right corner of the grid, where both levels are high. The "Low" cells sit in the bottom left. A heatmap in the Risk Register colours these cells by band, and a risk appears in the cell its two levels name.

## The mistake

The mistake is to read a heatmap cell as a single kind of risk. A cell is a pair of levels and a product. Two risks in two different cells can share a score and a band, and two risks in the same cell can be entirely different hazards that happen to have been assessed at the same levels. The cell tells you the arithmetic. The record tells you the risk.

## Exercise

Record the score and band of the cells at likelihood 4 impact 3, likelihood 3 impact 4 and likelihood 5 impact 5. Record the number of cells in each of the four bands and show that they add to the size of the grid. State the rule that fills every cell.
