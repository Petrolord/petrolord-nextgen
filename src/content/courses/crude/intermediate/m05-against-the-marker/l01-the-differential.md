# The differential

A netback on its own says what a barrel is worth to one refinery. netbackValue can also set it against a second figure, a marker netback.

{{panel:crude-valuation-explorer}}

## The marker

The marker enters as a netback in $/bbl of crude, the same unit as the crude's own netback, so the differential is the difference of two figures in one unit. The engine does not compute the marker. It takes it as a figure the caller supplies, and at Kwale that figure is 72.5 $/bbl.

netbackValue takes a marker netback as an input and reports the differential: this crude's netback minus the marker's. Kwale's marker is 72.5 $/bbl. Like every figure in this course it is invented.

## The Kwale blend against its marker

| crude or blend | gross $/bbl | netback $/bbl | differential against the marker $/bbl |
| --- | --- | --- | --- |
| the blend, 55 and 45 | 74.2412 | 64.9473 | -7.5527 |

The blend's netback is 64.9473 $/bbl, the marker's is 72.5, and the engine reports the differential as -7.5527 $/bbl.

## Reading the sign

The differential is this crude minus the marker, so its sign has a fixed meaning. A negative differential says the crude nets back less than the marker at this refinery. A positive one says it nets back more. At -7.5527, the Kwale blend is worth less to Kwale than its marker crude, by the figure the engine prints.

Always read the sign against the definition. The engine's convention is stated with the function: this crude's netback minus the marker's.

## A differential on an incomplete netback

The differential is formed from the netback beneath it, whatever that netback is. The course says so directly: "The differential is formed whether or not the valuation is complete." It prints the case. The Kwale Light and Ebocha partial assay blend of module 3, valued against the same marker, reports complete: false, a netback of 48.3393 $/bbl over the cuts it can value, and a differential of -24.1607 $/bbl. That differential is formed on a netback that leaves two cuts out, and complete: false on the netback is where a reader finds that out. A cost left blank and taken as zero is named on the netback the same way, in assumedZero.

## Both sides on the same basis

The lab values each crude on one set of terms: "Each crude alone is valued on the same Kwale cut set, product prices, processing cost, freight and losses as the blend." The marker is Kwale's too: "Kwale's marker is 72.5 $/bbl." Every differential in this module is read against that one marker on those terms.

## In the panel

The valuation explorer ends its waterfall at the netback and then draws the marker beside it, with the differential as the gap. Move the blend's shares and watch the netback move while the marker stays fixed: the differential follows the netback.

## Exercise

Read the blend's netback, the marker and the differential. State the engine's definition of the differential and use it to say what the sign of -7.5527 tells the Kwale buyer. Then read the differential this lesson prints for the Kwale Light and Ebocha blend, and say which line of its netback a reader must quote beside it.
