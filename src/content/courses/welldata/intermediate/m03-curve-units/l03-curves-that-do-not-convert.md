# Curves that do not convert

Two curves in feet_20 convert. Three do not. This lesson is about the three, because understanding why a curve is left alone is what stops you from converting things that should never be touched.

The instinct to guard against is contamination by association. The file is foreign. Its depth is in feet. Its sonic is per foot. It is easy to slide from there into treating the whole file as foreign and expecting the importer to do something to all five curves. It does not, and it should not.

## The five logs after import

| mnemonic | kind | unit after | unit before | converted |
|---|---|---|---|---|
| DEPT | depth   | M     | F     | YES |
| GR   | gr      | GAPI  | GAPI  | no  |
| RHOB | density | G/C3  | G/C3  | no  |
| NPHI | neutron | V/V   | V/V   | no  |
| DT   | sonic   | US/M  | US/F  | YES |

Read down the two unit columns and the rule is visible without any other information. Where the unit before and the unit after differ, the curve converted. Where they are identical, it did not. The mnemonics are along for the ride.

## GR in GAPI

The gamma ray log reports natural radioactivity, and it is quoted in API units, written GAPI in this file.

The API gamma ray unit is not derived from any physical dimension at all. It is defined by an artefact: a calibration pit at the University of Houston holding a block of formation of known activity, with the difference between the high and low activity zones of that block declared to be 200 API units. Every gamma ray tool in the world is normalised against that pit, directly or by a chain of transfer standards.

A unit defined by a reference sample has nothing in it to convert. There is no length, no time and no mass in GAPI, so there is no way for the choice of foot or metre to reach it. A tool logging a foot-referenced well and a tool logging a metre-referenced well report the same GAPI value in the same rock. The unit string is identical before and after import because the quantity was never unit-system-dependent in the first place.

## RHOB in G/C3

Bulk density is a mass divided by a volume, which means it does have physical dimensions, and it does contain a length. The length is in the denominator, cubed. So why does it pass through untouched?

Because the unit is already metric. G/C3 is grams per cubic centimetre, and the gram and the centimetre are both metric units. There is no foot anywhere in the string. The density tool did not change its unit because the depth reference of the log changed, and it had no reason to: density is a property of a sample of rock, quoted per unit of volume, and the volume unit is a vendor and industry convention rather than a consequence of how the borehole was depth-referenced.

This is worth pausing on, because it shows that the question is not whether a unit has dimensions. It is whether the unit string contains a length expressed in the foreign system. G/C3 does not, so the importer's table has no entry for it, so the curve passes through with its unit and its samples exactly as the parser produced them.

There is a related point about what the platform does not do. G/C3 is not the SI coherent unit for density; that would be kilograms per cubic metre. The importer does not normalise G/C3 to anything. The internal convention for density in this platform is the unit the industry actually logs in, and the importer's job is to remove foreign-system length references, not to impose a textbook unit system on everything it touches. Converting only what must be converted is a feature.

## NPHI in V/V

Neutron porosity is quoted as V/V, a volume of pore space per volume of rock. It is a ratio of two like quantities, so the units cancel and the number is dimensionless. The same fraction comes out whether the volumes behind it are measured in cubic feet or in cubic centimetres, because the length unit appears once above the line and once below it and cancels.

Dimensionless quantities are the easiest case in the whole of unit handling: there is nothing to convert, ever, under any change of unit system. The only thing to watch with a curve like NPHI is the convention question of whether it is written as a fraction or as a percentage, and that is a matter of reading the unit string honestly rather than a conversion. V/V says fraction. A file that said PU or percent would be saying something different, and it would still not be a foot-to-metre question.

## The general test

Put the three together and the test you should apply to any curve is a single question: does the unit string contain a length expressed in the foreign system, anywhere, in the numerator or the denominator?

GAPI has no dimensions at all. V/V is dimensionless by cancellation. G/C3 has a length, but a metric one. None of them qualifies, so none of them converts. F is a foreign length, and US/F carries a foreign length in the denominator, so both of those qualify and both convert.

Notice that this test is applied per curve, never per file. A file is not converted; curves are. The phrase "feet_20 is a feet file" is a statement about its depth column, and it tells you nothing about what will happen to the other four curves. Three of them are indifferent to it.

## Exercise

For each of the following curve units, decide whether an import into this platform would convert it and give the reason in one clause: OHMM for a deep resistivity, IN for a caliper, PU for a neutron porosity in porosity units, and G/C3 for a density in a metric file.

Self-check: OHMM is ohm metres, already metric, so no conversion. IN is inches, a foreign length outright, so it is the sort of unit that ought to convert, but it converts only if the platform's table carries an entry for it, and this platform's table covers feet and the per-foot slowness spellings rather than every foreign length in circulation. An unrecognised unit is passed through unconverted and flagged for a human, which is the subject of the next module. PU is a dimensionless porosity expressed on a scale of 0 to 100, so there is no length to convert; any change needed is a scale convention, not a unit-system conversion, and it should be handled as an explicit decision rather than folded in silently. G/C3 does not convert, and note that it does not convert in a feet file either, exactly as the table for feet_20 shows.
