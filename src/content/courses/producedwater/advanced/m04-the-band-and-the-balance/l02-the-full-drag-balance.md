# The full drag balance as a second method

The lesson before this one put two velocities side by side and read the gap between them. This one is about why that gap is worth anything at all, which turns entirely on the two numbers having been reached by different routes.

{{panel:pw-device-explorer}}

## Two routes rather than two copies

Stokes is a CLOSED FORM. Write the creeping flow drag, set it equal to the buoyancy, and the velocity falls out in one line with no iteration anywhere.

The full drag balance is not closed. The drag coefficient depends on the Reynolds number, the Reynolds number depends on the velocity, and the velocity is what you are solving for. The engine resolves that by a DAMPED ITERATION on the Schiller-Naumann drag coefficient, stepping until the residual settles.

Those are different methods, and that is what makes their agreement inside the band evidence of anything at all. Two copies of one calculation always agree. Two arguments agreeing is a result.

## What the oracle adds

The independent oracle does not reproduce either route. For the terminal rise velocity it runs BISECTION on the drag residual, against the engine's damped iteration.

Bisection and damped iteration are different numerical animals. Bisection brackets a sign change and halves the interval, so it converges on the root of the residual by a route that shares no step with an iteration that walks towards a fixed point. If the engine's iteration converged to the wrong place, or converged to the right place by an accident of damping, bisection would land somewhere else.

For creeping flow the oracle goes further and solves the FORCE BALANCE numerically, with the drag coefficient written as 24 over the Reynolds number and the two force expressions typed out. The 18 in the Stokes group is never typed anywhere in that route, so the oracle has no place for a wrong 18 to hide.

## Where the second method earns its keep

Inside the band the balance mostly confirms Stokes. Outside it the balance is the better answer. The module uses it for the bubbles, which are never inside the band, and for an oil droplet outside the band it keeps the closed form and warns.

A rising bubble is the clearest case. A 400 micron bubble in the flotation chain rises at 0.055485861717 m per second at a Reynolds number of 41.641016, and the engine reaches that by the full drag balance rather than by Stokes, because at a Reynolds number in the tens Stokes is no longer the settling law.

That is the correct use of two methods. One is cheap and is stated to a band. The other is iterative and does not assume creeping flow. The module uses each where it applies and reports which one produced the number.

## Exercise

For one droplet size inside the band, read the Stokes velocity and the balance velocity and record the ratio. Repeat well outside it.

Then say what you would conclude if the two routes agreed to twelve decimals at every size in the sweep, including the ones at a Reynolds number of twenty.
