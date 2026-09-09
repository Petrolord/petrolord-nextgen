# HCT on liquids only

The hydrocarbon tax has a rate chosen by terrain, licence and reading, and a base that is oil and condensate with gas left out.

{{panel:ec-fiscal-explorer}}

## The rate

deriveHctRate:

| terrain, licence, framework | rate |
| --- | --- |
| shallow_water PML converted, PIA | 0.300000 |
| shallow_water PPL, PIA | 0.150000 |
| onshore PML marginal pre-2021, PIA | 0.150000 |
| deep_offshore PML, PIA | 0.000000 |
| deep_offshore PML, NTA conservative | 0.000000 |
| deep_offshore PML, NTA aggressive | 0.300000 |
| deep_offshore PML, NTA custom 12.5 | 0.125000 |
| frontier, either | 0.000000 |
| override 20 anywhere | 0.200000 |

On the worked example's chargeable profit of 949369854.24 the rates read: PML 284810956.27 (NPV 135185570.34), PPL 142405478.14 (NPV 277591048.48), override 20 189873970.85 (NPV 230122555.76). The licence alone moves take from 86.1703 percent to 71.6019. The marginal pre-2021 flag does the same thing at the same rate: pia_marginal_field_blend charges 26361776.50 on 175745176.68, which is 0.150000. The framework does not move it: AKATA under force_pia reports the same HCT of 77020493.72 as under nta_2025, and only the TET and levy lines change. Deep offshore under the 2025 framework is a reading, not a rule. pia_deep_offshore_nta_aggressive charges 419659147.53 and reports NPV 449025977.03; the custom 12.5 charges 174857978.14 for 693827146.42; the conservative reading charges 0.00 for 890564331.93. On AKATA the same choice is NPV 141623594.88 against 61725382.46, and the digest's own comparison is that the terrain string moves NPV more than an oil price sweep from 82 to 120, which reaches 128984232.18.

## The base

pia_gas_only_hct_zero sells 20000000.00 Mscf and no liquids for 90000000.00 of gross revenue. Its hct_assessable_profit is 0.00, hct_tax 0.00, and CIT is still 14880000.00 on a cit_chargeable_profit of 49600000.00. NPV 17380000.00. The escape hatch pia_hct_include_gas_revenue true rebuilds the base on the whole revenue: hct_assessable_profit 68600000.00, chargeable 64600000.00, hct_tax 19380000.00, and NPV -2000000.00. Condensate is a liquid: multiyear_pia_real lifts 6000000.00 bbl of oil and 400000.00 bbl of condensate in 2025 and prod_alw_eligible_bbl reads 6400000.00.

On AKATA the exclusion is visible in the bases. The 2029 hct_assessable_profit is 130971072.31 while cit_assessable_profit is 134762247.64; the gas revenue and its royalty are out of the first, and the NDDC is out of the second. From there the HCT base loses the capital allowance and the production allowance of 5500000.00 to reach hct_chargeable_profit 84742595.49, and the 0.300000 rate gives 25422778.65. A field with 800 scf of gas per barrel pays its hydrocarbon tax on the oil alone.

## The mistake

Taxing the whole revenue at 30 percent, which is what the legacy hatch does: on the gas-only case it turns a project worth 17380000.00 into one worth -2000000.00. The other mistake is treating the deep offshore rate as settled. Three readings, three NPVs, and pia_deep_offshore_hct_interpretation is a string somebody chose; the digest's conservative_zero is a default, not a finding.

## What it refuses

The rate does not read water depth or price, and there is no gas rate in the table: gas is not in the base, so there is nothing for a rate to act on unless the hatch is opened. Frontier pays 0.000000 under either framework, whatever its licence.

## Exercise

Write the HCT on the worked example at PML, PPL and override 20, and the NPV for each. Then run the gas-only case with and without the hatch and say what base each HCT was charged on.
