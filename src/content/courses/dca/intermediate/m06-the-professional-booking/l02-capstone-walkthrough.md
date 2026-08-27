# The capstone walkthrough

The Professional capstone does not ask you to book one well. It asks you to work the Ekene field the way a portfolio engineer does: pin down a decline exponent, book a well from it, window a second well, read the number that proves a third well's naive fit invalid, book a well from a borrowed curve, and total the field. Six graded fields, one per skill this tier taught.

| Graded field | Unit | Tolerance |
|---|---|---|
| Ekene-3 fitted decline exponent b | - | 0.02 |
| Ekene-3 EUR at 10 stb/d | stb | 600 |
| Ekene-6 windowed-to-primary Di | 1/d | 0.00002 |
| Ekene-1 full-history fit R2 | - | 0.01 |
| Ekene-6 EUR from the fixed-b type curve | stb | 600 |
| Sum of the four closed-form EURs at 10 stb/d | stb | 2000 |

Read those tolerances as diagnostics rather than as generosity. The b tolerance of 0.02 is smaller than the engine's grid step of 0.05 by a factor of 2.5, so a fit landing one grid step from the truth fails. The Di tolerance of 0.00002 is 2 percent of the value graded. The field-total tolerance of 2000 stb is 8.56174397362720 times the difference between the two legitimate ways of totalling the field, which is the tolerance telling you that either route passes and you still have to know which one you used.

This lesson walks two of the six fields the whole way, one through each panel, and points you at the lesson that owns each of the rest. Copying answers is not the risk here. The risk is producing a number by a route you cannot defend.

## Walkthrough 1: Ekene-3's b and its EUR

Open the fit explorer. Select Ekene-3, model Auto-select, window Primary.

{{panel:dca-fit-explorer}}

The engine returns Hyperbolic with $q_i$ 150.000000000000 stb/d, $D_i$ 0.00200000000000000 per day, R2 1.00000000000000, and a b tile reading 0.49999999999999994.

That b tile is not a display bug and you should not round it in your head before understanding it. The grid search steps b by repeated addition of 0.05, so the value the engine actually carries is the accumulated float, not the decimal 0.5. The graded tolerance of 0.02 absorbs it comfortably. What the tolerance does not absorb is a neighbouring grid point: 0.45 or 0.55 are both 0.05 away, and both fail.

Now book the EUR by hand, because the second graded field is the one place in this capstone where the arithmetic is entirely yours. The hyperbolic cumulative to an economic limit is

$$EUR = \frac{q_i^{\,b}}{(1-b)\,D_i}\left(q_i^{\,1-b} - q_{lim}^{\,1-b}\right)$$

With $q_i = 150$, $D_i = 0.002$, $b = 0.5$ and $q_{lim} = 10$. Because $b$ and $1-b$ are both 0.5 here, every exponent in the formula is a square root:

$$q_i^{\,0.5} = 12.2474487139159, \qquad q_{lim}^{\,0.5} = 3.16227766016838$$

$$\frac{q_i^{\,b}}{(1-b)D_i} = \frac{12.2474487139159}{0.5 \times 0.002} = \frac{12.2474487139159}{0.001} = 12247.4487139159$$

$$EUR = 12247.4487139159 \times (12.2474487139159 - 3.16227766016838) = 12247.4487139159 \times 9.08517105374751$$

$$EUR = 111270.166537926 \text{ stb}$$

Stop and run that on a calculator before reading on. If you land on the same 111270.17, you have reproduced a graded field from first principles, and the panel's EUR tile is arithmetic rather than magic. Note that the engine's daily forecast for the same scenario accumulates 111190.357687804 stb, a difference of 79.8088501215243 stb that sits well inside the 600 stb tolerance. Both routes pass. Only one is the number you should say you reported.

## Walkthrough 2: Ekene-6 from the borrowed curve

The fifth field is the one people get wrong while feeling confident, so work it slowly. Open the type curve explorer.

{{panel:dca-typecurve-explorer}}

Leave the pool on Ekene-3 and Ekene-6, which is the default. The normalize-and-fit tiles come back with $q_{i,norm}$ 1.00042521426751, $D_i$ 0.00131674836694260, b 0.05 and R2 0.861590575359367. Then set apply-to-well to Ekene-6. Applying that fixed b of 0.05 to Ekene-6's own history gives $q_i$ 88.8116671130696 stb/d, $D_i$ 0.000893152170857701 per day, R2 0.999047938405246, and a quality tier of Good.

Read the two R2 values against each other before you read the EUR. The pooled curve fits its own cloud at 0.86; re-fitted onto one member with b held at 0.05, it fits that member's history at 0.999. A borrowed shape can hug a history almost perfectly.

The EUR tile from that match reads 91524.2759502962 stb. The panel shows Ekene-6's true closed-form EUR of 105266.626461929 stb beside it, and the percentage difference, -13.0548028121742 percent, which is 13742.3505116328 stb of oil.

The graded field asks for the type-curve EUR of 91524.2759502962. The trap is submitting 105266.63 because it is the better number and it sits on the same panel. The capstone is testing whether you can report what a method produced while knowing it is wrong by 13 percent, which is exactly the situation a borrowed curve puts you in on a well with no history to check against.

## Where the other four come from

**Ekene-6's windowed Di.** Module 2 lesson 3. Fit explorer, well Ekene-6, window Primary, model Auto: read the $D_i$ tile. The graded tolerance of 0.00002 is tight enough that fitting the full history instead fails the field outright, which is the entire point of the module.

**Ekene-1's full-history R2.** Module 2 lesson 2. Same panel, well Ekene-1, window Full history, model Auto. You are asked to report the goodness of fit of a fit you have been taught to reject, so read the R2 tile and submit it as it stands. Note while you are there that the same fit pins b at the search ceiling and returns a $q_i$ below the well's first recorded rate: those are the symptoms, the R2 is merely the number.

**The field total.** Module 5 lesson 2. Add the four closed-form EURs at the 10 stb/d limit: four values, three additions, no engine required. The roll-up total from the four saved scenarios also passes inside the 2000 stb tolerance, and you should be able to say which you entered and why they differ.

## Submitting

The capstone form sits under the course on the Learning Mode page. Enter the six values at whatever precision you carried and submit; grading is server-side against engine truth within the stated tolerances, and you see which fields passed.

A failure here is almost never a rounding problem. Each field has a characteristic way of going wrong: the wrong grid neighbour on b, a units slip on an EUR, the wrong window on a Di, the windowed fit reported where the naive one was asked for, the true EUR reported where the type-curve EUR was asked for, and a stale scenario in a total. Work out which of those you did before you touch a decimal place.

## Exercise

For each of the six graded fields, write down the most plausible way to produce a wrong answer that still looks reasonable, and the check that catches it. Then make two of those mistakes deliberately in the panels: fit Ekene-6 on the full history and compare the $D_i$ tile against the primary-window value, and apply the pooled type curve to Ekene-3 instead of Ekene-6 and watch which tiles move. Predict the direction of each change before you click.
