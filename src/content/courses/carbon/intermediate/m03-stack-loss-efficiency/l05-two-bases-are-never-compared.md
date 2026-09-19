# Two bases are never compared

This module has printed the invented Isiokpo heater four times: at two oxygen readings on two heating value bases. This lesson reads the rule that decides which of those four figures may be set against each other, and the refusal that enforces it when the tuning saving of module four is asked for.

{{panel:carbon-efficiency-explorer}}

## The warning on every LHV efficiency

SECTION 13 prints the engine's comparison warning on LHV, verbatim: "This efficiency is on LHV. An efficiency on the other basis is a different number for the same heater and the two must not be compared."

The warning makes two claims. The first is a fact about the heater: the same heater has a different number on the other basis. The second is a rule for the reader: the two must not be compared.

## The same heater, twice

SECTION 13 shows the first claim directly:

| case | basis | efficiency percent |
| --- | --- | --- |
| current, 5.5 percent O2 | LHV | 86.4029 |
| target, 2.8 percent O2 | LHV | 87.8476 |
| current, 5.5 percent O2 | HHV | 77.9288 |
| target, 2.8 percent O2 | HHV | 79.2343 |

At the current reading the heater is 86.4029 percent on LHV and 77.9288 percent on HHV. The digest prints the gap between them as a difference of 8.4741 percentage points, computed from the engine's figures. That gap is no loss the heater suffers and no gain a tuning could win. It is the two bases disagreeing about how much heat the fuel supplied, for a heater that did not change.

## The comparisons that are allowed

Read the table down its basis column and the rule sorts itself. Current against target on LHV is a comparison on one basis: 86.4029 against 87.8476 percent. Current against target on HHV is another: 77.9288 against 79.2343 percent. Each pair is one heater at two oxygen readings, with the heat supplied credited the same way in both. Module four turns each pair into a fuel saving.

A comparison across the basis column mixes two credits for the fuel in one subtraction. The warning forbids it, and the engine refuses it.

## The refusal that enforces it

The tuning saving of module four takes a current efficiency and a target efficiency. SECTION 14 prints what the engine answers when they come on different bases:

REFUSED: The two efficiencies are on different bases (LHV and HHV) and cannot be compared.

The engine does not convert one to the other and does not guess which the caller meant. It refuses, and names both bases in the refusal.

## The basis travels with the answer

Where the comparison is allowed, the engine carries the basis through. SECTION 14 prints the tuning saving on LHV with basis LHV among its outputs. It also prints the saving on HHV, computed from the two HHV efficiencies of SECTION 13, as a fuelSavingPercent of 1.6476 against the LHV figure of 1.6445. Each is a saving on its own basis.

The basis box is checked as well. SECTION 13 refuses a basis of "gross" and a blank one. The refusal for "gross", verbatim:

REFUSED: The heating value basis must be LHV or HHV. "gross" is neither, and an efficiency on an unknown basis cannot be compared with anything.

The engine reads the basis without regard to case or spaces: " hhv " returns basis HHV and 77.9288 percent.

## Exercise

Read the four efficiencies of SECTION 13 and the refusal in SECTION 14 for a current efficiency on LHV and a target on HHV. Say which two pairs of efficiencies can be set against each other, what the digest's difference of 8.4741 percentage points is a difference between, and why that figure is no measure of what tuning the heater is worth.
