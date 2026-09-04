# When agreement is not evidence

Two runs of the teaching network agree on the north manifold to every digit printed and disagree about what the system produced.

{{panel:pd-fight-explorer}}

## The rows that agree

Five of the seven starting guesses leave the north manifold at 780.469728 psia and the trunk at 12955.677151 lb/d. Those five report conservation gaps of 345.000000, 345.000000, 345.000000, 0.000000 and -640.000000 lb/d, and the allocated well's rate at 985.000000, 985.000000, 985.000000, 640.000000 and 0.000000 lb/d. Same manifold, same trunk, three accounts of what went in. One of the five is the network's answer and four are not.

## Why the pressures can match while the mass does not

The unpinned part is genuinely determined, and it is solved against a pinned node whose pressure reaches it only through the branch on it, saturated at its 640 lb/d capacity in all five runs. A saturated branch carries the same mass whatever sits behind it, so the rest of the network cannot feel where the pinned node was left. The reported WELL rate can, because the inflow relation still evaluates at that pressure, and the gap is the difference.

## What agreement is worth, and when

Agreement is evidence when the two things agreeing had no way to agree by accident. `solveLinearNetwork` and `solveNetwork` share no code and no reasoning, and on the published `linear_star` they land on 546.666666667 psia at w1, difference 0.0000e+0 psia, and 252.222222222 psia at h, difference -2.8422e-14 psia. That says the assembly, the signs and the boundary handling are right. `oracle_network.py` is independent in the same way, Gauss-Seidel with a bracketed bisection at each node and no Jacobian, and it agrees with the engine on 4 published cases and records no defects.

Two runs of the same solver share everything: the same assembly, the same Jacobian, the same convergence test, the same filter. They can only disagree where the input differed, and they agree everywhere the shared machinery is wrong.

## What the oracle would not have caught

None of these runs is oracle territory. The oracle has no concept of a pinned node, and each of its four published cases is a plain Vogel plus turbulent system in which no node can go flat. A clean report on 4 cases is not a statement about a fifth with a flat topped inflow on a saturated line.

## The mistake

Running a solve twice from different starts, seeing the headline pressures match, and calling the answer confirmed. Pick the two runs that agree to the last bit at a gap of 345.000000 lb/d and you have confirmed a non-solution twice. The run that closes at 0.000000 lb/d sits at 1182.577035 psia, where this well's Vogel inflow equals the 640.000000 lb/d its line can pass. Every one of these runs reports `converged` true, and the one check that separates them was never called by the solver that produced them.

## Exercise

Take two guesses that agree on the manifold and disagree on the gap, and write both gaps and both well rates. Then say what has to be true of two methods for their agreement to mean something, and whether these runs meet it.
