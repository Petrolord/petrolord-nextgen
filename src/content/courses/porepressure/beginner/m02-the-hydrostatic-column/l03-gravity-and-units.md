# Gravity and units

Pore pressure work is arithmetic on quantities that arrive from several sources, in whatever units each source was built in. Most errors in a prognosis are errors of bookkeeping rather than errors of physics, and they survive review because a wrong number in the right format looks like a right one.

This lesson is the bookkeeping. Depths are metres below mudline.

## The value of g

This engine uses

$$g = 9.80665 \text{ m/s}^2$$

That is the standard value, defined rather than measured. True local gravity varies with latitude and elevation, and this field does not correct for that, so a defined constant is used and stated.

The reason to state it precisely is that $g$ never appears alone. It is always multiplied by a column, and the column here is large. Add the two parts of the golden well's hydrostatic column as mass per unit area:

$$1025 \times 100 + 1030 \times 4000 = 4222500 \text{ kg/m}^2$$

The graded hydrostatic pressure at 4000 m below mudline is that figure multiplied by $g$, and nothing else enters. The answer is proportional to the gravity constant you chose, so any error in $g$ is multiplied by the whole 4222500 kg/m2 column.

Here is what that does. The same column, computed three times, changing only $g$.

| g used | hydrostatic at TD | error against the engine |
| --- | --- | --- |
| 9.8 | 41.380500000 MPa | -0.028079625 MPa |
| 9.80665 | 41.408579625 MPa | 0 (the graded value) |
| 9.81 | 41.422725000 MPa | +0.014145375 MPa |

The capstone tolerance on that field is 0.01 MPa. Both rounded values of gravity fall outside it, so both are marked wrong.

Read the 9.81 row again, because that is the value people actually reach for. It returns 41.422725000 MPa at 4000 m below mudline where the engine returns 41.408579625 MPa, an error of +0.014145375 MPa, which is 14 kilopascals. That value has the right magnitude, the right unit and a plausible spread of digits, and nothing on the page announces that it came from a rounded constant. It looks right, it is wrong, and it fails the check.

The 9.8 row is further out and on the other side, low by 0.028079625 MPa. The two rounded constants do not even agree about which way the answer moves, so a habit of rounding gravity does not produce a consistent bias you could correct for later.

This is not a point about decimal places for their own sake. Use 9.80665 m/s2 throughout. When you inherit a pressure from somebody else, ask what gravity it was computed with before you compare it against yours, since a disagreement of a few tens of kilopascals between two hydrostatic curves is more often two constants than two geologies.

## Pascals and megapascals

The SI unit of pressure is the pascal, one newton per square metre, and it is a small unit for this work. The hydrostatic pressure at 4000 m below mudline in the golden well is 41408579.625 Pa.

Dividing by one million gives megapascals, and the same pressure is 41.408579625 MPa. Nothing has changed except the label. The convention in this course is to compute in pascals, because that is what the equations return when densities are in kg/m3 and depths are in m, and to report in megapascals, because that is the scale a well is discussed at.

The dangerous moment is the boundary between the two. A pressure a factor of a million out is usually caught, because it is absurd. A pressure out by a factor of a thousand, from a kilopascal reading treated as a pascal, is merely wrong, and it can pass through several steps unnoticed. Label every intermediate value with its unit.

## Densities and transit times

Densities in this course are in kg/m3, so seawater is 1025 kg/m3, the pore fluid is 1030 kg/m3, and the bulk density at the mudline in the golden well is 1900 kg/m3.

The competing convention is g/cc, in which those three numbers read 1.025, 1.030 and 1.900. A density log in a real LAS file is often in g/cc, and the factor between the conventions is a thousand. A density curve left in g/cc and fed to an overburden integration that expects kg/m3 gives an overburden a thousand times too small.

Transit times here are in us/m, microseconds per metre, so the sonic at the mudline in the golden well reads 656 us/m. The other convention is us/ft, and a trend fitted to us/ft picks then applied to a us/m log returns parameters that look plausible and are wrong.

## A pressure is not a gradient

A pressure is a quantity at a depth. It has units of Pa or MPa, and it means nothing without the depth attached. Saying that the hydrostatic pressure is 41.408579625 MPa says nothing until you add that it applies at 4000 m below mudline in 100 m of water.

A gradient is a rate of change of pressure with depth. It has units of pressure divided by length, such as Pa/m or kPa/m, and it describes an interval rather than a point.

A third quantity resembles a gradient without being one. An average gradient from a datum down to a depth is the total pressure divided by the total height, and in density units that is equivalent mud weight, the subject of the next lesson.

The practical rule is that a pressure always travels with a depth and a datum. If you write a pressure in a report without saying at what depth it applies and what that depth is measured from, you have not written an answer.

## The habit

Write the unit next to every number, including the intermediate ones on scrap paper. Check the datum before comparing two figures from different people, since below mudline and below sea level differ by the water depth in every marine well. Carry full precision through the arithmetic and round only when you report, because a tolerance of 0.01 MPa on a value of 41.408579625 MPa leaves no room for accumulated rounding.

A number without a unit is not an answer.

## Exercise

Compute the hydrostatic pressure at 4000 m below mudline in the golden well twice, once with g = 9.80665 m/s2 and once with g = 9.81 m/s2, using the column figure of 4222500 kg/m2. Report both in MPa, state the difference, and say whether the second one would pass a capstone tolerance of 0.01 MPa. Then say which of a pressure and a gradient has to be quoted with a depth attached.

Self check: with g = 9.80665 m/s2 the answer is 41.408579625 MPa, which is the graded value, and with g = 9.81 m/s2 it is 41.422725000 MPa. The difference is +0.014145375 MPa, which is 14 kilopascals and larger than the 0.01 MPa tolerance, so the rounded value is marked wrong even though it looks entirely reasonable on the page. A pressure is the quantity that has to carry a depth and a datum with it, since a gradient already describes a rate over an interval rather than a value at a point.
