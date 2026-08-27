# The b ceiling alarm

This is the most useful single diagnostic in the module, and it takes five seconds to read. When a fit comes back with $b$ at or beside the top of the search range, the fit is telling you that the model is wrong. It is not telling you the well has a fat tail. Learning to hear the difference is what this lesson is for.

{{panel:dca-fit-explorer}}

## Where the ceiling actually sits

Lesson 2 established the grid: start at 0.05, add 0.05, stop when the value would exceed `maxB`. With the default `maxB` of 2, the accumulated sequence reaches 1.950000000000001 and the next value is 2.000000000000001, which fails the test. So $b = 2$ is never evaluated. The highest exponent the engine can ever report from the grid is **1.950000000000001**, which the fit report rounds to 1.95.

That number is your alarm. A reported $b$ of 1.95 does not mean the optimizer chose 1.95 from a range of possibilities. It means the optimizer wanted more and ran out of range.

## The four Ekene producers, fitted naively

Set the panel to Full history and Auto-Select, and walk the four wells. This is the fit an analyst produces when nobody has told them about the waterflood.

| Well | model | qi (stb/d) | Di (per day) | b (raw) | R2 | tier |
|---|---|---|---|---|---|---|
| Ekene-1 | Hyperbolic | 97.2058663778433 | 0.00196150586036441 | 1.950000000000001 | 0.818388421218434 | Fair |
| Ekene-3 | Hyperbolic | 134.237029542021 | 0.00374899598601156 | 1.950000000000001 | 0.899873903499416 | Fair |
| Ekene-5 | Hyperbolic | 71.9031304250764 | 0.000538961863807783 | 1.5000000000000007 | 0.732769191334589 | Poor |
| Ekene-6 | Hyperbolic | 87.9980156583808 | 0.000960001821405101 | 1.3500000000000005 | 0.780507944377468 | Poor |

Two wells pinned flat against the ceiling, and the other two high in a range that no primary-depletion oil well has any business occupying. The planted exponents are 0, 0.5, 1 and 0.35.

Ekene-1's R2 of **0.818388421218434** is the value the Professional capstone asks you to read back, so obtain it deliberately at least once. Select Ekene-1, set the window to Full history so all 72 monthly rows from 2020-01-01 to 2025-12-01 are in scope, leave the model on Auto-Select and leave the constraints at their defaults. The reported fit is the first row of the table above, and the R2 tile reads 0.818388421218434.

## Why b runs to the ceiling

The waterflood, which module 2 takes apart properly, makes the late history flatter than any decline and eventually makes it rise. Within the Arps family, flatness is bought in exactly one way: raise $b$. The optimizer is not confused and it is not broken. It is doing precisely what it was asked, over data it should never have been given, and it spends the only parameter that can help until that parameter runs out.

You can watch it happen one month at a time. Fit Ekene-1 with Auto-Select from 2020-01-01 and walk the end date forward:

| window end | rows | model | b | R2 |
|---|---|---|---|---|
| 2022-12-01 | 36 | Exponential | 0 | 1.00000000000000 |
| 2023-01-01 | 37 | Exponential | 0 | 1.00000000000000 |
| 2023-03-01 | 39 | Hyperbolic | 0.05 | 0.999812532094246 |
| 2023-06-01 | 42 | Hyperbolic | 0.15000000000000002 | 0.998661525861795 |
| 2023-12-01 | 48 | Hyperbolic | 0.7500000000000001 | 0.977409843483430 |
| 2024-06-01 | 54 | Hyperbolic | 1.5000000000000007 | 0.929065839326637 |
| 2025-12-01 | 72 | Hyperbolic | 1.950000000000001 | 0.818388421218434 |

$b$ climbs monotonically toward the ceiling as the contaminated rows accumulate, and R2 falls the whole way. Stop at the third row. Two extra monthly rows past the correct boundary and the well has already changed family, from Exponential at R2 exactly 1 to Hyperbolic at 0.9998, and nothing in that report looks wrong. The Professional habit is to notice that the answer to "which family is this well?" moved at all.

## The three-part alarm

When you see a high $b$, run these three checks in order. On the naive Ekene-1 fit, all three fire.

**Is $b$ at or adjacent to the ceiling?** 1.950000000000001 is the top rung. Yes.

**Is the fitted $q_i$ below the well's actual opening rate?** The fit says 97.2058663778433 stb/d. Ekene-1's first row is 120 stb/d exactly. A fit that cannot reproduce the rate you actually measured on day one is describing a different well. That is 18.9951113517972 percent low. Yes.

**Is R2 far below what a single-regime window gives?** The primary window gives 1.00000000000000. The full history gives 0.818388421218434 and a Fair tier. Yes.

Any one of the three is worth a second look. All three together mean the window is wrong, and no amount of parameter tuning will fix it.

## The trap: constraining b is not a fix

The obvious move, once you have seen a $b$ of 1.95, is to tighten `maxB` and refit. Do it on Ekene-1's full history and watch what you get.

Set `maxB` to 1.0 and Auto-Select returns Harmonic, $q_i$ 88.2403213595711 stb/d, $D_i$ 0.000924465609791911 per day, R2 0.805676381435128. Set `maxB` to 1.5 and force Hyperbolic and you get $b$ 1.4500000000000006 at R2 0.809309589113655, pinned against the new ceiling exactly as it was pinned against the old one.

The constraint did not improve the description of the well by any measure, and R2 got slightly worse. What it did was silence the alarm. A $b$ bound is a governance instrument for policing legitimate fits of a single regime; applied to a fit whose window spans two drive mechanisms, it is a filter that hides the evidence. The fix for a ceiling $b$ is never a tighter ceiling. It is a correct window, and that is the whole of module 2.

## What the ceiling fit books

Booked at a 10 stb/d limit through the hyperbolic closed form, the naive Ekene-1 fit returns 400406.400714940 stb against the well's true 91666.6666666667 stb, an overstatement of 336.806982598116 percent. The same exercise gives 406646.329664377 stb for Ekene-3, 448652.825376077 for Ekene-5 and 298759.978747020 for Ekene-6. Nobody signs those numbers when they are presented as a four-fold reserves increase. Presented as "the software's best fit to all available data", they get signed.

## The misconception to retire

"A high $b$ is good news, because it means a longer tail and more reserves."

A high $b$ that survives a correct window, a defended regime and a governance review is a physical statement about flow behaviour. A high $b$ produced by a window containing a regime change is an artefact of an optimizer with one degree of freedom left. They look identical in the fit report and mean opposite things, and the only way to tell them apart is to know what happened to the well.

## Exercise

Fit Ekene-3 over its full history with Auto-Select and read the R2 tile. Compare it with the other three naive R2 values in the first table and identify which well produces the highest R2 from a completely invalid fit. Then answer this in writing: if you sorted a hundred-well portfolio by naive full-history R2 and reviewed the worst twenty by hand, which of the four Ekene producers would escape your review, and what does that say about R2 as a screening statistic for regime changes?
