# Smaller than the noise

Sweep the speed on ODUMA-4 and the rod loading dips at 10.6 spm. The dip is 1.470226 percentage points. It is not an optimum, and this lesson is why.

{{panel:pd-balance-explorer}}

## The dip, as the solver printed it

The speed sweep runs at the shipped 120 node grid and every row reports converged. Four contiguous rows carry the whole story.

| Speed, spm | Worst section loading, percent |
| --- | --- |
| 10.2 | 85.051352 |
| 10.4 | 89.649462 |
| 10.6 | 88.179235 |
| 10.8 | 97.785820 |

The loading rises, falls back by 1.470226 percentage points, then jumps. Read on its own that is a design result: run at 10.6 spm and buy back a point and a half of rod loading for nothing.

## The same number with the well held still

Now hold the speed and move only the node count. Nothing about the well changes down these rows, and the loading is computed the same way in both sweeps.

| Nodes | Loading at 10.4 spm | Loading at 10.6 spm | Loading at 10.8 spm |
| --- | --- | --- | --- |
| 60 | 86.370126 | 88.096996 | 93.991728 |
| 120 | 89.649462 | 88.179235 | 97.785820 |
| 240 | 90.335925 | 88.650937 | 99.668360 |
| 480 | 90.544382 | 88.785732 | 99.261999 |
| 960 | 90.089054 | 87.849399 | 99.756606 |
| 1920 | 90.653801 | 88.058831 | 100.545612 |

The spread is 4.283675 percentage points at 10.4 spm, 0.936333 at 10.6 spm and 6.553883 at 10.8 spm.

## The refusal

The dip is 0.343216 times the node spread at the row before it and 0.224329 times the spread at the row after it. A grid parameter that changes nothing about the well moves this number further than the speed change does. So the dip is not a result. It is not a small result, or a marginal one, or one that needs confirming. There is nothing in it to confirm.

Note what the comparison is not. It does not claim the coarse answer is wrong and the fine one right. Both sweeps compute the same quantity, and one of them varies a parameter with no physical content and still moves it further.

## What survives and what does not

The plunger stroke on this well moves 0.044644 percent across the same six node counts. Any reading built on the stroke, including the swept and produced rates, survives the grid. Any reading built on the load extremes has to clear the node spread first, measured at the speed being read, because that spread is 0.936333 points at one speed and 6.553883 at another.

## Exercise

Read the loading at 10.4, 10.6 and 10.8 spm, then read it at 10.6 spm on 60, 240 and 1920 nodes.

Write one sentence stating whether 10.6 spm is an optimum, and name the number that settles it.
