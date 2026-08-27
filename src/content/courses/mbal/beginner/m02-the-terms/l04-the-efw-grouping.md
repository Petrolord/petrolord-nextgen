# The Efw grouping

One lesson, one pair of parentheses. The compressibility group inside the rock and water expansion term is

$$S_{wi} c_w + c_f$$

and it is very commonly misremembered as

$$S_{wi} (c_w + c_f)$$

The two expressions differ by where the closing bracket goes. On the Ekene tank they differ by 51.4851485148515 percent in the term, 20.2334630350195 percent in the total expansion, and 25.3658536585366 percent in the in place volume you would go on to book. That is a quarter of a field, lost to a bracket.

## Why the correct grouping is the correct one

The physics decides it, and once you see the reason you will not misplace the bracket again.

Water compressibility acts only on the water. Connate water occupies the fraction $S_{wi}$ of the pore volume, so when you express its expansion per unit of PORE volume you must weight it by how much of that pore volume is water. Hence $S_{wi} c_w$.

Formation compressibility acts on the pore volume itself. The rock does not compact only under the water and leave the oil-filled pores alone. The whole pore space shrinks, all of it, so $c_f$ enters unweighted. Hence the bare $+ c_f$.

The misreading multiplies the rock's contribution by the water saturation, which asserts that only the pores containing water are able to compact. Stated in words like that, nobody believes it. Stated as a misplaced bracket in a spreadsheet, everybody accepts it.

## The arithmetic, both ways

Ekene's inputs: $S_{wi} = 0.35$, $c_w = 0.000003$ per psi, $c_f = 0.000004$ per psi.

Correct:

$$S_{wi} c_w + c_f = 0.00000105000000000000 + 0.00000400000000000000 = 0.00000505000000000000$$

Misread:

$$S_{wi}(c_w + c_f) = 0.35 \times 0.00000700000000000000 = 0.00000245000000000000$$

The misreading is 51.4851485148515 percent BELOW the correct group. Put another way, the correct group is 2.06122448979592 times the misread one. The gap is this large because $c_f$ is the bigger of the two compressibilities here and the misreading is precisely what shrinks $c_f$ by a factor of $S_{wi}$.

Note the direction. Because $c_f$ exceeds $c_w$ in most consolidated reservoirs, the misreading almost always UNDERSTATES the rock and water expansion, which understates the total expansion, which OVERSTATES the oil in place. The error flatters the booking. That is exactly the direction of error a reserves auditor is trained to look for.

## What it costs on Ekene

Take the last survey, drawdown 1103.99173733300 psi.

The correct slope is 0.00000932307692307692 rb/stb/psi, giving $E_{fw} = 0.0102925998895969$ rb/stb.

The misread slope is 0.00000452307692307692 rb/stb/psi, giving

$$E_{fw} = 0.00499343955039851 \text{ rb/stb}$$

a shortfall of 51.4851485148515 percent, exactly the error in the group, since everything else in the term is a constant multiplier.

Add the oil expansion, which is untouched at 0.0158974810175951 rb/stb, and the totals are:

$$E_t \text{ correct} = 0.0261900809071921 \qquad E_t \text{ misread} = 0.0208909205679937$$

a 20.2334630350195 percent shortfall. The dilution happens because only part of $E_t$ was damaged.

Now divide the unchanged withdrawal of 317926.842484584 rb by each:

$$\frac{F}{E_t} \text{ correct} = 12139208.1074968 \text{ stb} \qquad \frac{F}{E_t} \text{ misread} = 15218421.8713497 \text{ stb}$$

The misreading books 25.3658536585366 percent more oil than the tank contains. Three million barrels, from a bracket.

## The reason you cannot catch this by looking at the fit

This is the part that makes the grouping worth its own lesson rather than a footnote.

Repeat the misreading at survey 3 instead of survey 6. The drawdown there is 637.857138863942 psi, the misread $E_{fw}$ is 0.00288507690501537 rb/stb, the misread $E_t$ is 0.0120702197046561 rb/stb, and dividing that survey's withdrawal of 183689.695545334 rb by it gives 15218421.8713496 stb.

The same wrong answer. Every survey agrees with every other survey, to fifteen figures, on a number that is wrong by three million barrels.

That happens because the mistake is a constant multiplier on a term that is itself proportional to drawdown. It rescales the whole expansion column by a fixed factor, so the relationship between withdrawal and expansion stays perfectly straight and the fit quality stays perfect. Module 3 will teach you to read the straightness of that relationship as evidence that the model is right. This lesson is the caveat: straightness proves internal consistency, not correctness. A systematically wrong constant produces a beautifully straight, beautifully wrong line.

The only defence is to check the inputs and the grouping directly. Recompute the group by hand, confirm that $c_f$ enters unweighted, and confirm the slope. Two minutes, once per tank.

## The neighbouring error

While you are checking, watch for the more drastic version: dropping $E_{fw}$ altogether. On Ekene that leaves $E_t = E_o = 0.0158974810175951$ rb/stb, and the in place volume comes out at 19998567.2027352 stb, an overstatement of 64.7435897435901 percent. That percentage is not a coincidence: it is exactly the ratio $E_{fw} / E_o$, since deleting a term inflates the answer by the fraction of the denominator you deleted.

Some textbooks do say that rock and water expansion is negligible. That advice is safe for a saturated reservoir with a gas cap, where free gas expansion is orders of magnitude larger than everything else. It is dangerous for an undersaturated tank like this one, and the next lesson shows exactly how dangerous.

## Exercise

Work the group and the resulting slope for a tank with $S_{wi} = 0.45$, $c_w = 0.000003$ per psi and $c_f = 0.000004$ per psi, keeping $B_{ti} = 1.20000000000000$ and $m = 0$. Your correct group should be 0.00000535000000000000 and your slope 0.0000116727272727273 rb/stb/psi.

Then work the misread version of the same tank, $S_{wi}(c_w + c_f) = 0.00000315000000000000$, and compute the percentage error in the group. Compare it against Ekene's 51.4851485148515 percent and answer this: does raising the water saturation make the bracket mistake better or worse, and what does that tell you about which reservoirs are most exposed to it?
