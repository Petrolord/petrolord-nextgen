# The run

The run time is the simplest answer in the course. It is a length over a speed, and its simplicity is what makes the assumption inside it easy to miss.

{{panel:fc-wall-pig-explorer}}

## Length over speed

A sphere crosses the OGBIA line, 26400.000000 ft of it, at 3.000000 ft/s, and the engine returns 2.444444 hours. It reports that figure beside the speed it was given, which is the engine being explicit that the speed was handed to it.

The three published runs are all driven at 5.000000 ft/s.

| length ft | run h |
| --- | --- |
| 8000.000000 | 0.444444 |
| 30000.000000 | 1.666667 |
| 52800.000000 | 2.933333 |

Nothing about the fluid appears in any of those rows. The density, the viscosity and even the holdup that the same call used to work out the sweep are all absent from it.

## The constant, measured out of the engine

Hours come from seconds through one conversion, and the package measures it rather than typing it. A length over the pig speed, divided by the engine's own run time in hours, returns 3600.000000 seconds per hour.

## The speed is a choice, and it is not the flow velocity

The OGBIA line carries its duty at a velocity of 2.244621 ft/s, and the sphere in these runs is driven at 3.000000 ft/s. Those are two different numbers about the same pipe on the same day.

A pig is pushed by the fluid behind it and it does not travel at the fluid's average velocity by default. This engine does not attempt the relationship. It takes the speed as an input, so the run time is exactly as good as the speed somebody stated.

## What it refuses

A pig that does not move has no run to report: "a pig run needs a positive length and speed". A zero speed would give no arrival at all and a zero length no journey, so the engine names both.

## The mistake

The mistake is passing the line velocity as the pig speed because both are feet per second. They are different quantities, the engine cannot tell them apart, and the run time it returns will be wrong by whatever the difference is.

The second mistake is planning an operation on the run time alone. The run is when the pig arrives. What arrives with it is the swept volume, and the interval between runs is a third question again, so a pigging plan needs all three.

## Exercise

Give the OGBIA run time with the length and speed behind it, and say what the engine reports beside it and why. Then give the seconds per hour the package measures out of the engine, explain why the pig speed is not the line's flow velocity, and give the refusal for a pig that does not move.
