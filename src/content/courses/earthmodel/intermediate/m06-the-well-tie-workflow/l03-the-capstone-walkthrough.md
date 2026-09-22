# The capstone walkthrough

The capstone gives you a well of its own: a head location and KB, a three-station survey (vertical to a kick-off, built to an inclination and azimuth, held to TD) and three picks in MD. It asks for six numbers from tying that well to the golden framework. This lesson walks the derivation of each on W2, the golden deviated well, with the panel open for verification. None of W2's numbers is a capstone answer; the value of the walkthrough is seeing the six as one connected computation you can then run on the capstone's well.

The tie explorer opens on W2. For the capstone, choose "Type a well" and type the brief's head, survey and picks.

{{panel:em-tie-explorer}}

## Field one: the TVDSS at the TopA pick

On W2: build endpoint at station 1500 (x 1511.876968573417, TVDSS 1440.0948948471319), then linear interpolation at fraction $0.2$ toward station 1900. TVDSS $= 1440.0948948471319 + 0.2 \times 282.84271247461896 = 1496.6634373420557$. Every digit is closed-form: an arc, a hold and a fraction. On the capstone's well the arc ends at its own station and the hold runs at its own inclination and azimuth, so the east and north steps both move.

## Fields two through four: the well's three residuals

Residual = pick TVDSS minus the clamped surface at the pick's landed x and y. On W2 the TopB pick lands at fraction 0.5 into the hold, TVDSS 1581.5162510844414, and the clamped TopB at the landing blends columns 13 and 14 on row 4 to 1573.1978994886435, so the residual is plus 8.318351595797822.

The sign is kept: positive means the pick sits deeper than the surface. The surface is read where the pick LANDS, not at the wellhead. On a deviated well the three picks land at three different places, so each one samples its surface somewhere else.

## Fields five and six: the zone A control point

Zone A runs from the TopA pick to the TopB pick. The control point is the zone's MD midpoint, landed along the path. On W2 the interval is 1580 to 1700, midpoint MD 1640, landed at fraction 0.35 into the hold: x $= 1511.876968573417 + 0.35 \times 282.84271247461896 = 1610.8719179395334$, y 2200 because W2 builds due east.

The capstone asks for both coordinates, because its well does not build along an axis. The wrong but plausible answers each tell a story: the wellhead x and y mean the vertical assumption; the TopA landing reused means the midpoint was never taken; the TopB landing means the same.

## The connected picture

One trajectory feeds all six fields. A candidate whose machinery is subtly wrong fails specific fields in diagnosable ways: a TopA depth that is right with residuals that are wrong points at the surface sampling; residuals right with a wrong control point points at the midpoint. That is what makes it a practical exam rather than a quiz: the six numbers are one pipeline's outputs, and the pipeline is the thing being graded.

## Worked example

Run W2 in the panel now: read TopA TVDSS from the pick-versus-surface tile, the three residuals from their tiles, and the control point from its tile. Then switch the trajectory to the straight vertical hole and watch the TopA residual change sign. Then choose "Type a well", which starts from W2's shape, change the azimuth from 90 to 180 and watch the control point move from east of the head to south of it.

## Exercise

For each of the six fields, name the single earlier lesson whose content most directly derives it, and the most likely wrong answer a candidate would produce by skipping that lesson. Six lines.
