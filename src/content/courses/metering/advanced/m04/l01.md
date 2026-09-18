# The wetted area, and the height that counts

{{panel:fc-withheld-explorer}}

The fire case begins with an area. A pool fire around a tank heats the shell that liquid is standing against, and the heat that gets into the tank grows with how much of that wetted shell the flame can reach, by a relation that changes from band to band. Getting the area right is the first half of the calculation, and it is not simply the wetted shell.

## What the engine returns for this tank

| quantity | value |
| --- | --- |
| wetted area, ft2 | 5881.0614 |
| effective wetted height, ft | 30.000000 |
| heat input band | above 2800 ft2 |

The wetted area is 5881.0614 ft2 and the effective wetted height is 30.000000 ft, on a tank whose shell height is 36.000000 ft and whose design liquid level is 34.600000 ft. The height that went into the area is lower than either.

## The cap, and where it comes from

The engine says why:

> only the wetted shell below 30 ft counts for fire venting (API 2000): a flame does not reach higher in the standard's basis

That is a limit inside the standard's own method rather than a modelling choice. The basis assumes a pool fire around the tank, and the heat input relation was established for the shell a flame of that kind envelops. Shell above that height is still wetted and is still steel, and the method does not credit it with taking heat from the fire.

The cap binds on tall tanks and it binds hard. Ask the engine for a 48 ft liquid column and the effective wetted height comes back as 30.000000 ft, exactly as it does here. A taller tank does not get a larger fire duty out of its extra height.

## Why this is the half that gets misread

The area is the input a reader is most likely to construct themselves, because it looks like geometry and geometry feels safe. A wetted area worked out as the full circumference times the full liquid height would be larger than the area the method wants, and it would look perfectly defensible on a drawing.

So take the area from the calculation that knows the cap. The engine returns the effective wetted height beside the area precisely so that a reviewer can see which height was used, and a wetted area with no height beside it is a number you cannot audit.

## What comes next, and what does not

From the area come a band and a duty, which the next lesson walks. After the duty comes the step that would turn it into a required vent capacity, and that step is where this engine stops and refuses. Nothing in this course grades a required emergency vent capacity, because the package cannot source one.

## Exercise

Read the fire case block in digest SECTION 28 and say which two returned figures let you check that the height cap is binding on this tank. Then say what the returned effective wetted height would be on a tank with a liquid column shorter than the cap.
