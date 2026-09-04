# What one well cannot tell you

The rate a well makes is not a property of the well. Every single-well study is run against a wellhead pressure somebody typed in, and on a real gathering system nobody types that pressure.

{{panel:pd-trunk-explorer}}

## The same four wells, twice

| Well | Alone, lb/d | On the system, lb/d | Lost, percent | Wellhead rise, psi |
| --- | --- | --- | --- | --- |
| t1, AGBADA-2 | 6890.874160167 | 6004.874117054 | 12.857585591 | 364.386971 |
| t2, AGBADA-6 | 3057.021085629 | 2318.356346320 | 24.162893177 | 485.665999 |
| t3, AGBADA-9 | 4750.157046765 | 3992.446687538 | 15.951269648 | 347.691369 |
| t4, AGBADA-12 | 985.000000000 | 985.000000000 | 0.000000000 | 527.461813 |

Nothing about any well changed. The reservoir pressures, the qmax values and the flowline conductances are the same in both columns. What changed is that the other three wells arrived, the header rose, and every wellhead had to rise with it.

## Four wells that add up to less than themselves

The four solo rates add to 15683.052292561 lb/d. The system produces 13300.677150912 lb/d. The network costs 2382.375141650 lb/d, which is 15.190761959 percent, and no amount of single-well work recovers that number, because a solo run never sees the header.

AGBADA-12 loses nothing because its allocation holds it at 985.000000000 lb/d in both columns. Its wellhead still rose 527.461813 psi, the largest rise of the four, and its flowline passes 640.000000000 lb/d of the 985.000000000 lb/d it is credited with.

## Two rankings that are not the same ranking

By percentage lost: t2 at 24.1629, t3 at 15.9513, t1 at 12.8576 and t4 at 0.0000 percent. By rate on the system: t1 at 6004.8741, t3 at 3992.4467, t2 at 2318.3563 and t4 at 985.0000 lb/d.

AGBADA-6 gives up the largest share of itself while making the second least on the system, and AGBADA-2 makes the most while giving up 12.857585591 percent. A well with little margin over the header has the least to give when the header rises, and an allocation meeting that ranks by rate never sees it.

## What the system answer was checked against

The solve reports `converged: true` in 11 iterations with a reported residual of 1.546141e-11 lb/d and `pinned: t4`. `checkConservation`, on that same answer, reports produced 13300.677150912 lb/d against delivered 12955.677150912 lb/d, a gap of 345.000000000 lb/d, relative 0.025938529000. Both columns of the comparison are real; the produced total carries a hole nothing in the solve reported.

## The mistake

Adding solo rates to size a facility. On these four that is 15683.052292561 lb/d against 13300.677150912 lb/d, and the error is in the direction that costs money.

## Exercise

Write the four wells in both rankings and name the one whose position moves most.

Then say which single number in the solo columns could have warned you, and why the answer is none of them.
