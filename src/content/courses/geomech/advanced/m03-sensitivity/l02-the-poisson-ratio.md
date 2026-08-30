# The Poisson ratio

The dominant sensitivity in the whole model.

{{panel:gm-window-explorer}}

## The sweep

| Poisson ratio | slant window | horizontal window |
|---|---|---|
| 0.20 | 576.7899309704164 | 667.0242306208563 |
| 0.24 | 798.0061358773585 | 1056.932198261083 |
| 0.25 | 856.6462603768646 | 1159.8966312287419 |
| 0.28 | 1041.4600436889584 | 1364.1863204876872 |
| 0.32 | 1311.0752789823102 | 1615.3768250146395 |
| 0.35 | 1533.051534215804 | 1820.2463152969724 |

## The size of it

On the slant well the window runs from 576.7899309704164 to 1533.051534215804 kg/m3 across that range. It nearly triples.

On the horizontal well it runs from 667.0242306208563 to 1820.2463152969724. It nearly triples too.

## What that range represents

0.20 to 0.35 is the span of this course's own lithology seeds: sandstone at 0.20 and shale at 0.35.

So the difference between assuming the section is sandy and assuming it is shaly, with nothing else changing, is a factor of nearly three in the answer.

## Where it comes from

k0 is nu over one minus nu, and it is the multiplier on the effective vertical stress in the horizontal stress estimate.

At nu of 0.20, k0 is 0.25. At nu of 0.35, k0 is 0.5384615384615384. So the horizontal stresses are more than twice as large in the second case, and the fracture initiation pressure rises with them.

A higher Poisson ratio means higher horizontal stresses means a higher fracture gradient means a wider window, and the effect compounds through the whole calculation.

## Why this is the important finding

Because the Poisson ratio is usually the LEAST carefully determined input in the whole model.

Overburden comes from a log. Pore pressure has a whole discipline behind it. Strength comes from a correlation on a log. The Poisson ratio, on a well with no shear sonic, comes from a table.

The parameter with the largest influence is the one with the least evidence behind it.

## What that means for the deliverable

Any mud window from a model with a seeded Poisson ratio should be quoted as a band, and the band is wide.

Quoting 1041.4600436889584 kg/m3 to ten decimal places from a model whose most sensitive input was read off a lithology table is a false precision, and this sweep is how you demonstrate it.

## What to buy first

A dipole shear sonic log. It gives the Poisson ratio directly at log resolution, and on this evidence it would narrow the answer more than any other single measurement.

## Exercise

Compute k0 at each of the six Poisson ratios in the table and plot the window width against k0 rather than against nu.

Then say whether the relationship looks more nearly linear in one than in the other, and what that suggests.
