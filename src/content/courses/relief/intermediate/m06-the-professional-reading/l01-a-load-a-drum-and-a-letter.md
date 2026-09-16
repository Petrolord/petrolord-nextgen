# A load, a drum and a letter

{{panel:fc-fire-drum-explorer}}

One vessel in a pool fire, one drum keeping liquid out of the header behind it, and the reading this whole tier has been building towards. Two halves of one flare system, worked end to end.

## The fire half

| step | value | route |
| --- | --- | --- |
| wetted area | 683.6960 ft2 | wettedAreaFt2 |
| pool fire duty | 4434115.2612 Btu/hr | fireHeatInput |
| relief load | 34641.5255 lb/hr | fireReliefLoad |
| required area | 1.578271 in2 | gasVaporArea |
| orifice | K | selectOrifice |

Five steps, four routes and one derived pressure among them. Every figure is an engine return, and the order cannot be rearranged: the duty needs the area, the load needs the duty, the required area needs the load and the relieving pressure, and the letter needs the required area.

## The drum half

| step | value | route |
| --- | --- | --- |
| vapour density | 0.124385 lb/ft3 | derived from the stated gravity |
| actual vapour rate | 212.481739 acfs | derived from the stated MMscfd |
| dropout velocity | 4.005010 ft/s | dropoutVelocityFtS |
| vapour velocity | 4.467129 ft/s | koDrumHorizontal |
| required length | 7.026927 ft | koDrumHorizontal |
| L over D | 0.780770 | koDrumHorizontal |

Note the first two rows. Both are derived rather than returned by any route in the module, which is the caller's work from the first module of this tier arriving exactly where it was said it would. The dropout velocity is the third row, and the drum route takes it as an input rather than reaching for it.

## Reading the two halves as one screen

The two tables arrive in the same session, about the same facility, on the same screen. That is what makes them worth putting side by side, and it is also the trap. Eleven figures in four units, produced by six different routes plus two conversions the caller did, and nothing on the screen groups them.

So the discipline is to label every figure with the half it belongs to before writing any of them down. A required area and a required length are both required, both in the answer, and answers to two unrelated questions.

## The two halves share no number

This is the thing to take away. Look down both tables and there is no figure in common, and no figure in one that feeds the other.

The valve is sized on the load a fire puts on a vessel. The drum is sized on the vapour the header carries and the droplet the flare tip will not accept. A reader who expects the relief load to turn up in the drum calculation has the chain wrong. What the drum takes is a rate at drum conditions, and this engine is handed that rate rather than deriving it from any relief case.

That separation is honest rather than convenient. On a real plant the relieving vapour does travel down the header to the drum, and connecting the two means converting a relieving mass flow to a volumetric rate at header conditions with a composition and a temperature nobody has given this engine. It does not pretend to a link it cannot compute.

## What the caller carried, in this tier

| handed to the caller | where it showed up |
| --- | --- |
| the wetted height truncation at 25 ft | the level typed into the geometry route |
| which scenario is the governing case | whether this fire case is the one that sizes the valve |
| the conversion from a standard rate to an actual one | the vapour rate row in the drum half |
| the liquid density and vapour viscosity at drum conditions | the settling calculation behind the dropout velocity |

Four boundaries, and every one of them appears somewhere in the eleven rows above. That is the tier in a sentence: the engine did the arithmetic, and four judgments came from outside it.

## Exercise

Write out both halves with the route beside each row. Then state what the two halves have in common numerically, and list the four things the caller supplied with the row of the reading each one affected.
