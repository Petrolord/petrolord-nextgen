# Heat leaves through layers

Heat leaving a flowline has one route out and it crosses everything on that route. Nothing is bypassed, so the obstacles add.

{{panel:pd-thermal-explorer}}

## The bare pipe has three terms

Strip the published pipe to its steel wall and the stack has three entries: the film on the bore, the wall itself, and the film on the outside. Each is a resistance per foot of pipe, in hr ft degF/Btu, and the engine returns the share each one carries.

| Term | Resistance, hr ft degF/Btu per foot | Share, percent |
| --- | --- | --- |
| Inside film | 0.0025191879 | 42.39197245 |
| Carbon steel wall | 0.0005406116 | 9.09721378 |
| Outside film | 0.0028828065 | 48.51081376 |

Total 0.0059426060, and the three shares sum to 100.00000000 percent. Overall U comes back as 105.9799311355 Btu/(hr ft2 degF), referred to the 6.065 in bore.

## Series, not parallel

A joule that leaves the fluid has to cross the boundary layer on the bore, then the steel, then the boundary layer on the outside. There is no second path. That is what puts these in series, and series resistances add rather than averaging.

The consequence is worth stating plainly. One large term is enough to control the answer, and adding a second large term next to a first one does far less than the first one did. That is the whole behaviour of an insulated line in one sentence, and it is why a stack with a dominant term is easy to reason about and a stack without one is not.

## The steel is not the insulation

On this bare pipe the two films carry 42.39197245 percent and 48.51081376 percent. The steel wall, the strongest and thickest-sounding thing in the drawing, carries 9.09721378 percent. Most of a bare subsea pipe's thermal resistance is two thin layers of fluid clinging to its faces.

The outside film at 200.0000 Btu/(hr ft2 degF) is a seabed with a current running over it. Take the current away, so that the pipe sits in still water, and the catalog value drops to 50.0000 and that term grows.

## The mistake

Reasoning about a wall as though its material mattered. Steel at k 26.0000 Btu/(hr ft degF) is a fine structural choice and a hopeless insulator, and swapping steel grades changes nothing at all in this table.

## What the stack refuses

`overallU` will not build a pipe with no wall. Called with no layers it returns `ok = false` and "A pipe needs at least one layer: its own wall." The films alone are not a pipe.

## Exercise

In the panel, build the bare 6.065 in by 6.625 in steel pipe with the published films and record the three resistances and their shares.

Then say which single term you would attack first if you had to bring this pipe's U down, and why it is not the steel.
