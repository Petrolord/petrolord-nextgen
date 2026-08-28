# Endpoints rule the curves

Lesson 2 split the Corey parameters into shape and scale: exponents bend the interior, endpoints pin the frame. This lesson is about the frame, because in displacement work the frame decides more than the bending does. Two saturations and two permeability values control where the curves live, and later, how much oil a flood can ever recover.

## The four frame numbers

The saturation endpoints, $S_{wc} = 0.35$ and $S_{or} = 0.25$, fix where the curves start and stop. Everything the flood will ever do happens between $S_w = 0.35$ and $S_w = 0.75$, and the width of that window, 0.4 of pore volume, is the movable oil you priced in module 1: 8964338.21256436 barrels of the Ekene pore volume.

The permeability endpoints fix the heights. $k_{rw,max} = 0.3$ is the water curve's value at residual oil: flood the rock to its end state and water flows at thirty percent of the rock's single phase capacity. $k_{ro,max} = 0.9$ is the oil curve's value at connate water: before any water arrives, oil at connate water flows at ninety percent of capacity.

That asymmetry, 0.3 against 0.9, is typical of water wet rock and it is not an accident of the fixture. In a water wet sand the water occupies the small pores and coats the grains, so even at its maximum saturation it flows through a compromised network. The oil, occupying the open pore centres, loses little to the immobile water films around it. The ratio of the two endpoints will return in module 3 inside the mobility ratio, where it sets the character of the whole flood.

## What moving an endpoint does

Raise $k_{rw,max}$ from 0.3 to 0.6 and the entire water curve doubles, every interior point included, because the endpoint multiplies the power law. The oil curve is untouched. The flood, as module 3 will show, gets substantially worse, because water that flows more easily is water that outruns the oil.

Move $S_{or}$ from 0.25 down to 0.15 and the window widens: the curves now run to $S_w = 0.85$, there is more movable oil, and the ultimate prize of the flood grows. Nothing about the shape parameters changed, yet the size of the target moved by a quarter. When a laboratory reports endpoint saturations, those numbers go more or less straight into reserves arithmetic, which is why endpoint quality control matters more than curve fit quality.

## The engine's own rules

The engine validates every relative permeability table against the frame logic before it will compute with it, and its rejection messages are worth reading as physics. Feed it a table whose water column starts above zero at the lowest saturation and it answers:

"krw at the lowest Sw should be 0 (connate water immobile)."

Feed it a table whose oil column rises anywhere and it answers:

"kro must be non-increasing in Sw."

Each message is a physical statement. Connate water is by definition the water that does not flow, so a table that gives it permeability is describing a different saturation than it claims. Oil permeability rising as water saturation rises would mean more water somehow made room for faster oil, which two phase interference forbids. The other checks are bookkeeping of the same kind: at least three rows, all values inside $[0, 1]$, no duplicate saturations, water permeability never decreasing.

The endpoint zeros, $k_{rw} = 0$ at $S_{wc}$ and $k_{ro} = 0$ at $1 - S_{or}$, are definitional, not measured. A laboratory cannot measure a zero flow rate; it observes that flow stopped and records the saturation where it did. The zeros anchor the table's meaning rather than report an experiment.

## The misconception to avoid

Because $k_{ro,max} = 0.9$ is close to 1, it is tempting to treat it as cosmetic and mentally replace it with 1. Do not. The endpoint values enter the mobility ratio as a ratio, and moving 0.9 to 1.0 shifts that ratio by ten percent, which is the difference between one flood forecast and another. The frame numbers are few, so each one carries real weight; there is no such thing as a rounding-friendly endpoint.

## Exercise

A laboratory reports a candidate table for a neighbouring sand: $S_{wc} = 0.30$, $S_{or} = 0.30$, $k_{rw,max} = 0.45$, $k_{ro,max} = 0.85$. First compute the movable fraction of pore volume for that sand and compare it with Ekene's 0.4, stating which sand offers the bigger displacement target per barrel of pore volume.

Second, the same report's table shows the water column reading 0.02 at $S_w = 0.30$, its lowest row. Quote the exact engine message this table will trigger, and say in one sentence what physical claim the table is accidentally making.
