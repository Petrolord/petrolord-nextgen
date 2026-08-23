# Uniform and irregular steps

A depth grid is uniform when the increment between every consecutive pair of samples is the same, all the way down the well. Not the same on average, and not the same as whatever the header claims: the same between every pair. This lesson is about why that distinction matters and how one of the teaching files is built to blur it.

## The average can lie

Take irregular_20. It spans 1500 to 1560 m and holds 121 depth samples. Compute the average step the obvious way:

$$\frac{1560 - 1500}{121 - 1} = \frac{60}{120} = 0.5\ \text{m}$$

Exactly 0.5 m, as clean a number as basic_20's genuinely uniform step. If your idea of checking a grid is dividing the range by the sample count, this file passes with a perfect score. It is nonetheless irregular: walk the depth column sample by sample and the increments wander around 0.5 m instead of repeating it. The end points and the count are consistent with a uniform grid; the interior is not. That is precisely the failure mode the file exists to teach, because real acquisition produces it through splices, tool stalls and merged runs, and because the average-step shortcut is so common in quick scripts.

## The header can lie too, politely

The LAS convention for irregular sampling is to declare STEP 0 in the ~Well section, and irregular_20 does: its header reads STRT 1500 M, STOP 1560 M, STEP 0 M. A zero step is not a claim that samples coincide; it is the format's way of saying the step is not constant, go look at the data. So this particular header is honest. But headers are typed by humans and export software, and nothing in the format enforces that a file declaring STEP 0.5 actually keeps that spacing, or that a file with STEP 0 is really irregular. The header is a statement of intent. The depth column is the fact.

## Check every increment

The engine's step checker, uniformStepM, implements the only honest definition. It takes the depth vector in metres, reads the first increment, and compares every subsequent increment against it. If any increment disagrees, the function returns null: no uniform step exists. Only when the whole column keeps the spacing does it return the step.

Two details make the check practical rather than pedantic. First, the comparison uses a tolerance of one percent of the step, floored at a few float32 ulps of the deepest sample, because converted depths stored as 32-bit floats jitter by a hair (feet_20's 0.6096 m grid is the standing example, and it correctly passes as uniform). Second, the tolerance is far too tight for genuinely irregular files to sneak through, because their increments miss by whole fractions of a step, not by float noise. On irregular_20 the checker returns null, and the import summary reports the file as irregular with no step, exactly what the data says.

Run the comparison across the teaching set and the lesson writes itself: basic_20, 301 samples at 0.5 m, uniform; feet_20, 151 samples at 0.6096 m after conversion, uniform; irregular_20, average 0.5 m, header STEP 0, not uniform.

## What to do with an irregular file

Nothing destructive. An irregular grid is not an error to fix at parse time; it is a property to record. The importer keeps the depth column exactly as logged, stores it as the well's depth vector, and marks the file's step as unknown. Whether to resample onto a uniform grid, at what spacing, and with what interpolation is a modelling decision that belongs to a later, explicit stage where the choice is visible and reversible. A parser that quietly regrids data is a parser that destroys evidence.

The beginner's discipline is therefore three checks, in order: read the header step as a claim, compute the average as a sanity number, then let the increment-by-increment check deliver the verdict. Only the third one counts.

## Exercise

A file spans 2000 to 2030 m with 61 samples. First, compute the average step: 30 / 60 = 0.5 m. Second, the depth column contains the consecutive samples 2014.0, 2014.5, 2015.2, 2015.5. Compute the three increments (0.5, 0.7, 0.3 m) and state what uniformStepM returns for this file (null, because 0.7 and 0.3 disagree with the first increment by far more than one percent of a step). Third, state what STEP value the file's header should declare under the LAS convention, and why the header alone would not have been enough to catch the problem if it had claimed 0.5 instead.
