# A well barrier element

An envelope is not a thing you can touch. Its elements are, and everything the engine knows about a well starts with them.

{{panel:wi-envelope-explorer}}

## Three things, and all three are required

A well barrier element is a physical object that has been given a containment job. To the engine it is a small record, and the record has three load-bearing parts.

**A thing.** A name and a kind. The name identifies this specific object in this specific well, such as the production packer or the intermediate casing cement. The kind says what sort of object it is, chosen from a fixed list.

**A job.** Which envelope it serves. Primary, secondary, or both. Without this the engine refuses the element by name and stops. It will not guess from the kind, because the kind does not determine the job.

**A status.** Verified, degraded, failed or not verified. This is the element's own health, and it is the only one of the three that changes over the life of the well.

## Status is a claim about evidence

The word verified is doing real work. It does not mean the element looks right, or was installed correctly, or is the kind of thing that usually holds.

It means somebody tested it, the test passed, and the test is current. An element that has never been tested is not verified, which is a different statement from failed and a very different statement from absent. Module 3 spends five lessons on exactly this distinction, because it is where most real barrier tables go wrong.

The engine builds this into the rollup rather than leaving it to judgement. An untested element degrades its envelope just as a degraded one does. If you want intact, everything in the envelope has to have been tested and passed.

## Reading one line of the published well

Look at the downhole safety valve in the teaching roster. Its kind is the safety valve kind, its envelope is primary, and its status is degraded.

Three fields, and between them they set the well's colour. The kind tells you what failure would mean, the envelope tells you which of the two lines of defence is affected, and the status tells you that this one is not currently doing its job properly.

Change nothing else and the well is yellow. Change that one status to verified and the well is green. Change it to failed and the well is orange. One element, three fields, and the whole verdict swings on it.

## Exercise

In the panel, pick any element in the published roster and re-rate it through all four element statuses. Record the envelope status and the category at each step.

Then take one entry from the list you wrote in module 1 and fill in all three fields for it. If you cannot honestly write verified, write what you can defend instead, and note what test would let you upgrade it.
