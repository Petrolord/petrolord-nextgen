# A live well reported dead

The engine will call a flowing well dead. The obvious repair does not work, and that is the lesson.

{{panel:pd-node-explorer}}

## Dead is a claim about the grid

A dead status means no adjacent pair of samples had residuals of opposite sign. That is not an observation about the well. `solveNodeCore` scans a grid, default 40 grid points, and where two crossings sit inside one interval it reports a live well dead. Every residual it computed was right; the conclusion was wrong.

## The closed form case

`analyticResidualPinched` has a parabolic residual, so its crossings are exact: 990.000000 stb/d at 2037.856191 psia, unstable, and 1010.000000 stb/d at 2014.429848 psia, stable, against an open flow of 2000.000000 stb/d and a window of 20.000000 stb/d. At 1000.0000 stb/d the inflow is 2026.171589 psia and the outflow 2026.071589 psia, a residual of -0.100000 psi.

| nGrid | Spacing, stb/d | Status | Crossings |
| --- | --- | --- | --- |
| 40 | 51.179487 | dead | 0 |
| 100 | 20.161616 | dead | 0 |
| 110 | 18.311927 | flowing | 2 |
| 200 | 10.030151 | flowing | 2 |
| 4000 | 0.499125 | flowing | 2 |

Raising 40 to 100 more than halves the spacing and still returns dead, because 20.161616 stb/d exceeds 20.000000 stb/d. That sequence looks like a threshold anyone reaches by refining far enough.

## The reversal

FORCADOS-3 choked to 1469.15 psia truly flows: crossings at 956.387791 and 1014.239511 stb/d, a window of 57.851719 stb/d, a minimum residual of -0.478610 psi.

| nGrid | Spacing, stb/d | Ratio | Status |
| --- | --- | --- | --- |
| 40 | 105.837892 | 1.829468 | flowing |
| 50 | 84.238322 | 1.456107 | dead |
| 60 | 69.960640 | 1.209310 | flowing |

A finer scan lost a well the coarser one found, and a finer one still found it again.

## Why finer is not better

A sign change scan sees the dip only if one of its intervals straddles it, so the verdict depends on where the samples land and not only on how many there are. The grid is rebuilt, not subdivided: none of the 50 points sits where any of the 40 points sat. Below the guarantee threshold the verdict is decided by an alignment that has nothing to do with the well.

Refining until the answer stops changing is therefore not a method, because the answer can change back.

## The check that works

Ask whether the residual is ever negative, not whether a sign changed between two samples. That needs no bracketing and costs the same per point. The pinched instrument reads -0.100000 psi at 1000.0000 stb/d; choked FORCADOS-3 has a minimum residual of -0.478610 psi; the published `deadWell` case has a smallest sampled residual of 988.172727 psi and nothing negative anywhere. It also reports the margin, which a crossing count never carried.

The engine does not probe the residual before returning dead, so the verification is yours.

## Exercise

Read the status of choked FORCADOS-3 at 40, 50 and 60 grid points and write the three verdicts in order.

Then find its minimum residual and say in one sentence why that single number settles what the three verdicts could not.
