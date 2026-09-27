# The Ekene register and its items

{{panel:materials-register-calculator}}

Every practical in this course starts from one register: the EK-11 materials and spares register of the Ekene field. It is synthetic, written for this platform by a stated script, and it says so in its own label, verbatim:

> SYNTHETIC teaching data for the Ekene field (Petrolord fictional teaching field, block EK-11). No real company, person, supplier or price appears.

Money is in US$. The register carries 18 stock items, and every figure in it is a stated input you can read in the calculator's box.

## What each item states

Each item has an id and a name, an annual usage, a unit cost, a score from 1 to 5 on each of four criteria (safety, production, lead time and redundancy), the stock on hand, the months since it was last issued and its monthly usage. Six of the eighteen, as the register states them:

| id | name | annual usage | unit cost | safety | production | lead time | redundancy | on hand | months since last issue | monthly usage |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ESP-MTR | ESP motor, 228 kW, for Ekene-2 and Ekene-4 | 2 | 185000 | 3 | 5 | 5 | 4 | 1 | 7 | 0.1667 |
| PSV-KIT | Pressure safety valve repair kit, separator V-101 | 6 | 3800 | 5 | 2 | 3 | 2 | 4 | 3 | 0.5 |
| MECH-SEAL | Mechanical seal, export pump P-301 | 6 | 8900 | 3 | 5 | 3 | 2 | 2 | 6 | 0.5 |
| CEM-G | Class G cement, tonne | 180 | 420 | 2 | 2 | 2 | 1 | 35 | 12 | 15 |
| BARYTE | Baryte, tonne | 300 | 260 | 1 | 2 | 2 | 1 | 80 | 2 | 25 |
| HEAT-TRC | Heat tracing controller (obsolete model) | 0 | 3100 | 1 | 1 | 2 | 1 | 5 | 40 | 0 |

The spread is deliberate. A motor worth 185000 is used twice a year; baryte at 260 a tonne goes out by the hundred tonnes. A register that mixes the two is exactly why one policy cannot treat every item alike.

## The stated cases

Beside the items, the register states one case for each costing function, each named by the item it belongs to. This tier works the first one:

| function | item | tier that works it |
| --- | --- | --- |
| eoq | BARYTE | Associate |
| quantityDiscount | CSG-958 | Professional |
| safetyStock | CHK-BEAN | Professional |
| poissonStock | PSV-KIT | Professional |
| insuranceSpares | ESP-MTR | Expert |
| leadTimeRisk | MECH-SEAL | Expert |

## What the register plants for this tier

A teaching register earns its keep by putting items exactly where a rule has to decide. For the Associate tier it plants these:

- PSV-KIT scores the maximum on safety. It is class V with a weighted score of 68.000000, a score which alone gives class E.
- MECH-SEAL scores 70.000000, exactly the V minimum, and is class V; GASKET-RJ scores 44.000000, exactly the E minimum, and is class E.
- CEM-G is the item whose cumulative share of annual usage value crosses 80 percent, at 83.536840 with it.
- CEM-G has gone 12 months without an issue, GASKET-RJ 24 months and HEAT-TRC 40 months with no usage at all; ORING-KIT holds 80.000000 months of cover.

Each of these lands on a boundary of a stated rule, and each has its own lesson later in this tier. When you meet them there, you will already know where they sit in the register.

## Exercise

Open the register calculator. In "Criticality classes", start from "The Ekene register, its stated criticality policy" and read the box: find the scores of PSV-KIT and MECH-SEAL and check them against the table above. In "Slow-moving and obsolete stock", start from "The Ekene register, its stated bands" and find in the box the on hand, months since the last issue and monthly usage of HEAT-TRC and ORING-KIT. Then, using only the box, pick two items the register did not show you above and write out every figure the two boxes state for each of them.
