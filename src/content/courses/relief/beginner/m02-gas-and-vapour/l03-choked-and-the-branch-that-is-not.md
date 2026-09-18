# Choked, and the branch that is not

{{panel:fc-sizing-explorer}}

This is the lesson most likely to correct something you already believe. Almost everyone arrives expecting the outlet pressure to matter to the size of a relief valve. Across the lower part of a relief case's range it does not matter at all, and the engine shows you that in 6 rows.

## The evidence

The ORUBIRI load and valve, with the back pressure at the valve outlet walked as a fraction of the relieving pressure so no row carries a pressure of its own. The engine returns a critical ratio of 0.551208 for this gas, and the two rows closest together are placed either side of it on purpose.

| back pressure ratio (stated) | branch | required area in2 | F2 where subcritical |
| --- | --- | --- | --- |
| 0.100000 | critical | 2.223779 | n/a |
| 0.200000 | critical | 2.223779 | n/a |
| 0.300000 | critical | 2.223779 | n/a |
| 0.400000 | critical | 2.223779 | n/a |
| 0.500000 | critical | 2.223779 | n/a |
| 0.551207 | critical | 2.223779 | n/a |
| 0.551209 | subcritical | 2.224962 | 0.698520 |
| 0.600000 | subcritical | 2.237461 | 0.735763 |
| 0.700000 | subcritical | 2.352545 | 0.808025 |
| 0.800000 | subcritical | 2.658695 | 0.875668 |
| 0.900000 | subcritical | 3.504623 | 0.939468 |

In choked flow the required area does not move with the back pressure at all. Read the first 6 rows: the area is identical across every one, because once the downstream pressure is low enough the flow through the throat is set entirely by the upstream condition. That is the whole meaning of choked, and it is live behaviour of the shipped studio rather than a simplification made for teaching.

Above the critical ratio the area does move. The last critical row sits at 0.551207 and the first subcritical one at 0.551209, a millionth either side of the crossing, and across that millionth the area goes from 2.223779 in2 to 2.224962 in2. The branch changes and the answer does not jump. Keep walking and the movement gets steep, 2.237461 in2 by 0.600000.

## What the flat part is worth knowing

Two practical readings come out of that flatness. The first is that on a choked case, arguing about the header pressure is arguing about something the size does not depend on. The second is the reverse, and it catches people: once a case is subcritical the header pressure is part of the sizing answer, so a header modification can invalidate a valve that was adequate.

Do not divide one subcritical area by another and call the quotient how the branch behaves. The digest prints no ratio between those rows, so nothing stands behind such a number.

## A typed factor that is ignored, and the engine says so

The balanced bellows factor Kb is a chart input. In choked flow it divides the area, so it changes the answer. Above the critical ratio the subcritical equation has no Kb in it at all, and the engine tells you so rather than leaving it to be discovered.

| branch | back pressure ratio (stated) | Kb (stated) | required area in2 | warning |
| --- | --- | --- | --- | --- |
| critical | 0.200000 | 1.000000 | 2.223779 | no |
| critical | 0.200000 | 0.720000 | 3.088582 | no |
| subcritical | 0.800000 | 1.000000 | 2.658695 | no |
| subcritical | 0.800000 | 0.720000 | 2.658695 | yes |

The two subcritical rows are identical to twelve decimals, 2.658695041098 in2 and 2.658695041098 in2, and the second carries the engine's own words: `subcritical flow uses F2, not Kb; the typed Kb was ignored`. The two choked rows are not identical, 2.223779 in2 and 3.088582 in2, because there Kb divides.

A separate warning fires on the chart Kb itself once the back pressure ratio passes 0.300000000000, which is the point past which a balanced bellows valve needs its published chart factor. Kb is a typed input in this course: a chart, and nothing graded here rests on its value.

## Exercise

Write down the required area at the four lowest back pressure ratios and say what changed between them. Then explain, in one sentence each, why a typed Kb moves the answer on one branch and is ignored on the other.
