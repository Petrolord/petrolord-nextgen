# The correction this bay declines

An air cooler is a cross-flow machine. Air passes across a bundle rather than along it, and a cross-flow unit needs a correction factor on its driving force. The closed form or chart for that factor is not established in this repository, so this module declines to supply one and says so on every answer it gives.

{{panel:fc-rating-explorer}}

## What the answer carries instead

The correction field comes back empty on both teaching bays, and a note comes with it.

The note is worth reading in full, because it states a basis rather than apologising for a gap: "An air cooler is cross-flow, and the closed form or chart for its F is not established in this repository. `airCooler` therefore sizes on the COUNTER-CURRENT log mean with F = 1 and says so in its return (`fCorrection: null`). The area it reports is a counter-current-basis area and a real cross-flow unit needs more surface. The hot-day rating does NOT depend on this, because it holds effectiveness rather than assuming an arrangement."

## What that means for the surface

The bare surfaces of the two bays are 52125.749338 and 36660.428319 ft2, against log means of 85.263896 and 82.901805 degF. Both surfaces are counter-current-basis surfaces. They are not wrong and they are not final: a real cross-flow bay needs more metal than either figure, and how much more is the thing nobody here can state.

The honest form of a held item is to name the basis rather than to quietly apply a one. A silent correction of one would have produced exactly the same number with none of the warning attached, and a reader would have had no way to know which of the two they were holding.

## Read the basis with the number

The basis lives in the note and in the empty correction field. The area lives in a field of its own. A caller that copies the area alone onto a sheet has copied a counter-current-basis figure without the sentence that qualifies it, and the sheet then reads as a sized bay.

So treat the pair as one value. Where this course quotes a bare surface it says on what basis, and a study that does the same is doing the only thing available until a publication settles the factor.

This is a general habit rather than a rule about air coolers. Any number that arrives with a qualification has to travel with it, because the number is easy to copy and the caveat is easy to leave behind.

## The one place it does not reach

The last sentence of the note is the important one for the next module. The hot-day rating holds effectiveness taken from its definition at the design point, so it assumes no arrangement and applies no correction factor. The one number this module cannot source therefore never enters the rating, which is why a hot-day duty can be trusted further than a design area.

## Exercise

Record the two bare surfaces and the two log means with the bay each belongs to, and write beside them the basis the module states for both. Say what the empty correction field means and what a silent value of one would have hidden. Then say why the hot-day rating is unaffected, quoting the mechanism rather than the conclusion.
