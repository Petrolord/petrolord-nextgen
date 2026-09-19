# Pass, fail and not fully screened

screenRoute reads each requirement in a route's envelope against the characterised gas and gives it a status. Then it gives the route one of three verdicts: passes, fails, or not fully screened.

{{panel:gasvalue-route-explorer}}

## Eleven checks on one gas

Here is EGBEMA screened against the study's own limits. Every actual figure comes from the gas the Associate tier characterised, or from the volume the study flares:

| route | requirement | actual | limit | status | margin |
| --- | --- | --- | --- | --- | --- |
| Compressed natural gas | Minimum volume | 7.5000 | 5 | pass | 2.5000 |
| Compressed natural gas | Maximum inerts | 0.0460 | 0.06 | pass | 0.0140 |
| Compressed natural gas | Minimum heating value | 1248.4110 | 1000 | pass | 248.4110 |
| Mini LNG | Minimum volume | 7.5000 | 10 | fail | -2.5000 |
| Mini LNG | Maximum CO2 before treatment | 0.0280 | 0.02 | fail | -0.0080 |
| Mini LNG | Maximum inerts | 0.0460 | 0.06 | pass | 0.0140 |
| LPG and condensate extraction | Minimum volume | 7.5000 | 5 | pass | 2.5000 |
| LPG and condensate extraction | Minimum liquids content | 3.2205 | 2 | pass | 1.2205 |
| Gas to power or gas to wire | Minimum volume | 7.5000 | 3 | pass | 4.5000 |
| Gas to power or gas to wire | Minimum heating value | 1248.4110 | 950 | pass | 298.4110 |
| Gas to power or gas to wire | Maximum inerts | 0.0460 | unset | unchecked | none |

The actual column repeats four figures. The volume is 7.5000 on every route. The inert mole fraction is 0.0460 wherever inerts are checked. The heating value is 1248.4110 on both routes that ask for one. The only figures that appear once are the CO2 mole fraction, 0.0280, and the liquids content, 3.2205. Same gas, same figures: what changes from route to route is the limit.

The status column carries three words. A check with a limit reads pass or fail. The check with no limit reads unchecked, and its margin reads none.

## Reading the margin column

The margin column prints signed figures. Every pass in the table carries a positive margin: 2.5000 on the CNG volume, 0.0140 on the inerts, 248.4110 on the CNG heating value, 1.2205 on the liquids content. Both fails carry a negative one: -2.5000 on the mini LNG volume and -0.0080 on its CO2. The same volume, 7.5000, gives a margin of 2.5000 against a limit of 5 and -2.5000 against a limit of 10.

Read the gas to power heating value beside the CNG heating value. The actual is 1248.4110 in both rows. The limits are 950 and 1000, and the margins print 298.4110 and 248.4110.

## Three verdicts

| route | verdict | uncheckedRequirements |
| --- | --- | --- |
| Compressed natural gas | passes | none |
| Mini LNG | fails | none |
| LPG and condensate extraction | passes | none |
| Gas to power or gas to wire | not fully screened | Maximum inerts |

Three verdicts appear: passes, fails, and not fully screened.

CNG passes: all three of its checks read pass. LPG passes on its two. Mini LNG fails: two of its three checks read fail, and the third, Maximum inerts, reads pass.

Gas to power is the route to read slowly. Both of its checked requirements pass, with margins of 4.5000 and 298.4110. It still does not read passes. Its Maximum inerts has no limit, so the check reads unchecked and the verdict reads not fully screened, with Maximum inerts named in uncheckedRequirements. A requirement with no limit is reported unchecked; an unset limit is not a satisfied one.

Look at the actual figure on that unchecked row: 0.0460. It is the same inert mole fraction that passed against 0.06 on CNG and on mini LNG. On the gas to power route the row reads unchecked all the same, because that route's own limit is unset.

In the panel, type a Maximum inerts limit on the gas to power route and read its verdict again.

The screen gives each route its own verdict and ranks nothing. Module 5's bid table lays the four routes side by side, and a route that fails screening stays in that table with its failure named.

## Exercise

Read the three gas to power rows and its verdict row. Say which status each check carries, give the margin on each checked requirement, and quote the field that names the requirement left unchecked. Then set the unchecked row's actual beside the CNG Maximum inerts row and say what the two rows share and what they do not.
