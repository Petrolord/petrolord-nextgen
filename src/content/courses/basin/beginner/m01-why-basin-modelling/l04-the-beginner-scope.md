# The beginner scope

This tier has five working modules after this one, and together they build two things: a burial history and a thermal history. This lesson lays the whole path out in order, so that no module arrives without a place to sit, and states plainly what is left for the tiers above.

Units are fixed throughout. Depths and thicknesses are in metres. Porosity is a fraction of bulk volume, written v/v, never a percentage unless the word percent appears. Compaction constants are per m. Thermal conductivity is in W/m/K. Heat flow is in W/m2, with the equivalent in mW/m2 given alongside it. Temperatures are in degC.

## Step 1: the compaction curve

Module 2 starts with the observation that porosity falls as sediment is buried, and puts a curve through it. The curve is the Sclater-Christie exponential, and it has two parameters for each lithology, a surface porosity and a compaction constant. For the engine's shale those are 0.63 and 0.00051 per m.

Given a depth, the curve returns a porosity. Shale porosity at 2000 m is 0.22717481230903933 v/v, and that is one of the six values the capstone grades.

## Step 2: solid thickness

The same module then asks a harder question. If a layer of sediment is part pore and part grain, how much grain is actually in it. That quantity is the solid thickness, and it is the one thing about a layer that does not change as the layer is buried or restored.

In 100 m of freshly deposited shale at the surface the solid thickness is 38.57953418711555 m, which is another of the graded values. Most of that fresh shale is pore space rather than grain, which is the fact the rest of the tier rests on.

## Step 3: decompaction

Module 3 runs the curve backwards. Take a layer you find at depth today, work out how much grain is in it, then ask how thick that same grain would be if it sat at the surface with its original pore space restored.

A 100 m shale whose top sits at 1000 m holds 63.11728183077296 m of grain in place, and that grain restored to the surface occupies 159.79553483785466 m, the third graded value. Do it in the other direction and the invariant is exact: computing the solid thickness of that restored 159.79553483785466 m at the surface returns 63.117281830772924 m, the same grain to within 1e-13. Decompaction moves thickness around and conserves grain.

That is how a burial history is built. Peel the section back one layer at a time, restoring each remaining layer as the load above it is removed, and you have where every layer sat at every point in the past.

## Step 4: the steady heat column

Module 4 turns depth into temperature. Heat flows up through the section, each rock conducts it at its own rate, and the temperature at a depth follows from those two facts alone.

The fixture is the two layer column: 10 degC at the surface, 0.06 W/m2 of basal heat flow, 1000 m of conductivity 1.8 W/m/K over 1000 m of conductivity 3.5 W/m/K. Its three graded temperatures are 11.666666666666671 degC at the 50 m cell centre, 41.66666666666673 degC at 950 m, and 59.619047619047684 degC at 1950 m.

Module 5 puts burial and heat side by side and module 6 walks the whole workflow end to end.

## The six graded numbers

| number | value | tolerance |
|---|---|---|
| solid thickness in 100 m of surface shale | 38.57953418711555 m | 0.05 |
| 100 m shale from 1000 m, restored to surface | 159.79553483785466 m | 0.05 |
| shale porosity at 2000 m | 0.22717481230903933 v/v | 0.001 |
| temperature at the first cell, 50 m | 11.666666666666671 degC | 0.05 |
| temperature at the low-k base, 950 m | 41.66666666666673 degC | 0.05 |
| temperature at the deepest cell, 1950 m | 59.619047619047684 degC | 0.05 |

You are not asked to memorise them. You are asked to say, for each one, which step produced it, what it depends on, and which way it would move if one of its inputs moved.

## What this tier does not build

Three things are deliberately out of scope.

Maturity kinetics belongs to the Professional tier. Given a temperature history, kinetics tells you how far the kerogen has reacted, and it is where the counterintuitive result lives that a slower heating history can be more mature at the same temperature, because time is a reagent.

The full forward model belongs to the Expert tier, along with generation, expulsion and the erosion signature. That tier runs 150 million years of history on the four layer reference basin, with a heat flow cooling from 80 mW/m2 to 60 mW/m2 and a 600 m erosion event, and recovers the erosion by rerunning the model without it.

## Why the split is honest

The split is not a matter of difficulty. It is a matter of dependency.

Burial and heat are geometry and steady conduction. Both are closed form, both can be checked by hand, and both stand on their own without anything else being assumed. Maturity, generation and expulsion cannot. Each of them takes the temperature history as an input and returns an answer that inherits every error in that input without complaint. A maturity number computed on top of a burial history you cannot check is a confident number with an unknown error bar.

So this tier stops where the checkable arithmetic stops. When you can produce all six graded numbers and say what each depends on, you have the input every later stage consumes, and you will know when it is wrong.

The panel below runs the whole beginner path at once. Pick a depth and a lithology and it reads the compaction curve, the solid and restored thicknesses, and the golden heat column.

{{panel:bs-burial-heat-explorer}}

## Exercise

Write the four steps in order, and beside each note what it takes in and what it hands on. Then answer two questions in one sentence each. Which step produces the number 159.79553483785466 m, and which single input would you change to make it larger? Which of the six graded numbers would be unaffected if the shale compaction constant changed?

Self check: the steps are the compaction curve, solid thickness, decompaction, and the steady heat column, each consuming the previous step's output. The restored thickness of 159.79553483785466 m comes from decompaction, and it grows if the layer is found deeper, since a deeper layer holds more grain in the same 100 m and therefore expands further on restoration. The three temperatures are unaffected by the compaction constant, because the heat column at this tier is driven by the surface temperature, the basal heat flow and the two conductivities alone.
