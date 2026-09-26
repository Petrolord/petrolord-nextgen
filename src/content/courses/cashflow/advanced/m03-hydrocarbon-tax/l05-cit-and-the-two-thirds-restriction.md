# CIT and the two-thirds restriction

Companies income tax is the second profit tax on the same cash, on a base that includes gas, with a capital allowance the law caps at two thirds of the profit in PIA years and carries forward. PIA figures here use the Regulations (2021) price-royalty base, the engine default.

{{panel:ec-fiscal-explorer}}

## The base

cit_assessable_profit is gross revenue less royalty, HCDT, NDDC and opex. On the worked example it is 1058241648.19, equal to the HCT base because this oil-only field deducts the NDDC in both. Then the capital allowance comes off: 300000000.00 of capex at 20 percent in its first year is 60000000.00, so cit_chargeable_profit is 998241648.19, and CIT at pia_cit_rate_pct 30 is 299472494.46. The production allowance and the cost price ratio cap never reach it. AKATA in 2029 runs the same way: cit_assessable_profit 141335497.73 less the 42000000.00 fifth of its 210000000.00 capex gives cit_chargeable_profit 99335497.73, and CIT 29800649.32.

## Five years, fixed by the texts

The capital allowance runs over five years: 20, 20, 20, 20 and 19 percent of the cost in PIA years (PIA Fifth Schedule para 17(1)), and 20 percent a year in NTA years (NTA First Schedule Part II para 14(1)). Left unset or at 5, pia_capex_recovery_years runs the worked example to NPV 141236909.83; at 1, 2 or 10 the engine refuses the run and names both texts. A field that stops early never claims the rest.

## The restriction

For a crude oil company the Companies Income Tax Act limits the capital allowance to two thirds of the assessable profit, with the excess carried forward (CITA Second Schedule para 24(7), as substituted by Finance Act 2023 s.9(b), effective 1 May 2023). The Nigeria Tax Act has no such limit, so it acts only in years before 2026, and a company in upstream or midstream gas operations is exempt (set pia_cit_company_gas_operations true).

cpr_forfeiture shows it. Its cit_assessable_profit is 13987213.60, and the year's allowance is 20000000.00 on 100000000.00 of capex. The law cuts the claim to two thirds of the profit: cit_allowance_claimed 9324809.07, cit_chargeable_profit 4662404.53, one third of 13987213.60, and cit_tax 1398721.36. The refused 10675190.93 sits in cit_allowance_carryforward. The HCT on the same row has no such limit and carries its own loss of 512786.40.

The published pair prices the carry. pia_cit_allowance_restricted_carry reports NPV -102455984.11, and pia_cit_allowance_no_carry, the same field with cit_restricted_allowance_carryforward false, reports -116276490.72. The carry lands in 2026, an NTA year, and claims 110675190.93 there against 60000000.00 without it.

## The mistake

Reading the two thirds as a floor on tax of one third of profit in every year. It is a cap on the allowance, and it only acts in a pre-2026 year where the allowance is large against a thin profit; the worked example's 60000000.00 against 1058241648.19 is nowhere near it. The other is writing the refused amount off.

## What it refuses

CIT has no terrain and no reading; its rate is 30 in every published case. The carryforward needs a later year to land in, so a ledger that ends in the year the restriction binds loses it.

## Exercise

Write the CIT on cpr_forfeiture from its assessable profit and say why the chargeable profit is exactly one third of it. Then say where the refused allowance sits on that ledger and why it is never claimed.
