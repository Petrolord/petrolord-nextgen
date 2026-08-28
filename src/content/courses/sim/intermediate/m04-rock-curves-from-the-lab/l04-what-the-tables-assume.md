# What the tables assume

Two tables, 43 rows, and a set of assumptions that no row states. This lesson collects them, because they are the reason a rock curve transfers or does not.

## One rock

Both tables apply to every cell in the model. All 4500 of them, across five layers whose permeability spans a factor of six, share one set of relative permeability curves.

That is a strong assumption and it is usually wrong in detail. Relative permeability depends on pore structure, and pore structure is what makes one layer 600 md and another 100 md. A high-permeability layer typically has a lower connate water saturation and a different curve shape.

Simulators support multiple saturation regions for exactly this reason, with a region number per cell and a table per region. This deck uses one region, which is the simplest honest choice given that the SCAL course fitted one curve.

## No hysteresis

The tables describe one direction. A cell whose water saturation is rising follows the same curve as one whose water saturation is falling.

Real rock does not do that. Drainage and imbibition curves differ, sometimes substantially, and the difference matters wherever saturation reverses, which in a waterflood means near an injector that gets shut in and around a rising contact.

Modelling hysteresis requires a second set of curves and a switching rule. This deck has neither, which is fine for a monotonic flood and would not be for a cycled gas storage project.

## No capillary pressure

Both tables carry a Pc column of zeros, and the previous module explained what that means: sharp contacts, no transition zone, saturation decided entirely by which side of the contact a cell sits on.

The SCAL course built a real capillary pressure curve for this sand from a Leverett J-function, and used it to show that the crest is drier than the flanks. None of that is in the deck.

For a field with 49 m of relief and a transition zone of a few metres that is a reasonable simplification. It is still a simplification, and the study should say so rather than leaving a reader to notice a column of zeros.

## No dependence on anything but saturation

Relative permeability in this format is a function of saturation alone. Not of rate, not of pressure, not of interfacial tension, not of temperature.

Most of those are genuinely negligible in a waterflood. Interfacial tension is not negligible in a surfactant flood, which is precisely why enhanced recovery processes need different tables and often a different simulator.

## Three phases from two tables

When oil, water and gas are all present, the simulator has to produce an oil relative permeability that neither table gives directly. It computes one from the two tables using a three-phase model, and there are several in common use that give visibly different answers.

Which model is used is a simulator setting rather than a deck table, and it is one of the least-examined choices in a study. On an undersaturated field it never bites; on a gas cap expansion it can dominate.

## The habit

For any deck you inherit, five questions about PROPS:

How many saturation regions, and why that many.
Is there hysteresis, and does the process need it.
Is capillary pressure present, and is the transition zone small compared to the column.
What is the three-phase model, if three phases occur.
Where did each table come from.

Ekene's answers are one, no, no, not applicable, and mixed provenance. All defensible, all worth writing down.

## The misconception to avoid

"The tables describe the rock." They describe a rock, under one saturation history, with no capillary pressure, at whatever conditions the underlying measurements were made. That is a much narrower claim, and the gap between the two is where most rel-perm surprises live.

## Exercise

First, list the five questions above and answer all five for this deck.

Second, name one field process for which each of these would be inadequate: a single saturation region, no hysteresis, and saturation-only dependence.
