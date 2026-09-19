# The differential

A netback on its own says what a barrel is worth to one refinery. A trader wants to know whether that is good, and that needs something to measure it against.

{{panel:crude-valuation-explorer}}

## The marker

A refinery that buys crude regularly has a reference crude it knows well, one whose netback it has already worked out on its own cuts, prices and costs. That reference is the marker. Any new crude is judged by how its netback stands against the marker's.

netbackValue takes a marker netback as an input and reports the differential: this crude's netback minus the marker's. Kwale's marker is 72.5 $/bbl. Like every figure in this course it is invented.

## The Kwale blend against its marker

| crude or blend | gross $/bbl | netback $/bbl | differential against the marker $/bbl |
| --- | --- | --- | --- |
| the blend, 55 and 45 | 74.2412 | 64.9473 | -7.5527 |

The blend's netback is 64.9473 $/bbl, the marker's is 72.5, and the engine reports the differential as -7.5527 $/bbl.

## Reading the sign

The differential is this crude minus the marker, so its sign has a fixed meaning. A negative differential says the crude nets back less than the marker at this refinery. A positive one says it nets back more. At -7.5527, the Kwale blend is worth less to Kwale than its marker crude, by the figure the engine prints.

Always read the sign against the definition. Some desks quote a differential the other way round, marker minus crude, and a figure read with the wrong convention reverses a buy into a sell. The engine's convention is stated with the function: this crude's netback minus the marker's.

## What a differential is used for

A differential is a price signal. If the Kwale blend is offered at a price tied to the marker, the differential says how far below or above that marker price the refinery can pay and still break even against running the marker. It turns a refinery's internal valuation into a number a seller understands.

That is also why the differential inherits everything in the netback. If a price were missing, the netback would be incomplete, and a differential built on it would compare part of one crude with the whole of another. If a cost were blank and taken as zero, the netback would carry that assumption, and so would the differential. The engine names both conditions on the netback itself, so they travel with the differential.

## Both sides on the same basis

A differential only means something when the two netbacks are built the same way: the same cut set, the same product prices, the same processing cost and freight treatment. The marker's 72.5 is Kwale's own figure for its marker crude, on Kwale's terms. Comparing a crude valued at one refinery against a marker valued at another would mix two different sets of cuts and prices, and the difference would measure the refineries as much as the crudes.

## In the panel

The valuation explorer ends its waterfall at the netback and then draws the marker beside it, with the differential as the gap. Move the blend's shares and watch the netback move while the marker stays fixed: the differential follows the netback.

## Exercise

Read the blend's netback, the marker and the differential. State the engine's definition of the differential and use it to say what the sign of -7.5527 tells the Kwale buyer. Then say what the differential would carry with it if the netback beneath it were incomplete.
