# Optimal, infeasible and unbounded

The kernel's status is always one of three words, and the caller is told which. A result that arrives without its status is a number without a meaning, so the status is the first line to read on any linear programme, in any app that uses this kernel.

## Three answers

**Optimal** means the feasible region is not empty and the objective reaches a best value on it. The kernel returns the point, the value and the shadow prices.

**Infeasible** means no point satisfies every row and every bound at once. The limits contradict one another. There is no recipe to return, and none is invented.

**Unbounded** means the region is not empty but the objective improves without limit inside it. The kernel reports it as plainly as the other two.

This course poses one small problem for each:

| problem | status |
| --- | --- |
| minimise x + y with x + y <= 2 and x + y >= 3 | infeasible |
| maximise x with x - y <= 1 (y unbounded above) | unbounded |
| minimise x with a lower bound of 5 above an upper bound of 3 | infeasible |
| maximise 3x + 2y with x + y <= 2 and y >= 2 | optimal, objective 4.0000 |

## Reading each one

The first problem asks x + y to be at most 2 and at least 3 in the same breath. Two rows contradict, so the status is infeasible.

The second lets y grow without an upper limit, and the row x - y <= 1 lets x grow with it. The objective, x, has no ceiling, so the status is unbounded.

The third needs no row at all. A single variable with a lower bound of 5 above an upper bound of 3 has no value that fits, so the kernel says infeasible. The blend optimizer refuses the same case for a component in its own words, and module five reads that refusal.

The fourth looks tight and is still feasible. The rows x + y <= 2 and y >= 2 leave very little room, and the kernel returns optimal with objective 4.0000. A region that is very small is still a region.

## Infeasible is information

A trader who asks for a cargo that the tanks cannot make needs to hear so plainly. The optimizer carries the kernel's infeasible status through to its own refusal, "REFUSED: No recipe from these components can meet every specification. Relax a limit, or bring in a component that can." Module five reads two Apapa cases that end this way. The point to hold now is that infeasible is a verdict on the problem as posed, and it is as valid an output as a recipe.

## A malformed problem is something else

A problem that is written wrongly is neither optimal, infeasible nor unbounded. When a row carries the wrong number of coefficients, the kernel throws ("Row 0 has 1 coefficients, expected 2"). That is a fault in the question, and the kernel refuses to answer it with a status.

{{panel:crude-recipe-explorer}}

In the panel, pull one row's right-hand side across another until the region vanishes, and the status changes to infeasible. Remove a row that closes the region and it changes to unbounded.

## Exercise

Read this lesson's third and fourth problems: a lower bound of 5 above an upper bound of 3 returns infeasible, and x + y <= 2 with y >= 2 returns optimal, objective 4.0000. Say what the relationship between the two bounds in the third problem shows, and say why the fourth problem's two rows, which both press on y, still leave the kernel a point to return as optimal.
