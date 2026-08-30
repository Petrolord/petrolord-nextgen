# A vertical hole has no azimuth

The one case where direction does not matter, and the one thing that still does.

{{panel:gm-stability-explorer}}

## The claim

Drill a vertical hole and its azimuth is meaningless. There is no direction to a vertical line.

So the collapse pressure, the fracture initiation pressure and the window width are all independent of the azimuth you nominally give it.

## The engine agrees

At 2500 m, a vertical hole at azimuths of 0, 60 and 150 degrees all give:

| quantity | value |
|---|---|
| collapse EMW | 318.0216274260011 kg/m3 |
| fracture EMW | 2339.3030058401414 kg/m3 |
| window width | 2021.2813784141406 kg/m3 |

Identical to every digit, at all three azimuths.

## The thing that does change

The BREAKOUT ANGLE.

| nominal azimuth | breakout angle from the high side |
|---|---|
| 0 deg | 150 deg |
| 60 deg | 90 deg |
| 150 deg | 0 deg |

## Why

Because the breakout angle is measured from the hole's own high side, and the high side of a nominally vertical hole is defined by the azimuth you gave it.

The breakout is in the same PHYSICAL place in all three runs: 90 degrees from the SHmax azimuth of 60 degrees, which is 150 degrees of compass bearing. Only the reference direction moved.

## Reading that as a check

Add the nominal azimuth to the reported breakout angle and you should get the same compass bearing every time. Here: 0 plus 150, 60 plus 90, and 150 plus 0 all give 150 degrees.

If they did not, the rotation would be wrong, and this is a cheap test of a stress rotation that costs nothing to run.

## The physical result

Breakouts on a vertical well form along the MINIMUM horizontal stress direction, which is 90 degrees from SHmax.

That is the basis of stress-orientation interpretation from caliper and image logs, and it is worth knowing that it comes out of the arithmetic rather than being asserted.

## Where it stops being true

The moment the hole deviates. Then the azimuth is real, the window depends on it, and the breakout angle no longer has the simple relationship above.

## Exercise

Run the panel at 2500 m with a vertical hole at three azimuths of your own choosing and confirm the breakout bearings all agree.

Then set 5 degrees of inclination and repeat, and say how large the difference is.
