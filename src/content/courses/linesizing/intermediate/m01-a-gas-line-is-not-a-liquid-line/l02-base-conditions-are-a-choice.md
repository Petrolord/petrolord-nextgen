# Base conditions are a choice

A rate in scfd is a volume counted at a stated base, and the base the published transmission forms are written at is 520.000000 degR and 14.650000 psia. The module exports both, which is what lets a caller check them rather than assume them.

{{panel:fc-gasline-explorer}}

## Pressures that are easy to confuse

| figure | value | what it is |
| --- | --- | --- |
| the base temperature of the published forms | 520.000000 degR | the temperature a standard cubic foot is counted at |
| the base pressure of the published forms | 14.650000 psia | the pressure a standard cubic foot is counted at |
| the SOKU outlet | 620.000000 psia | a pressure the line actually runs at |

A fourth pressure belongs beside them and the engine names it rather than numbering it: atmospheric, which is the floor of the outlet-pressure bracket. The base pressure is not atmospheric. The two do different jobs as well as holding different values, because the base is a bookkeeping condition that appears inside every form while atmospheric is a physical floor that appears in the solver inverting them.

## A standard cubic foot is an accounting unit

Nothing in the pipe is at 520.000000 degR and 14.650000 psia. The SOKU trunk flows at 535.000000 degR and somewhere between 850.000000 psia and 620.000000 psia along its length. A rate of 66104956.1404 scfd is a statement about how much gas passes, expressed as the volume that quantity would occupy at the base, and the base is in the form precisely so the answer can be a quantity rather than a volume at an unstated condition.

## Two forms at different bases are not comparable

This is the trap the export exists to prevent. Two published forms quoted at different bases are not comparable even when the numbers agree, because agreement between two rates counted at two different bases is a coincidence of the arithmetic rather than a statement about the pipe. Every rate in this tier, all four forms and every published case, is counted at 520.000000 degR and 14.650000 psia, so the four can be set beside each other honestly.

## The base does not move with the line

The flowing temperature and the compressibility belong to the line and change with it. On SOKU they are 535.000000 degR and 0.885000. The base does not change with the line at all. Two trunks in different climates carrying different gas report at the same 520.000000 degR and 14.650000 psia, which is what makes a contract written in scfd mean the same thing at both ends of it.

## Why the module exports the base

The base could have been left implicit inside the forms, which is where most published statements of them leave it. Exporting 520.000000 degR and 14.650000 psia makes it a value a caller can read, print in a report and check against a contract, rather than a constant buried in an equation. A figure that can be quoted is a figure that can be disagreed with, and that is the whole reason for lifting it out.

## The mistake

The mistake is reading 14.650000 psia as atmospheric and using it as the floor of a pressure search, or reading atmospheric as the base and reporting a rate against it. They are two low pressures in the same engine, used at opposite ends of the calculation.

The second mistake is comparing a rate from this engine against a rate from a document that never stated its base.

## Exercise

Give the base temperature and base pressure the published forms report at, and the atmospheric pressure the outlet solver uses as its floor. Say which of the two is a bookkeeping condition and which is a physical one. Then explain why two rates counted at different bases cannot be compared even when they are equal.
