# Uplift and recovery from the farmor's share

{{panel:farmout-valuation-calculator}}

A carry is paid years before it comes back, so the farminee adds an uplift. HMRC's manual (OT18360, updated 23 January 2019) names the usual form:

> "the increasing interest party may also stipulate in the agreement that he recover his costs, usually including an addition representing simple interest, out of production relating to the reducing interest party’s licence interest." (HMRC Oil Taxation Manual OT18360)

The uplift type is a stated input; a call without one is refused:

> uplift must be an object { type } with type "none", "simple", "compound" or "multiple" (no default); got nothing

## Compound: on the whole opening balance

The Ekene fixture (synthetic) states a compound uplift of 8.000000 percent a year:

> 8% a year on the opening balance, compounded yearly; a year's new cost earns none in its own year

In 2031 the opening balance is 123840000.000000, which already carries the 2030 uplift, and the uplift is 9907200.000000 (engine).

## Simple: on the principal alone

The golden case devcarry-ekene-simple-ot18360 states the same carry with uplift type "simple" at 8.000000 percent, day basis "annual-period". The engine's rule:

> 8% a year simple interest on the outstanding principal (one year per ledger period); accrued interest earns none; a recovery pays the accrued interest first, then the principal; a year's new cost earns none in its own year (HMRC Oil Taxation Manual OT18360: costs recovered "usually including an addition representing simple interest")

In 2031 the principal is 120000000.000000 and the uplift 9600000.000000; the 3840000.000000 accrued in 2030 earns nothing.

| year | uplift (compound) | uplift (simple) | recovered (simple) | of which simple interest | of which principal |
| --- | --- | --- | --- | --- | --- |
| 2031 | 9907200.000000 | 9600000.000000 | 0.000000 | 0.000000 | 0.000000 |
| 2032 | 12619776.000000 | 11520000.000000 | 50000000.000000 | 24960000.000000 | 25040000.000000 |
| 2033 | 9629358.080000 | 9516800.000000 | 50000000.000000 | 9516800.000000 | 40483200.000000 |
| 2036 | 565417.925673 | 423627.161600 | 5718966.681600 | 423627.161600 | 5295339.520000 |

## Interest first: the engine's stated reading

The manual says a recovery usually includes an addition representing simple interest. It does not say whether a recovery pays that interest or the principal first. The engine pays the accrued simple interest first, then the principal:

> 2032: the 50000000 recovered pays the accrued interest 24960000 first, then 25040000 of principal

That is the engine's stated reading. Paying principal first would leave more principal earning simple interest. No graded figure depends on the order.

## Recovery from the farmor's share

Each year the recovery is the smallest of the available share, the balance due and any cap left. In 2032 EKO's share of the entitlement is 100000000.000000, and at 50.000000 percent, 50000000.000000 is available and recovered. In 2036 the balance due is below what is available, so the carry is recovered.

## The two forms side by side

Both forms recover the Ekene carry in 2036. The simple form adds 44438966.681600 in all, the compound form 46353141.996585 (engine). A reason rounds money to the cent: the 2033 compound uplift reads 9629358.08 in its reason, and the field is 9629358.080000.

A simple uplift also states its day basis: "annual-period" counts each ledger year as one year, and under "actual/365" the 2032 uplift of 366 days is 11551561.643836 (stated probe, engine).

## Exercise

Open the valuation calculator on the view "A development carry after the farm-in" and start from "The Ekene carry, compound uplift". Read the uplift column. Set "Uplift (stated)" to simple interest, enter the rate in "Uplift, percent a year (stated)" and choose a day basis; read the interest paid and principal paid columns for 2032. Compare "Recovered in" and "Uplift in all" with the compound run, then switch the day basis to actual/365 and read the 2032 uplift.
