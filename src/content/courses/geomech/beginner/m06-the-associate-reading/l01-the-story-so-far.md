# The story so far

Five modules, six numbers, and two of them guesses.

## The claim

A mechanical earth model is six numbers at a depth, and two of the six are estimated rather than measured.

## What each module established

**Module 1.** Overburden, SHmax, Shmin, pore pressure, sonic slowness and strength. There is no seventh input. Two of them, the horizontal stresses, are never measured on a normal well: Shmin is bounded by a leak-off test at a handful of depths and SHmax essentially never. Pressures are the calculating unit and equivalent mud weight is the working unit, and a mud weight without a depth attached cannot be converted back.

**Module 2.** The overburden is an integral of a density log and nobody logs the top of a well. This profile assumes a constant 2300 kg/m3 gradient at every depth, which is fine at reservoir depth and wrong near surface. The pore pressure arrives from upstream and the engine deliberately does not compute it. It runs hydrostatic at 1030 kg/m3 to 1500 m and then ramps to 1186.5384615384614 by 2600 m, and the effective vertical stress stops growing as fast the moment the ramp starts.

**Module 3.** Shmin and SHmax come from one formula differing only in the order of two tectonic strains, so the whole difference between them is tectonic and works out to 3906250 Pa at every depth in this profile. The burial part uses k0 of 0.38888888888888895 from a Poisson ratio of 0.28. The result is then clamped to the Andersonian frictional bounds, which is a BOUND rather than an estimate, and the engine counts the clamps.

**Module 4.** Strength comes from a sonic correlation. Horsrud for shale and McNally for sandstone cross each other TWICE, at about 198.68499251376295 and about 409.8356528477385 microseconds per metre, so there is no rule about which is conservative. The friction angle sets the slope of the failure line and appears again in the frictional bounds, where it is really a fault property rather than a rock one. The lithology seeds are starting values.

**Module 5.** The quality score is 80 because 23 of 52 samples put SHmax above the overburden, which is not the normal faulting regime the run assumes. It is the tectonic strain term that does it: the term is fixed at 8897569.444444442 Pa for SHmax while the burial part grows with depth, so the breach fades and ends between 1150 m and 1200 m. Only four samples are clamped, so 19 of the 23 got there through the estimate alone.

## The numbers to carry

- k0 is nu over one minus nu, and it is 0.38888888888888895 at a Poisson ratio of 0.28.
- q is (1 + sin phi) over (1 - sin phi), and it is exactly 3 at 30 degrees.
- Effective stress is total stress less the Biot coefficient times the pore pressure.
- Equivalent mud weight is pressure over g times true vertical depth, with g at 9.80665.
- This profile's overburden gradient is 2300 kg/m3 at every depth, by assumption.

## The one sentence

Two of the six numbers are model outputs, and the model tells you when it has stopped believing itself.
