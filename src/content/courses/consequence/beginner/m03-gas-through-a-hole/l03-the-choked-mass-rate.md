# The choked mass rate

{{panel:cq-release}}

Once a gas release is choked, its mass rate follows a simple rule: it is linear in the upstream pressure. Double the absolute pressure behind the hole and the rate doubles. The ambient pressure drops out, because the flow in the hole has reached the speed of sound and nothing downstream can reach back. This lesson reads that rule off the AMENAM gas line and then shows the independent check that stands behind every gas result the course grades.

## Linear in the upstream pressure

The choked rows of the AMENAM methane line, from the engine:

| upstream Pa, stated | Pa over P0 | regime | outflow coefficient psi | upstream density kg/m3 | mass rate kg/s |
| --- | --- | --- | --- | --- | --- |
| 250000 | 0.405300 | CHOKED | 1.000000 | 1.607640 | 0.129090 |
| 500000 | 0.202650 | CHOKED | 1.000000 | 3.215281 | 0.258180 |
| 2000000 | 0.050662 | CHOKED | 1.000000 | 12.861124 | 1.032722 |
| 10000000 | 0.010132 | CHOKED | 1.000000 | 64.305619 | 5.163609 |

From 250000 to 10000000 Pa the mass rate grows by, derived, 40.000000, exactly the pressure ratio of 40.000000. The reason sits in the density column. At a fixed temperature an ideal gas's density is proportional to its pressure, and the choked flow leaves the hole at a speed set by the temperature and the gas alone. More pressure packs more mass into each cubic metre that passes at that fixed speed.

In the engine's words, at or below the critical pressure ratio the downstream pressure cannot reach back into the hole. The choked rows carry psi at one, and ambient appears nowhere in them.

## What that means in practice

The linearity is useful as a sanity check. If a choked release at one pressure is known, the rate at another pressure on the same line, at the same temperature, follows by proportion. If a result on a choked line fails that proportion, an input has changed that you did not intend, such as a temperature or a molar mass typed in the wrong unit.

It also tells you where the uncertainty lives. On a choked line the upstream pressure, the hole area and the coefficient each move the rate in direct proportion. Ambient pressure does not move it at all, so a study of a choked release gains nothing by refining the weather's barometric pressure and a great deal by pinning down the hole.

## A second route behind the answer

The gas outflow this course grades carries an independent check, a route that never tests the critical ratio. For six gas cases the independent oracle maximises the isentropic nozzle mass flux over every throat pressure at or above ambient. Choking falls out of that maximisation by itself. The engine against that route:

| golden case | regime | engine kg/s | route B kg/s, golden | relative difference |
| --- | --- | --- | --- | --- |
| yb-hydrogen-t0 | CHOKED | 15.311760 | 15.311760 | 5.80e-16 |
| methane-choked | CHOKED | 3.614864 | 3.614864 | 2.46e-16 |
| nitrogen-subsonic | SUBSONIC | 0.016120 | 0.016120 | 2.15e-16 |
| air-barely-subsonic | SUBSONIC | 0.112711 | 0.112711 | 4.93e-16 |
| air-barely-choked | CHOKED | 0.113903 | 0.113903 | 3.66e-16 |
| co2-high-gamma-low | SUBSONIC | 0.216885 | 0.216885 | 3.84e-16 |

The two routes agree to within the rounding of double precision arithmetic. A mistake copied into both the engine's formula and the oracle's formula would survive a comparison of formulas. It would not survive this one, because route B never writes the choked formula down.

## Exercise

On the outflow view, run the AMENAM gas line at 500000 Pa and then at 2000000 Pa. Divide the two mass rates and compare the quotient with the ratio of the two pressures. Then change the upstream temperature on the second run and write one sentence on why the proportion with pressure only holds at a fixed temperature.
