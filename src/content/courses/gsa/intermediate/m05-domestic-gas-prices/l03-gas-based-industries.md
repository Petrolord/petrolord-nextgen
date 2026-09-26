# Gas based industries and the Fourth Schedule

{{panel:gsa-ledger-calculator}}

Gas based industries buy gas as feedstock, and the Act prices it by a formula tied to the price of what they make, inside a floor and a ceiling. This lesson reads the Fourth Schedule formula, its product table and the order in which the band applies.

## What the Act says

The Petroleum Industry Act 2021 (Official Gazette No. 142, Vol. 108, 27 August 2021, read 2026-09-26) sets the band in s.168:

> "(2) The floor price for the gas based industries shall be US $0.90 per MMBtu." (PIA s.168(2))

> "(3) The ceiling price shall be the domestic base price applicable for any particular year." (PIA s.168(3))

The Fourth Schedule gives the formula:

> "CP = NRP * (1 + EPF) <=EPP Where - CP is the applicable price in US $/MMBtu, EPP is the domestic base price under section 168 (3), NRP is the National Reference Price which is US $1/MMBtu" (PIA Fourth Schedule)

The escalation factor is EPF = (CMPP - PRP) / PRP, with CMPP the average current month end product price and PRP the product reference price, both in US$ per tonne. The engine holds the Schedule's table: NRP 1.000000 for every product, and PRP 250.000000 for ammonia, urea, methanol and polypropylene, and 325.000000 for low sulphur diesel (GTL).

## The prices the engine returns

Every row states the domestic base price as reported for 2026, which sets the ceiling. None is graded.

| product | CMPP | EPF | formula price | price | held at |
| --- | --- | --- | --- | --- | --- |
| urea | 450.000000 | 0.800000 | 1.800000 | 1.800000 | none |
| urea | 200.000000 | -0.200000 | 0.800000 | 0.900000 | floor |
| urea | 600.000000 | 1.400000 | 2.400000 | 2.180000 (reported 2026 ceiling) | ceiling |
| urea | 250.000000 | 0.000000 | 1.000000 | 1.000000 | none |
| low-sulphur-diesel-gtl | 520.000000 | 0.600000 | 1.600000 | 1.600000 | none |

At a product price equal to its reference price, the price is the NRP. Below it the formula can fall under the floor, and the engine lifts it to 0.900000 with its reason: "the formula gives 0.8, below the floor US$0.90 per MMBtu, so the price is held at 0.9 (s.168(2))". Above, the formula can pass the domestic base price, and the engine holds it there. The ceiling applies before the floor.

## The Authority may change the table

> "The Authority may by regulation change the formulas or the values for NRP, CMPP and PRP and introduce other values for one or more gas based industries" (PIA Fourth Schedule)

So the engine accepts a `schedule` of NRP and PRP with a named source. On an illustrative synthetic regulation of NRP 1.2 and PRP 300, ammonia at a CMPP of 450 prices 1.800000. The reason prints the double the engine holds, "the formula gives 1.7999999999999998, inside the floor 0.9 and the domestic base price 2.18", on the reported 2026 figure; the course quotes the field, 1.800000.

## What the engine refuses

> product must be one of "ammonia", "urea", "methanol", "polypropylene", "low-sulphur-diesel-gtl"; got "fertiliser"

> cmpp must be stated: the average current month end product price in US$ per tonne (Fourth Schedule); got nothing

## Exercise

Work in the course's own ledger calculator, on the view "Domestic gas prices". It starts with the urea case at a CMPP of 450 and the reported 2026 figure as its stated domestic base price.

1. Read the EPF, the formula price and the price, and check them by hand.
2. Set `cmpp` to 200, then 600. Write the price and the "held at" tile each time.
3. Set `product` to "low-sulphur-diesel-gtl" and `cmpp` to 520. Say why the price differs from urea at the same CMPP.
4. Delete `cmpp` and read the refusal.
