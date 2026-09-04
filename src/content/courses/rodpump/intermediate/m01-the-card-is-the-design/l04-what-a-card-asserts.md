# What a card asserts

A predicted card asserts one thing: that this string, driven this way, settles into this loop. Everything else read from it is inference.

{{panel:pd-card-explorer}}

## What it does claim

It claims a settled cycle. The published taper reports converged after 3 cycles at 5 and at 9 spm and ODUMA-4 after 4, all with no warnings. Without that, the loop is one transient among many and none of its extremes mean anything.

It claims a load at each position. On ODUMA-4 the loop runs from 13336.192959431 lb at the top of the stroke to 19545.877783339 lb at cycle fraction 0.151227 and down to 2625.472705679 lb at cycle fraction 0.718331.

At the pump end it claims the valve behaviour: away from the transfers the pump load is either 4690.299657039 lb, the full fluid load, or 0 lb.

## What it does not claim

The card is not evidence about the well. It is what the assumed inputs imply: the fluid load came from a plunger area and a stated differential, and the damping came from a ratio somebody typed.

Several things a real card shows are not in this model at all. Rod buckling and the compression a sinker bar would be sized for. Tubing movement and an unanchored tubing string. Fluid friction on the plunger, and valve slippage as anything other than the `pumpEfficiency` the caller types. Gas interference. Deviated hole side loading and rod on tubing wear. Gearbox, belt and motor losses. The fatigue history that turns a Goodman percentage into a service life.

A predicted card can therefore never look like a gas interference card, because no term in the march can produce one.

## The refusals and the warnings are different promises

A refusal means no answer was produced. A damping ratio of 0, a pumping speed of zero, a rod string with no sections, a plunger with no differential to lift against, a linkage that does not close, a rod size that cannot be read as a diameter, a measured card with fewer than sixteen samples, and a speed at or above the string's own fundamental all return nothing.

A warning means an answer was produced anyway. `taperStepsUp`, `timestep`, `notPeriodic`, `rodOverstressed`, `structuralOverload`, `torqueOverload`, `strokeOverload` and `incompleteFillage` all come back attached to a full result. The card is still drawn, still complete, still confident looking.

## The mistake

Reading a predicted card as a diagnostic. The package does have a diagnostic path, `diagnoseCard`, which takes a measured card and propagates its Fourier harmonics down the string, and it shares no code with `predictCard`. Interpreting a predicted shape as though it had been recorded is a full circle back to the assumptions.

## Exercise

List the eight warning codes and say, for each, whether a result is still returned.

Then name three things a real dynamometer card can show that this march cannot produce at any setting.
