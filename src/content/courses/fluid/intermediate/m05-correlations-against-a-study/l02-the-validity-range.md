# The validity range

Every correlation the engine carries knows the conditions it was fitted over, and says so when you leave them.

{{panel:fluid-study-explorer}}

## What the engine does

Two functions take the correlation choices and the conditions, and return a list of warnings. Each warning names the correlation, the quantity that is out of range, and the range.

Ekene as it stands raises none. Push the temperature to 320 F on Vasquez-Beggs and one appears, naming Vasquez-Beggs and the temperature.

## Why this is unusual

Most libraries return the number. The range lives in a manual, or a comment, or the head of whoever implemented it, and the number arrives on its own.

That works until the number is used somewhere its author did not anticipate, which is what numbers are for. Attaching the warning to the call site is what keeps the limit and the value together.

The pattern appears across this Suite: the waterflood engine carries assumption strings with its results, the simulation composer emits warnings alongside the deck. It is the same idea each time.

## What a range violation actually means

Not that the answer is wrong. That the answer is an extrapolation.

A correlation is a curve through data. Inside the data the curve is constrained; outside it, the curve continues because the functional form continues, and nothing constrains where it goes.

Sometimes the extrapolation is fine, because the functional form has the right shape. Sometimes it diverges. The correlation cannot tell you which, and neither can the warning: it can only tell you that you are outside the evidence.

## Ranges are per correlation, not per property

This catches people. Standing and Vasquez-Beggs have different ranges for the same property.

So switching correlations can move you from inside a range to outside one without changing a single input, and a set of conditions that raised no warning under one choice may raise several under another.

Which is exactly why the warning names the correlation.

## What to do when a warning fires

**Check whether another correlation covers the conditions.** Often one does.

**Check the direction.** A correlation extrapolated 20 F beyond its temperature range is usually survivable; one extrapolated to twice its maximum gas-oil ratio is usually not.

**Report it.** A number produced outside the correlation's range with the warning suppressed is the worst of both: it looks like the others and it is not.

**Or get a measurement**, if the answer matters enough.

## The check on Good Oil

Its conditions, 40.7 API at 220 F with 768 scf/stb, sit inside the ranges of the standard correlation set. So the correlations can be run on it without warnings, and their answers can be compared against the measurements.

That comparison is the point of the whole module. A correlation inside its range, checked against a measurement on the same fluid, is the only way to find out what "inside the range" is worth.

## The misconception to avoid

"No warnings means the answer is good." No warnings means the conditions are inside the range the correlation was fitted over. Scatter WITHIN a fitted range is often substantial: Beal's dead oil viscosity has factor-of-two scatter well inside its range. The warning is about extrapolation, not about accuracy.

## Exercise

First, explain in two sentences what a validity range warning does and does not tell you about the number it accompanies.

Second, give two reasons why the warning has to name the correlation rather than just the property.
