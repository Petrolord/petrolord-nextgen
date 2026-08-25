# Fracture pressure down the well

The formula is local: feed it $S$ and $PP$ at a depth, get $FP$ there. Run it at all 401 samples and the green curve appears. This lesson reads that curve the way lesson 1 of module 3 read the red one, and extracts the three behaviours worth remembering.

{{panel:pp-eaton-explorer}}

## Above the onset: a fixed blend

From the mudline to 2500 m the pore pressure is the hydrostatic, so the fracture pressure is the fixed mixture of two known curves: two thirds overburden, one third hydrostatic. At 1000 m: $\tfrac{2}{3} \times 21.10039782240696 + \tfrac{1}{3} \times 11.106031125 = 17.76894225660464$ MPa, where the overburden and hydrostatic values are the engine's. At 2500 m the same blend of 54.95258938967901 and 26.257305375 gives 45.38749471811934 MPa.

The green curve in the normal section is not new information; it is the frame, re-weighted. Everything it knows it inherited. That has a practical face: in normal section, fracture-gradient uncertainty IS overburden uncertainty, and the density column is the place to spend effort.

## Below the onset: the inherited kink

At 2500 m the pore pressure breaks upward, and the fracture pressure inherits one third of the break. The green curve has a kink at the same depth as the red one, one third as sharp. Below it, the fracture gradient steepens: between 3000 m and TD the fracture pressure climbs from 55.65667173729269 to 76.55157117548856 MPa.

That number pair is worth checking against the mixture reading once: at 3000 m, $\tfrac{2}{3} \times 66.83114254343904 + \tfrac{1}{3} \times 33.307730125 = 55.65667173729269$ exactly. Any point of the green curve is one line of arithmetic away from two numbers you already trust, which makes the curve auditable at a glance, and audit-at-a-glance is the working habit this course keeps installing.

## The narrowing window, seen whole

The gap between green and red is the pressure-unit window, $K(S - PP)$ by the algebra of last lesson. Above the onset it grows with depth, since $S - P_h$ grows. Below the onset the growth slows: the window is still widening in absolute terms down this well, because the budget grows faster than the ramp eats it, but it is narrower at every depth than it would have been without the ramp. At TD: 29.14299155048856 MPa with the ramp, against $\tfrac{2}{3} \times 49.714487325732826 = 33.14299155048855$ without. The overpressure cost the well exactly $\tfrac{2}{3} \times 6 = 4$ MPa of window at TD.

On wells with steeper ramps the subtraction wins: the window narrows outright with depth, and where it approaches zero, drilling stops without casing. This well is gentle; the Expert tier converts these same curves to mud-weight units, where the picture sharpens further, because dividing by depth changes which features dominate.

## What the green curve is for

Three uses, in the order a well team meets them. Mud ceiling: the mud weight, expressed as pressure at any exposed depth, must stay below the green curve everywhere in the open hole. Casing seats: a section ends where the mud needed at its bottom would fracture the rock at its top, and seats are chosen by running exactly that comparison along these two curves. Kick tolerance: when a kick is being circulated out, the pressure at the weakest exposed point, usually the last shoe, must stay under its fracture pressure; the margin available is read directly off the green curve at the shoe.

Every one of those uses consumes the curve at a depth OTHER than TD, which is why the whole curve matters even though the capstone grades one point of it.

## Worked example

The mixture blend at 3500 m, then the window there. Engine values: $S = 78.90215933224333$, $PP = 40.358154875$ MPa. Fracture pressure: $\tfrac{2}{3} \times 78.90215933224333 + \tfrac{1}{3} \times 40.358154875 = 52.60143955482889 + 13.452718291666667 = 66.05415784649555$ MPa, matching the engine's 66.05415784649554 in all but the last place. Window: $66.05415784649554 - 40.358154875 = 25.69600297149554$ MPa, which is also $\tfrac{2}{3} \times (78.90215933224333 - 40.358154875) = \tfrac{2}{3} \times 38.54400445724333$: same number both ways.

## Exercise

Read the three orderings check of module 3 against the green curve's construction, and answer: can the coefficient form EVER produce a fracture pressure above the overburden, or below the pore pressure? Under what condition on $K$?

Self check: with $0 \le K \le 1$ the fracture pressure is a weighted average of pore pressure and overburden and cannot leave the interval between them; it touches the pore pressure at $K = 0$ and the overburden at $K = 1$. A $K$ above 1 would put the fracture pressure above the overburden, which the elastic derivation cannot produce since $\nu < 0.5$ keeps $\nu/(1-\nu) < 1$, but a CALIBRATED $K$ can exceed 1 in strongly tectonically compressed basins, where horizontal stress really does exceed vertical. The formula survives; the interval guarantee does not. Know which regime your basin is in before trusting the ordering as a check.
