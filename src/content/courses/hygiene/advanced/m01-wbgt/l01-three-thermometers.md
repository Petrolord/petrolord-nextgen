# Three thermometers

{{panel:hy-heat-stress}}

The indoor reading set is a natural wet bulb of 26.400000 C and a globe of 38.700000 C, and through the indoor form it gives a WBGT of 30.090000 C. The outdoor set adds a dry bulb: 27.100000 C, 45.300000 C and 33.800000 C give 31.410000 C through the outdoor form. Both results are the NIOSH 2016-106 section 9.3.2 weighting, checked for transcription only, which is the same evidence status as the section 8.1 equation this tier meets in module two. No figure in this lesson is graded.

## What each thermometer reads

The wet bulb globe temperature is an index of heat stress built from three readings, and each one answers a different physical question.

The natural wet bulb is a thermometer whose bulb sits in a wet wick open to the air that moves past it. Evaporation from the wick cools it, so it reads lower in dry, moving air and close to the air temperature in still, humid air. The digest prints the weights and their transcription-only status and gives no rationale for them, so read the usual explanation as background: the natural wet bulb is taken to stand for the body's ability to cool itself by sweating, and that is the reason offered for the largest weight in both forms.

The globe is a thermometer at the centre of a hollow black sphere. It absorbs radiant load from the sun, from hot surfaces and from furnaces, and it reads the highest of the three wherever radiant load is present. In both reading sets the globe is the highest reading, which says the spot carries radiant load.

The dry bulb is an ordinary shaded air thermometer. It enters only the outdoor form.

| reading set | natural wet bulb, C | globe, C | dry bulb, C | WBGT, C (transcription only) |
| --- | --- | --- | --- | --- |
| indoor set | 26.400000 | 38.700000 | not used | 30.090000 |
| outdoor set | 27.100000 | 45.300000 | 33.800000 | 31.410000 |

## What the engine checks on a reading

The engine refuses a reading it cannot use and names the field. A wet bulb below absolute zero is refused on `naturalWetBulbC`:

> naturalWetBulbC is below absolute zero

A missing globe reading on the outdoor form is refused on `globeC`:

> globeC must be a finite temperature in degrees C

Neither refusal judges whether a reading is plausible for a site. The engine checks that a number is a temperature and leaves the judgement of the instrument to the hygienist.

## What this index is and what it leaves out

Heat stress in this course is a WBGT index and a body's metabolic load. Flare and pool-fire thermal radiation, a radiant flux in kW/m2 on a surface, is owned by the Separation and Relief courses, and this course cites it there and goes no further. A globe reading near a flare is still a globe reading; how much radiant flux reaches that spot is a question for those courses.

The engine also has no door for the ISO 7243 clothing and body-height adjustments. That text is licensed and is never quoted here.

## Exercise

Take the indoor set and write down which of the three readings it carries and which it leaves out. Then take the outdoor set and state the difference between its globe and its natural wet bulb from the printed readings. Finally, write the evidence status that has to sit beside 31.410000 C whenever you report it, in the words this lesson uses.
