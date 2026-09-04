# A missing exponent read as zero

`annualEffectiveDecline` chooses its form with `if (modelType === 'Exponential' || !b)`. `!NaN` is true, so a hyperbolic fit whose exponent came back unusable returns the exponential answer and says nothing.

{{panel:pd-reading-explorer}}

## What the clause decides

Three branches. `modelType === 'Exponential' || !b` takes the exponential form, `modelType === 'Harmonic' || b === 1` takes the harmonic form, and everything else takes the hyperbolic form. The exponent is the only thing separating them once the model type is not stated outright.

The golden publishes five cases. At a nominal decline Di of 0.0015 per day, b of 0 and model type Exponential gives an effective decline of 42.160601062199 per cent over the first year. The same Di at b of 0.5, model type Hyperbolic, gives 38.364403131474 per cent. At b of 1, model type Harmonic, it gives 35.379644588045 per cent.

## The spellings of a missing exponent

Derived, all at Di 0.0015 per day with model type stated as Hyperbolic.

| b | Effective decline, per cent over a year |
| --- | --- |
| 0.5 | 38.364403131474 |
| NaN | 42.160601062199 |
| null | 42.160601062199 |
| undefined | 42.160601062199 |
| the string "0.5" | 38.364403131474 |
| 1e-9 | 42.160603673675 |

The three unusable spellings all return 42.160601062199 per cent, which is exactly the published exponential answer at that Di. A string exponent, meanwhile, coerces and works. The one input shape a reader would call broken produces a plausible number and the one they would call sloppy produces the right one.

## A negative exponent is not refused either

`(1 + b Di t) ** (-1/b)` at b of -0.5 raises a negative bracket to the power 2, which is an ordinary positive number. At Di of 0.01 per day the bracket is -0.825000000000, the exponent is 2.000000, and the function returns 31.937500000000 per cent. At Di of 0.005 per day the bracket is 0.087500000000 and it returns 99.234375000000 per cent. A physically impossible exponent yields a percentage a reader can act on.

## What is guarded, and it is guarded properly

Di is checked. Di of 0, of -0.001, of NaN and of null all return null and refuse. Di of 1e-9 returns 0.000036499990 per cent, which is small and honest. The guard exists in the same function as the clause that has no guard at all.

## The mistake

Reading 42.160601062199 per cent off a run whose model type says Hyperbolic and recording it as a hyperbolic result. It is the exponential answer at that Di, reached because the exponent was falsy, and the return carries no flag distinguishing it from the case where b was genuinely zero.

## Exercise

Set the model type to Hyperbolic in the panel and run Di 0.0015 per day at b of 0.5, then at NaN, then at 0.

Then say which two of the three returned the same number and what a reader would have to check outside the return to tell them apart.
