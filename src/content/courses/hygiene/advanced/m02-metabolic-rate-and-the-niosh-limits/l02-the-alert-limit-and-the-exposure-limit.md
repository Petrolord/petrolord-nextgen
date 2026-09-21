# The alert limit and the exposure limit

{{panel:hy-heat-stress}}

At 300.000000 W the RAL gives 24.972590 C WBGT and the NIOSH heat REL gives 28.213106 C WBGT, a gap of 3.240515 C. All three figures are the NIOSH 2016-106 section 8.1 equation, checked for transcription only. None of them is graded in this course.

## Two equations, two workers

NIOSH 2016-106 section 8.1 prints two equations in the one-hour time weighted metabolic rate M, in watts, each returning a limit in degrees C WBGT.

The recommended alert limit, the RAL, is for unacclimatized workers: 59.9 minus 14.1 times log10 M. The recommended exposure limit for heat stress, which this course always writes as the NIOSH heat REL, is for acclimatized workers: 56.7 minus 11.5 times log10 M. Each of the four constants is the NIOSH 2016-106 section 8.1 equation, checked for transcription only.

The acronym needs care. The Associate tier's NIOSH noise REL is an 85 dBA criterion for a noise dose. The NIOSH heat REL is a WBGT limit for an hour of work. They share three letters and nothing else, so every report names which one it means.

## The shape of the two curves

Both limits fall as the work gets harder, because a body producing more warmth tolerates less heat stress from the surroundings. The RAL falls faster, its slope being 14.1 C per decade of M against 11.5 for the NIOSH heat REL, so the gap between them widens with the work rate.

Every figure in this table is the NIOSH 2016-106 section 8.1 equation, checked for transcription only.

| M, W | RAL by the equation, C WBGT | NIOSH heat REL by the equation, C WBGT | heat REL minus RAL, C |
| --- | --- | --- | --- |
| 150.000000 | 29.217113 | 31.674951 | 2.457837 |
| 200.000000 | 27.455477 | 30.238155 | 2.782678 |
| 300.000000 | 24.972590 | 28.213106 | 3.240515 |
| 400.000000 | 23.210954 | 26.776310 | 3.565356 |
| 500.000000 | 21.844523 | 25.661845 | 3.817322 |

## How the constants were checked

The course measures the four constants from the running engine: the RAL at 1 W is 59.900000000000, and the RAL at 1 W less the RAL at 10 W is 14.100000000000; the NIOSH heat REL gives 56.700000000000 and 11.500000000000 the same way. Each matches a literal typed in the course's build script, a third file.

That proves the engine holds what the build script holds. It does not reach the page. The golden classes both doors TRANSCRIPTION ONLY, with 0 published cases and 7 oracle-only cases each, and the provenance record states that planting the same error in engine and oracle left the suite green for the NIOSH heat REL slope. No public printed value reproduces these constants.

## Using them anyway

The equations are the published NIOSH criterion, and a hygienist uses them. What this course adds is the status: a figure from either equation is reported as the section 8.1 equation evaluated, checked for transcription only, and never as a verified value. The reasons are the subject of module three.

## Exercise

Read the heat REL minus RAL column at 150.000000 W and at 500.000000 W and say how the gap changes with work rate. Then use the two slopes to explain why it changes that way. Write every figure you quote with the NIOSH 2016-106 section 8.1 status beside it.
