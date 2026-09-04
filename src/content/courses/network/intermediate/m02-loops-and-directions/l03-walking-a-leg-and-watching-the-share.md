# Walking a leg and watching the share

Change one conductance on one leg of a loop, solve again, and read six things that moved. Only one of them was touched.

{{panel:pd-network-explorer}}

## The walk

A derived sweep on the published `looped` inputs, holding the wells, the separator at 200 psia and every other branch fixed, moving only the midpoint leg. Sweep points are not published cases. The 220 row is the published condition.

| Midpoint leg, lb/d per root psi | Header, psia | Midpoint, psia | Direct leg, lb/d | Midpoint leg, lb/d | Midpoint share, percent | Delivered, lb/d |
| --- | --- | --- | --- | --- | --- | --- |
| 60 | 949.106108 | 920.294335 | 4926.564514 | 1610.297987 | 24.634111 | 6536.862501 |
| 100 | 822.200173 | 759.980156 | 4489.909309 | 2366.389984 | 34.514100 | 6856.299293 |
| 220 | 621.148551 | 473.868277 | 3693.942751 | 3640.772531 | 49.637544 | 7334.715282 |
| 340 | 543.931055 | 350.553477 | 3338.168088 | 4171.808000 | 55.550217 | 7509.976087 |
| 500 | 502.317598 | 280.025247 | 3129.710878 | 4472.841563 | 58.833419 | 7602.552441 |
| 800 | 476.212272 | 234.053568 | 2991.534324 | 4668.434789 | 60.945870 | 7659.969113 |

## What moved that nobody touched

The direct leg fell from 4926.564514 lb/d to 2991.534324 lb/d with nothing done to it. The header, which is what the wells feel, fell from 949.106108 psia to 476.212272 psia, and delivered rose from 6536.862501 lb/d to 7659.969113 lb/d. A loop leg is not a private pipe.

## The share flattens and the total flattens with it

Going from 60 to 100 lb/d per root psi moves the share from 24.634111 to 34.514100 percent. Going from 500 to 800, a far larger step in conductance, moves it from 58.833419 to 60.945870 percent. Delivered does the same: 6536.862501 to 6856.299293 lb/d over the first step, 7602.552441 to 7659.969113 lb/d over the last.

The midpoint route is the b3 feed at 300 lb/d per root psi and then this leg, in series. Once the walked leg stops being the tight part of that route, spending more on it buys almost nothing, and the b3 feed was never touched.

## The mistake

Debottlenecking a loop by upsizing the leg somebody complained about. The number worth acting on is not that leg's own conductance but where the route it belongs to stops being tight, and on this walk the tight part stopped being the walked leg well before 800.

## What the flag says and what it does not

Every row was returned by a solver reporting converged. On the published condition that is converged = true in 6 iterations at a reported residual of 3.6364e-7 lb/d. `solveNetwork` never calls `checkConservation`, so a converged flag on a sweep row speaks about the iteration and not about the mass in the answer. The independent referee, which does compute a gap, reports 2.5057e-9 lb/d on its own solve of that condition.

## Exercise

Reproduce two rows of the walk, one from each end. Record the direct leg flow in both, and say which row would justify spending money.
