# A disagreement worth knowing about

The engine against its oracle, stated fully.

{{panel:td-friction-explorer}}

## The comparison

Over more than a hundred published summaries and checkpoints from five wells and up to five operations each:

**Worst relative disagreement:** 6.70e-2, on the horizontal well's trip-in hookload. Absolute gap 1196.6856587605325 N on a hookload whose magnitude is about 17 kN.

**Worst absolute disagreement:** 1632.220696788194 N, on the horizontal well's slide-drill hookload. Relative gap 1.03e-2.

**Everywhere else:** better than 1e-4 relative, which is what the goldens' own description asks for.

## Where it is, and where it is not

Both worsts are on the same well and both are on operations that put the string into compression along a lateral.

No other well produces a relative disagreement above 1e-3, and the vertical well produces none at all beyond the oracle's own residual.

## What it is: discretisation, mostly

Halving the integration step halves the horizontal gap, from 1196.6856587605325 N at 10 m to 45.937824464563164 N at 0.25 m. First-order convergence toward zero, which means the two implementations are computing the same thing and one of them is coarser.

## What is left over: a model difference, small

On the slant well rotating on bottom the gap settles at -32.650164601625875 N and refining a hundredfold moves it by less than a newton. On the build-and-hold well it settles at -18.011927655432373 N.

Those do not converge to zero, so they are not discretisation.

## Which implementation is closer

The vertical well settles it. It has a closed-form answer, the buoyed weight of the string, 732311.468284047 N.

The engine returns it to -3.6088749766349792e-9 N. The oracle returns a value 42.6224374640733 N away.

So the oracle carries a residual of a few tens of newtons even with no friction present, which is the same order as the unexplained gap on the slant and build wells. The most likely explanation is the oracle's own integration, and on that reading the engine is the more accurate of the two.

## What that does NOT prove

The vertical well exercises the weight integral, the buoyancy factor, the component lookup and the grid. It never touches the friction terms, the curvature terms or the direction cosines.

So it settles the residual only if the residual comes from the weight integral. That is plausible, given the residual is present on every well including the least deviated, and it is not proved.

## Why state it at all

Because a validation claim that omits its own known exception is not a validation claim.

Somebody will eventually run the comparison and find the seven percent. Better that they find it in the course, with its size, its location, its cause and its consequence already established, than that they find it alone.

## The consequence for decisions

Thirty-two newtons on a 730 kN hookload is 4.5e-5. Twelve hundred newtons on a hookload of -17 kN is seven percent, and it is on a case the model has already flagged as buckled from end to end.

Neither of them changes a decision. The habit of finding out is what matters.

## Exercise

Reproduce all four numbers in this lesson from the panel: the two worsts, the slant residual, and the vertical well's two errors.

Then write the two-sentence version you would put in a report, with both the relative and the absolute measure in it.
