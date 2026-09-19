# A limit is yours to set

A route's envelope is a list of requirements. Each one has a direction and a unit, and each has a limit. flareToValue ships every one of those limits unset.

{{panel:gasvalue-route-explorer}}

## The envelopes as the engine exports them

ROUTE_TEMPLATES carries its requirements across the four routes, one row each. Every limit column reads null:

| route id | requirement | direction | unit | limit |
| --- | --- | --- | --- | --- |
| cng | Minimum volume | min | MMscfd | null |
| cng | Maximum inerts | max | mole fraction | null |
| cng | Minimum heating value | min | Btu/scf | null |
| mini_lng | Minimum volume | min | MMscfd | null |
| mini_lng | Maximum CO2 before treatment | max | mole fraction | null |
| mini_lng | Maximum inerts | max | mole fraction | null |
| lpg_extraction | Minimum volume | min | MMscfd | null |
| lpg_extraction | Minimum liquids content | min | gal/Mscf of C3+ | null |
| gas_to_power | Minimum volume | min | MMscfd | null |
| gas_to_power | Minimum heating value | min | Btu/scf | null |
| gas_to_power | Maximum inerts | max | mole fraction | null |

Every limit ships unset (null): the envelope is the study's to fill. The engine's note on the templates opens "Requirement limits are yours to set." The same note calls the limits "commercial and technology-specific", and it ends: "a licensor's CO2 limit is a design choice and the minimum viable volume moves with the market."

## Two requirements carry their own notes

The templates carry notes on two requirements.

On Mini LNG's Maximum CO2 before treatment: "CO2 freezes in a liquefaction train and must be removed first. The limit is the licensor's."

On the LPG route's Minimum liquids content: "Below this the liquids do not pay for the plant, whatever the gas is worth."

Neither note gives a number. The limit stays null in the template, and the study types it.

## The limits one study typed

The EGBEMA study typed limits route by route. A requirement not listed is left unset:

| route | limits typed |
| --- | --- |
| Compressed natural gas | minVolumeMMscfd 5, maxInertFraction 0.06, minGhvBtuScf 1000 |
| Mini LNG | minVolumeMMscfd 10, maxCo2Fraction 0.02, maxInertFraction 0.06 |
| LPG and condensate extraction | minVolumeMMscfd 5, minGpmC3Plus 2 |
| Gas to power or gas to wire | minVolumeMMscfd 3, minGhvBtuScf 950 |

Each typed field carries its unit from the template it fills. minVolumeMMscfd is in MMscfd. maxInertFraction and maxCo2Fraction are mole fractions. minGhvBtuScf is in Btu/scf. minGpmC3Plus is in gal/Mscf of C3+. So the 2 on the LPG route is two gallons of propane and heavier per Mscf, and the 0.02 on mini LNG is a CO2 mole fraction.

Count the rows against the templates. The CNG, mini LNG and LPG routes have a limit typed on every requirement their templates carry. Gas to power carries three requirements and the study typed two of them: Maximum inerts on the gas to power route is left unset. Lesson 3 shows what the screen reports for it.

These limits are the EGBEMA study's own, and like every figure in this course they are invented and illustrative. They are no licensor's limit and no market's minimum volume. This course does not say what a route's limit should be.

## An unset limit is not a satisfied one

A requirement with no limit is reported unchecked. The screen does not pass it. With every limit unset, as the studio opens, all four routes carry the same verdict:

| route | verdict |
| --- | --- |
| Compressed natural gas | not fully screened |
| Mini LNG | not fully screened |
| LPG and condensate extraction | not fully screened |
| Gas to power or gas to wire | not fully screened |

In the panel, clear every limit and read the four verdicts, then type the EGBEMA study's limits back one route at a time and watch each verdict change.

One refusal sits in front of every screen. Asked to screen a gas the analysis refused, screenRoute answers "A characterised gas is required." A gas the analysis refuses in the Associate tier is refused again at the screen, by that sentence.

## Exercise

Read the EGBEMA limits table beside the template rows. Name the one requirement the study left unset and the route it belongs to. Then read the studio's opening verdict table and say what all four routes report when every limit is unset, quoting the sentence about an unset limit.
