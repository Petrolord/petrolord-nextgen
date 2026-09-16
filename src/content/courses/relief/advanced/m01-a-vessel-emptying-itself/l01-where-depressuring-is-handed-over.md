# Where depressuring is handed over

A pressure relief valve keeps a vessel from going over its set pressure. It does nothing about the inventory already inside. Emptying that inventory deliberately, through a fixed orifice into a flare header, is the fourth question this studio answers, and it is the one question in the course where the engine integrates rather than evaluates.

{{panel:fc-blowdown-explorer}}

## The seam you have just crossed

Cooldown and no-touch time belong to the Flow Assurance course, and that course names no depressurisation as its own scope exclusion. This is the lesson it points at. Everything about metal temperature during a blowdown stays there. What arrives here is the vessel, the gas in it, the hole it leaves through, and a clock.

## The case is still yours to choose

The thesis of this course holds here as firmly as it did over the valve. Every sizing route in this module takes a relief load as an input, and the one route that computes its own load computes it from geometry and from answers the caller states. The blowdown march is the same. It takes a start pressure, an end pressure, a volume, a temperature, gas properties, an orifice and a discharge coefficient, and it returns what those inputs demand. It has no opinion about which end pressure matters, which vessel governs, or whether the orifice you typed is the one on the drawing.

## The stream this module is written on

AFIESERE is a vessel depressuring into a flare, and every figure in this module comes from it. It states 720.000000 ft3 at 1240.000000 psia and 545.000000 degR, down to 145.000000 psia, molecular weight 20.000000, k 1.280000, z 0.880000, orifice 1.250000 in at a discharge coefficient of 0.820000.

On those inputs the march reaches the end pressure in 268.419002 s, which is 4.473650 min, at a final temperature of 340.807983 degR.

## What one call hands back

The march does not hand back a time and stop. Call it and you receive an object of eleven fields: the time, the whole trajectory as an array of stations, the final temperature, the final pressure, the mass left, the mass it started with, the number of steps, how many of those had to be subdivided, the time step it used, the pressure below which its choked assumption stops holding, and a warning slot. On AFIESERE as stated that last field reads `null`.

Read that list as a design. Six of the eleven are the answer, four exist so you can audit it, and the eleventh is the warning slot. A march that returned only a time would be asking you to trust its step size, its stopping rule and its flow assumption without showing you any of the three.

## Exercise

Write down the AFIESERE inputs as stated, and the time, the time in minutes and the final temperature they produce. Then list the eleven fields one call returns and mark the four you would use to audit the rest. Finally, name the course that owns cooldown and say in one sentence what this course does with the metal question.
