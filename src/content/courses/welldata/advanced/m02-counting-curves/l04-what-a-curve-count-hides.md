# What a curve count hides

The campaign imported 24 curves. That number is correct, it is graded with no tolerance, and on its own it is close to useless as a statement about the delivery.

This lesson applies the second of the two questions from module 1 to the first graded reading. What does a curve count hide, and what would you have to look at instead to answer the questions it cannot.

## What the number actually claims

Be precise about the claim, because the claim is narrower than it sounds. Twenty four curves imported means that across the six files, twenty four columns of numbers were declared in curve sections, read by the parser, and produced by the pipeline as curves, with the depth index left out of the count.

That is a claim about columns existing. It is not a claim about any of the following.

**Whether the curves carry data.** A column exists whether or not there is a measurement in a single one of its cells.

**Whether the units are right.** A curve counts as one curve whether its unit was recognised, converted, or left alone because nobody knew what it meant.

**Whether the values are usable.** Range, calibration, tool sticking, casing effects and depth shift are all invisible to a count.

**Whether the curve is the curve it says it is.** A mnemonic is what somebody typed in the header.

**Whether the curves are the ones you needed.** Twenty four curves that are all gamma ray would count the same as a full suite.

A count answers how many. Nothing else.

## The case that proves it

nullheavy_20 contributes 4 curves to the campaign total of 24, the same contribution as basic_20 and the same as every other file. Those four curves are GR in GAPI, RHOB in G/C3, NPHI in V/V and DT in US/M.

One of the four is entirely dead. It is declared, it occupies a full column across all 201 depth samples of that file, it was imported, it is counted, and there is not one measurement in it. It is the only dead curve anywhere in the delivery, which is why the graded dead-curve reading is 1.

Hold those two facts together, because the whole lesson is in the pair. In the curve count, nullheavy_20 and basic_20 are indistinguishable. Both contribute 4. In the delivery, one of them holds a curve that promises data and delivers none, and the other does not.

A reader given only the total of 24 cannot see that. A reader given the campaign table can, because the dead-curve column has a 1 in exactly one row.

## Why the dead curve is still counted

It is fair to ask whether a dead curve should be in the total at all, and the answer is yes, for a reason that matters more than the count.

The curve was delivered. It appears in the curve section, it occupies a column in the data, and after import it appears in the registry where a person or a downstream tool can see its mnemonic. Removing it from the count would make the campaign disagree with the delivery, and the campaign's job is to describe what arrived.

The Associate tier put the decision where it belongs. A dead curve at import forces an explicit choice between flagging it, which preserves the record of what the vendor supplied, and dropping it, which keeps the working dataset honest. Either can be right. What is never right is letting the dead column pass as data, and a count that quietly excluded it would do exactly that while looking tidier.

So the count says 24 and the dead-curve reading says 1, and the two together are the finding. Neither alone is.

## What is coming

Two modules answer the questions this one has opened, and it is worth naming them so you do not go looking early.

**Module 3 finds the exceptions.** Three readings in this campaign each point at exactly one file: one file needs a depth unit conversion, one file has no uniform depth step, and one dead curve exists. Those three are the delivery's real content, and module 3 argues that finding them is the product of running a campaign at all.

**Module 4 opens an aggregate.** The 272 flagged nulls in nullheavy_20 is one number covering more than one kind of problem, and module 4 breaks it into its parts curve by curve. That breakdown is the central teaching point of the tier, and it is the sharpest example anywhere in this course of an aggregate hiding its composition.

Both modules do the same thing to a different number. They ask what is inside it. Get into the habit now, on the easy case, so that the hard case in module 4 is familiar rather than surprising.

## The reporting habit

Never send a curve count on its own. It invites the reader to conclude that twenty four usable curves arrived, which is a conclusion the number does not support.

Send it with the readings that qualify it. Twenty four curves imported across six files with the depth index excluded, of which one is dead, in a delivery where one file needed a depth unit conversion and one file has no uniform depth step. That sentence is not much longer and it cannot be misread in the way the bare count can.

The panel below runs all six teaching files as one campaign and shows the table with each aggregate and its composition.

{{panel:wd-campaign-explorer}}

## Exercise

Open the panel and cover everything except the curves column. Write down every question about this delivery that the column alone can answer, and every question you would want answered before recommending that the delivery be published. Then uncover one further column at a time and note which of your questions each one closes.

Self-check: the curves column alone answers how many curves arrived, how many each file contributed, and whether the files carry a consistent suite. It cannot tell you whether the curves hold data, whether their units are right, whether the depth columns are sound, or whether anything is missing. The dead-curve column closes the first of those and points at nullheavy_20. The converted column tells you one file arrived in foreign depth units and names feet_20. The uniform step column tells you one file's depth column is not evenly sampled and names irregular_20. The nulls column raises a question rather than closing one, since a total of 272 in a file of 201 depth samples cannot be read at all until it is broken out, and that is module 4.
