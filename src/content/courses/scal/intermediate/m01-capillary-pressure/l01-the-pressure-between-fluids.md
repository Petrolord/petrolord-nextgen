# The pressure between fluids

The Associate tier moved oil with water and never once asked what it costs two fluids to share a pore. That question is where this tier begins, and everything the next five modules build, the J-function, the free water level, the transition zone, stands on it.

Put two immiscible fluids in contact and the boundary between them behaves like a stretched membrane. Molecules at the interface are pulled inward by their own phase more strongly than they are pulled across, and the result is a measurable energy per unit area of interface: the interfacial tension, written $\sigma$ and quoted in dynes per centimetre. Air against brine carries about 72 dyn/cm. Oil against brine carries far less. Mercury against air carries far more. The number belongs to the fluid pair, not to either fluid alone.

## Curvature makes pressure

A flat interface costs nothing beyond its area. Bend it, and the pressure on the concave side must exceed the pressure on the convex side to hold the curve, exactly as the air inside a balloon sits above the pressure outside. In a pore throat of radius $r$, with the interface meeting the solid at the contact angle $\theta$, the pressure jump is

$$P_c = \frac{2 \, \sigma \cos\theta}{r}$$

That jump is the capillary pressure: the pressure of the non-wetting phase minus the pressure of the wetting phase,

$$P_c = p_{nw} - p_w$$

Two things in that little equation run the whole module. First, $P_c$ scales with $\sigma \cos\theta$, so the same rock measured with different fluid pairs gives numerically different curves. Second, $P_c$ scales with $1/r$, so small pores demand more pressure than large ones. Neither statement involves saturation yet. Saturation enters through the rock itself.

## Wettability decides who curves which way

The contact angle $\theta$ is measured through the wetting phase, the fluid that preferentially coats the solid. In a water-wet rock, water lines the grain surfaces and occupies the small pores by preference; oil or gas, the non-wetting phase, sits in the pore bodies. When $\theta$ is 0 the solid is perfectly wetted and $\cos\theta$ is 1; at 40 degrees the effective pull is trimmed to $\cos 40^\circ$, roughly 0.77. The engine carries the pair $\sigma$ and $\theta$ together for exactly this reason: what the physics feels is the product $\sigma \cos\theta$, never $\sigma$ alone.

The Ekene sand, like most of the sandstones this academy works, is treated as water-wet throughout. That choice sets the sign convention: capillary pressure here is oil pressure minus water pressure, and it is never negative on a drainage curve.

## Why the curve rises as water drains

Now let saturation fall. Start with the rock full of water and push oil in. The oil enters the largest, cheapest throats first, because they demand the least pressure. To push the water saturation lower, the oil must invade progressively smaller throats, and by the $1/r$ rule each new class of throats costs more pressure than the last. The result is the drainage capillary pressure curve: $P_c$ plotted against $S_w$, low at high water saturation, climbing as water saturation falls, and climbing without bound as the remaining water retreats into pendular rings and micro-porosity that no realistic pressure will empty.

So the shape of a $P_c(S_w)$ curve is a pore-size story read in pressure units. A sharp early rise means the big throats are few. A long flat middle means many throats of similar size. A steep late wall marks the irreducible water the rock will not give up. Module 2 will squeeze that story into a single dimensionless curve; this lesson only needs you to believe the shape is information, not noise.

## Small numbers, long levers

On the Ekene reservoir rock the pressures involved will turn out to be a fraction of a psi at the top of the curve. It is tempting to file capillary pressure under negligible on that evidence, because reservoir engineers spend their days with thousands of psi. Resist the temptation. Capillary pressure acts across every interface in every pore of a column of rock tens of metres tall, and module 5 will show that fractions of a psi, converted through fluid density differences, decide where the free water level sits and how much of the oil column is actually at connate water. Displacement could afford to neglect $P_c$ inside its one-dimensional race. The static distribution of fluids cannot.

## The misconception to avoid

The common error is to treat capillary pressure as a rock property, one number a core report should list. It is not. It is a function, $P_c(S_w)$, and it belongs jointly to the rock and to the fluid pair and to the direction of saturation change. The same plug measured with air against brine and again with oil against brine gives two different curves; the same plug drained and then re-imbibed gives two different curves again. Whenever someone hands you a capillary pressure without naming the fluid pair, the contact angle and the direction, they have handed you a number you cannot yet use.

## Worked example

A pore throat one micrometre in radius, water-wet with $\theta = 0$, holds an oil-water interface with $\sigma = 26$ dyn/cm. In consistent CGS units the capillary pressure is

$$P_c = \frac{2 \times 26}{1 \times 10^{-4} \ \text{cm}} = 520000 \ \text{dyn/cm}^2$$

which is about half an atmosphere, or roughly 7.5 psi. Repeat the arithmetic for a throat ten times wider and the pressure falls ten times, to roughly 0.75 psi. Two orders of pore size span the entire working range of a reservoir capillary pressure curve, which is why the curve is such a sensitive pore-size probe.

## Exercise

First, a mercury-air system has a far higher interfacial tension than an oil-brine system, several hundred dynes per centimetre against a few tens. Without any calculation, state what that does to the measured $P_c$ values on the same plug, and why the underlying pore-size story is unchanged.

Second, explain in two or three sentences why the drainage curve must climb as $S_w$ falls in a water-wet rock, using only the two scaling facts of this lesson: $P_c \propto \sigma \cos\theta$ and $P_c \propto 1/r$. Say explicitly which fact does the work.
