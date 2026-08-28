# Saturated and undersaturated

Two regimes, two sets of behaviour, and every correlation has to know which one it is in.

{{panel:fluid-correlation-explorer}}

## The two regimes

**Undersaturated**, above the bubble point. The oil holds all its gas. Rs is fixed at Rsb, Bo falls as pressure rises, and viscosity rises with pressure.

**Saturated**, at or below the bubble point. The oil holds all it can. Rs falls as pressure falls, Bo falls with it, and viscosity rises as the thinning gas leaves.

Both curves are continuous at the bubble point but neither is smooth: the slope changes sign for Bo and for viscosity. That kink is real and any table that lacks it is wrong.

## What a correlation has to be told

Every Rs correlation in the engine takes a pressure and a bubble point, and returns the value at whichever is lower. That is why the signature has two pressures in it.

Bo is handled differently. The correlations return the SATURATED Bo for a given Rs, and the undersaturated branch is applied on top by the caller, because it depends on a compressibility rather than on the correlation.

Understanding that split matters. Asking a Bo correlation for the value at 3200 psia on an oil that bubbles at 2000 and expecting it to handle the undersaturation itself gets you the bubble point value.

## The undersaturated correction

Above the bubble point the oil is a single-phase liquid being compressed, so:

$$B_o = B_{ob}\, e^{-c_o (p - p_b)}$$

with co the isothermal compressibility of the undersaturated oil, of order 1e-5 to 2e-5 per psi.

At 1200 psia of undersaturation and co of 1.5e-5 that is a factor of about 0.982, so Bo drops nearly two percent between the bubble point and initial pressure. Small, systematic, and it goes the right way: squeezing an oil makes it smaller.

## Where the kink causes trouble

**In a table.** A PVT table that runs from atmospheric to well above the bubble point must include a row AT the bubble point, or interpolation cuts the corner and the peak is lost. The simulation deck's PVTO record makes this explicit by separating saturated nodes from undersaturated branches.

**In a fit.** Fitting one smooth curve through the whole pressure range fits neither branch. The two regimes have different physics and want different treatments.

**In a history match.** A reservoir crossing its bubble point mid-history changes behaviour, and a model whose bubble point is 200 psia off crosses at the wrong time. That mismatch shows up as a gas-oil ratio that rises too early or too late, and it is far more diagnostic than any oil-rate residual.

## Ekene sits well above

Initial pressure 3200 psia, bubble point 2000. The oil is undersaturated by 1200 psia at discovery and the depletion phase modelled in the material balance course happens entirely in the undersaturated regime.

That is why the waterflood course could treat the formation volume factors as frozen constants: over the pressure range the field actually saw, they barely moved.

## The misconception to avoid

"Undersaturated means there is no gas." It means there is no FREE gas. An undersaturated oil at 400 scf/stb is carrying a great deal of gas, all of it dissolved. What it lacks is a second phase, and that absence is what makes the regime simple rather than what makes it dry.

## Exercise

First, state what happens to Rs, Bo and viscosity as pressure rises above the bubble point, and then as it falls below it.

Second, Ekene bubbles at 2000 psia and starts at 3200. Using a compressibility of 1.5e-5 per psi, estimate the ratio of Bo at initial pressure to Bo at the bubble point, and say which is larger.
