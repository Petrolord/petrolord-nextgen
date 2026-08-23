# The limits of Archie

The Archie equation is empirical. It was calibrated on clean, water-wet sandstones, and it is quantitatively reliable exactly there. Before you apply it anywhere, you should be able to list its assumptions and recognise when a rock breaks them. This lesson gives you that checklist, plus a feel for how input errors move the answer.

## Assumption 1: the rock is clean

Archie assumes the only conductor in the system is the free brine in the pores. Clay minerals violate this. A clay platelet carries a charged surface that holds a cloud of exchangeable cations, and those ions conduct. A shaly sand therefore reads lower resistivity than a clean sand at the same porosity and saturation, and plain Archie interprets that extra conductivity as extra water. The result is a pessimistic saturation: real pay can be computed as wet and written off.

The fix is a shaly-sand saturation model that adds a clay conductivity term. Simandoux and Indonesia are the two classic ones, and both are taught with worked examples at the intermediate tier of this course. At this tier the rule is simpler: check $V_{sh}$ before trusting Archie. A common working threshold is that plain Archie is comfortable below a $V_{sh}$ of roughly 0.10 to 0.15, treated with suspicion above it.

The typewell sands pass easily. The pay in SAND_A carries $V_{sh}$ under 0.01, effectively zero, so Archie is the appropriate model there and the shaly-sand corrections would change nothing.

## Assumption 2: the rock is water-wet

The derivation of $n \approx 2$ rests on the brine forming a connected film on the grain surfaces as hydrocarbons fill the pore centres. In an oil-wet rock the geometry inverts: oil coats the grains and the remaining water sits in disconnected blobs. Disconnected water conducts poorly, so resistivity climbs much faster as saturation falls, and the effective $n$ can reach 3 or higher. Applying $n = 2$ to an oil-wet rock underestimates $S_w$, this time an optimistic error. Wettability is measured on core; without core data, most interpretations assume water-wet and note the assumption.

## Assumption 3: the inputs are right

Archie amplifies or dampens input errors in ways you can predict from the exponents. With the typewell givens ($a = 1$, $m = 2$, $n = 2$):

- $R_w$ error. $S_w$ scales as $\sqrt{R_w}$. A factor of 2 error in $R_w$ becomes a factor of $\sqrt{2} \approx 1.4$ in $S_w$. Serious, but the square root softens it.
- $R_t$ error. Same square root, inverted: read $R_t$ 20 percent too low (thin beds, bad borehole) and $S_w$ comes out about 10 percent too high.
- Porosity error. The harshest one. $S_w$ scales as $\phi^{-m/n} = \phi^{-1}$ here, and porosity errors also hit the pore volume you are computing pay for. An overstated porosity understates $S_w$ and overstates net pay thickness simultaneously.
- $m$ and $n$ errors. Using $m = 2$ when the rock is really $m = 1.8$ biases every saturation; these exponents are measured on core at higher tiers. The default 1, 2, 2 set is a reasonable sandstone assumption and is exactly what the typewell provides.

## Worked example

A sand has true values $\phi = 0.20$, $R_t = 8$ ohm.m, $R_w = 0.05$. Correct Archie: $\phi^2 = 0.04$, $\phi^2 R_t = 0.32$, ratio $= 0.15625$, $S_w = 0.395$. Now repeat with an $R_w$ that is wrong by a factor of two, 0.10 ohm.m: the ratio doubles to 0.3125 and $S_w = 0.559$. The saturation moved from 0.395 to 0.559, a factor of exactly $\sqrt{2} = 1.414$. One wrong scalar input shifted the sand from comfortable pay to nearly failing the 0.6 cutoff. This is the error-propagation arithmetic you should be able to do in your head during any interpretation review.

## When to trust it here

Pulling the checklist together for the typewell: the sands are clean (assumption 1 holds), the field is treated as water-wet (assumption 2 assumed, as is standard without core), $R_w$ is given at formation conditions and verified against the water leg, and porosity comes from a calibrated density log (assumption 3 addressed). Plain Archie with the given exponents is therefore the right model for this dataset, and the saturations you compute with it in the next lesson can be defended.

## Exercise

A shaly interval in another well carries $V_{sh} = 0.35$, and plain Archie computes $S_w = 0.85$. Your colleague concludes the interval is wet. Give two reasons to pause before accepting that conclusion, and state the direction of the likely error. Check yourself: at $V_{sh} = 0.35$ clay conductivity depresses resistivity, so plain Archie overstates water saturation, and the interval should be re-run with a shaly-sand model such as Simandoux; the true saturation is likely lower than 0.85, possibly low enough to be pay.
