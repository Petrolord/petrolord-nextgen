# A failure names its requirement

A verdict of fails does not stand alone. screenRoute returns the failures beside it, and each failure names the requirement it broke, the actual, the limit and the shortfall in the requirement's own unit.

{{panel:gasvalue-route-explorer}}

## Mini LNG's two failures

EGBEMA's mini LNG route is the one route that fails the study's screen. Its failures field reads, in full:

| route | verdict | failures (requirement: actual against limit, shortfall) |
| --- | --- | --- |
| Mini LNG | fails | Minimum volume: 7.5000 against 10, short by 2.5000 MMscfd; Maximum CO2 before treatment: 0.0280 against 0.02, short by 0.0080 mole fraction |

Two requirements are named. Each carries its unit: the volume shortfall is 2.5000 MMscfd, and the CO2 shortfall is 0.0080 mole fraction. The check table prints the same two rows with margins of -2.5000 and -0.0080.

The failures field lists only what failed. Mini LNG's third requirement, Maximum inerts, reads pass at 0.0460 against 0.06 with a margin of 0.0140, and it does not appear in the failures. The other three routes print none in the failures column: CNG and LPG pass, and gas to power fails nothing.

## Two reasons can fail one route

The mini LNG route breaks two different requirements, and the field names both. One is a volume: the study typed minVolumeMMscfd 10, and EGBEMA flares 7.5 MMscfd. The other is a composition figure: the study typed maxCo2Fraction 0.02, and the gas carries a CO2 mole fraction of 0.0280.

The template's own note on the CO2 requirement reads: "CO2 freezes in a liquefaction train and must be removed first. The limit is the licensor's." The note gives no figure, and the 0.02 is the EGBEMA study's own. The engine's general note on the templates opens: "Requirement limits are yours to set."

The failures field keeps the two apart. Each entry opens with the requirement's name, and each shortfall carries its own unit, MMscfd for the one and mole fraction for the other.

## A failed route stays on the page

A failure removes nothing from the study. compareRoutes lays the routes side by side, and a route that fails screening stays in the table with its failure named. In the EGBEMA bid table, mini LNG keeps its row with its verdict fails, and the comparison lists it under screenedOut:

| field | value |
| --- | --- |
| screenedOut | Mini LNG |
| notFullyScreened | Gas to power or gas to wire |

Those two fields sort the routes that do not pass. Mini LNG fails a requirement it was checked against. Gas to power fails nothing and carries a requirement nobody checked. The two are named in different fields, and module 5 reads the rest of that table.

## A failure and an unchecked requirement

The verdict table carries two lists per route. failures names what broke. uncheckedRequirements names what had no limit to be checked against:

| route | verdict | failures | uncheckedRequirements |
| --- | --- | --- | --- |
| Mini LNG | fails | two, named above | none |
| Gas to power or gas to wire | not fully screened | none | Maximum inerts |

On EGBEMA the two lists fall on different routes: mini LNG has failures and nothing unchecked, and gas to power has one requirement unchecked and no failures. This course does not choose the gas to power inerts limit for the study.

In the panel, change mini LNG's CO2 limit and its volume limit one at a time, and read the failures field and the verdict after each change.

## Exercise

Read mini LNG's failures field. Name both requirements, give each actual, limit and shortfall with its unit, and quote the margin the check table prints on each of the two rows. Then say which field lists mini LNG in the bid table and which field lists gas to power.
