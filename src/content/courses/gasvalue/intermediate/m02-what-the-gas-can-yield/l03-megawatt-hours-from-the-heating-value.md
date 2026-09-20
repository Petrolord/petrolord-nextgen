# Megawatt hours from the heating value

Three routes are capped on a mass: the whole gas mass, or the propane and heavier. Gas to power or gas to wire is capped on the heating value. Its yield unit is the megawatt hour, and its ceiling basis is the heating value.

{{panel:gasvalue-route-explorer}}

## The rule

The gas to power ceiling is the heating value in MWh: the heating value times a thousand over BTU_PER_MWH. The heating value is in Btu per standard cubic foot, and a thousand of those cubic feet make one Mscf. BTU_PER_MWH is one of the unit constants flareToValue exports:

| constant | value | what it is |
| --- | --- | --- |
| BTU_PER_MWH | 3412141.6331 | International Table Btu in one megawatt hour |

## Three gases, three ceilings

| gas | ghvBtuScf | gas to power ceiling, MWh per Mscf |
| --- | --- | --- |
| EGBEMA | 1248.4110 | 0.3659 |
| OGUTA | 1035.6050 | 0.3035 |
| studio opening gas | 1210.7800 | 0.3548 |

Each ceiling is built from its own gas's heating value, the figure the Associate tier printed as ghvBtuScf. That heating value is blended on moles: the mole-weighted heating value over the normalised analysis.

The Associate tier printed two shortcuts beside EGBEMA's heating value, each from the same reference table. The same heating values weighted by mass read 1537.2878 Btu/scf. The engine asked about the hydrocarbons alone, with the inerts left out and the rest scaled to one, reads 1308.6069 Btu/scf. The engine's figure is 1248.4110, and the gas to power ceiling of 0.3659 MWh rests on that figure. No ceiling is printed on either shortcut, and this lesson computes none.

## One heating value, two uses

EGBEMA's 1248.4110 Btu/scf appears twice in the gas to power study. In the screen it is the actual against the study's Minimum heating value of 950, with a margin of 298.4110 and a status of pass. In the ceiling it becomes 0.3659 MWh per Mscf. The CNG route reads the same heating value against its own limit of 1000.

A heating value can also be missing. The Associate tier showed EGBEMA's analysis with n-butane's heating value left blank: the mixture's ghvBtuScf prints null. A blank heating value leaves the mixture's heating value missing, and the engine's note on that row reads: "A heating value missing on any component leaves the mixture value missing too. No partial average is reported." The course prints no gas to power ceiling for that probe.

## The yield the study typed

EGBEMA's study typed a gas to power yield of 0.085 MWh per Mscf, against the ceiling of 0.3659. In module 3 that yield meets the rest of the route's year:

| route | yield per Mscf | recovery | price per unit, dollars | productPerYear | revenuePerYear, dollars |
| --- | --- | --- | --- | --- | --- |
| Gas to power or gas to wire | 0.085 MWh | 0.94 | 58 | 212733.7500 MWh | 12338557.50 |

The product is counted in the route's own unit all the way through: MWh per Mscf in, MWh a year out, and the price is in dollars per MWh.

In practice, the ceiling is a property of the gas and the typed yield is the study's own figure for its plant, bounded by that ceiling.

In the panel, pick the gas to power route and change the gas. Read the heating value and the ceiling on each gas, and read the typed yield beside them.

## Exercise

Read the three gas to power ceilings with the heating value each is built from. State the rule the ceiling follows, naming the constant and its value. Then give EGBEMA's heating value on moles and the two shortcut heating values the Associate tier printed beside it, and say which one the ceiling of 0.3659 MWh rests on.
