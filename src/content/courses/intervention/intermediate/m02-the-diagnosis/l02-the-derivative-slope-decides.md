# The derivative slope decides

The mechanism is chosen by one number. `derivativeSlope` is compared against two thresholds, and the ratio slope sitting beside it in the same object is never consulted.

{{panel:pd-channel-explorer}}

## The two comparisons

`coningSlope` is -0.1 and `channellingSlope` is 1.3. Both are overridable defaults, and both are round on purpose: they are boundaries between pictures rather than measurements. A derivative slope below -0.1 reads coning. A derivative slope above 1.3 reads channelling. Between them the reading is ordinary displacement.

## Where the two slopes disagree

The golden publishes four labelled histories of 40 samples each, from 10.000000 to 3000.000000 days. Read at the default `lateFraction` of 0.5, which opens the window at t = 186.345364 days, they come back like this. No golden asserts a mechanism, so these are the classifier's own:

| History | Ratio slope | Derivative slope | Engine mechanism |
| --- | --- | --- | --- |
| channelling | 1.600000000 | 1.600000000 | channelling |
| coning | 0.230022389 | -0.539955222 | coning |
| displacement | 1.000000000 | 1.000000000 | displacement |
| flat | 0.000000000 | n/a | displacement |

The coning row is the one to hold onto. Its ratio is still climbing, at a slope of 0.230022389 with a fit quality of 0.930741260 as a fraction, and the verdict is coning anyway, because the derivative over the same 20 samples falls at -0.539955222. A reader watching only the ratio would say the water is still getting worse.

Teaching well ELELENWO-4, a case designed for this course rather than published, makes the same point the other way. At the default window its ratio slope is 1.040602176, which sits well below 1.3, while its derivative slope is 1.442132492, which sits above it. The ratio argues displacement and the derivative wins.

## What the engine concedes about that

The note the reading carries says it plainly: for any power-law history the ratio and its derivative have the same log-log slope, so nothing separates displacement from channelling except how steep the climb is. On the published channelling and displacement histories the two slopes are identical to the digit. The separation the classifier depends on is the one case where the shapes are not power laws.

## The flat row, and what it proves

The flat history returns mechanism displacement with no derivative fit at all: n = 0 samples, no slope, no fit quality, no span. A mechanism was still named. A returned mechanism is not evidence that a slope was measured.

## The mistake

Averaging the two slopes, or reporting whichever one is more comfortable. They answer different questions on different samples, and only one of them was compared against a threshold.

## What it refuses

Nothing on the ratio side. There is no test that the two slopes agree, no flag when they differ by 0.401530316 as they do on the teaching well, and no field in the object that reports the disagreement.

## Exercise

Read the published coning history at the default window and record both slopes.

Then say which one produced the verdict, and what the other one would have said on its own.
