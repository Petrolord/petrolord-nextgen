# The two thirds restriction in Act years

{{panel:pia-hct-calculator}}

Companies income tax has its own brake on capital allowances, separate from the cost price ratio. In a year under the Act alone the claim is limited to two thirds of the assessable profit, and the rest waits. This lesson reads where the rule comes from, when it binds and who is exempt.

## The source

The rule is paragraph 24(7) of the Second Schedule to the Companies Income Tax Act, as substituted by the Finance Act 2023 s.9(b), effective 1 May 2023 (s.30). The course read the Finance Act 2023 as a scanned copy published by the Budget Office of the Federation on 7 June 2023, read on 2026-09-26, so it is paraphrased here. In the course's paraphrase: the capital allowance claimed against companies income tax in a year may not exceed two thirds of the assessable profit, the excess is carried forward, and companies in upstream or midstream gas operations are exempt.

The engine states its reading in `kpis.pia_notes` on any ledger with a year under the Act alone, unless the company is in gas operations:

> Before 2026 the companies income tax capital allowance is limited to two thirds of the assessable profit, with the excess carried forward (CITA Second Schedule para 24(7) as substituted by Finance Act 2023 s.9(b), effective 1 May 2023). The wording in force before 1 May 2023 was not read; the engine applies the same restriction to every year before 2026. Companies in upstream or midstream gas operations are exempt: set pia_cit_company_gas_operations to true.

The middle sentence is a stated choice for years before 1 May 2023.

## Where it binds

On the Ekene CPR case (synthetic), 2024 and 2025 are years under the Act alone and the assessable profit is thin against the capital allowance:

| year | CIT assessable profit | CIT allowance claimed | CIT |
| --- | --- | --- | --- |
| 2024 | 23999396.909159 | 15999597.939440 | 2399939.690916 |
| 2025 | 13442572.062084 | 8961714.708056 | 1344257.206208 |

Each claim is two thirds of that year's assessable profit, and the rest of the allowance is carried forward. On this lease 2026 is a year under the Nigeria Tax Act 2025, where the rule does not apply, and the carried amount is claimed there; the Expert tier reads that change of law.

## Where it does not

On the Ekene onshore lease (synthetic), 2024 and 2025 are also years under the Act alone and the restriction applies, but two thirds of each assessable profit is larger than the 18000000.000000 allowance, so the whole allowance is claimed. The engine's `cit_allowance_restricted` flag reads true in both years; that marks the rule as in force, whether or not it bit.

## The rule and the cost price ratio

The two brakes are independent: the cost price ratio limits hydrocarbon tax cost against revenue, and the two thirds rule limits the companies income tax capital allowance against profit. On the CPR case both bind in 2024 and 2025.

## Exercise

Work in the course's own hydrocarbon tax calculator, which runs the same engine.

1. Open "Companies income tax on a ledger" and choose ekene_cpr_binding_forfeiture. Match the two rows above and read the CIT allowance carried column.
2. Add `"pia_cit_company_gas_operations": true` to the terms. What happens to the 2024 claim, and why does companies income tax in 2024 fall to zero?
3. Choose ekene_onshore_across_2026 and confirm the claim equals the capital allowance in every year. Explain from the assessable profit why the rule does not bite.
