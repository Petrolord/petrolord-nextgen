# One file is not uniform

The campaign field reads: files with a uniform depth step, 5. Five of the six teaching files have a depth column whose sampling is constant, and one does not. The one that does not is irregular_20.las. Both halves of that sentence are true, and only one of them is the graded answer.

## The field is a pass count

Read the label again. It asks how many files have a uniform depth step. The answer is 5.

A learner who writes 1 has not made an arithmetic mistake. They have answered a different question, the one about how many files fail, and they have answered it correctly. With a tolerance of zero on every field in this capstone, a correct answer to an adjacent question scores the same as a wrong answer, which feels harsh until you notice that the same thing is true of a report you hand to a colleague. Nobody downstream will ask you which question you thought you were answering.

The trap is sharper here than it looks, because the fields around this one have the opposite polarity. Files needing depth unit conversion is 1, a count of exceptions. Dead curves detected is 1, a count of exceptions. Files with a uniform depth step is 5, a count of conformers. Three adjacent fields, two of them counting the odd files out and one counting the ordinary ones, and nothing but the wording tells them apart. Read the label, decide which population it names, then count that population.

## What the campaign is testing

The Professional tier built the uniformity test and ran it on both sides. You know what it does: it adopts the first difference in the converted depth column as a candidate step, builds a tolerance around it, walks the remaining differences, and either returns a step or returns nothing. You watched it forgive float32 wobble on feet_20 and reject genuine irregularity on irregular_20, with three orders of magnitude of clear air between the largest thing it forgives and the smallest thing it rejects.

The campaign does not re-open that argument. It calls the same function on each of the six files and records whether a step came back. One bit per file, six bits, five of them set. That is the whole computation, and its value is not in the test, which you already trust, but in having applied it to everything.

Here is the column:

| file | uniform step |
|---|---|
| basic_20.las | yes |
| feet_20.las | yes |
| irregular_20.las | NO |
| nullheavy_20.las | yes |
| quirks_20.las | yes |
| wrapped_12.las | yes |

Count the yes entries and the field is 5.

## The file that fails

irregular_20.las holds 121 depth samples, and its depth column steps by more than one size. You met it at the Professional tier, where the differences were large enough to miss the tolerance by roughly a hundred times, so no step exists for it. The importer does not repair the file and does not refuse it. The step field comes back empty, which is an explicit refusal to report a spacing rather than a number of any kind, and the file is imported with its depth column exactly as logged.

What the campaign adds is context. Alone, an irregular file looks like a problem with that file. Against five siblings that are all uniform, it looks like a file that came from somewhere else, or from a different run, or from an editing step the others did not go through. One irregular file in six is a fact about the delivery, and the delivery is what you are actually responsible for.

## Why a pass count is the right thing to report

There is a practical reason the useful version of this field counts the files that conform.

A pass count states what you can rely on. Five files carry a spacing that downstream code may assume, and the sixth does not, so anything that resamples, filters, or steps through depth on a fixed increment can be pointed at five wells with confidence and must be told about the sixth. That is an instruction somebody can act on.

A pass count also degrades honestly when the batch grows. On a much larger delivery, a bare failure count tells you almost nothing, because the same figure means one thing in a handful of files and another in hundreds. A pass count carries the batch size with it, so you still chase the exception and you also know how much of the batch you have cleared.

And a pass count forces you to confirm the quiet files. Reporting the failure means looking at one file. Reporting the pass count means having looked at all six, because you cannot claim that five passed unless you tested five.

## Worked example

Work the field in the order the panel presents it. Take each file, read the uniform column, and keep a running count of yes entries: basic_20 yes, one. feet_20 yes, two. irregular_20 no, still two. nullheavy_20 yes, three. quirks_20 yes, four. wrapped_12 yes, five. The graded value is 5.

Then state the finding in one sentence that carries both numbers: 5 of the 6 files have a uniform depth step, and the exception is irregular_20.las. That sentence answers the graded field and names the file to chase, and it cannot be misread as either 5 failures or 1 pass.

Open the panel below and read the uniform column down the six files, then check your count against the graded field.

{{panel:wd-campaign-explorer}}

## Exercise

Write down the graded value for files with a uniform depth step, and beside it write the value a learner would report if they answered the question of how many files fail the test. Then write the single sentence you would put in a delivery note so that neither number can be mistaken for the other. Finally, state what the graded field would read if a seventh file arrived and it too had an irregular depth column.

Self-check: the graded value is 5, the failure count is 1, and both describe the same campaign over six files. A sentence that survives being copied reads that 5 of the 6 files have a uniform depth step and the exception is irregular_20.las, because it carries the count, the denominator and the name of the file to chase. A seventh irregular file would leave the pass count at 5 while the batch became 7, so the pass count alone would no longer describe the delivery, which is the reason a count of this kind should always travel with its denominator.
