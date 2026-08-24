# What this tier adds

The Associate tier left you able to open any of the six teaching files, run the parser over it, and say whether it is healthy. You could read a section map, count depth samples, spot a null flag that is not the usual one, and tell a uniform depth column from an irregular one. That is a real skill and it is the right first skill. It is also a skill that stops at the edge of the file.

This tier starts where that stops. A file that has passed QC is still a foreign object. It carries the units the logging contractor used, the mnemonics that contractor's system emitted, and a depth grid on whatever spacing the tool ran at. None of that is wrong. It is not yet in the project's own units and vocabulary, and until it is, no application above the registry can use it without first asking what unit this particular well happens to be in. Import is the act of making a foreign file part of the project.

## What the Associate tier established

Five things carry forward, and it is worth naming them so you can see what is being built on.

The registry is where wells live, and every application reads them from there rather than from files on disk. The LAS format has a section structure, a curve contract in the ~Curve section, and a data block whose columns follow that contract in order. Depth arrives in metres or in feet, and the platform's internal standard is metres. Missing data is a declared sentinel value written into the grid, not a blank. Headers are claims, and the depth column is the fact.

None of that is revised here. All of it is assumed. If any of the five feels loose, go back to the Associate tier before continuing, because everything below treats them as settled.

## Reading a file is not importing it

Here is the distinction in one sentence. Reading a file answers the question "is this file believable". Importing a file answers the question "what does this file become inside the project".

The second question has answers the first one never needs. A reader can report that feet_20 is denominated in feet and leave it there, because the reader hands its output to a person who knows what feet are. An importer cannot leave it there. It has to produce a depth column in metres, because the thing consuming its output is not a person. It is every downstream application, and those applications do not ask. They assume metres and proceed.

That difference in consumer is the whole reason the two skills are separate. QC output is read by someone who can apply judgement to it. Import output is read by software that will apply none.

## What import decides

The pipeline makes four decisions about every file, and this tier is organised around them.

**The depth unit.** The importer reads the depth curve's declared unit, looks up a conversion factor for it, and converts the whole depth column. If it does not recognise the unit it refuses the file rather than guessing, because a guessed depth unit that guesses wrong is undetectable once the well is in the registry.

**The curve units.** Depth is not the only column whose unit references a length. Every curve is inspected on its own, and the ones that need converting are converted while the rest pass through untouched. On the file this tier works, two curves are converted, and one of them is not the depth column.

**The curve kinds.** Each curve is classified into a standard kind from its mnemonic, so that a downstream application can ask for the gamma ray without knowing what this particular vendor called it. Recognition is a suggestion rather than a certainty, and a curve the importer does not recognise stays unrecognised instead of being forced into a category.

**The step uniformity.** The depth column is tested increment by increment and the pipeline returns a verdict: either a step in metres, or nothing at all. That verdict is recorded on the well, and downstream tools that need a uniform grid key off it.

Every one of those decisions is recorded alongside the data. A converted curve carries the unit it came from and the factor used, so anyone auditing the well a year later can see what was done to it. Nothing in import happens silently, and that rule is the only reason import is auditable at all.

## The one file this tier works

You will meet the same file repeatedly: feet_20.las, the feet-denominated well from the teaching set, with irregular_20.las brought alongside it once as a contrast for the uniformity test. Working one file all the way to the bottom is deliberate. The goal is not coverage. The goal is that you can produce every number the pipeline produces for that file, by hand where the arithmetic allows and by reasoning where it does not, and account for the difference where your answer and the pipeline's answer are not identical.

## Where the Expert tier picks up

The Expert tier stops looking at files one at a time and audits a delivery of six as a single campaign, reporting totals across the whole set. Those aggregate numbers belong there. This tier does not compute them, and if you find yourself adding curves up across files, you have crossed into the next tier's job.

The progression across the three tiers reads cleanly. The Associate tier judges one file. This tier imports one file. The Expert tier audits a delivery.

## Exercise

Write down, from memory, the four decisions the import pipeline makes about a file, and beside each one write the Associate-tier QC skill it depends on. Then answer this in one sentence: why can a QC panel legitimately report a depth in feet while the registry cannot store one.

Self-check: the four decisions are the depth unit conversion, the per-curve unit conversion, the curve kind classification, and the step uniformity verdict. They rest on, in the same order, reading the depth unit from the ~Curve and ~Well sections, reading each curve's declared unit from the curve contract, reading mnemonics from the curve contract, and walking the depth column increment by increment rather than trusting the header step. The QC panel reports to a person who knows what feet are and can apply judgement to the number; the registry reports to software that assumes metres and will never ask, so a stored depth in feet becomes a silent error in every application above it.
