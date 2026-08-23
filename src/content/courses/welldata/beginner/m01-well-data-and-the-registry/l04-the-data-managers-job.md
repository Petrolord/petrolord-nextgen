# The data manager's job

The first lesson argued that the data manager is a gatekeeper. This one makes the job concrete. Import QC is not an open-ended inspection; it is four specific questions, asked in order, each answerable from the parsed file. Learn the four and you can QC any log file methodically instead of hopefully.

## Question 1: is the structure right?

Did the file parse as what it claims to be? That means the LAS version was read (2.0 for most of our files, 1.2 for wrapped_12), the wrap mode was honoured (wrapped_12 answers YES where the others answer NO), the sections were all found, and the curve list came out with the right mnemonics and units. Structure failures are usually loud, but not always: a naive reader can survive quirks_20's messy header while quietly mangling the well name. The proof of structure is that every downstream number in the QC panel is even computable.

## Question 2: are the units right?

Read the depth unit first, then every curve unit. Our platform standardises on metres; feet_20 arrives in feet and must be converted, including its us/ft sonic curve. The subtle danger is that unit errors produce plausible-looking numbers. Depth in feet still increases monotonically; a sonic curve in us/ft still wiggles. Only the unit fields, and your habit of reading them, stand between a correct import and a well three kilometres out of position.

## Question 3: is the sampling right?

Three reads answer it: the depth range (does 1500 to 1650 m make sense for this well?), the step (0.5 m for the metric teaching files, 2 ft for feet_20), and uniformity (is the step actually constant?). The fence-post rule from lesson 2 ties range and step to the sample count: basic_20's 301 samples confirm its declared range and step agree with its data. irregular_20 is the file that fails this question honestly, declaring STEP 0 to admit its rhythm is broken.

## Question 4: is the data complete?

Count the nulls per curve, hunt for dead curves, and glance at the statistics. nullheavy_20 is the standing example: 71 of 201 GR samples null, and NPHI dead at every depth. A dead curve should never be published as if it were data. Statistics close the loop: a finite-sample GR mean of 64.9272 GAPI in basic_20 is a sensible shale-and-sand mixture, while a mean of minus several hundred would tell you a null flag leaked into the arithmetic.

## The QC panel answers all four

Open any teaching file in the app and the QC panel lays the answers out: version and wrap on top, the depth block with unit, range, native and converted step, and sample count, then the curve table with samples, nulls, first and last finite values and finite-sample means, then the header rows. Every cell is computed live by the central parser from the file you loaded. Nothing is hand-entered, which is exactly why reading the panel carefully counts as measurement, not paperwork.

The six numbers the Associate capstone grades are all plain readings of this panel across the six files: basic_20's sample count (301), its GR null count (8) and GR mean (64.9272), feet_20's converted step (0.6096 m), nullheavy_20's NPHI null count (201), and wrapped_12's sample count (161). The capstone is not a puzzle. It is the job, done properly, six times.

## Publishing to the registry

QC earns its keep at the last step: publishing. Once a file passes the four questions, its curves are written to the shared well registry that every other Petrolord app reads. Petrophysics, correlation, synthetics and mapping never re-parse your LAS file; they read the registry copy, in metres, with nulls honestly flagged. That is the quiet payoff of the gatekeeping: the QC stamp travels with the data, and a hundred downstream computations inherit it for free. It is also why the standard is absolute. A bad curve in one project file is a local problem; a bad curve in the registry is everyone's problem.

## Exercise

Write the four QC questions from memory, and under each one name the teaching file that stresses it and the single QC-panel reading you would cite as evidence. Self-check: structure, wrapped_12 (version 1.2, wrap YES, and still 161 samples); units, feet_20 (depth unit F, step 2 ft converting to 0.6096 m); sampling, irregular_20 (declared STEP 0, uniformity check fails); completeness, nullheavy_20 (NPHI null at all 201 samples). Then state which file you would use as your control when something looks odd, and why. The intended answer is basic_20, because it is the file where all four questions pass cleanly.
