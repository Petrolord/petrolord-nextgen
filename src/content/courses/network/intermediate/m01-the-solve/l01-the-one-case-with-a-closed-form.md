# The one case with a closed form

Give the solver linear branch resistances and the network stops being an iteration. It becomes one matrix solve, and that is the only place the answer can be checked with no tolerance at all.

{{panel:pd-network-explorer}}

## A star that needs no iteration

The published case `linear_star` is two linear wells on one header and one linear trunk: conductances b1 = 80, b2 = 120 and b3 = 400 lb/d per psi, wells w1 at 60000 lb/d at 900 psia and w2 at 40000 lb/d at 700 psia, separator held at 150 psia. Every branch is a resistor and every inflow a straight line, so the system collapses to a weighted graph Laplacian that `solveLinearNetwork` inverts. `solveNetwork` knows nothing about that and runs Newton anyway.

## Two routes with no shared reasoning

| Node | Newton, psia | Difference from the closed form, psia |
| --- | --- | --- |
| w1 | 546.666666667 | 0.0000e+0 |
| w2 | 396.666666667 | -5.6843e-14 |
| h | 252.222222222 | -2.8422e-14 |
| s | 150.000000000 | 0.0000e+0 |

Relative, that is 1.4330e-16 at w2 and 1.1269e-16 at h. Gaussian elimination and Newton share no code and no reasoning, so agreement at that size is evidence about the assembly, the signs and the boundary handling rather than about either method.

## What the flag says and what the audit says

Newton reports converged = true in 2 iterations, a reported residual of 7.2760e-12 lb/d and nothing pinned. Run `checkConservation` on that same answer and it gives produced = 40888.888888889 lb/d against delivered = 40888.888888889 lb/d, a gap of 7.275958e-12 lb/d, relative 1.779446e-16. Here the two agree. They are still two different numbers, and `solveNetwork` never calls the second one.

Newton is exact on a linear system, so many steps here would mean the Jacobian is wrong rather than the problem hard. The gate asserts three iterations or fewer for that reason.

## Series and parallel, while they last

Two linear branches of 200 and 300 lb/d per psi in series give a wellhead of 183.333333333 psia, and one equivalent branch of 120.000000000 lb/d per psi by the reciprocal rule gives that wellhead to 0.0000e+0 psia. The same two in parallel give 120.000000000 psia, matched exactly by one branch of 500 lb/d per psi.

## The mistake

Carrying those two rules onto a real gathering system. They hold because a linear branch is a resistor. A turbulent branch is not, its conductance is quoted in lb/d per root psi, a quantity that never compares with a linear one, and neither rule survives it.

## What it refuses

Nothing picks the closed form for you, and nothing warns when a linear case reaches the iterative path. The independent bisection referee has no linear method either: it sweeps this star 19 times like everything else, landing 1.8679e-10 psia from Newton at w1.

## Exercise

Solve `linear_star` in the panel, then swap the trunk for a turbulent branch and solve again. Write down both iteration counts, and one sentence on why only the first can be checked without a tolerance.
