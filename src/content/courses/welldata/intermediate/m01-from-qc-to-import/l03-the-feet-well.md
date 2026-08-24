# The feet well

Every teaching file in this set carries one specific problem. The file this tier is built on is feet_20.las, and its problem is that it is correct. Nothing in it is broken, nothing is missing, no header is mangled. It is a clean export that happens to be denominated in the other unit system, which makes it the sharpest possible test of whether your import pipeline is a pipeline or a QC screen with ambitions.

## What the file says about itself

The header declares a depth unit of F, a start of 4900, a stop of 5200 and a step of 2, and the depth curve in the ~Curve section is declared in F to match. The parser reports 151 samples.

Check the sample count against the header before anything else, because it costs seconds and it catches truncation immediately. A grid running from 4900 ft to 5200 ft at a 2 ft step holds

$$\frac{5200 - 4900}{2} + 1 = \frac{300}{2} + 1 = 151$$

samples, the plus one because both ends are included. Header and data agree, so the file is intact and the only thing left to deal with is its units.

## Why a foot file is the useful case

Three reasons, and they build on each other.

The first is that a foot file is not a defect. A large fraction of the world's log data is denominated in feet, particularly North American data and older vintages everywhere, and it will keep arriving that way for as long as there is archived data. You are never going to fix the supply. You are going to convert at the door, forever, so the door had better be right.

The second is that a foot file forces you to separate the file from the project. A file with a mangled header is wrong and you can say so. A file in feet is not wrong. It is foreign, and the pipeline's job is translation rather than repair. That distinction is hard to feel on any of the other five teaching files, because on those the pipeline is either fixing something or flagging something. Here it is doing neither. It is restating a perfectly good file in the project's own terms.

The third is that this file punishes the natural shortcut. The instinct is to think of unit trouble as a property of the file: this is a feet file, convert it. It is not a property of the file. It is a property of each curve, and this file proves it, because its five curves do not all behave the same way.

## The five logs, before and after

Here is what the pipeline does to feet_20, curve by curve.

| mnemonic | kind | unit before | unit after | converted |
|---|---|---|---|---|
| DEPT | depth | F | M | YES |
| GR | gr | GAPI | GAPI | no |
| RHOB | density | G/C3 | G/C3 | no |
| NPHI | neutron | V/V | V/V | no |
| DT | sonic | US/F | US/M | YES |

Two facts are worth reading off that table now, because they are graded later and because both of them are places where a careful learner still gets the wrong answer.

**Two curves are converted, and one of them is not the depth column.** DT is a sonic transit time in microseconds per foot, so its unit carries a length in the denominator. The importer reaches that conclusion by looking the unit string up in a fixed table rather than by reasoning about dimensions, and US/F is in that table. GR in GAPI, RHOB in G/C3 and NPHI in V/V carry no length at all, so they pass through untouched. Anyone who assumes only the depth column needs converting arrives at one converted curve instead of two.

**Four kinds are recognised, and DEPT is not one of them.** The pipeline reads each mnemonic and recognises gr, density, neutron and sonic among the value curves. DEPT is stamped as the index curve because it comes first, rather than being recognised as a measurement, so it is excluded from the count of recognised kinds and the answer is four rather than five.

Module 3 works the unit column of that table and module 4 works the kind column. For now, hold the shape of it: a file is not in one unit, it is a set of curves each carrying its own unit, and the pipeline decides one curve at a time.

## What will have to happen to it

By the end of this tier you will have taken this file through the whole pipeline and be able to state, with reasons, what came out.

The depth column will be multiplied by the factor for feet and the start, stop and step will be reported in metres. Module 2 does that work, including why the digits the pipeline reports are longer than the digits your calculator gives.

The sonic will be converted in the opposite direction, because a per-length unit converts the other way round from a length. Module 3 does that.

Every curve will be offered a kind, and the count of recognised kinds will exclude the index. Module 4 does that.

The converted depth column will be tested for uniformity, and a second file, irregular_20.las, will be run through the same test and fail it. Module 5 does that, and the contrast is the lesson: the same test, applied to a file whose wobble is storage noise and a file whose wobble is real.

## Exercise

Working only from the header facts in this lesson, write down four things about feet_20.las before you touch any tool: the native depth unit, the native start and stop with their unit, the native step with its unit, and the sample count. Then, without converting anything, say how many of the five curves you expect the pipeline to convert and how many kinds you expect it to recognise, and give your reason for each.

Self-check: the native depth unit is F; the native start and stop are 4900 ft and 5200 ft; the native step is 2 ft; the sample count is 151, consistent with 300 ft of range at a 2 ft step plus one for the inclusive end. Two curves are converted, DEPT because it is a length and DT because microseconds per foot carries a length in its denominator, while GAPI, G/C3 and V/V reference no length. Four kinds are recognised, because gr, density, neutron and sonic are all identified among the value curves and the index curve DEPT is excluded from that count.
