# Converted and new leases

{{panel:pia-royalty-calculator}}

A petroleum mining lease reaches the Act by one of two roads: converted from an oil mining lease granted before the Act, or granted after the Act out of new acreage. The road matters at the fiscal end, and the engine asks for it as a stated input.

## Two words this course legislates

A converted lease is a petroleum mining lease converted from an oil mining lease under the Act's conversion, which the engine reads as `pia_lease_status` "converted". A new lease is a petroleum mining lease granted out of new acreage, `pia_lease_status` "new". Any other status is refused:

> pia_lease_status must be "converted" or "new"; got "renewed".

## Conversion in the text

Conversion is voluntary. A holder of an oil mining lease or oil prospecting licence "may enter into a voluntary conversion contract under this Act" (PIA s.92(1)), and it has a deadline, PIA s.92(4):

> "(4) A conversion contract shall be concluded at a date (“conversion date”) which is the earlier of: (a) 18 months from the effective date ; and (b) the expiration date of the oil mining lease"

On conversion the holder selects areas. PIA s.93(6)(b) sends the areas under development or in production into mining leases:

> "(b) selected under subsection (1) (d) and (e), into petroleum mining leases, with fiscal terms as applicable under section 267 (a) and other terms of Chapter 4 of this Act to the lease,"

Read together: the areas a holder keeps in development or production become petroleum mining leases on the 30 percent terms, the areas it keeps for appraisal or discovery become petroleum prospecting licences on the 15 percent terms, and the areas it does not select are relinquished (PIA s.93(4)).

## A lease that does not convert

A holder that does not convert keeps its old terms: the Act does not apply to it until its licence or lease ends or expires (PIA s.303(1)), and the Nigeria Tax Act 2025 says the same of its own hydrocarbon tax Part (NTA s.87(1)). Such a lease sits outside the engine and is concept-only.

## Marginal fields

A producing marginal field may keep its original royalty rates but must convert to a petroleum mining lease within 18 months of the effective date (PIA s.94(1)), and the Act allows no more of them: "(9) No new marginal fields shall be declared under this Act." The engine reads a converted producing marginal field as a stated flag, `pia_marginal_field_pre_2021`, on an onshore or shallow water lease. The flag puts the field in the 15 percent tax class and leaves its royalty on the terrain's tranches.

| Ekene case | terrain | lease | daily rate 2026, bopd | liquids royalty rate |
| --- | --- | --- | --- | --- |
| ekene_marginal_shallow_flag | shallow_water | converted, marginal flag set | 20000.000000 | 0.093750 |

## One question left open

A new lease onshore or in shallow water asks for one more stated input, because the texts do not say which of the two tax rates it pays. That is one of the course's three open readings, and the Professional tier takes it up.

## Exercise

Open the royalty calculator and choose "Royalty by terrain and daily rate". Enter shallow_water and 20000 bopd and confirm the engine returns the marginal field case's rate, 0.093750. Switch to "The instruments stacked on a ledger" and run ekene_marginal_shallow_flag. In the case box set pia_marginal_field_pre_2021 to false, run it again and note which column moved and which stayed. Then set pia_lease_status to "renewed", run it, and copy the refusal.
