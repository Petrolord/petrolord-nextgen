# The friction angle, twice

One parameter, two jobs, and a well where it does not matter at all.

{{panel:gm-window-explorer}}

## The two jobs

**At the wall.** It sets q, the slope of the Mohr-Coulomb line, so it decides how much the mud's confinement is worth against collapse.

**In the stress model.** It sets the Andersonian frictional bounds that clamp the horizontal stress estimate.

The engine takes one value and uses it in both places, which is a simplification worth noticing: the first is a property of intact rock and the second is a property of a fault surface.

## The sweep

| friction angle | slant window | horizontal window |
|---|---|---|
| 20 deg | 1041.4600436889584 | 1227.7066806217579 |
| 26 deg | 1041.4600436889584 | 1299.3059767294599 |
| 28 deg | 1041.4600436889584 | 1321.361913748701 |
| 32 deg | 1041.4600436889584 | 1364.1863204876872 |
| 36 deg | 1041.4600436889584 | 1405.1811337900945 |
| 40 deg | 1041.4600436889584 | 1444.1467542136784 |

## The slant well does not move at all

Not approximately. Identically, to every digit, at all six friction angles.

## Why

Because the slant well's tightest point is PORE PRESSURE BOUND.

The lower bound there is the pore pressure, which does not depend on the friction angle. The upper bound is fracture initiation, which is a tension criterion and has no friction angle in it either.

So neither bound uses the parameter, and the window is exactly invariant.

## The horizontal well does move

From 1227.7066806217579 to 1444.1467542136784 kg/m3, which is 18 percent.

Because its tightest point is COLLAPSE BOUND, and the collapse criterion is the one place the friction angle appears in the answer.

## The general statement

**Which bound binds determines which parameters matter.**

That is the practical payoff of the previous module. Knowing that a section is pore pressure bound tells you not to spend money measuring a friction angle, and knowing that it is collapse bound tells you to.

## The second job, and why it does not show here

Changing the friction angle also moves the frictional bounds on the horizontal stresses, which would change the fracture gradient.

It does not show on the slant well because no depth near its tightest point is clamped: the estimate sits comfortably inside the bounds, so widening or narrowing them changes nothing.

On a profile with more clamping, the friction angle would move the fracture gradient too, and the two effects would not be separable by inspection.

## Exercise

Confirm from the previous module which bound binds on each well, and check that it explains the two columns above.

Then predict what the friction angle sweep would look like on a well whose tightest point was collapse bound AND clamped, and say why.
