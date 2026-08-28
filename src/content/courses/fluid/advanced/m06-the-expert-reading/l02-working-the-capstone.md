# Working the capstone

Six numbers from the tuning, and the mistake most likely to produce a plausible wrong answer on each.

{{panel:fluid-tuning-explorer}}

## What you are given

The Good Oil Well No. 4 study: the eleven-component composition, the C7+ molecular weight of 218 and specific gravity of 0.8515, a reservoir temperature of 220 F and a bubble point of 2634.65 psia, and the optimum separator test at 100 psig and 75 F with its measured total gas-oil ratio of 768 scf/stb, stock tank gravity of 40.7 API and formation volume factor of 1.474 rb/stb.

Tune the four bounded knobs jointly against all four targets, with the stock tank stage at 75 F and 14.65 psia appended to the reported separator stage.

## Field 1: the tuned saturation pressure

The model's saturation pressure at 220 F AFTER the regression.

Two mistakes. Reporting the UNTUNED value of 2791.10 psia, which the Professional tier grades and which is the starting point rather than the result. And reporting the measured 2634.65, which is the target the fit was aiming at rather than what it achieved.

The check: it is close to the measurement but not equal to it, and it is slightly BELOW rather than above, because the tuned error is negative.

## Field 2: the tuned total gas-oil ratio

The separator train's total after tuning, in scf/stb.

Two mistakes. Omitting the stock tank stage, which is the classic error and pushes the answer well below the truth. And reporting the untuned 793.80, which is above the measurement rather than below it.

The check: the tuned value sits BELOW the measured 768, because the tuned error is negative, while the untuned value sat above it. If your answer is above 768 you have the untuned one.

## Field 3: the tuned stock tank gravity

The API gravity of the stock tank liquid after tuning.

Two mistakes. Reporting the untuned 31.81, which is nine API light. And reporting the target 40.7, which the fit does not reach.

The check: it is between the two, nearer the measurement, and about two API light.

## Field 4: the tuned volume shift knob

The value the regression lands on for sPlus.

Two mistakes. Reporting the UNTUNED characterized shift of 0.15389683656773767, which is where the regression started rather than where it finished. And reporting one of the multipliers, which are near one and are obviously a different kind of number once you look.

The check: it is smaller than the characterized starting value, because the untuned model's oil was too dense and the correction makes it lighter.

## Field 5: the tuned C1 to C7+ binary interaction parameter

The value the regression lands on for kC1.

The likely mistake is reporting a critical property multiplier instead. The two multipliers are near one; this one is a few hundredths, which is the ordinary scale for a hydrocarbon binary interaction parameter.

The check: it is a small positive number well under a tenth.

## Field 6: the residual reduction

The sum of squared residuals before the fit divided by the sum after.

Two mistakes. Reporting the difference rather than the ratio, which is a very small number and obviously not what a reduction factor looks like. And reporting the reduction in one target rather than in the objective, which mixes a per-target percentage with an aggregate.

The check: it is a ratio above one, in the twenties, and it is dimensionless.

## The general advice

Every field asks for a value AFTER the regression, and every likely mistake is the corresponding value BEFORE it, or the target it was aiming at. Three numbers exist for most of these quantities and only one of them is the answer.

Before submitting, for each field write down which of the three you have: untuned, measured, or tuned. That single check catches most of what goes wrong here.

## Exercise

First, for each of the six fields name the alternative value that would produce a plausible wrong answer, and say which of untuned, measured or tuned it is.

Second, two of the fields have a sign or direction check that distinguishes the tuned value from the untuned one. Name them and state the check.
