# The step, and what it costs

The one numerical knob, and how to tell when it matters.

{{panel:td-friction-explorer}}

## The knob

The engine resamples the survey onto a fine grid and marches up it. The grid spacing is `stepM`, and it defaults to 10 m.

That is the only discretisation in the model. Everything else is closed-form arithmetic on each interval.

## Why refine it

Because the recursion is an approximation to an integral. Over each interval the engine uses one attitude, one weight and one tension for the whole interval, corrected by a midpoint predictor. The finer the interval, the smaller that error.

## What it actually costs

Take the horizontal well, tripping in, and halve the step repeatedly:

| step | hookload | less the independent oracle |
|---|---|---|
| 10 m | -16676.68507494847 N | 1196.6856587605325 N |
| 5 m | -17264.465825528852 N | 608.9049081801495 N |
| 2 m | -17618.990599018114 N | 254.38013469088764 N |
| 1 m | -17738.03469206841 N | 135.33604164059216 N |
| 0.5 m | -17797.58310676321 N | 75.787626945792 N |
| 0.25 m | -17827.43290924444 N | 45.937824464563164 N |

Each halving roughly halves the error. That is first-order convergence, and it means the answer at 10 m is about a kilonewton away from the converged one on this case.

## And what it does not cost

Now take the slant well, rotating on bottom:

| step | hookload | less the oracle |
|---|---|---|
| 10 m | 730840.7115634655 N | -31.824017251492478 N |
| 5 m | 730840.0915648093 N | -32.44401590770576 N |
| 2 m | 730839.91796583 N | -32.617614887072705 N |
| 1 m | 730839.8931660198 N | -32.6424146972131 N |
| 0.25 m | 730839.8854161154 N | -32.650164601625875 N |

The hookload itself moves by less than a newton across the whole refinement. It has converged at 10 m and stays there.

So the step matters a great deal on one case and not at all on another, and the difference is which case has a string in compression through a curve.

## The rule

Refine the step when the answer is near a sign change, near a buckling threshold, or in a section where the string is in compression. Leave it at 10 m otherwise.

And whenever a number is going to be relied on, refine once and check it moved by less than you care about. That takes one run and it is the only honest way to know.

## The residual you cannot refine away

Notice the slant well converged to -32.65 N rather than to zero. That gap is not discretisation, because refining does not touch it. It is a difference between two implementations of the model, and module 5 of the Professional tier is where this course establishes which one is right.

## Exercise

Run the panel's oracle view on the horizontal well tripping OUT rather than in.

Confirm the error halves with the step there too, note that it does so from the other side, and say why an operation that puts the string in tension converges to a smaller absolute error than the same well in compression.
