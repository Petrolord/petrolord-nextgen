# The Ekene agreements

{{panel:gsa-quantity-calculator}}

This course teaches on two gas sales agreements written for the platform around the Ekene licence. Both are synthetic, and both fixture files say so: no real company, plant, contract, price series or regulator allocation appears in them. The seller in each is the Ekene licence's gas, onshore. The quantities are contract quantities only.

## The power plant agreement

Ekene gas to the Ekene Power Plant (synthetic), a domestic power sector agreement running from 2027 to 2034.

| term | value |
| --- | --- |
| DCQ | 21000 MMBtu per day (20 MMscf per day at a stated 1050 Btu/scf gross) |
| reference conditions | 60 F and 14.696 psia (synthetic statement) |
| MaxDCQ | 110 percent |
| take-or-pay | 80 percent of the Adjusted ACQ |
| make-up | 3 contract years, forfeited at the end |
| seller shortfall damages | a stated 1.25 US$ per MMBtu not made available (synthetic contract term) |

Its price rests on a stated planning assumption: the fixture holds 2.18 US$ per MMBtu, the domestic base price reported for 2026, flat in every year as a planning assumption.

The ACQ of each year follows the calendar. The years 2027, 2029, 2030, 2031, 2033 and 2034 carry an ACQ of 7665000.000000 MMBtu; the leap years 2028 and 2032 carry 7686000.000000.

Read each term as something the two parties wrote down. The DCQ is stated in energy, and the fixture also states the volume and heating value it came from, so you can check the conversion yourself. The take-or-pay percentage applies to the Adjusted ACQ, which is the ACQ after the year's force majeure, maintenance and seller shortfall are taken off. The make-up period and what happens to unrecovered make-up at the end are stated terms as well; the engine will not guess them. The damages rate for a seller shortfall is a contract term of this synthetic agreement, and a real contract would state its own.

## The export feed agreement

Ekene gas to an export feed-gas buyer (synthetic), an oil-indexed agreement from 2027 to 2036, at a DCQ of 63000 MMBtu per day (60 MMscf per day at 1050 Btu/scf), MaxDCQ 105 percent and take-or-pay 90 percent. Its price formula, make-up and carry-forward terms belong to the Professional tier. Here it serves as a second set of quantities: its ordinary years carry an ACQ of 22995000.000000 and its leap years 23058000.000000.

## What is planted in them

The fixtures were written so that each situation a contract must handle happens somewhere. Several belong to this tier.

| planted situation | what finds it |
| --- | --- |
| January 2027: a zero nomination, whole-day force majeure, a seller shortfall, a nomination above MaxDCQ, maintenance and a buyer-caused gap | the daily balance, day by day |
| 2027: force majeure 42,000 and a seller shortfall of 6,300 reduce the Adjusted ACQ | the take-or-pay year's Adjusted ACQ |
| 2032: the take-or-pay quantity exactly met | a deficiency of zero at the boundary |

The engine finds all twelve planted situations, and the ones that run across several years (make-up expiring, carry-forward, the end of the term) are worked at the Professional tier.

## Why synthetic

A real gas contract is confidential, and a real allocation belongs to a regulator. A synthetic agreement can be printed in full, so every figure you read in a lesson can be recomputed in the panel from terms you can see.

## Exercise

Open the quantity calculator, the course's own calculator panel, and choose "Contract quantities and swing". The box holds the power plant's 2028 terms. Run it and read the day count and the ACQ. Change `year` to 2027 and run it again. Then enter the export feed's terms: a `dcq` of 63000, `maxDcqPct` 105 and `topPct` 90 for the year 2029. Read the ACQ and the MaxDCQ, and compare each with the figures above.
