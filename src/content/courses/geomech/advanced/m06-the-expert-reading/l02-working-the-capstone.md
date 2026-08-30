# Working the capstone

Six numbers from two whole-trajectory walks.

{{panel:gm-window-explorer}}

## What is asked

On the SLANT well, at the tightest point of its walk:

1. The **window width**, in equivalent mud weight.
2. The **collapse gradient** there.
3. The **fracture initiation gradient** there.

On the HORIZONTAL well, at the tightest point of ITS walk:

4. The **window width**.
5. The **collapse gradient** there.
6. The **fracture initiation gradient** there.

## The settings

The same capstone parameter set as the two tiers before it, unchanged: a Poisson ratio of 0.24, a friction angle of 26 degrees, a Young's modulus of 18000000000 Pa, tectonic strains of 0.0002 and 0.0005, a Biot coefficient of 0.9, an SHmax azimuth of 105 degrees and a tensile strength of 2500000 Pa.

None of those is a published parameter, so none of your six answers is a number the lessons printed.

## The order

Two walks, three fields each. Run the slant walk, find its tightest row, read three numbers. Then the horizontal walk, same again.

Nothing here is computed by hand: this tier is about reading a walk correctly.

## The traps

**The tightest point moves.** At the published parameters the horizontal well is tightest at 1020 m. At the capstone parameters it is not necessarily there, and reading the published tightest depth off the lessons will give you the wrong row.

**The collapse gradient is not always the lower bound.** Fields 2 and 5 ask for the COLLAPSE gradient specifically, not the lower bound. On the well where the pore pressure binds, the collapse gradient is well below the lower bound and it is still the answer.

**The window width is measured from the LOWER BOUND, not from the collapse gradient.** So on the pore-pressure-bound well, field 1 plus field 2 does NOT equal field 3.

**On the collapse-bound well it does.** Field 4 plus field 5 equals field 6 exactly, because there the collapse gradient IS the lower bound.

That asymmetry is the whole point of module 2, and it is the free check on this capstone: one of the two sums closes and the other does not, and you should be able to say which before you run anything.

**Every field is an equivalent mud weight in kg/m3**, not a pressure.

## What to notice

The capstone parameters have a LOWER Poisson ratio than the lessons, so module 3 says the windows should be narrower than the published ones on both wells.

Check that they are. If either came out wider, something is wrong.

## Exercise

Before running either walk, predict which of the two wells will have the pore-pressure-bound tightest point at the capstone parameters, and say why.

Then run both and check, and say what would have to change for the answer to swap.
