# The pad fraction trap

The pad fraction is not one minus the efficiency, and the difference is large enough to ruin a job.

{{panel:st-pack-explorer}}

## The two forms

The correct pad fraction is

    f_pad = (1 - eta) / (1 + eta)

The form people reach for from memory is one minus eta, on the reasoning that the fraction of fluid lost must be the fraction of the job spent on pad. That reasoning is wrong, and it fails in a fixed direction: because eta is positive, dividing by one plus eta always makes the answer smaller, so the naive form is always the larger of the two. It never errs towards too little pad.

## The published gap

At the published conditions the efficiency is 0.1728566723633056. The correct pad fraction is 0.7052381992848291. One minus efficiency is 0.8271433276366944. The gap is 0.12190512835186529 of the pump time.

The pump time is fixed by the material balance, so every unit of time added to the pad is taken from the ramp, and the placed mass is proportional to the ramp time.

The correct pad leaves the ramp with whatever is left after 0.7052381992848291 of the pump time. The naive pad leaves it exactly the efficiency, 0.1728566723633056 of the pump time, since one minus one minus eta is eta. Divide the second by the first and you have the fraction of the planned proppant that still gets pumped. It is well under two thirds.

## How the gap moves with efficiency

The gap is zero at both ends of the range and largest in the middle.

| leakoff coefficient | efficiency | correct pad fraction | one minus efficiency | gap |
|---|---|---|---|---|
| 0 | 1 | 0 | 0 | 0 |
| 0.000025 | 0.6326359683290029 | 0.22501282514741658 | 0.36736403167099707 | 0.1423512065235805 |
| 0.00005 | 0.39582605426929196 | 0.4328432929610202 | 0.604173945730708 | 0.17133065276968784 |
| 0.0001 | 0.1728566723633056 | 0.7052381992848291 | 0.8271433276366944 | 0.12190512835186529 |
| 0.0002 | 0.054451800554703535 | 0.8967201715127071 | 0.9455481994452964 | 0.048828027932589335 |
| 0.0004 | 0.01460645625334061 | 0.9712076418135991 | 0.9853935437466594 | 0.014185901933060352 |

At perfect efficiency both forms give no pad, so there is nothing to disagree about. At very poor efficiency both give almost all pad, so the disagreement has no room left. The worst case sits at moderate efficiency, near the 0.39582605426929196 row, which is the range ordinary treatments live in.

## What the error does in the field

Too much pad is not a safe error. The extra clean fluid drives the fracture beyond the point the proppant will ever reach, so the far part of the created length closes unpropped and contributes nothing, and the short ramp leaves a thin pack behind it.

The job comes back with a long created length, a short propped length, less mass than the plan, and a treating record that looks entirely normal. Nothing screens out and nothing alarms. The well simply underperforms, and the reason is one missing denominator.

## Exercise

Take the 0.00005 row and work both pad fractions on paper, then convert each to a pad volume at 0.053 m3/s using the pump time from the panel.

State the ratio of the two ramp times and say what it does to the placed mass.

Then say why an engineer who only works very high leakoff jobs could use the naive form for years without being caught.
