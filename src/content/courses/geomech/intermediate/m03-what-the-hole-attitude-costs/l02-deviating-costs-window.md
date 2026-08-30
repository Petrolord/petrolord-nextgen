# Deviating costs window

Usually, and not always, and the exception is the interesting part.

{{panel:gm-stability-explorer}}

## The expectation

A vertical hole in a normal faulting field is loaded by the two horizontal stresses, which are close together. A deviated hole is loaded by a mixture of a horizontal stress and the overburden, which are far apart.

More stress anisotropy at the wall means a bigger hoop stress range, which means a higher collapse pressure and a lower fracture pressure. So deviating should narrow the window.

## What the engine gives at 2500 m

Along the SHmax azimuth of 60 degrees:

| inclination | collapse EMW | fracture EMW | width |
|---|---|---|---|
| 0 deg | 318.0216274260011 | 2339.3030058401414 | 2021.2813784141406 |
| 30 deg | 385.9559505466418 | 2258.616297359445 | 1872.6603468128035 |
| 60 deg | 497.4594170179333 | 2097.242880398052 | 1599.7834633801185 |
| 90 deg | 545.5972311612414 | 2016.5561719173554 | 1470.958940756114 |

The window narrows monotonically, from 2021.28 to 1470.96 kg/m3. It has lost about 27 percent of itself.

## Both bounds move the wrong way

The collapse pressure rises by 227.6 kg/m3 and the fracture pressure falls by 322.7. Both changes are unhelpful, and they add.

That is the general picture, and it is why a horizontal well in a strongly anisotropic field is a harder hole to drill than a vertical one through the same rock.

## The exception

Now do the same along the Shmin azimuth of 150 degrees:

| inclination | collapse EMW | fracture EMW | width |
|---|---|---|---|
| 0 deg | 318.0216274260011 | 2339.3030058401414 | 2021.2813784141406 |
| 30 deg | 289.69470964721813 | 2530.0692962695693 | 2240.374586622351 |
| 60 deg | 442.23615397755685 | 2615.0675198009053 | 2172.8313658233483 |
| 90 deg | 508.1480946245233 | 2494.5481467507584 | 1986.400052126235 |

At 30 degrees the window is WIDER than vertical, by 219.09 kg/m3. At 60 degrees it is still wider. Only at 90 degrees does it finally drop below the vertical value, and then only by 34.88.

## Why

Because deviating toward Shmin brings the overburden into the hoop plane in place of the LARGER horizontal stress. In a normal faulting field the overburden is the biggest stress, but replacing SHmax with Sv in the wall loading turns out to reduce the anisotropy at the wall before it increases it, over this range.

The fracture pressure rises steadily to 60 degrees, which is the dominant effect.

## The lesson

"Deviating costs window" is a rule of thumb, and this fixture breaks it over half its range.

The general statement worth carrying is that the window depends on the attitude, and the dependence has to be computed rather than assumed.

## Exercise

Compute the change in window width from vertical to 30 degrees along each of the two azimuths, and note the signs.

Then say what a well planner should do with a target that can be reached from either direction.
