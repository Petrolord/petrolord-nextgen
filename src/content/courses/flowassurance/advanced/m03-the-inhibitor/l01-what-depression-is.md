# What depression is

Depression is how far a chemical moves the hydrate temperature. Subcooling is how far inside the hydrate region the fluid already sits. A dose is sized on the second and bought with the first.

{{panel:pd-hydrate-explorer}}

## Neither quantity is an engine output

`hydrateInhibition` computes the depression an inhibitor gives and the rate that holds a concentration. Its header says it "does NOT compute where the hydrate boundary is in the first place: that is a fluid property from a lab or a compositional flash, and it belongs to whoever owns the fluid."

Subcooling is the hydrate temperature less the fluid temperature, so it inherits that entirely. Every subcooling in this course is a laboratory number subtracted from an engine number, and the answer is only ever as good as the half nobody computed.

## The boundary moves when the line stops

TEACHING LINE AKASO SPUR is a construct this course designed for itself, not a published case. Its boundary is a teaching input at two states: 71.00 degF while gas is flowing, and 78.00 degF once the line packs up after a shutdown.

The same line arrives at 89.316029952695 degF with heat loss alone, a margin of 18.3160299527 degF outside the region, and at 64.1160299527 degF once the engine applies its pressure drop. Against the flowing boundary of 71.00 degF the first is comfortable and the second is not. Against the packed-up boundary of 78.00 degF, sitting against a 45.00 degF seabed, neither arrival is anywhere near comfortable.

## The margin is degF, not a factor

`inhibitionRequirement` takes `subcoolingF` and `safetyMarginF` and adds them. The dose is sized on the sum. On the teaching line the shut-in subcooling to kill is 36.00 degF and the safety margin is 5.00 degF, so `neededDepressionF` comes back as 41.00 degF.

Depression is what a chemical delivers against that. On the published rows methanol at 20.0 weight percent in the water gives 18.2194132335 degF, so a need of 41.00 degF is well past a fifth-strength aqueous phase. The relation is not linear, and a fixed margin in degF costs progressively more concentration the further out the design already is.

## What it refuses

A need that is not positive is answered rather than computed. The function returns `required` false with a written note saying the fluid sits outside the hydrate region by that many degF and no inhibitor is needed to keep it there. It does not return a rate of zero dressed up as a design, which is the distinction between an answer and a number.

## The mistake

Computing subcooling against the flowing boundary and carrying it into a shut-in case. On the teaching line those boundaries are 71.00 degF and 78.00 degF, and the fluid is colder in the shut-in case as well, so the error compounds from both ends.

## Exercise

Take the teaching line boundaries of 71.00 degF and 78.00 degF and the two arrivals of 89.316029952695 degF and 64.1160299527 degF, and write down the four subcoolings they imply.

Then say which of the four you would hand to `inhibitionRequirement`, and what you would have to source before any of them is defensible.
