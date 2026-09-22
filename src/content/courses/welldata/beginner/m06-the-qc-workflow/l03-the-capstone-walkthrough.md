# The capstone walkthrough

The Associate capstone is not an essay and not a memory test. It grades exactly six numbers, and every one of them is read off the QC panel you toured in the previous lesson. Nothing is computed by hand, nothing is looked up in a table, and nothing is stored as an answer key inside the exercise. You open a file, you find the tile or the table cell that holds the reading, and you report what the parser produced.

The capstone is set on its own case: the ODUMA campaign, six LAS files from a field this course never opens for you. Download them from the capstone case files on the capstone card, then open each one in the QC panel with **Open your own LAS files**. The six readings are: the depth samples in oduma2_main; its GR null samples; its mean GR over finite samples; the oduma3_feet depth step converted to metres; the PEF null samples in oduma5_nulls; and the depth samples in oduma1_wrapped.

This lesson walks the same six readings on the teaching files, as a worked example. Your capstone numbers come from the ODUMA files, so they will be different. It then explains the path you have to clear before the capstone will even open.

## The six readings, worked on the teaching files

**1. Depth samples (worked on basic_20; the capstone asks it of oduma2_main).** Select basic_20 in the file selector and read the Samples / NULL tile. The first value is the number of depth samples in the file, and it is 301. This is a whole number, so there is no tolerance to worry about: it is right or it is not.

**2. GR null samples (worked on basic_20; the capstone asks it of oduma2_main).** Stay on basic_20 and drop to the per-curve table. Find the row whose mnemonic is GR and read the nulls column. It shows 8. Take care not to read the samples column beside it, which shows 301 for every curve in this file, and not to read the RHOB row, which carries 9 nulls and sits directly under GR in most renderings.

**3. Mean GR over finite samples (worked on basic_20; the capstone asks it of oduma2_main).** Same file, same GR row, last column: the finite-sample mean, 64.9272 GAPI. The grader allows a tolerance of 0.05, which is wide enough to forgive rounding at the fourth decimal and narrow enough to catch a mean taken over the wrong curve or the wrong file. Remember what the column means. It is the average of the 293 finite samples only, with the 8 nulls excluded, which is why the completeness check has to pass before this number means anything.

**4. Depth step converted to metres (worked on feet_20; the capstone asks it of oduma3_feet).** Switch to feet_20 and read the Step tile. It shows the step twice, native first and metric second: 2.0000 F / 0.6096 m. The reading the capstone wants is the second one, the metric step, with a tolerance of 0.001. Reporting the native 2.0 here is the classic mistake, and it is exactly the unit error this whole course exists to train out of you. The tile shows both numbers side by side so that the conversion is visible rather than assumed.

**5. Null samples of a dead curve (worked on nullheavy_20 NPHI; the capstone asks for PEF in oduma5_nulls).** Switch to nullheavy_20 and look for the red row in the curve table. Red means dead, and NPHI is dead here: 201 samples, 201 nulls, no first finite, no last finite, no mean. The reading is the nulls column, 201. Check the NULL flag in the header tile first: a file that flags nulls with a value other than -999.25 is still read correctly by the parser, and the count is only right if it did. The colour is doing you a favour, because a dead curve is the one completeness failure that is easy to miss when you are skimming for outliers.

**6. Depth samples in a wrapped file (worked on wrapped_12; the capstone asks it of oduma1_wrapped).** Switch to wrapped_12 and go back to the Samples / NULL tile. It reads 161. This one closes the loop with module 2: the file is LAS 1.2 in wrapped mode, so each depth sample is spread over several physical lines, and 161 is the count of depth samples the parser reassembled, not the count of lines in the data section.

Six readings, four files, three regions of the panel. Work them in the order above and you never revisit a file twice. The capstone is the same six readings over four of the ODUMA files, in the same order.

## The path that unlocks it

The capstone sits at the end of a sequence the server enforces, not merely suggests. The rules are the same for every deep course on the platform:

* Read every lesson in a module. Progress is recorded per lesson, and a module is not complete until all of its lessons are marked read.
* Pass that module's quiz at 75 percent. The quiz opens only once the module's lessons are done.
* Three failed attempts on the same module quiz trigger a 24 hour cooldown before you may try again. The cooldown is deliberate. It exists to send you back to the lessons rather than letting you guess your way through the option list.
* Clear all six modules the same way.
* Pass the final exam at 70 percent. The exam draws across the whole course, which is why the threshold is a little lower than the per-module bar.
* Only then does the capstone unlock.

Nothing here can be skipped by opening the app and doing the readings early. You can practise in the QC panel any time you like, on the teaching files or on the ODUMA files, and you should, but the graded submission is locked until the sequence above is complete.

## What passing means

Passing the capstone earns the Associate certification in Well Data Manager. That certificate is not a decoration at the end of a course. It is the prerequisite root of the whole NextGen geoscience path: petrophysics, well correlation, seismic, mapping and volumetrics all sit behind it. Every one of those disciplines consumes the curves you have just learned to receive and check, so the platform asks you to prove you can gatekeep the data before it lets you interpret it.

Try it yourself: the panel below runs the real parser over the teaching files, and over any LAS file you open with Open your own LAS files.

{{panel:wd-las-inspector}}

## Exercise

Open the QC panel and produce all six worked-example readings on the teaching files in one sitting, writing each down with its file name and the panel region you took it from before you check anything. Self-checks for the worked example: basic_20 samples 301 from the Samples / NULL tile; basic_20 GR nulls 8 and finite mean 64.9272 GAPI from the GR row; feet_20 step 0.6096 m from the second value in the Step tile; nullheavy_20 NPHI nulls 201 from the red row; wrapped_12 samples 161 from the Samples / NULL tile. Then download the ODUMA case files from the capstone card, open them with Open your own LAS files, and take the same six readings from them the same way; those are your capstone answers, and no lesson prints them. Finally, state in one sentence why only two of the six readings carry a numeric tolerance.
