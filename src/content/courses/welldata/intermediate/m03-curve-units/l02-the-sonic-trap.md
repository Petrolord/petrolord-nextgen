# The sonic trap

This lesson is one worked curve. It is the curve that decides whether you get the graded conversion count right, and it is the curve that most learners get wrong on the first attempt.

The curve is DT in feet_20. It arrives with the unit US/F. It leaves the import pipeline with the unit US/M, and it is flagged as converted.

## What a transit time actually is

A sonic tool sends an acoustic pulse into the formation and times its arrival at receivers set a known distance apart. The raw observation is a travel time over a fixed span of borehole wall. Dividing that time by that span gives the quantity the log reports, which the industry calls slowness or interval transit time.

Read the unit as the definition it is. US/F is microseconds per foot: the number of microseconds the wave needs to cross one foot of formation. US/M is microseconds per metre: the number of microseconds the wave needs to cross one metre of formation.

Two things follow immediately. First, the number is not a property of the rock alone; it is a property of the rock together with the reference length you chose to quote it over. Second, since a metre is a longer distance than a foot, the same rock produces a larger number when quoted per metre than when quoted per foot. A conversion that made the number smaller has gone the wrong way.

## Why it is not optional

The temptation is to treat the sonic unit as a labelling detail. It is not, because the sonic is an input to arithmetic almost immediately after import.

Slowness is the reciprocal of velocity, and velocity is what ties a well to seismic. Every time and depth relationship built from a sonic log integrates the slowness over the depth interval, and that integral is a time only when the slowness and the depth agree about what length they are counting in. Feed a per-foot slowness into an integration over metric depths and the resulting time is wrong by the full ratio of the two units, which is not a subtle error and yet is entirely invisible in the numbers themselves. Both the input and the output remain plausible quantities.

The same reasoning applies to acoustic impedance, to synthetic seismograms, to sonic porosity through any of the standard transforms, and to compaction and pore pressure trends built on transit time. All of them assume the platform's internal unit. That internal unit is US/M, decided once, on day one, for the whole project.

So the conversion is not housekeeping performed for tidiness. It is the step that makes the curve usable by anything downstream.

## What the importer does with it

Walk the mechanism through on this one curve.

The parser reads the curve section line for DT and reports the unit exactly as written, US/F. The parser converts nothing; its job is fidelity to the file.

The import layer takes that unit string, trims it, upper-cases it, and looks it up in the curve conversion table. US/F is in the table. The table entry names the internal unit, US/M, and the factor, which is one divided by 0.3048.

The samples are multiplied by that factor. The curve's unit becomes US/M. Its source unit is recorded as US/F, its converted flag is set true, and its provenance records the unit it came from, the unit it went to, and the factor used.

Notice the direction once more, because it is the single most common arithmetic slip in this course. The depth column in the same file is multiplied by 0.3048. The sonic is divided by 0.3048. Two curves in one file, converted by the same constant, applied in opposite directions, and the reason is that the length in the sonic unit sits in the denominator.

## The trap, stated plainly

Here is the mistake this lesson is named for.

A learner reasons that converting a file to metres is a depth-column job, looks at feet_20, sees one depth column, and answers that one curve was converted. The graded answer is 2.

The two are DEPT and DT. DEPT converts because F is a length. DT converts because US/F has a length in its denominator. The mistake is not carelessness about arithmetic; it is a wrong mental model of what a unit conversion is. Once you hold the rule that the unit string decides, and that a length counts wherever it appears in the unit, the sonic stops being a trap and becomes an ordinary case.

It helps to notice that the trap survives inspection. Nothing about the DT column looks foreign. The values are plausible transit times. The mnemonic is the same DT that appears in the metric files. Only the unit string in the curve section says otherwise, and it says so in three characters.

## Reading it off the panel

The panel below runs the real import pipeline on any of the six teaching files and shows you, per curve, the unit before, the unit after, and whether the curve was converted.

Load feet_20 and read the DT row. The unit before is US/F, the unit after is US/M, and the converted flag is set. Then load basic_20, which is a metric file, and read its DT row. The unit before is US/M, there is nothing to convert, and the flag is clear. Same mnemonic, same measurement, same tool, different answer, and the only thing that differed was the unit string.

{{panel:wd-import-explorer}}

## Exercise

Predict, before you touch the panel, what the DT row will show for feet_20 and for basic_20: the unit before, the unit after, and the converted flag in each case. Then say in one sentence why the sonic conversion divides by 0.3048 while the depth conversion in the same file multiplies by it. Finally, state what a data manager should conclude about a project curve labelled US/M whose values are roughly a third of what the neighbouring wells show.

Self-check: for feet_20, DT is US/F before, US/M after, converted. For basic_20, DT is US/M before and after, and not converted. The sonic divides because its unit carries the length in the denominator, so quoting the same rock per metre rather than per foot gives a larger number. A curve labelled US/M whose values are about a third of its neighbours is almost certainly an unconverted per-foot slowness that was relabelled rather than converted, and it should be sent back to the source file rather than corrected in place.
