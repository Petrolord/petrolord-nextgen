# The cost of a wrong aquifer

Everything so far has been about detecting an aquifer that is there. This lesson is the opposite mistake, and the more expensive one, because nothing in the output warns you that you have made it.

The Ekene tank has no aquifer. Its ratio column is flat to fourteen significant figures, its intercept is machine zero, its water drive index is exactly zero, and its oil in place reconciles against an independent booking to fifteen digits. There is no diagnostic in this course that Ekene fails. Give it a pot aquifer anyway.

## The answer

| quantity | pot on Ekene | truth |
|---|---|---|
| oil in place | $-516449.043355256$ stb | 12139208.1074968 stb |
| aquifer water in place $W$ | 42890161.1573930 rb | none |
| R-squared | 0.999485673716372 | 1 |
| influx at the last survey | 331452.684714500 rb | 0 rb |
| water drive index | 1.04254388249892 | 0 |
| depletion drive index | $-0.0258243022172419$ | 0.607003891050583 |
| drive indices summed | 1.00000000000000 | 1.00000000000000 |
| drive mechanism | strong_water_drive | depletion_drive |
| warnings | 5, all about the PVT table order | the same 5 |

A negative oil in place, 12655657.1508521 stb from the truth, on a tank the closed model reads perfectly. A water drive index above one, crediting water with 104 percent of everything withdrawn while the oil expansion supplies a negative amount. A cumulative influx of 331452.684714500 rb against a withdrawal of 317926.842484584 rb, so the model claims 13525.8422299160 more reservoir barrels of water arrived than volume of any kind left the tank.

And an R-squared of 0.999485673716372. Those two facts together are the lesson: an excellent looking fit and a physically impossible answer, from the same six surveys, with nothing in the warnings list.

## Why the regression does this

The short answer is lesson 3's: an extra free parameter lets the regression trade oil against water, and with six surveys on a clean depletion line there is nothing to stop it. The long answer becomes a check you can run. Compute the pot plot's coordinates, $x = \Delta p / E_o$ and $y = F / E_o$, for the six Ekene surveys.

| n | $x = \Delta p / E_o$ | $y = F / E_o$ |
|---|---|---|
| 1 | 69444.444444446708 | 19998567.202735730 |
| 2 | 69444.444444443550 | 19998567.202734798 |
| 3 | 69444.444444444307 | 19998567.202735007 |
| 4 | 69444.444444444307 | 19998567.202735011 |
| 5 | 69444.444444445529 | 19998567.202735364 |
| 6 | 69444.444444444991 | 19998567.202735212 |

Every survey lands on the same point. Both coordinates span a relative range of $4.5 \times 10^{-12}$ percent. There is no plot here, only six copies of one point.

The reason is structural and Ekene specific. This fixture's oil expansion is exactly proportional to drawdown, at 0.0000144 rb/stb/psi, so $\Delta p / E_o$ is the reciprocal of that slope, 69444.444444444453, at every pressure. And $F/E_o$ is the oil in place multiplied by $E_t/E_o$, with both expansion terms proportional to the same drawdown, so it too is the same everywhere. That value, 19998567.2027352, is what the Associate tier got when it dropped the rock and water term altogether.

A least squares line through six coincident points has no defined direction. What the engine fits is the leftover floating point scatter: $y$ spans $9.31322574615479 \times 10^{-7}$, $x$ spans $3.15776560455561 \times 10^{-9}$, and the ratio is 294.930875576037 against a reported slope of 295.416233943700. The fitted slope is the ratio of two rounding errors, and the R-squared measures how well a line fits them.

## The lever arm, which is the transferable part

What should the slope have been? With no aquifer, $W = 0$, so the slope is the reservoir's own rock and water contribution:

$$N B_{ti}\frac{S_{wi}c_w + c_f}{1 - S_{wi}} = 12139208.1074968 \times 0.00000932307692307692 = 113.174770971432$$

reservoir barrels per psi, which the Associate tier already computed as Ekene's rock and connate water response per psi. The engine's slope is 295.416233943700, so the slope error is 182.241462972269 rb/psi.

Every least squares line passes through the centroid, so $\text{intercept} = \bar{y} - \text{slope} \times \bar{x}$, with $\bar{x} = 69444.444444444904$ and $\bar{y} = 19998567.202735189$. The oil in place error is therefore the slope error multiplied by $\bar{x}$:

