# Working the capstone

The six graded values in this tier, and the traps in each.

{{panel:ps-sand-explorer}}

## The conditions

The capstone sand is the one from the Associate tier, and the interval, the cavity geometry, the boost factor and the step are all new. None of them matches the published case.

Note the geometry, which is not the perf tunnel. Note the boost, which is not one. And note the step, which does NOT divide the interval.

## The six values

Two from the sand, four from the sweep.

The gravel band lower edge is five times the capstone median, which the Associate tier already computed. It is graded again here because everything downstream depends on it.

The gauge margin is the smallest grain of the selected gravel less the chosen gauge. That requires the gravel selection and then the gauge selection, and it cannot be looked up.

The critical flowing pressure is at the governing row, so find the governing row first.

The governing margin is the smallest margin over the sweep.

The margin at the interval bottom is the last row, which is the row a truncated sweep would never have computed. On this interval the step leaves a short last step, so that row exists only because the sweep runs to the bottom.

The boost at zero margin is a bisection: the strength multiplier at which the governing margin is exactly zero. The margin is linear in the boost, so a secant would find it in one step, and a bisection is what the lab uses.

## Where the marks get lost

Using the perf-tunnel stress pair when the geometry says open hole. That swaps the overburden in for the minimum horizontal stress and changes every row.

Stopping the sweep at the last whole step. The interval and the step here are chosen so that the last step is short.

Reporting the margin at the interval top as the bottom row, or the other way round. On this profile the margin rises with depth, so the governing row is the TOP and the bottom row is the loosest.

Forgetting the boost factor entirely, which scales the strength and shifts every critical pressure.

## Checking yourself

Three checks. The margin at the bottom must exceed the governing margin, because the governing margin is the smallest. The governing margin must be positive at the stated boost, and therefore the boost at zero margin must be below the stated boost. And the gauge margin must be positive, because the gauge is chosen strictly below the bound.

## Exercise

Write the three self checks before you start.

Compute the six values and apply them.

Then say how many rows your sweep produced, what depth the last one is at, and why that row exists.
