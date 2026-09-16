# Drag against weight, iterated

{{panel:fc-fire-drum-explorer}}

A droplet in a rising gas falls at the speed where form drag balances its buoyant weight. That is the third answer this academy gives to one question, and the other two belong to other courses.

## Three answers to one question

Gas well loading owns drag against weight with the Turner and Coleman criteria. Separation and Slug Catching owns the Souders-Brown allowable velocity and the critique of using it as a settling velocity. This course owns the third, the API 521 drag-coefficient method, and it re-derives neither of the others. When a figure from one of them turns up in a drum calculation, the first question is which of the three routes produced it.

## The balance, and the loop inside it

The engine evaluates Ud as a coefficient times the square root of the group g d times the density difference over the vapour density times the drag coefficient. The drag coefficient depends on the Reynolds number, the Reynolds number depends on the speed, and the speed is what is being solved for. So the engine iterates and returns the pair it converged on.

| the ODIDI droplet at 400 micron | value |
| --- | --- |
| dropout velocity | 4.005010 ft/s |
| drag coefficient | 1.026414 |
| passes to convergence | 19 |
| residual at the stop | 0.000000000000 |
| converged | true |

The velocity and the drag coefficient belong together and are returned together on purpose. The engine recomputes the velocity from the coefficient it is about to hand back, so a reader can put the pair into the balance and recover the same answer. Quote one without the other and you have quoted half of a solution.

The return carries seven fields in all: the velocity, the drag coefficient, the Reynolds number, the pass count, a converged flag, the residual it stopped at, and a warning slot.

## Why an iterated answer needs its residual

A loop that stops has to say why. There are two honest reasons: it met a tolerance, or it ran out of passes. The converged flag separates them and the residual says how close the balance came. A velocity handed back with a converged flag of false is one the engine did not solve for.

So the habit for any iterated quantity is an order of reading. The flag, the pass count, the residual, then the answer, because the first three decide whether the fourth means anything.

## What the group measurement proves

| the group Ud squared times C times the vapour density, over the density difference times the droplet size | value |
| --- | --- |
| at 100 micron | 0.000140743657 |
| at 200 micron | 0.000140743657 |
| at 0.02 cp instead of 0.01 | 0.000140743657 |
| the same group divided by standard gravity in ft/s2 | 1.333333333333 |

That group should carry the coefficient squared, standard gravity and the foot per micron and nothing else. The first two rows are equal to twelve decimals, which says the group does not carry the droplet size. The third equals the first as well, which says it does not carry the viscosity. Dividing by gravity then leaves the coefficient squared times the foot per micron. Three equalities, measured by calling the engine rather than by reading its source.

## Held for literature

The drag correlation and its low-Reynolds cap are an empirical fit. No route in this package derives them, and the validation oracle shares that same fit on purpose and says so, which means the published dropout cases cannot discriminate the fit. It is taught here as a stated limit with its reference named. Nothing graded in this course reads it.

## Exercise

Name the three academy answers to drag against weight and which course owns each. Then record the ODIDI pair with its pass count, and give the three group measurements and the figure left after dividing by gravity.
