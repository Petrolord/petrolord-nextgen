# Two packagings measured out of the engine

pumps.js exports no constants. It names three internally, a percentage slack and the two ends of the speed band, and all three belong to work the Professional tier does rather than to this one. Every packaging it computes with is written inline at the point where it is used or imported. So the only honest way to say what is inside it is to ask the engine a question it can only answer one way.

{{panel:fc-pump-explorer}}

## Measuring rather than reading

The method is the same each time. Choose inputs that make every other term in the expression equal to one, call the export, and read the packaging straight off the return. Four of them come out like this:

- feet of head per psi at specific gravity one, taken from psiToHeadFt at one psi: 2.310000000
- the field horsepower packaging, taken from one over the hydraulic power at unit flow, unit head, unit gravity and unit efficiency: 3960.000000
- kilowatts per horsepower, taken from the motor input in kW over the motor input in hp at a motor efficiency of one: 0.745699871582
- the default motor efficiency, taken from the brake power over the motor input when the argument is left out entirely: 0.940000000000

## What each one is

The first two are the field packagings this course lives in. 2.310000000 turns feet of head into psi and back, and 3960.000000 turns gallons per minute, feet and specific gravity into horsepower. Both of them carry a density inside, which is the subject of the next lesson.

The third is a unit conversion rather than a field packaging. It comes from the shared units file that both of these engine modules read. pumps.js takes the kilowatt conversion from it and compression.js takes the two it needs from the same file, so one definition of a horsepower serves the liquid machine and the gas machine.

The fourth is not a constant at all. It is a default: the motor efficiency the engine assumes when the caller states none. The power lesson stated a motor efficiency of 0.920000 and the engine used it. Omit the argument and the engine quietly uses 0.940000000000.

## Why a default is worth measuring

A default is an easy number to miss, because it produces a complete answer with nothing on screen to say it was assumed. Measuring it is the only way to know what it is, and knowing what it is the only way to decide whether it is right for the station in front of you.

The engine's choice here is a reasonable one for a large industrial motor, and it is still an assumption. A reader who states the efficiency has made a decision. A reader who omits it has also made a decision and may not know it.

## The mistake

Quoting a packaging from memory. These four figures came out of the engine that shipped, one measurement each, and that is the only claim this course makes about them. A constant remembered from a handbook may be the same, and it is a different kind of statement.

## Exercise

Describe the single call that measures the field horsepower packaging and give the figure it returns. Then give the default motor efficiency, say how it was measured, and say why a default is worth a measurement of its own.
