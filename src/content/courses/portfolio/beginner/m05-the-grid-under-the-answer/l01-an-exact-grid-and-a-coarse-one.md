# An exact grid and a coarse one

The optimizer counts capex in cells, and the size of a cell decides whether the answer is exact or approximate. When the limit and every candidate capex are whole numbers and the limit is at most 5000, a cell is 1 million USD; otherwise a cell is the limit divided by 2000.

{{panel:ec-capital-explorer}}

## The exact grid on OKONO

Every OKONO capex is a whole number of million USD, from 60.0000 for OK-5 to 310.0000 for OK-6, and every limit run on it is whole and far under 5000. The engine reports a resolution of 1.0000 at each of the five limits from 300.0000 to 1000.0000, and overLimit reads false at every one. On this grid a project weighs exactly its capex in cells, so the knapsack solves the real question: the 450.0000 answer of OK-1, OK-3 and OK-4 at 291.0000 is the true optimum.

## When the grid turns coarse

The coarse grid is limit / 2000 per cell, and each project weighs max(1, round(capex / cell)) cells. The limit is then always 2000 cells, and each capex is rounded to the nearest cell. Two published cases reach it by different doors.

| case | limit | resolution | engine set | capex | EMV | gap (golden) |
| --- | --- | --- | --- | --- | --- | --- |
| rawDollars | 450000000.0000 | 225000.000000 | A + B + D | 450000000.0000 | 250.0000 | 0.0000 |
| nonIntegerLimit | 450.5000 | 0.225250 | A + B + D | 450.0000 | 250.0000 | 0.0000 |

In rawDollars the capexes are entered in whole USD, A at 100000000.0000 and B at 200000000.0000, so the limit is far over 5000 and the cell is 450000000.0000 over 2000, which is 225000.000000. In nonIntegerLimit the money is in million USD, but the limit of 450.5000 is not a whole number, so the cell is 450.5000 over 2000, which is 0.225250. Both land on A, B and D at an EMV of 250.0000, matching the exact optimum, and the golden gap is 0.0000 in each.

## Coarse is not wrong, only unproven

A coarse grid can still give the exact answer, and both of these cases do. Once capexes are rounded to cells, though, the knapsack is solving a nearby problem, and a set that fits in cells may cost a little more or a little less than the limit in money. On a coarse grid the answer must be checked against the limit in money every time.

## The mistake

The quiet mistake is a unit slip. An inventory typed in raw dollars, or a limit typed as 450.5000 to leave a little headroom, moves the whole solve from the exact grid to the coarse one without any change to the projects. Both published answers look identical, which hides it. The grid matters whenever capexes do not divide evenly into cells.

The second mistake reads resolution as precision in value. It is a capex cell in the money units entered, 225000.000000 USD in one case and 0.225250 million USD in the other.

## What it refuses

The engine chooses the grid from the inputs; it offers no finer grid on request. The Suite now shows the resolution and the overshoot flag on screen.

## Exercise

For rawDollars and nonIntegerLimit, say which condition sends each to the coarse grid and show the cell size as limit over 2000. Then give OKONO's resolution at 450.0000 and explain why its answer involves no rounding.
