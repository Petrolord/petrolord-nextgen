# Indoor and outdoor weights

{{panel:hy-heat-stress}}

The same outdoor readings give 31.410000 C through the outdoor form and 32.560000 C through the indoor form, a difference of 1.150000 C. Every one of those figures is the NIOSH 2016-106 section 9.3.2 weighting, checked for transcription only, the same status the section 8.1 equation carries. The form is a choice the reader makes about the site, and it moves the answer by more than a degree.

## The two forms

The engine evaluates the forms NIOSH 2016-106 section 9.3.2 prints, and both weightings are checked for transcription only.

Indoors, or outdoors without solar load, the index is 0.7 times the natural wet bulb plus 0.3 times the globe. Outdoors with solar load it is 0.7 times the natural wet bulb plus 0.2 times the globe plus 0.1 times the dry bulb. The wet bulb weight is the same in both. What changes is how the remaining 0.3 is split: indoors the globe carries all of it, and outdoors the globe gives up 0.1 to the dry bulb.

| reading set | form | natural wet bulb, C | globe, C | dry bulb, C | WBGT, C (transcription only) |
| --- | --- | --- | --- | --- | --- |
| indoor set | indoor | 26.400000 | 38.700000 | not used | 30.090000 |
| outdoor set | outdoor | 27.100000 | 45.300000 | 33.800000 | 31.410000 |
| outdoor set | indoor | 27.100000 | 45.300000 | not used | 32.560000 |

## Why the indoor form reads higher on outdoor data

In the outdoor set the globe, at 45.300000 C, sits well above the dry bulb at 33.800000 C, because the sun loads the black sphere. The indoor form gives the globe a weight of 0.3 where the outdoor form gives it 0.2, so the indoor form counts more of that solar-loaded reading. The result is the 1.150000 C gap in the table. Whenever the globe reads above the dry bulb, the indoor form on outdoor data reads high.

That is the practical risk. A hygienist who picks the wrong form for the site builds an index that is off by the gap, and nothing in the arithmetic warns. The engine has two separate doors, `wbgtIndoorC` and `wbgtOutdoorC`, so the form is always stated by the call that was made. A report should state it in words as well.

## How the weights were measured

The course measures each weight by a unit impulse: set one reading to one degree and the others to zero, and the index returned is that reading's weight. The engine returns 0.700000000000 and 0.300000000000 on the indoor door, and 0.700000000000, 0.200000000000 and 0.100000000000 on the outdoor door, each against a literal typed in a third file, the course's build script, with a relative difference of 0.

That measurement proves the engine holds the numbers the build script holds. It cannot prove that either copy matches the page, and the next lesson but one explains why that distinction decides what this course grades.

## Exercise

Evaluate the indoor form by hand on the indoor set and check that you reach 30.090000 C. Then evaluate both forms on the outdoor set and confirm 31.410000 C and 32.560000 C. Write one sentence naming which reading drives the 1.150000 C gap and one sentence giving the status that must sit beside all three results.
