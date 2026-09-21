# Vertical and horizontal view factors

{{panel:cq-fire}}

A view factor depends on which way the target faces. A wall facing the fire and a roof lying flat beside it see the same flame at different angles and receive different shares of its heat radiation. The engine returns both orientations for every target, and this lesson reads them for an upright flame.

## Two orientations

Fv is the view factor of a vertical target facing the flame: a wall, a tank shell, a person standing upright and turned toward the fire. Fh is the view factor of a horizontal target at ground level facing upward: a roof, the ground itself, a person lying down. Both are computed at the same point, a small target at ground level at distance X from the axis of the flame base. Each is a pure number between zero and one, and each would equal one only for a target completely surrounded by flame. The Fv of 0.332171054250 at 15 m in the sweep below is the weighted share of that vertical target's view the flame fills.

## An upright flame, swept

A flame of radius 10 m and length 30 m (stated), at a tilt of 0 degrees, with targets swept from 15 to 120 m from the axis:

| distance from axis m, stated | Fv | Fh | Fmax |
| --- | --- | --- | --- |
| 15 | 0.332171054250 | 0.222949619043 | 0.400055173586 |
| 20 | 0.245031643354 | 0.145696203798 | 0.285075235764 |
| 30 | 0.150735942534 | 0.071282105127 | 0.166740705537 |
| 50 | 0.069804515030 | 0.021824698965 | 0.073136774631 |
| 80 | 0.029868910564 | 0.005919000622 | 0.030449735411 |
| 120 | 0.013574612722 | 0.001779114747 | 0.013690703409 |

View factors are quoted at twelve decimals, the precision the engine prints and this course grades.

## Fh falls faster than Fv

Close to the fire, at 15 m, Fh is 0.222949619043 against an Fv of 0.332171054250, the same order of size. At 120 m Fh is 0.001779114747 against 0.013574612722, a small fraction of it. The reason is geometry. A horizontal target looks up, and it sees the flame only at a grazing angle once the flame is far away, while a vertical target still faces it squarely. Far from a fire, the vertical view factor carries almost all of the exposure; near it, the horizontal one adds a large share. The exercise asks you to measure that shift for yourself, row by row.

## Why neither alone is enough

A consequence note that quotes only Fv understates the exposure near the fire, where Fh is large. One that quotes only Fh understates it everywhere. The engine returns both, and combines them into a third number, Fmax, which the next lesson takes up and which the heat flux uses.

## The second route agrees

The engine's validation record checks every golden view factor against a second route, a four hundred by four hundred Gauss-Legendre integration over the visible flame surface. Across nine golden cases the two routes agree to all twelve printed decimals, in both orientations. Two of the cases:

| golden case | engine Fv | route B Fv | engine Fh | route B Fh |
| --- | --- | --- | --- | --- |
| vertical-h2-x2 | 0.236117430735 | 0.236117430735 | 0.126151330866 | 0.126151330866 |
| vertical-h5-x3 | 0.161985285356 | 0.161985285356 | 0.091116026744 | 0.091116026744 |

That independent agreement is why a view factor can carry a graded answer, quoted at the full twelve decimals.

## Exercise

In the fire panel's view factor view, enter the stated flame of radius 10 m and length 30 m at zero tilt. Read Fv and Fh at 15, 50 and 120 m and confirm them against the table. For each distance, divide Fh by Fv by hand and write the three ratios to three places. Describe in two sentences how the ratio changes with distance and why.
