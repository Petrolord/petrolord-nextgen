# The seed and the draw order

The risk summary draws from a seeded generator, mulberry32, in a fixed order, so the same inputs return the same numbers on every machine. That makes a result reproducible. It does not make it true.

{{panel:ec-governance-explorer}}

## The draw order

Each iteration draws, in this order and from one stream: F1, then F2, then for each project in array order e1 and e2. All are standard normals from randomNormal on mulberry32(seed). F1 and F2 are shared by every project; e1 and e2 belong to one project. Every normal is drawn whether or not it is used, so a project with pos 1.000000 still consumes its e1.

The defaults are seed 20260829 and 10000 iterations. A seed that is not a whole number falls back to 20260829, and an iteration count below 1 falls back to 10000.

## What a fixed order buys

Because the stream never depends on the inputs, two runs that differ only in one project's pos or fail cost hand every project the same normals. The gap between the two results is the change you made, not fresh sampling noise. That is what makes a sensitivity run readable.

Reorder the projects, or insert one, and the normals are dealt out differently. The portfolio is the same, the seed is the same, and the numbers still move by sampling noise. Anyone reproducing a figure needs the seed, the iteration count and the project order.

## One set, four seeds

OKONO's funded set at the 450.0000 limit, OK-1 + OK-3 + OK-4:

| seed | iterations | P(loss) | standard error sqrt(p(1 - p) / n) | P90 |
| --- | --- | --- | --- | --- |
| 20260829 | 1000 | 0.114000 | 0.010050 | -15.1262 |
| 20260829 | 10000 | 0.123600 | 0.003291 | -18.3574 |
| 20260829 | 40000 | 0.125975 | 0.001659 | -18.8524 |
| 1 | 10000 | 0.128500 | 0.003346 | -21.8586 |
| 2 | 10000 | 0.127700 | 0.003338 | -19.9023 |
| 3 | 10000 | 0.119100 | 0.003239 | -15.3254 |

At 10000 iterations the four seeds give P(loss) from 0.119100 to 0.128500 and P90 from -21.8586 to -15.3254. Each is exactly reproducible. None is the answer. The standard error of 0.003291 says roughly how far another seed would move P(loss), and seeds 1 and 3 land on either side of the default by a little more than one of them.

## Reproducible and still off

The published singleWildcat case has an exact P(loss) of 0.700000. The engine at the default seed returns 0.696100 every time you run it, a standard error of 0.004583 away and a z of 0.8510. Reproducibility tells a reviewer they are looking at the same run. It says nothing about whether the run landed on the truth, and nothing about whether the projects were entered honestly.

## The mistake

The mistake is seed shopping. A team that tries seeds until P(loss) prints 0.119100 has not reduced the risk of the 450.0000 set; it has picked the draw that flatters it. The honest report names the seed and the iterations beside the figure, and if a decision turns on a difference smaller than the standard error, the difference is noise.

## Exercise

Give the draw order for one iteration of a three-project portfolio. Then, from the seed table, state P(loss) and P90 for seeds 20260829, 1 and 3 at 10000 iterations, and say whether the gap between seed 3 and the default is larger or smaller than the default run's standard error.
