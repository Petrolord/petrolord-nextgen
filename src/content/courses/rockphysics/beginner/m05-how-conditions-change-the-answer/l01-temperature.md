# Temperature

Every fluid number you have used so far in this course carried the same label: 60 degC and 25 MPa. That label is not decoration. A density or a bulk modulus quoted without the conditions it was computed at is an incomplete statement, in the same way a depth without a datum is incomplete. This module takes the conditions off the shelf and moves them one at a time, so you can see how much of the answer they control. It starts with temperature, because temperature holds the one result that surprises most people the first time they meet it.

## Brine from 20 to 100 degC

Hold the pressure at 25 MPa and the salinity at 35,000 ppm, which are the Ekene reservoir values, and move only the temperature.

| T (degC) | rho (kg/m3) | K (GPa) | vp (m/s) |
| --- | --- | --- | --- |
| 20 | 1032.1697 | 2.511437 | 1559.8600 |
| 40 | 1026.0469 | 2.642625 | 1604.8488 |
| 60 | 1017.8250 | 2.697811 | 1628.0556 |
| 80 | 1007.5722 | 2.689136 | 1633.6850 |
| 100 | 995.3571 | 2.629247 | 1625.2726 |

The 60 degC row is the Ekene brine you have been carrying since module two: 1017.8250 kg/m3 and 2.697811 GPa. Every other row is the same brine, at the same pressure and the same salt content, sitting at a different temperature.

## Density behaves the way you expect

Read the density column from top to bottom. It falls at every step, from 1032.1697 kg/m3 at 20 degC down to 995.3571 kg/m3 at 100 degC. Warm water expands, so the same mass occupies more space and the density drops. That is the intuition almost everybody brings to the table, and for density it holds across the whole range.

Density is the well behaved half of the pair. It moves smoothly, it moves in one direction only, and it never turns around. If you know the temperature is higher, you know the brine is lighter.

## Bulk modulus does not

Now read the K column the same way. It rises from 2.511437 GPa at 20 degC to 2.642625 GPa at 40 degC and 2.697811 GPa at 60 degC. Then it turns over. At 80 degC it is 2.689136 GPa, which is below the 60 degC value. At 100 degC it is 2.629247 GPa, which is below the 40 degC value as well.

Brine bulk modulus is not monotonic in temperature. It peaks somewhere between 60 and 80 degC and falls away on both sides of the peak.

This is a real property of water and not an artefact of the correlation. Two effects compete. Cold water carries a loose hydrogen bonded structure with open space in it, and that structure is easy to compress, so cold brine is soft. Warming breaks the structure down and the liquid packs more efficiently, which stiffens it. Push the temperature far enough and thermal expansion takes over, the molecules sit further apart, and the liquid softens again. The stiffest brine is the one where those two effects balance, and at 25 MPa and this salinity that balance sits between the 60 degC and 80 degC rows.

## Velocity peaks somewhere else again

The last column makes the point sharper. Sound speed in a fluid depends on both numbers through $v_p = \sqrt{K/\rho}$, so it inherits the shape of the stiffness and the shape of the density at the same time.

The stiffest brine in the table is at 60 degC. The fastest brine in the table is at 80 degC, at 1633.6850 m/s. Velocity keeps climbing for one more row after stiffness has already begun to fall, because the density is still dropping and a lighter fluid transmits a wave faster for the same stiffness. By 100 degC the stiffness has fallen far enough that velocity gives up too, at 1625.2726 m/s.

Three columns, three different shapes, one fluid. Nothing here is anybody's fault. It is what a fluid property surface looks like.

## A property is a surface, not a trend

The habit this lesson is trying to break is the mental picture of a fluid property as a trend line with a slope you can carry around. Learn the slope at 20 degC and you would predict that hot brine is stiff. Learn it at 100 degC and you would predict that hot brine is soft. Both are readings of the same table, and neither survives outside the range it was taken from.

Treat each property as a value on a surface over temperature, pressure, salinity and composition. You evaluate it at the conditions you are working at. You do not extrapolate from a slope you measured somewhere else.

The practical bite is easy to size. Suppose you had taken brine properties from a bench measurement at 20 degC and used them for the Ekene sand at 60 degC. You would carry 2.511437 GPa instead of 2.697811 GPa, and 1032.1697 kg/m3 instead of 1017.8250 kg/m3. The capstone grades brine bulk modulus to a tolerance of 0.005 GPa and brine density to 0.5 kg/m3, so both of those would be wrong by a wide margin, and every mixed fluid built from them would be wrong too.

## Exercise

Using the table above and nothing else, write down which row holds the stiffest brine and which row holds the fastest brine, then write one sentence explaining why those are two different rows. Then say what a plot of K against temperature would look like between 20 and 100 degC, in one sentence.

As a self check: the stiffest brine is the 60 degC row at 2.697811 GPa, and the fastest brine is the 80 degC row at 1633.6850 m/s. They differ because velocity is $\sqrt{K/\rho}$ and the density is still falling at 80 degC, from 1017.8250 to 1007.5722 kg/m3, which buys enough extra speed to more than cover the small loss of stiffness from 2.697811 to 2.689136 GPa. A plot of K against temperature would rise from 2.511437 GPa at 20 degC, flatten through a maximum between the 60 degC and 80 degC rows, and then fall away to 2.629247 GPa at 100 degC, so it is a hump and not a straight line.
