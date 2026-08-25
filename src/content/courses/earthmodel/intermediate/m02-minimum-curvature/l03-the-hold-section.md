# The hold section

From 1500 to 1900 m MD, W2's survey reports the same attitude at both ends: 45 degrees inclination, azimuth 090. The dogleg is zero, the ratio factor is 1, and the arc degenerates into what it should: a straight, slanted line. This lesson is about that line, because two of the three graded picks land on it.

## The 45 degree split

At 45 degrees the direction cosines are equal: $\sin 45^\circ = \cos 45^\circ = 0.7071067811865476$. Every metre of hole in the hold buys exactly as much east as down:

$$\Delta E = \Delta MD \times \sin 45^\circ, \qquad \Delta z = \Delta MD \times \cos 45^\circ$$

Per 100 m of measured depth, that is 70.71067811865474 m east and 70.71067811865476 m of vertical depth. The full hold, 400 m of hole, travels 282.84271247461896 m in each direction, landing station 1900 at x 1794.719681048036 and TVD 1752.9376073217509.

This is also why W2's zone intervals shrink when converted to rock. The well logs zone A over 120 m of measured depth, from 1580 to 1700, but nearly all of that interval lies in the hold, so the vertical thickness of rock crossed is close to $120 \cos 45^\circ$: the true figure, from the trajectory, is 84.8528137423857 m, which is $60\sqrt{2}$. Zone B's 60 m of hole is 42.42640687119297 m of vertical rock, $30\sqrt{2}$. A deviated well always logs MORE hole than rock, by the factor $1/\cos I$, and at 45 degrees that factor is $\sqrt{2}$.

## Where the picks sit

Only W2's TopA pick, at 1580 m MD, is near the build at all, and even it is 80 m past the build's end. TopB at 1700 and BaseB at 1760 are 200 and 260 m into the hold. So the landing arithmetic for W2's picks barely touches the arc: it is the build's endpoint plus a straight-line extension. That will make next lesson's interpolation story unusually clean, and it is worth knowing that the fixture was built this way on purpose: the subtleties of arcs and of interpolation are separated into different parts of the hole so each can be tested alone.

## The attitude is measured, not planned

A hold section in a real well is never perfectly straight; the survey stations simply record matching attitudes at 1500 and 1900, and minimum curvature draws the straightest path consistent with them. If the hole wandered between stations, that wander is invisible to the method and to everyone downstream of it. The defence is denser stations, not a cleverer formula: with stations every 30 m, wander shows up as small dogleg per segment; with stations 400 m apart, it cannot show up at all. The golden fixture's sparse stations are a teaching choice, and the panel's smooth white line should be read as "the smoothest consistent path", not "the path".

## Worked example

Land station 1900 by hand from station 1500. Start: x 1511.876968573417, TVD 1470.0948948471319 (last lesson's arc endpoint). The hold covers 400 m of hole at 45 degrees east: east $400 \times 0.7071067811865476 = 282.84271247461896$ m, down the same. So x $= 1511.876968573417 + 282.84271247461896 = 1794.719681048036$ and TVD $= 1470.0948948471319 + 282.84271247461896 = 1752.9376073217509$. Both match the engine's stored station to the last digit, because a zero-dogleg segment involves no approximation of any kind.

## Exercise

Compute how much rock W2 crosses per 100 m of measured depth in the hold, and how far east it travels in the same 100 m. Then compute the same two numbers for a hold at 30 degrees inclination, and state which of the two wells would log more hole per metre of vertical rock.
