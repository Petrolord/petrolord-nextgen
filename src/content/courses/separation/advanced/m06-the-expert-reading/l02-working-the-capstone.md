# Working the capstone

The assessment gives a stream and a site and asks for the figures a designer would hand over. Every one of them is reachable by running the chain in order and reading what the engine returns, with no shortcut and no number carried over from a worked example.

{{panel:fc-slug-explorer}}

## Run the chain in order

Conditions come first, because everything downstream moves with them. A gauge pressure becomes an absolute pressure, the gravity gives the pseudo-criticals and the reduced pair, and the reduced pair gives z. Then the gas density, then the actual rate the vessel sees.

K comes from the mist extractor and the pressure. Settling comes from K and the two densities. Only then is there a vessel. On AGBAMI that chain runs 350.000000 psig to Ppr 0.549797 and Tpr 1.508700, z 0.947166, a gas density of 1.276898 lb/ft3, K 0.525000, settling 3.549130 ft/s and a gas rate of 8.713371 ft3/s.

## Three-phase in the right order

Split before interface, interface before layers, layers before verdicts. The retentions give the water share, the share gives an area, the area inverts to an interface depth, and the two layers follow from the interface and the liquid level. AGBAMI holds 0.516129 of its liquid area as water, which puts the interface at 3.049149 ft under an oil layer of 1.950851 ft.

The verdicts come last because they need the sized vessel. A crossing time is compared against a residence time, and the residence time is a consequence of the length the retentions forced.

## Read the sweep as a table

A sweep answer is never one number. Take the diameter, then its row: the length, the slenderness, `inRange`, `feasible` and the reasons. Then take `preferredStatus`, because a null preferred diameter means none-feasible or none-in-band and those call for different actions.

Check the band that was passed in before concluding anything about shape. Widening the ABANA-2 band from 3.000000 to 5.000000 out to 3.000000 to 7.000000 brings the 6.000000 ft row in range and leaves it infeasible on gas capacity, so the preference stays at 7.000000 ft.

## Read the layout as five counts

Checked, zero-requirement pairs, skipped, unknown pairs, and then the two flags. ERHA reports 69, 21, 2 and 12, with complete false and pass false. Take the two rankings separately: `worstAbsolute` names the pair short by the most metres and `worstRelative` the pair short by the largest fraction, and they name different pairs there.

A setback needs its provenance stated. A computed figure moves with its duty, and a table figure does not.

## Units, precision and words

Vessel work prints to six decimals, metres and kilowatts and seconds to four, and counts are whole numbers. Gauge and absolute pressures are never written as though they were the same quantity. Where an answer is a status word rather than a number, give the word, because null with a reason is the answer and a blank is not.

## Exercise

Write the order of the chain from gauge pressure through to a droplet verdict, naming what each step needs from the one before it. Then list what a complete sweep answer contains beyond the preferred diameter, and the five counts plus two flags that make up a layout reading.
