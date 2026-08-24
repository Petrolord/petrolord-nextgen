# The Ekene SAND at depth

Every number in this course comes from one rock in one place, described completely before any calculation starts. Here is that description.

| Condition | Value |
| --- | --- |
| Temperature | 60 degC |
| Pressure | 25 MPa |
| Brine salinity | 35,000 ppm, which is 0.035 weight fraction |
| Gas gravity | 0.6 |
| Oil gravity | 35 API, density 0.85 g/cc at surface |
| Solution gas to oil ratio | 50 L/L |
| Mineral frame | 70 percent quartz, 30 percent clay |

Seven lines. Read them as the specification of a calculation rather than as background colour, because every one of them changes an answer later in the course, and leaving any of them out makes the fluid properties unquotable.

## Temperature and pressure are the state of the rock

A fluid is not a substance with fixed properties. It is a substance in a state, and temperature and pressure are that state. Take the same gas, of the same composition, and put it in three different places.

| Pressure at 60 degC | Gas density (kg/m3) | Gas K (MPa) |
| --- | --- | --- |
| 10 MPa | 69.5252 | 17.7074 |
| 25 MPa | 172.6668 | 55.7187 |
| 40 MPa | 237.8996 | 111.3929 |

Between 10 and 40 MPa the density climbs from 69.5252 to 237.8996 kg/m3 and the bulk modulus climbs from 17.7074 to 111.3929 MPa. Nothing about the gas itself changed. Only the depth at which you asked the question changed.

This is why the Ekene SAND is specified at 60 degC and 25 MPa rather than at a depth in metres. Depth is a proxy. What the physics responds to is the pressure and the temperature at that depth, which depend on the local gradients, and two fields at the same depth in different basins can hold fluids with genuinely different properties. State the conditions and the calculation is reproducible. State a depth and it is not.

Pressure here is the pore pressure, the pressure of the fluid in the pore space, because that is the pressure the fluid is under. The Professional tier introduces the effective stress on the frame, which is a different quantity and drives a different set of effects. At this tier the 25 MPa acts on the fluids only.

## Salinity, gas gravity and GOR are the composition

Three of the seven lines describe what the fluids are made of rather than where they sit.

Brine salinity of 35,000 ppm is dissolved salt, given to the engine as a weight fraction of 0.035. Salt makes water heavier and stiffer, and the effect is large enough that quoting a brine modulus without a salinity is close to meaningless. Module 2 puts numbers on it.

Gas gravity of 0.6 is the density of the gas relative to air, and it stands in for composition. A gravity near 0.6 is close to dry methane. Heavier gravities carry more of the heavier hydrocarbon components, and they behave differently under the same pressure and temperature.

Solution gas to oil ratio of 50 L/L says how much gas is dissolved in each unit volume of oil at these conditions. It is the difference between the oil you would sample at surface and the oil that is actually down there. Its effect is large and it runs in one direction:

| GOR at 60 degC and 25 MPa | Oil density (kg/m3) | Oil K (GPa) |
| --- | --- | --- |
| 0 | 820.9856 | 1.475341 |
| 50 | 777.0630 | 1.142795 |
| 150 | 693.8631 | 0.715855 |

Dissolved gas makes the oil lighter and much softer at the same time. Between GOR 0 and GOR 150 the bulk modulus falls from 1.475341 to 0.715855 GPa. If someone hands you an oil modulus without a GOR, they have handed you a number that cannot be placed anywhere on that range.

## The frame is 70 percent quartz and 30 percent clay

The last line describes the solid. The Ekene SAND is a shaly sand, and the split matters because quartz and clay are not similar materials. Quartz has a bulk modulus of 36.6 GPa and a shear modulus of 45.0 GPa. Clay has a bulk modulus of 20.9 GPa and a shear modulus of 6.9 GPa.

Look at the shear values. Quartz is about 6.5 times stiffer in shear than clay. Module 3 shows what that does to the confidence you can place in a mixed frame, and the answer is different for the two moduli, which is a result worth arriving at properly rather than being told now.

## Why a fluid property without its conditions is worthless

Suppose a report tells you the reservoir brine has a bulk modulus of 2.534420 GPa, with nothing else attached. You cannot use it, and you cannot check it, for a specific reason.

Several different reservoirs produce a value close to that. Fresh water at 60 degC and 25 MPa gives exactly 2.534420 GPa. The Ekene brine at its full 0.035 salinity but at 20 degC instead of 60 gives 2.511437 GPa, close enough that a reader shown two significant figures could not tell the two cases apart. Each of those is a different reservoir with a different answer for every downstream calculation the modulus would feed. The number does not identify its own case.

The habit to build now is a small one and it will save you repeatedly. Whenever you write down a fluid property, write the conditions beside it in the same line. Whenever you receive one without conditions, ask for them before using it. In this course, every fluid value is quoted at 60 degC and 25 MPa, and every time the conditions move, the whole set moves with them.

## Exercise

From the specification table, sort the seven lines into two groups: the ones that describe where the fluid is and the ones that describe what the fluid is made of. Then answer one question in a sentence. If a colleague sends you an oil bulk modulus of 1.475341 GPa for a field you have never worked, what is the first thing you ask for, and why?

Self check: the state lines are temperature 60 degC and pressure 25 MPa. The composition lines are brine salinity 0.035 weight fraction, gas gravity 0.6, oil gravity 35 API at 0.85 g/cc, solution gas to oil ratio 50 L/L, and the 70 to 30 quartz to clay frame, which describes the solid rather than a fluid. For the oil modulus you ask for the temperature, the pressure and the GOR, because 1.475341 GPa is what the Ekene oil gives at GOR 0, while the same oil at GOR 150 gives 0.715855 GPa, so without those conditions the number cannot be attached to a reservoir or checked against anything.
