# A yield has a basis

A route's yield is the product one Mscf of gas makes. The study types it. Each route's yield is typed per Mscf in the route's own unit, and each carries a basis for the most one Mscf of this gas can make. flareToValue's function for that most is yieldCeiling.

{{panel:gasvalue-route-explorer}}

## Four yields, four units

EGBEMA's study typed a yield on each route:

| route | yield unit | ceiling basis | EGBEMA yield typed |
| --- | --- | --- | --- |
| Compressed natural gas | kg | gas mass | 18.5 |
| Mini LNG | t | gas mass | 0.0175 |
| LPG and condensate extraction | t | propane and heavier | 0.0052 |
| Gas to power or gas to wire | MWh | heating value | 0.085 |

Read each yield with its unit. The CNG route makes 18.5 kg of CNG from one Mscf. Mini LNG makes 0.0175 t of LNG. The LPG route makes 0.0052 t of LPG. Gas to power makes 0.085 MWh. The four figures are in three different units, and each is read against its own ceiling.

## Three bases

The ceiling basis column carries three words.

**Gas mass.** CNG and mini LNG are capped on the whole gas mass. That is the kgPerMscf the Associate tier printed: the mass in one Mscf is the moles in a thousand standard cubic feet times the molar mass. For EGBEMA it reads 26.7066 kg/Mscf.

**Propane and heavier.** The LPG route is capped on the propane and heavier. That is the c3PlusKgPerMscf the Associate tier printed: the part of the gas mass that is propane and heavier. For EGBEMA it reads 6.6647 kg/Mscf.

**Heating value.** Gas to power is capped on the heating value, in MWh: the heating value times a thousand over BTU_PER_MWH. EGBEMA's heating value is 1248.4110 Btu/scf. Lesson 3 of this module reads that ceiling.

The Associate tier said of the first two: kgPerMscf and c3PlusKgPerMscf are the most any route can take out of a thousand standard cubic feet, by mass. yieldCeiling puts each route on one of them, or on the heating value.

## The ceilings on EGBEMA

| route | yield unit | ceiling basis | EGBEMA ceiling per Mscf | EGBEMA yield typed |
| --- | --- | --- | --- | --- |
| Compressed natural gas | kg | gas mass | 26.7066 | 18.5 |
| Mini LNG | t | gas mass | 0.0267 | 0.0175 |
| LPG and condensate extraction | t | propane and heavier | 0.0067 | 0.0052 |
| Gas to power or gas to wire | MWh | heating value | 0.3659 | 0.085 |

The CNG ceiling, 26.7066 kg, is the same figure as EGBEMA's kgPerMscf. Mini LNG sits on the same gas mass basis and prints its ceiling in its own unit, tonnes: 0.0267. The LPG ceiling prints 0.0067 t on the propane and heavier basis, beside a c3PlusKgPerMscf of 6.6647 kg.

Every EGBEMA yield typed sits at or below its ceiling. That is the only comparison this lesson draws between the two columns. The course prints one ratio of a typed yield over its ceiling, on a different gas, and the next lesson reads it.

## The basis in the engine's own words

Each route names its basis in the template, beside its yield unit, and the basis word travels with the ceiling. When a typed yield is above the ceiling, the refusal names the basis in brackets. On EGBEMA's CNG route at 30 kg/Mscf the engine answers: "Route "Compressed natural gas" yields 30 kg per Mscf, more than the 26.706618 kg the gas holds (gas mass). A yield above what the gas contains is refused." Lesson 4 of this module reads that refusal and its two siblings.

In the panel, pick each route in turn and read its ceiling and its basis word together.

## Exercise

Read the EGBEMA ceiling table. For each route, give the ceiling per Mscf with its unit and its basis word. Then name the Associate tier figure that prints the same value as the CNG ceiling, and quote the sentence about where the EGBEMA yields sit against their ceilings.
