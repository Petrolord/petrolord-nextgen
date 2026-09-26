# The domestic base price, a stated input

{{panel:gsa-ledger-calculator}}

Nigeria sets the price of gas sold to its strategic domestic sectors by law. The Petroleum Industry Act 2021 builds every sector price on one figure, the domestic base price, which a regulator determines each year. This module computes the sector prices. This lesson fixes what that one figure is, where it comes from, and why the course treats it as an input it quotes only as reported.

## What the Act says

The Petroleum Industry Act 2021 (Act No. 6, Official Gazette No. 142, Vol. 108, 27 August 2021, read 2026-09-26) gives the Authority the task each year:

> "determine the domestic base price under the Third Schedule to this" (PIA s.167(1))

The Third Schedule sets the principles the price must meet, the first of them:

> "(a) the price must be of a level to bring forward sufficient natural gas supplies for the domestic market on a voluntary basis by the upstream petroleum industry ;" (PIA Third Schedule para 1(a))

The Domestic Gas Delivery Obligation Regulations 2022 (S.I. No. 74 of 2022, Official Gazette No. 206, Vol. 109, 23 November 2022, read 2026-09-26) define the term by reference to the Act:

> "“domestic base price” is the price for marketable natural gas determined pursuant to the Third Schedule to the Act ;" (DGDO Regulations 2022 r.9)

## A required input with no default

The Act prints no figure; the Authority determines one every year. The regulator's own circular for 2026 could not be retrieved when the course's sources were read, so the engine holds no default and every call states the figure. A call without it is refused:

> domesticBasePrice must be stated in US$ per MMBtu: the Authority determines it each year (PIA s.167(1)) and the engine holds no default; got nothing

The engine's basis carries the whole position in its own words:

> a required input with no default under price control: the Authority determines it each year under the Third Schedule (s.167(1)). US$2.18 per MMBtu (power) and US$2.68 (commercial), effective 1 April 2026, are reported by BusinessDay (31 March 2026) and by Advocaat Law Practice through Legal 500 (7 April 2026); the regulator's circular was not read

## Quoting the reported figures

The course quotes those figures in that form and grades none of them:

| year | power, as reported | commercial, as reported |
| --- | --- | --- |
| 2026, effective 1 April | 2.180000 (reported) | 2.680000 (reported) |
| 2025 | 2.130000 (reported) | 2.630000 (reported) |

The power plant agreement (synthetic) prices every year from 2027 to 2034 at the reported 2026 figure of 2.180000, held flat as a stated planning assumption. The Authority re-determines the price each year, so every power plant money figure in this tier rests on that assumption, and each lesson that quotes one says so.

## Exercise

Work in the course's own ledger calculator, on the view "Domestic gas prices". It starts with a gas based industry case.

1. Replace the inputs with `{ "sector": "power", "priceControlApplies": true, "domesticBasePrice": 2.130000 }`, the reported 2025 figure. Read the price and the basis note under it.
2. Change the sector to "commercial" and read the price.
3. Delete `domesticBasePrice` and read the refusal.
4. Write one sentence you could put beside any power plant money figure, naming the assumption it rests on and who reported the figure.
