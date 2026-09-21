# The redundant simplified forms

{{panel:lp-sif-builder}}

Once a subsystem has more than one channel, its simplified form carries two pieces: a term for channels failing independently and a term for one cause taking them all out together. The second piece is the beta factor term, and on a real channel it usually decides the answer. This lesson sets all five simplified forms side by side on one channel so the shapes can be compared directly.

## The forms, as the engine writes them

In the forms below b is the beta factor and T is the proof test interval, which is how the engine writes them. The EKULAMA channel is used throughout at lambdaDU 1.2e-6 per hour, T1 of 8760 hours, a beta factor of 0.05 where the architecture takes one, no detected failures and no mean repair time after a test.

| architecture | simplified form | PFDavg | RRF | SIL |
| --- | --- | --- | --- | --- |
| 1oo1 | lambdaDU T / 2 | 0.005256000000 | 190.258752 | 2 |
| 1oo2 | ((1 - b) lambdaDU T)^2 / 3 + b lambdaDU T / 2 | 0.000296042728 | 3377.890772 | 3 |
| 2oo2 | lambdaDU T | 0.010512000000 | 95.129376 | 1 |
| 2oo3 | ((1 - b) lambdaDU T)^2 + b lambdaDU T / 2 | 0.000362528185 | 2758.406219 | 3 |
| 1oo3 | ((1 - b) lambdaDU T)^3 / 4 + b lambdaDU T / 2 | 0.000263048981 | 3801.573360 | 3 |

## Reading the shapes

Three things fall out of the table at a glance. The redundant forms square or cube the independent rate, so they reward redundancy hard while that term dominates. Every redundant form carries the same beta factor term, b lambdaDU T divided by two, which is a single channel term that no amount of voting removes. And the 2oo2 is worse than the 1oo1, at 0.010512000000 against 0.005256000000, because a 2oo2 needs both channels working to act and so fails on the first dangerous failure of either.

## The engine reproduces every one

The engine implements only the full Annex B equations. Run on this channel with no detected failures and no mean repair time after a test, it reproduces all five simplified forms to machine precision, with a relative difference of 0 on every row. That is a check worth knowing about, because it means learning the simplified shapes teaches you the engine's behaviour in the corner where the two agree.

## What the beta factor term costs

Put the 1oo2 beside the 1oo1. The single channel returns 0.005256000000 and the pair returns 0.000296042728, a gain of roughly a factor of eighteen. Without the beta factor term the squared independent piece alone would give far more, and the beta factor term of b lambdaDU T divided by two sets the floor the pair cannot beat.

## A beta factor has to be typed

For any redundant architecture the engine will not proceed without a beta factor. There is no default and there is no silent zero, because a beta factor of zero is a claim that no single cause can take out every channel, and a claim that strong has to be made deliberately by the analyst who signs the calculation. A 1oo1 has no second channel for a common cause to reach, so a beta factor typed on a 1oo1 call is ignored with a warning, and the same holds for a 2oo2 for a different reason that the common cause module takes up.

## Exercise

Compute the beta factor term b lambdaDU T divided by two for this channel at a beta factor of 0.05, using lambdaDU T of 0.010512000000. Set your figure beside the 1oo2 PFDavg of 0.000296042728 and state what share of that total the common cause piece accounts for.
