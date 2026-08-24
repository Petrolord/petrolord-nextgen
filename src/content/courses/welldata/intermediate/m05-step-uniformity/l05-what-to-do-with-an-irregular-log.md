# What to do with an irregular log

The test has returned nothing. The step field comes back null and the capstone field for this file is the integer 0. That is a finding, not a verdict on the well, and what you do in the next ten minutes decides whether the finding survives to the people who need it. This lesson is about the response, and it is deliberately qualitative. There is no arithmetic here to memorise.

## Do not silently resample

The tempting move is to put the curves on an even frame at import and be done with it. Resist it, for three reasons.

Resampling is interpretation. Choosing a spacing and an interpolation changes the data. Interpolating across a gap invents readings where the tool recorded none. Averaging fine samples onto a coarse frame erases beds that were resolved in the original. Picking the nearest sample shifts values to depths they were not measured at. Each of those can be the right choice for a particular purpose, and none of them is a parsing decision.

Resampling destroys evidence. Once the even frame is stored and the original column is gone, nobody downstream can tell that the file was ever irregular, and nobody can revisit the choice with better information. The one artefact that would have explained a later anomaly no longer exists.

Resampling hides the reason. An irregular column is usually telling you something about acquisition, and that something often matters more than the spacing does. A splice point, a stalled tool, an edited interval and a merge of mismatched runs each carry different consequences for whether the curves either side of the join can be compared at all. Regridding smooths the symptom and leaves the cause in place.

The pipeline's own behaviour is the model to follow. It keeps the converted depth column exactly as it came, imports every curve with its unit and its kind, and changes one thing only: it declines to report a step.

## Do not promote the header

The second temptation is quieter and more common. The test found nothing, the header has a STEP entry sitting right there, and it is easy to reach for it as a fallback.

That is the one move the whole design exists to prevent. A header STEP is a claim by whoever wrote the file, in the file's native unit, unchecked against the data section. Where the depth column has already contradicted it, the claim has been tested and failed. Copying it into the step field afterwards is not a fallback, it is overriding a measurement with an assertion, and the field it lands in carries no memory of where the number came from. Everything downstream will treat it as measured.

A file that declares a step of 0 is following the convention for irregular sampling and is telling you the truth. A file that declares a plausible step and has an irregular column is either stale or wrong, and that discrepancy is itself worth recording. Neither case produces a number you may put in the step field.

## Flag it, and make the flag travel

The right output is a visible negative attached to the well, not a note in someone's inbox. Three things should be true when you finish.

The step field is null, which is a form software can read. Downstream code has to be able to branch on it without parsing prose.

The finding is recorded in the well's provenance alongside the source file, the depth unit and the conversion factor, so that anybody who opens the well later sees the same thing you saw.

The character of the irregularity is written down in words. How many distinct spacings, roughly where the changes occur, and whether the pattern looks like a splice, an edit or a merge. That description is what turns a rejected file into a question somebody can answer.

## Decide deliberately, and decide later

Then hand the decision to the stage where decisions belong, with the options stated.

Ask the sender first. An irregular column is often an export artefact rather than a property of the logging run, and the original data may be regular. Getting the file rewritten costs an email and solves the problem at the source.

Where the curves can be used as they are, use them as they are. Work that integrates interval by interval, rather than counting samples and multiplying, does not need a uniform step at all, and choosing that path costs nothing.

Where a uniform frame is genuinely required, resample as an explicit, recorded step with a named spacing and a named method, downstream of import, with the original column preserved underneath. That way the choice is visible in the provenance, reviewable by somebody else, and reversible when it turns out to have been wrong.

Where the irregularity is a splice between runs that should not have been merged, splitting the file back into its runs is often better than any regridding.

Notice what all four have in common. Each one is a decision made by a person who knows what the data is for, recorded where the next person can find it. None of them is made by the importer, and none of them is made silently.

## Exercise

Take irregular_20 as delivered and write the handover you would attach to it: what the step field says, what goes into the provenance record, how you would describe the irregularity in words, and which of the four responses you would recommend and why. Then answer in one sentence: what is wrong with using the header STEP once the test has failed?

As a self check: the step field should come back null, which software can branch on, the provenance should record the finding beside the source file, the depth unit and the conversion factor, and the description should say how many distinct spacings appear and whether the pattern looks like a splice, an edit or a merge. Any of the four responses can be defended as long as it is recorded, and asking the sender first is usually the cheapest. Using the header STEP after the test has failed replaces a measurement with an unverified claim, in the file's native unit, in a field that keeps no record of where its number came from, so everything downstream will treat the assertion as measured fact.
