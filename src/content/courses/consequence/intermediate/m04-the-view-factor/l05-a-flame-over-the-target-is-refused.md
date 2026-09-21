# A flame over the target is refused

{{panel:cq-fire}}

Tilt a flame far enough toward a target close to the pool and the top of the flame passes over the target's head. The target is then under the flame, and the closed form view factor gives an answer that looks reasonable and is wrong. The engine refuses that case outright. This lesson shows where the line is, why the engine draws it and what the refusal says.

## Where the line is

The flame's top lies downwind of the base centre by the flame length times the sine of the tilt, and the base edge lies one radius out. In the ratios of this module, the flame reaches over the target when 1 + a sin(tilt) is at or above b, with a = L / R and b = X / R. The engine checks that condition before it computes anything. For the stated flame of radius 10 m and length 30 m, the sweep shows the refusal rows:

| distance from axis m, stated | at 20 degrees | at 40 degrees |
| --- | --- | --- |
| 15 | `tiltDeg` | `tiltDeg` |
| 20 | `tiltDeg` | `tiltDeg` |
| 30 | Fmax 0.229458544930 | Fmax 0.326573126713 |

At 30 m both tilts return a view factor. At 15 and 20 m both lean over the target, and the engine names the field `tiltDeg`.

## The engine's words

> tiltDeg: the tilted flame reaches over the target (1 + (L/R) sin(tilt) >= X/R): the closed form does not apply to a target under the flame

The message carries its own condition, so a reader can check it from the inputs by hand.

## Why the closed form fails under the flame

The engine's validation record tested the closed form beyond its line against a second route, a numerical integration over the flame surface the target can actually see. These are overhang probes, from the golden:

| probe, golden | closed form Fv | route B Fv | closed form Fh | route B Fh |
| --- | --- | --- | --- | --- |
| a 2, b 1.5, tilt 30 degrees | 0.394516 | 0.401252 | 0.433471 | 0.433471 |
| a 3, b 2.5, tilt 45 degrees | 0.291402 | 0.297689 | 0.350015 | 0.350015 |
| a 3, b 2.2, tilt 60 degrees | 0.303765 | 0.374215 | 0.609719 | 0.609719 |

Under the flame the closed form counts flame surface behind the target as seen. Its Fv is wrong in every probe, while its Fh stays right. At a 60 degree tilt the closed form Fv is 0.303765 against 0.374215 from the integration.

## A judgement, declared

The Yellow Book states no domain for the formula. The refusal is the engine's own judgement, and it declares it as such. Returning a number known to be wrong would be worse than returning none, so the engine names the field and stops. The caller then knows the target is under the flame, with burning gas overhead.

## The other refusal of the geometry

A target at or inside the flame base is refused as well, naming `distanceFromAxisM`:

> distanceFromAxisM: the target is at or inside the flame base: a view factor model needs the target outside the flame

## Exercise

In the fire panel's view factor view, enter the stated flame of radius 10 m and length 30 m at a tilt of 20 degrees. Move the target from 30 m toward the pool in small steps and note the last distance that returns a view factor and the first that returns the refusal. Using the condition quoted in the message, check by hand that your two distances straddle the line.
