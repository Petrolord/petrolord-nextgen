# Fluids are not constants

Open an old handbook and you will find a table of fluid properties. Water, one row. Oil, one row. Gas, one row. Each row carries a density and sometimes a bulk modulus, and each is presented the way the density of steel is presented, as a property of the substance.

That table is the source of a great many wrong seismic interpretations, and this module exists to replace it.

## The Batzle and Wang idea

Batzle and Wang published a set of relations that treat reservoir fluid properties as functions rather than as constants. Their argument was straightforward and it has held up. The density and the bulk modulus of a reservoir fluid depend on the temperature, the pressure and the composition of that fluid, and over the range of conditions that real reservoirs occupy, those dependencies are strong enough to dominate anything else in the calculation.

Their relations take the conditions in and give the properties back:

- **Brine** takes temperature, pressure and salinity, and returns density, bulk modulus and compressional velocity.
- **Gas** takes temperature, pressure and gas gravity, and returns density and bulk modulus.
- **Live oil** takes temperature, pressure, the surface oil density and the solution gas to oil ratio, and returns density, bulk modulus and compressional velocity.

Those are the three functions the engine behind this course calls. Everything module 2 produces comes out of them, at the single set of conditions established in module 1: 60 degC, 25 MPa, brine salinity 0.035, gas gravity 0.6, oil at 0.85 g/cc with a GOR of 50 L/L.

## How strong are the dependencies

Strong enough that reading a value off a table is not a small approximation. One line for each fluid makes the case.

The Ekene brine, at 25 MPa and its stated salinity, has a bulk modulus of 2.511437 GPa at 20 degC and 2.697811 GPa at 60 degC. Move the temperature alone and the modulus moves by several percent.

The Ekene gas, at 60 degC and gravity 0.6, has a bulk modulus of 17.7074 MPa at 10 MPa of pressure, 55.7187 MPa at 25 MPa, and 111.3929 MPa at 40 MPa. Those three pressures span perfectly ordinary reservoir depths, and the modulus is unrecognisable from one end to the other.

The Ekene oil, at 60 degC and 25 MPa, has a bulk modulus of 1.475341 GPa with no dissolved gas, 1.142795 GPa at GOR 50, and 0.715855 GPa at GOR 150. Composition alone takes it from one end of that span to the other.

None of those three variations is a refinement. Each of them is large enough to change the sign of a conclusion about whether a bright amplitude could be gas.

## Which variable dominates which fluid

The three fluids do not respond to the same things, and knowing which lever matters for which fluid is most of the practical skill.

| Fluid | Moves it most | Also moves it |
| --- | --- | --- |
| brine | salinity | temperature |
| gas | pressure | gas gravity |
| live oil | dissolved gas, the GOR | pressure and temperature |

Those rankings are the ones this course can demonstrate with engine output, and lessons 2 to 4 show the tables behind each row.

The gas row is the one to watch. Gas is compressible, so its density and its modulus are both steep functions of pressure, and there is no regime in which a gas property can be quoted without its pressure. Brine sits at the other end. Water is close to incompressible, so its properties drift rather than leap, but its salinity changes it substantially and salinity varies enormously between basins and even between reservoirs in one field.

## The one that does not behave

Something in this module will not follow a simple rule, and it is worth being warned before you meet it. Brine bulk modulus is not monotonic in temperature. It does not rise steadily, and it does not fall steadily. It peaks somewhere in the middle of the range this course covers and falls away on both sides.

Lesson 2 shows the table. The reason it matters here is that it defeats the instinct that gets people through most of physics, which is to remember a direction rather than a relationship. Warmer does not mean softer for brine. It means softer at one end of the range and stiffer at the other, and the only reliable way to know which is to evaluate the relation at the conditions you actually have.

## What this course does with the dependency, and what module 5 does

Module 2 evaluates the three fluids once, at one set of conditions, and hands you six numbers to carry forward. That is the working answer.

Module 5 does something different with the same relations. It moves one condition at a time and reports how far each answer travels, which turns a set of qualitative statements about sensitivity into a quantified ranking. When you have to decide whether a poorly known salinity is worth an argument with the petrophysicist, that ranking is what settles it.

Hold the order in mind. This module computes. Module 5 measures how much the computation depends on its inputs. Both are necessary, and doing the second before the first produces sensitivity figures that nobody can anchor.

## A working habit

From here to the end of the course, a fluid property is written as a value, a unit, and the conditions it was evaluated at. All three, every time. It looks pedantic on a worksheet and it stops being pedantic the first time a number is passed between two people who each assumed a different reservoir temperature.

## Exercise

Write down, for each of the three fluids, the inputs its Batzle and Wang relation takes. Then answer two questions in one sentence each. Which fluid is most sensitive to pressure, and why would you expect that from what you know about the substance? What is the one non-monotonic behaviour this module will show you?

Self check: brine takes temperature, pressure and salinity. Gas takes temperature, pressure and gas gravity. Live oil takes temperature, pressure, the surface oil density and the solution gas to oil ratio. Gas is by far the most sensitive to pressure, because it is highly compressible, so squeezing it moves both its density and its resistance to further compression, and the Ekene gas modulus runs from 17.7074 MPa at 10 MPa to 111.3929 MPa at 40 MPa. The non-monotonic behaviour is brine bulk modulus against temperature, which peaks in the middle of the range covered here and falls away above and below that peak.
