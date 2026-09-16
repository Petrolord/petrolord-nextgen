# The band the answer is honest in

Three separate limits sit on the water answer. One refuses outright. One warns that the fit is being extrapolated. One warns that the method itself is being extrapolated. Telling them apart is the point of this lesson.

{{panel:fc-water-explorer}}

## The fit limit, which refuses

The Magnus fit holds over a stated band of temperature and the engine will not answer outside it. Read from both sides of both edges:

| degF | degC | the engine |
| --- | --- | --- |
| -49.000001 | -45.000001 | refuses |
| -49.000000 | -45.000000 | answers 0.153343 lb/MMscf |
| 140.000000 | 60.000000 | answers 275.732705 lb/MMscf |
| 140.000001 | 60.000001 | refuses |

Both edges are inclusive. The engine answers at exactly the edge and refuses a millionth of a degree outside it. A guard that refused its own stated limit would be as wrong as one that accepted anything at all.

This behaviour is live. The gas temperature box in the studio takes any number, and a gas at 200.000000 degF is an ordinary thing to type. The whole dehydration tab refuses it by name: the Magnus water saturation fit holds from -45 to 60 degC (-49 to 140 degF), and 200 degF is 93.3 degC. The refusal carries the band in both units and your own temperature converted, so you are told what to change and by how much rather than only that something is wrong.

## The publication limit, which warns

The coefficients were published over a narrower band than the one the module guards, from -40 to 50 degC. Between 50 degC and the guard at 60 degC the fit is an extrapolation of itself. The engine answers and attaches a note saying so, and the note states that the fit reads about 0.8 percent above the Antoine fit at 60 degC.

## The method limit, which also warns

Above about 1000.000000 psia the engine attaches a different note. Ideal mixing understates the water a real gas carries, and the departure grows with pressure until the real gas correction of the McKetta-Wehe chart runs to tens of percent. The note says to use a chart reading for design.

The first two limits are about the curve the engine draws. The third is about whether that curve is the right curve at all, and no arithmetic inside this module can settle it.

## Why the three stay separate

One band with one verdict would be simpler and it would hide three different failures. Outside the fit band the formula has no claim on the curve, so refusing is the only defensible thing to do. Between the published band and the guard the formula still tracks the curve and the engine can say how far it has drifted, so refusing would throw a usable number away. Above the pressure threshold the formula is sound and the physics behind it has run out, which is why that note points at a chart.

## The other refusals

A total pressure below the water vapour pressure is refused, and so is a pressure exactly at it, because a gas at its own water vapour pressure is all water and nothing else. A pressure of zero is refused, and so is a temperature below absolute zero at -459.67 degF.

## Exercise

Record what the engine does at -49.000000 degF, at 140.000000 degF and at 140.000001 degF. Then name the three limits in order and say, for each, whether it refuses or warns and whether it is about the fit or about the method.
