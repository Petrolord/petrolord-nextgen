# Common errors

Four mistakes account for most of the wrong material balance answers that reach a reserves report. None looks wrong on the page. Each produces a plausible number with plausible units and a fit statistic good enough to reassure a reviewer, which is why they survive review.

Everything below is worked on the Ekene tank, where the true answer is 12139208.1074968 stb, so you can see what each error costs.

## Error 1: regrouping the compressibilities

The rock and connate water expansion term is

$$E_{fw} = B_{ti}(1+m)\frac{S_{wi} c_w + c_f}{1 - S_{wi}} \Delta p$$

and the numerator is $S_{wi} c_w + c_f$. The water compressibility is weighted by the water saturation because only the connate water expands. The formation compressibility is not, because all of the pore volume compacts. Two scalings, one parenthesis, and a term easy to slide across it.

Read it as $S_{wi}(c_w + c_f)$ and with Ekene's numbers the group becomes 0.00000245000000000000 instead of the correct 0.00000505000000000000, an error of -51.4851485148515 percent in the term. Carried through, the rock and water expansion per psi falls from 0.00000932307692307692 to 0.00000452307692307692 rb/stb/psi.

Rebuild every survey's total expansion with the misread group and refit. The slope comes back 15218421.8713497 stb, 25.3658536585368 percent above the truth, with an R-squared of 1.00000000000000. The rock and water share drops from 39.2996108949418 percent to 23.9024390243904 percent, and the depletion drive index rises to 0.760975609756096. Every one of those is wrong, and not one looks wrong.

The cousin error is worse. Drop the term altogether, on the reasoning that compressibilities of a few millionths per psi cannot matter, and the slope comes back 19998567.2027353 stb, 64.7435897435905 percent high, again with an R-squared of 1.00000000000000.

**The check.** Compute the group on its own and compare it against $c_f$. The correct group is always larger, because you are adding a positive water contribution: on Ekene, 0.00000505 against a formation compressibility of 0.000004. The misread group of 0.00000245 is smaller than $c_f$, which is impossible, and the check takes five seconds.

## Error 2: mixing reservoir barrels with stock tank barrels

Underground withdrawal is a reservoir volume. Cumulative oil production is a surface volume. They are the same fluid in different states, and the number that converts one to the other is the oil formation volume factor.

The mistake is to plot cumulative oil against total expansion instead of the withdrawal, usually because the cumulative was already the column in the spreadsheet. On Ekene the two differ by about twenty percent at every survey: at the last, 261475.039999678 stb against 317926.842484584 rb.

Fit the wrong one and the slope comes back 9963879.04308834 stb, 17.9198597235109 percent below the truth, with an R-squared of 0.999989436457542. Read a single survey instead of fitting and you get 9983743.11733701 stb, wrong by about the same amount. The error is one-sided, because the oil formation volume factor is above 1 at every pressure in the history.

Notice how respectable that R-squared is. Rescaling a straight line leaves a straight line, so goodness of fit cannot see a units error.

**The check.** Put units on the axes before you fit, and read the slope's units off them. Reservoir barrels divided by rb/stb gives stb, which is what oil in place should be. Stock tank barrels divided by rb/stb gives stb squared per reservoir barrel, which is not a thing. If the slope's units are not stock tank barrels, your vertical axis is the wrong column.

## Error 3: reading the slope off the wrong axes

Havlena and Odeh plot $F$ on the vertical axis and $E_t$ on the horizontal, so the slope is $F/E_t$ and equals the oil in place. Swap them, by habit or because a plotting tool defaulted that way, and the fitted slope is $E_t/F$.

On Ekene that slope is 8.23776963986990e-8. It is not wrong, it is the reciprocal of the right answer, and inverting it recovers 12139208.1074968 stb exactly. The R-squared is unchanged at 1.00000000000000, because swapping axes does not disturb how well the points line up.

This one is dangerous because the wrong number is not absurd. It is a very small number with no obvious interpretation, and in a cell labelled "slope" nobody notices. It becomes expensive when somebody multiplies by it instead of dividing.

**The check.** Sanity-check the magnitude first. Oil in place for any field of interest is a number in the millions of stock tank barrels, and a slope of 8.2e-8 is not oil in place whatever the cell is labelled. And name the axes in the chart title: withdrawal against total expansion, in that order.

## Error 4: reading a high R-squared as a correct model

Here are the four fits from this lesson in one table.

| What was fitted | Slope, stb | R-squared |
|---|---|---|
| The correct terms | 12139208.1074968 | 1.00000000000000 |
| Misgrouped compressibilities | 15218421.8713497 | 1.00000000000000 |
| Rock and water term dropped | 19998567.2027353 | 1.00000000000000 |
| Cumulative oil instead of withdrawal | 9963879.04308834 | 0.999989436457542 |

Three of those four answers are badly wrong, by 25 percent, 65 percent and 18 percent, and all four fit statistics are excellent.

That is not a defect in R-squared, it is what R-squared measures. It asks how much of the scatter in the vertical variable is explained by the horizontal one, and every error here is a smooth distortion that preserves the linear relationship while changing its slope. Scatter is the only thing it can see, and none of these mistakes creates any.

So R-squared answers one question: are these points on a line? It cannot say whether they are the right points, whether the axes are the right way round, or whether the terms were built correctly. Those are answered by units, by the reconciliation against an independent method, by the drive indices closing, and by the plot itself.

**The check.** Never quote a fit statistic as evidence of correctness on its own. Quote it with the reconciliation gap and the drive index sum beside it. Three numbers together are an argument. One alone is a decoration.

## Worked example: auditing a colleague's tank

A colleague sends you this. "Ekene material balance complete. Plotted cumulative oil against total expansion, R-squared 0.99999, oil in place 9963879 stb. Rock and water term computed with the group $S_{wi}(c_w + c_f)$. Volumetric booking is 12139208 stb, so material balance is 18 percent low, which we interpret as an unconnected northern compartment."

Work it before reading the verdict. The vertical axis is the cumulative, so error 2 has already scaled the answer down by about 18 percent, and the compressibility group is the misread one, which on its own pushes the answer up by about 25 percent. Two errors in opposite directions, partially cancelling, leave a discrepancy of a size that looks normal on a real field. Then a physical story was invented to explain the residue.

That last step is what makes the example worth working. The arithmetic was recoverable. The interpretation was not, because it attached a geological meaning to a bookkeeping mistake, and once that is written down somebody will drill it.

## Exercise

Rebuild the colleague's numbers correctly and write the corrected two-sentence note. Then, for each of the four errors above, write the single line you would add to a material balance checklist so the next person cannot commit it. Compare your four lines against the four checks printed here and keep whichever is sharper. That checklist is the review discipline the Professional tier will assume you already have.
