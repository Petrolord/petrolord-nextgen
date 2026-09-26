# HCT on liquids only

The hydrocarbon tax has a rate set by terrain, licence and lease, and a base that is crude oil and condensate with gas left out. PIA figures here use the Regulations (2021) price-royalty base, the engine default.

{{panel:ec-fiscal-explorer}}

## The rate

deriveHctRate:

| terrain, licence, framework | rate |
| --- | --- |
| shallow_water PML converted, PIA | 0.300000 |
| shallow_water PPL, PIA | 0.150000 |
| onshore PML marginal pre-2021, PIA | 0.150000 |
| deep_offshore PML, PIA | 0.000000 |
| deep_offshore PML, NTA, no reading stated | refused |
| deep_offshore PML, NTA conservative_zero | 0.000000 |
| deep_offshore PML, NTA aggressive_pml_30 | 0.300000 |
| deep_offshore PML, NTA custom 12.5 | 0.125000 |
| frontier, either | 0.000000 |
| override 20 anywhere | 0.200000 |

On the worked example's chargeable profit of 952616648.19 the rates read: PML 285784994.46 (NPV 141236909.83), PPL 142892497.23 (NPV 284129407.06), override 20 190523329.64 (NPV 236498574.65). The licence alone moves take from 85.5512 percent to 70.9331. A producing marginal field converted under s.94(1) pays the same 0.150000: pia_marginal_field_blend, run onshore with the marginal flag, charges 24111699.56 on 160744663.71. The framework does not change the rate of a converted shallow-water PML: AKATA reads 0.300000 in every year under force_pia and on auto. Its HCT still differs, 92396680.43 against 91654840.32, because PIA years take the capital allowance as 20, 20, 20, 20 and 19 percent and NTA years as 20 percent a year.

Deep offshore in a PIA year pays nothing: pia_deep_offshore_full, a 2025 year, charges 0.00. In an NTA year the Act brings deep offshore into the tax (NTA s.65(1)) and prints rates only for onshore and shallow water (s.72), so the engine refuses the year until a reading is stated. The same field under force_nta: aggressive_pml_30 charges 426107993.35 for NPV 466664592.02; custom 12.5 charges 177544997.23 for 715227588.14; conservative_zero charges 0.00 for 892772585.37. On AKATA the choice is NPV 136554243.51 against 60060654.75, a swing of about 76 million, most of the 94 million an oil price sweep from 82 to 120 adds (NPV 153901708.13).

## The base

pia_gas_only_hct_zero sells 20000000.00 Mscf and no liquids for 90000000.00 of gross revenue. Its hct_assessable_profit is 0.00, hct_tax 0.00, and CIT is still 15420000.00 on a cit_chargeable_profit of 51400000.00. NPV 18318000.00. The Act taxes crude oil and condensate (PIA s.260(1); NTA s.65(2)), and the engine follows it whatever pia_hct_include_gas_revenue says: pia_gas_only_legacy_hct, the same field with that flag true, prints the same 0.00 and the same NPV. Condensate is a liquid: multiyear_pia_real lifts 6000000.00 bbl of oil and 400000.00 bbl of condensate in 2025 and prod_alw_eligible_bbl reads 6400000.00.

On AKATA the exclusion is visible in the bases. The 2029 hct_assessable_profit is 136924208.42 while cit_assessable_profit is 141335497.73; both deduct the NDDC of 7020000.00, but the first leaves out the gas revenue and its royalty and takes the shared costs at the oil share. From there the HCT base loses the capital allowance and the production allowance of 5500000.00 to reach hct_chargeable_profit 90695731.60, and the 0.300000 rate gives 27208719.48.

## The mistake

Taxing the whole revenue at 30 percent: the gas-only field would carry a hydrocarbon tax it does not owe. The other mistake is treating the deep offshore rate in an NTA year as settled. Three readings give three NPVs, and pia_deep_offshore_hct_interpretation is a string somebody states; the texts leave the question open.

## What it refuses

The rate does not read water depth or price, and there is no gas rate in the table: gas is not in the base. Frontier pays 0.000000 under either framework, whatever its licence.

## Exercise

Write the HCT on the worked example at PML, PPL and override 20, and the NPV for each. Then run the gas-only case with the flag false and true and say what base each HCT was charged on.
