# The grid search

The exponential and the harmonic each have a transform that turns the model into a straight line with no unknowns hiding inside it, so each is solved by exactly one regression. The hyperbolic does not have that luxury. Its transform is $q^{-b}$, and $b$ is the thing you are trying to find. You cannot linearise your way out of a parameter that sits in the exponent of the linearisation.

The engine's answer is blunt and worth knowing exactly, because three of its properties reach your reserves report.

## What the loop actually does

The engine sweeps $b$ over a fixed grid. It starts at 0.05, adds 0.05 each pass, and stops when the value would exceed `maxB`, which defaults to 2. At every rung it runs the linearised regression, back-transforms into $q_i$ and $D_i$, rebuilds the predicted rates, and computes RMSE on the original rate scale. It keeps the rung with the lowest RMSE, and that single survivor is the hyperbolic candidate. Auto-Select then ranks that survivor against the exponential and harmonic candidates, again on RMSE, and returns the winner.

Three consequences follow, none of them obvious from the fit report.

**One: the rungs are not the decimals you would write.** The grid is built by repeated addition, and 0.05 has no exact binary representation. Add it to itself and the error accumulates. The first twelve rungs the engine actually visits are

`0.05, 0.1, 0.15000000000000002, 0.2, 0.25, 0.3, 0.35, 0.39999999999999997, 0.44999999999999996, 0.49999999999999994, 0.5499999999999999, 0.6`

Some land on the tidy value, some do not, and there is no pattern you can predict from the decimal. This is why the panel reports Ekene-3's fitted exponent as **0.49999999999999994** rather than 0.5. The difference from 0.5 is $5.551115123125783 \times 10^{-17}$, one unit in the last place of a double. Ekene-6's fitted exponent, by contrast, comes back as exactly 0.35, because 0.05 accumulated seven times happens to produce the same double as the literal 0.35.

Stop and reproduce it in any JavaScript console before you read on:

```
let s = 0.05; for (let i = 1; i < 10; i++) s += 0.05; s   // 0.49999999999999994
0.05 * 10                                                 // 0.5
```

Two arithmetics that agree in decimal disagree in binary, and the engine uses the first one. The practical rule is short: never test a reported $b$ with an equality comparison. Compare it against a tolerance. The Professional capstone grades Ekene-3's exponent to a tolerance of 0.02, so this float is entirely harmless there, and 0.5 is the right thing to write in a memo. A spreadsheet lookup keyed on an exact 0.5, or a unit test asserting `b === 0.5`, would fail on a number that is correct.

**Two: the grid quantises.** The engine can only ever return a $b$ within one step of a multiple of 0.05. A well whose true exponent is 0.37 will be reported at 0.35 or 0.40, and the report will carry no hint that a compromise was made. Ikoku's gas well in Ahmed's Example 16-3 is fitted in the literature at $b = 0.5195$ by a Newton solve; our grid could never produce that value, and the Expert tier makes a whole lesson of the difference between a solver and a grid. At this tier the discipline is to read a reported $b$ as the centre of a 0.05-wide bin, not as five decimal places of knowledge.

**Three: the harmonic rung is skipped.** The loop explicitly passes over any rung within 0.001 of 1, because the harmonic has its own exact linearisation and is handled separately. Under Auto-Select this costs nothing: the harmonic candidate is in the competition anyway. But if you force the Hyperbolic model on a genuinely harmonic well, the grid cannot reach the answer.

{{panel:dca-fit-explorer}}

## Worked example: the grid around Ekene-3

Select Ekene-3, primary window, and force the Hyperbolic model. Here is what the engine sees as it walks past the answer, RMSE computed on the rate scale in stb/d:

| rung | b (raw) | qi (stb/d) | Di (per day) | RMSE (stb/d) |
|---|---|---|---|---|
| 8 | 0.39999999999999997 | 146.706142272117 | 0.00183260487862868 | 0.872334668495765 |
| 9 | 0.44999999999999996 | 148.289265736103 | 0.00191285678389850 | 0.449327533249741 |
| 10 | 0.49999999999999994 | 150.000000000000 | 0.00200000000000000 | 4.14314051144892e-14 |
| 11 | 0.5499999999999999 | 151.853300884492 | 0.00209496246057763 | 0.478875334397122 |
| 12 | 0.6 | 153.866653331335 | 0.00219884676261261 | 0.991015196328253 |

The tenth rung wins by fourteen orders of magnitude, which is what a noise-free planted truth looks like. Notice also that $q_i$ and $D_i$ move together with $b$ along the grid: the neighbouring rungs do not just get the exponent wrong, they buy their misfit back by adjusting the other two parameters. The three Arps parameters are strongly correlated in any fit, and that correlation is why a small error in $b$ does not show up as an obvious error anywhere else in the report.

Now force the Hyperbolic model on Ekene-5, the harmonic well, over its primary window. Because the loop skips the rung at 1, the best the grid can do is **0.9500000000000003**, at R2 0.999934526382689 and RMSE 0.133888840068019 stb/d. Booked at a 10 stb/d limit that fit returns 148352.186019487 stb against the correct harmonic booking of 153505.672866270 stb, 3.35719635017790 percent light. The model selector, used carelessly, cost five thousand barrels on a well whose data was perfect.

## The misconception to retire

"The engine solved for b." It did not. It tried thirty-eight values and reported the best of them. That is a search, not a solution, and searches are characterised by their resolution, their bounds and their objective function. All three are visible: 0.05, a ceiling of 2 that the accumulation never quite reaches, and lowest RMSE. Knowing those three numbers is what lets you say why a fit came back the way it did.

## Exercise

The loop condition is `b <= maxB` with `maxB` defaulting to 2, and the rungs are accumulated by repeated addition. Work out for yourself what the highest rung the engine can actually evaluate is. Then check it in a console: keep adding 0.05 from 0.05 and print the first value that fails the `<= 2` test. Count how many rungs were accepted before it, subtract the one skipped near 1, and you have the exact number of hyperbolic candidates every Auto-Select fit in this course considers. Write both numbers down; lesson 5 turns the ceiling one into a diagnostic.
