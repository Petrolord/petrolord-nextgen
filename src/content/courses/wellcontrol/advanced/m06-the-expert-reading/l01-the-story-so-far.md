# The story so far

Five modules, one limit, and two wells that disagree about it.

## The claim

The weakest point in a well is the casing shoe, and everything in this tier asks whether an influx circulated up to it would break it.

## What each module established

**Module 1.** The shoe is the weakest point because it is the shallowest exposed rock. MAASP is the fracture pressure there less the mud column above it, and it FALLS as the mud weight rises, so making the well safer against a kick makes it less able to handle one. It is a rock limit rather than a casing or a BOP limit, and it changes every time the mud weight does.

**Module 2.** Kick tolerance is two cases and the smaller wins. Shut in, the influx stands at the bottom and the headroom at the shoe divided by the density difference gives its maximum height. Circulated, the influx has risen to just below the shoe, expanded, and is Boyle-compressed back to the volume it entered at. On the slant well the shut-in case binds because its shoe is 1225.671108990 m of true vertical depth above its bit; on the horizontal well the circulated case binds because that gap is 42.515647195 m.

**Module 3.** Boyle, isothermally, on a single bubble. Gas is worse than liquid twice over: a larger pressure deficit at shut-in and an expansion on the way up that a liquid does not have. The single-bubble assumption is conservative for a dispersed influx and badly wrong for dissolved gas in oil-based mud. Isothermal overstates the expansion and the ideal gas law understates it, and the two partly cancel.

**Module 4.** The mud weight at which the tolerance crosses the design kick size is the casing point. On the slant well the sweep falls nearly linearly to zero; on the horizontal well it is almost FLAT from 1200 to 1560 kg/m3 and then falls off, because its tolerance is set by the 42.5 m of geometry rather than by pressure. The usual well design lever does not work on the well that needs it most.

**Module 5.** Five omissions: subsea and floating operations, gas migration and volumetric control, dissolved gas in oil-based mud, the casing pressure history, and multiphase influx behaviour. The first makes every number wrong by tens of bar on a deepwater well, and the correction is a measured choke line friction.

## The numbers to carry

- MAASP is the fracture equivalent less the mud density, times g, times the shoe's true vertical depth.
- Slant well at 1440 kg/m3 and a 1750 fracture equivalent: MAASP 3898114.5728331697 Pa, tolerance 2.783680488747303 m3, bound shut in.
- Horizontal well, same conditions: MAASP 3563996.4181032656 Pa, tolerance 1.0788253418074196 m3, bound circulated.
- The two gaps between shoe and bit: 1225.671108990 m and 42.515647195 m.
- The hand example's MAASP: 9806650 Pa, and its kick tolerance: 17.083333333333332 m3.

## The one sentence

Kick tolerance is a geometry question dressed as a pressure question, and on a horizontal well the geometry wins.
