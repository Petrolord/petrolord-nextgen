# A factor is a record

{{panel:carbon-inventory-explorer}}

## More than a number

Every Igbogene line carries an activity and a factor. In carbonAbatement a factor is built by makeFactor, and what comes back is a record: a value, a unit, a gas, a source and a version, with fields that say whether the record is complete. The number is one field of it.

The smallest example is in the engine's own output. A factor typed with a value and nothing else:

| label | value | unit | gas | hasValue | provenanceComplete | missingProvenance |
| --- | --- | --- | --- | --- | --- | --- |
| A factor typed with no source | 2.5 | tCO2/t | CO2 | true | false | source, version |

hasValue is true, so the arithmetic can run. provenanceComplete is false, and missingProvenance names what is absent: source, version. The record keeps both facts side by side.

## The Igbogene factors

Here are the five Igbogene lines with their factors and provenance. Every activity and factor is invented for this course, and the electricity factor is synthetic:

| line | activity | unit | factor | factor unit | source | version | provenance complete |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Fired heaters (CO2) | 23121.448 | t CO2 | 1 | tCO2/tCO2 | Atom balance (conservation of mass) | not applicable | true |
| Flaring (CO2) | 2191.807 | t CO2 | 1 | tCO2/tCO2 | Atom balance (conservation of mass) | not applicable | true |
| Flaring (unburned CH4) | 16.306 | t CH4 | 1 | tCH4/tCH4 | Atom balance (conservation of mass) | not applicable | true |
| Vented and fugitive methane | 142.000 | t CH4 | 1 | tCH4/t | Epie Creek leak detection survey (invented) | 2026 Q2 | true |
| Purchased electricity | 31500.000 | MWh | 0.41 | tCO2/MWh | Supplier statement (invented) | 2025 | true |

## Three kinds of factor

The first three lines are atom-balance lines. The engine has already computed their tonnes of gas, so the Carbon Studio carries them into the inventory through a factor of 1 whose source is conservation of mass. Their version is "not applicable", and their provenance is complete. The engine's method sentence says why no document is needed: "This is conservation of mass, not an empirical factor, so it needs no source document."

The vented and fugitive methane line has an activity of 142.000 t of methane and a factor of 1. Its source is a named survey, the Epie Creek leak detection survey (invented), with a version of 2026 Q2. The factor is 1, and the record says where the 142.000 t came from.

The purchased electricity line is the one whose factor changes the unit. Its activity is 31500.000 MWh, and Igbogene's invented factor of 0.41 tCO2/MWh converts it into 12915.000 t of CO2. Its source is a supplier statement (invented), version 2025.

## What an incomplete record does

A factor with no source still computes. What it changes is the inventory's status. In the Igbogene steps, before the survey is referenced, the inventory totals 42945.777 tCO2e and is not reportable because "1 factor(s) have no source or version". Referencing the survey closes that reason, and the same total becomes reportable with the reason "none".

In practice, emission factors are revised by the bodies that publish them, so a factor with no version cannot be checked against the edition it was taken from.

In the panel's stepper, move from the step where the electricity factor is entered to the step where the survey is referenced. The total holds and the status turns reportable.

## Exercise

Read the vented methane line before and after the survey is referenced: the total of 42945.777 tCO2e in both steps, reportable false and then true. Say what the relationship between the unchanged total and the changed status shows about what a factor's source adds.

Self check: the total is 42945.777 tCO2e in both steps, so the source changes no figure. Without the source the inventory is not reportable because "1 factor(s) have no source or version", and with the survey referenced it is reportable with the reason "none". A factor's source makes the figure reportable without moving it.