$$182.241462972269 \times 69444.444444444904 = 12655657.1508521 \ \text{stb}$$

which is exactly $12139208.1074968 - (-516449.043355256)$, to the last digit.

**One reservoir barrel per psi of slope error costs 69444 stock tank barrels of oil in place.** That is the pot plot's lever arm, a property of the plot rather than of this fixture: the surveys sit at $x$ of order tens of thousands, and the answer is read at $x = 0$.

So here is the check to run on every pot regression you fit. **Look at the spread of $\Delta p / E_m$ across your surveys before you trust the intercept.** The constructed tank of module 1, whose oil expansion follows a curved undersaturated path, spreads its six values over 0.567357187736364 percent and recovers both unknowns to twelve figures. Ekene spreads its six over $4.5 \times 10^{-12}$ percent and returns a negative oil in place. A pot plot separates the oil term from the aquifer term only to the extent that the oil expansion departs from proportionality with drawdown. Where it does not, the two terms are indistinguishable and the split is arbitrary.

## See it in the panel

{{panel:mb-tank-explorer}}

**The truth.** Selector on "None (the truth)": oil in place 12139208.1 stb, R-squared 1, water drive index zero, aquifer strength none.

**The wrong model.** Move to "Pot aquifer (not needed here)": the oil in place goes negative, R-squared reads 0.999485673716372, the water drive index passes one, and the mechanism and strength tiles read strong_water_drive and strong. Nothing is flagged.

**The part most learners miss.** With the pot model still selected, read the survey table's last column. It still says 12139208.1 at every survey, because $F$, $E_t$ and their ratio belong to the data and do not know which model you picked. The panel is showing the truth and the model's answer at once, 12655657.1508521 stb apart.

## The two numbers the capstone grades

The Professional capstone asks for the oil in place when a pot aquifer is forced on Ekene, and for the R-squared of that fit. Both come from the second pass above: the "OOIP from the slope" tile reads $-516449.043355256$ stb and the "R-squared" tile 0.999485673716372, with tolerances of 20000 stb and 0.002. What matters is reading them from the pot setting rather than the none setting, and entering the oil in place as a negative number rather than assuming a sign error somewhere.

Write down, beside your answer, why a graded question asks you to report a negative oil in place at all.

## The sentence to carry

The Associate tier taught that a straight line does not validate your constants: misgroup a compressibility and the plot stays perfectly straight while the slope moves by a quarter of the field.

This is that statement one level up. **A high R-squared does not validate your model.** Straightness tests whether your points are consistent with the form you fitted, not whether that form was right, and adding a term the data does not need usually makes the fit statistic look better rather than worse. What can test the model: physical sanity on every reported quantity, an independent estimate of the answer, and the diagnostic that said whether an aquifer belonged there at all.

## Worked example

Rebuild the oil in place yourself from the slope of 295.416233943700 and the centroid:

$$N = 19998567.202735189 - 295.416233943700 \times 69444.444444444904 = -516449.043355256 \ \text{stb}$$

Had the slope come back at the honest 113.174770971432 rb/psi instead, the intercept would have been 12139208.1074968 stb, the true tank. The entire difference between a correct answer and a negative one is 182 reservoir barrels per psi of slope, invisible on any plot of these six points.

Then the second absurdity. Lesson 1 computed that supplying the whole of Ekene's last survey withdrawal from a pot aquifer would take 41139909.6741980 rb of water. The fitted aquifer is 42890161.1573930 rb, which is 1.04254388249891 times that, the same 1.0425 in the water drive index. The model has not merely invented an aquifer. It has invented one sized to supply more than the entire withdrawal, because the oil was given a negative contribution the water had to make up.

## Exercise

Obtain the two capstone numbers from the panel and write them down with their tolerances.

Then work this. A colleague's real field returns a pot regression with an oil in place of 3200000 stb, an aquifer water in place of 61000000 rb and an R-squared of 0.9993, against a volumetric booking of 14000000 stb and a ratio column flat within 0.4 percent across six surveys.

Say which single quantity you would ask for before commenting and why that one, then what you expect to find and what you would recommend if you were right. Two sentences each, no arithmetic required.
