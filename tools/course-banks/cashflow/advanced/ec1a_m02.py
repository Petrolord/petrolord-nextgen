import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC1 cashflow, advanced tier, The PIA Royalties. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC7 PIA re-cut applied;
# written by tools/course-waves/cashflow/pia-recut/build.py. Edit the rows there, then re-run it.

q(1,
 "AKATA under the PIA is shallow water, lifting 2200000 bbl in 2029, and its 2029 production royalty is 10070350.00 on 186032000.00 of gross revenue. A reader applying 0.125000 to the gross lands far above that figure. What did the reader miss?",
 "The tranches. At 6027.40 bopd the liquids pay the weighted 0.054261, the first 5000 bopd at 5 percent and the rest at 7.5 percent, plus gas at 0.050000.",
 ["The price royalty of 3606152.270399, which the engine deducts from the production royalty column before it reports the row, lowering the charge.",
  "The HCDT, which is deducted from gross revenue before the royalty rate is applied, so that the royalty base is smaller than the gross revenue of the year.",
  "The water depth of 60 m, which places AKATA in a reduced shallow water band well below the 0.125000 that a field at 100 m of water would pay on every barrel."],
 "Onshore and shallow water charge 5 percent on the first 5000 bopd, 7.5 percent on the next 5000 and their own terrain rate only above 10000 bopd, as one weighted rate; AKATA never reaches the 12.5 percent tranche. The gas pays 281600.00 at 0.050000. Onshore the same row also reads 10070350.00. The price royalty is a separate line, the HCDT is not a royalty deduction, and the rate never reads the depth.")

q(3,
 "pia_deep_offshore_full lifts 21900000 bbl in 2025, 60000 bopd, and pays 94900000.00 of production royalty on 1752000000.00 of gross revenue. A second reader charges 0.075000 on every barrel and gets a larger figure. What is wrong with that reader's method?",
 "The 7.5 percent applies only to the share above 50000 bopd: the first 50000 pay 5 percent, and the year pays one weighted rate, 0.054167.",
 ["The threshold is wrong: deep offshore switches at 60000 bopd, and a field sitting exactly on 60000 bopd is charged the lower 0.050000 on every barrel of the year it produces.",
  "The tiers are reversed: the first 50000 bopd of a deep offshore field pay the 0.075000 rate and only the barrels above the threshold pay the lower 0.050000 tranche.",
  "The reader should have blended the two rates month by month through 2025 and applied the average, since the engine prices each year on its twelve monthly readings."],
 "Deep offshore pays 5 percent up to and including 50000 bopd and 7.5 percent on the share above, as one weighted average on the whole volume: (50000 x 0.05 + 10000 x 0.075) / 60000 = 0.054167, 94900000.00. pia_deep_offshore_naive_30k, at 30000 bopd, pays 0.050000 on every barrel, 43800000.00. The engine reads the year's barrels over its calendar days, and the tranches are not reversed.")

q(0,
 "The worked example and pia_deep_offshore_full both carry pia_water_depth_m 100, and one pays a production royalty rate of 0.112500 while the other pays 0.054167. What does deriveOilRoyaltyRate read?",
 "The terrain string and the daily rate. It does not read the water depth, the licence type, the lease status or the price.",
 ["The water depth, and 100 m sits on the boundary between the shallow water and deep offshore bands, so the engine falls back on the terrain string to break the tie.",
  "The licence type, since a PML pays the shallow water tranches and the deep offshore case is held on a different licence with its own royalty schedule.",
  "The oil price, which moves the field between the 0.112500 and 0.054167 rates because the price royalty and the production royalty share one curve."],
 "The rate is chosen by a string somebody typed; the depth is carried in the config and never consulted, and the licence type moves the hydrocarbon tax rate only. The worked example is shallow water at 50000 bopd, weighted 5, 7.5 and 12.5 percent; the deep offshore case is 60000 bopd, weighted 5 and 7.5 percent.")

q(2,
 "AKATA's total royalties read 60324870.87 onshore and in shallow water alike and 59503845.87 in deep offshore. NPV is 59766796.57 onshore and in shallow water; in deep offshore it is 136554243.51 read conservative_zero and 60060654.75 read aggressive_pml_30. Which NPV move is due to the royalty alone?",
 "Shallow water to deep offshore under aggressive_pml_30: the tax rate stays at 30 percent and only the royalty moves, by 821025.00.",
 ["Onshore to shallow water, since the terrain string changes only the royalty table there and every other line in the ledger follows from the royalty.",
  "Shallow water to deep offshore under conservative_zero, since that reading keeps the tax rate of shallow water and changes nothing but the royalty tranches.",
  "None of them, because each terrain also changes the gas royalty, 0.070000 onshore and in shallow water against 0.050000 offshore, so no move is oil alone."],
 "Onshore and shallow water only differ above 10000 bopd, so at AKATA's rate there is no move at all. Under aggressive_pml_30 the deep offshore year pays the same 30 percent hydrocarbon tax as shallow water, so the move from 59766796.57 to 60060654.75 is the royalty saved. conservative_zero also removes the tax, a reading the texts leave open, and gas pays 0.050000 in every terrain.")

q(1,
 "deriveOilRoyaltyRate onshore reads 0.050000 at 5000 bopd, 0.062500 at 10000 and 0.106250 at 20000, the tranches a producing marginal field onshore also pays. Why is the 10000 bopd rate exactly halfway between the first two tranches while the 20000 bopd rate is not halfway to 0.150000?",
 "At 10000 bopd the year's barrels split evenly between the 5 percent and 7.5 percent tiers; at 20000 bopd half the barrels sit in the 15 percent tier and the other half are still priced at the two lower tiers.",
 ["The 10000 bopd row is an interpolation between two table entries and the 20000 row is a table entry, so only the first is an average.",
  "The blend is arithmetic below 10000 bopd and geometric above it, which is why the upper rows rise more slowly than a straight average of the tranche rates would, and why the curve bends away from 0.150000 as the daily rate grows.",
  "The 20000 bopd rate is capped by the deep offshore tranche boundary at 50000 bopd, so the onshore curve is bent toward 0.132500 and away from 0.150000."],
 "The rate is the average across the year's barrels, so the first 10000 bopd are always priced at the two lower tranches and the rate approaches 0.150000 from below, 0.142708 at 120000 bopd. A marginal field is onshore or in shallow water; the terrain string marginal_field is refused.")

q(3,
 "AKATA in shallow water, run as a producing marginal field converted under s.94(1) (pia_marginal_field_pre_2021 true), keeps its 2029 production royalty of 10070350.00, yet its 2029 HCT falls from 27208719.48 to 13604359.74 and NPV rises from 59766796.57 to 97891150.04. What did the flag change?",
 "The hydrocarbon tax rate, 15 percent for a marginal field converted under s.94(1) against 30 percent; the royalty is the terrain's either way.",
 ["The royalty tranches, since the flag moves the field onto the lower marginal schedule and the smaller royalty leaves a larger base that is then taxed less.",
  "The price royalty, which the flag waives on a marginal field, so the hydrocarbon tax base loses 3606152.27 of deduction and the tax falls with it.",
  "The production allowance, which the flag doubles for a converted marginal field, so the chargeable profit is halved before the rate applies."],
 "The flag sets the hydrocarbon tax rate to 0.150000 and leaves the royalty to the terrain: total royalties stay 60324870.87 and total tax falls to 171815891.58. pia_marginal_field_blend, run onshore with the flag, pays HCT 24111699.56 on a chargeable profit of 160744663.71. The price royalty and the allowance do not move with the flag.")

q(0,
 "The PIA worked example sells at 80.000000 in 2025 and pays a price royalty of 34908351.810791 on 1460000000.00 of gross revenue, the 0.023910 in the table on the Regulations (2021) base, the engine default, where the 2021 curve reads 0.030000 at 80. What lowered the rate?",
 "The benchmarks rise every 1 January by 2 percent from 2021, so the same nominal price sits lower on the curve every year.",
 ["The rate is applied to revenue after the production royalty of 164250000.00 rather than to the gross, and the smaller base shows up as a smaller apparent rate.",
  "The price is deflated by the 3 percent inflation before the curve is read, so the real price of 2025 is below 80 and earns the lower rate on every barrel.",
  "The twelve monthly rows of 2025 are each read on the curve and averaged, and the monthly reads fall below the annual read because the curve is convex."],
 "At 60 USD/bbl the rate is 0.010000 in 2021, 0.005432 in 2025 and 0.000209 in 2030; a flat price is a falling royalty because the benchmarks move under it. On the Act's reading the benchmarks start a year earlier, a question the texts leave open.")

q(2,
 "In 2035 a price of 60 USD/bbl reads a price royalty rate of 0.000000, and in 2026 a price of 55 already does. What has happened to the curve?",
 "The 50 benchmark, rising 2 percent a year from 2021, has moved past those prices, and below the low benchmark the rate is nothing.",
 ["The engine floors the rate at 0.000000 whenever the price is below the year's applied oil price, and 60 is below every escalated price in the deck.",
  "The lower tier has been switched off by the 2025 framework change, which removed the price royalty below the 100 anchor for every terrain.",
  "The rate is rounded to six decimals, and by 2035 the true rate at 60 is a small positive number that rounds to zero."],
 "At 60 the rate is 0.010000 in 2021, 0.005432 in 2025, 0.000209 in 2030 and 0.000000 in 2035, a royalty in name only long before it vanishes. These are the Regulations (2021) base figures, the engine default.")

q(3,
 "pia_price_royalty_ceiling at 200.000000 pays 365000000.000000 on 3650000000.00 of gross revenue, exactly 10 percent, and the table reads 0.100000 at 200 in 2021, 2025, 2030 and 2035. What does a price above the 150 anchor earn?",
 "The ceiling of 0.100000 and no more, which is the only part of the curve that the years do not erode.",
 ["A rate that keeps climbing at the upper tier's slope, twice as steep as the lower tier, so that 200 earns more than 150 and 250 more than 200.",
  "The upper tier rate read at the escalated 150 anchor, which drifts upward with the years so that 200 earns a little more each year.",
  "A rate of 0.100000 plus the lower tier rate at 100, because the tiers stack and a price that has passed both anchors pays both."],
 "pia_high_price_royalty_tiers at 140.000000 pays 202719327.420547 on 2555000000.00, a rate of 0.079342, still between the escalated middle and high benchmarks; 160 and 200 both read 0.100000 in 2021.")

q(0,
 "pia_gas_only_hct_zero sells 20000000.00 Mscf and no oil for 90000000.00 of gross revenue at an oil price of 80.000000, and its price_royalty column reads 0.000000 beside a production royalty of 4500000.00. Why no price royalty?",
 "The price royalty reads the oil price and charges the oil; there is no oil, and gas does not carry it.",
 ["The gas price of 4.5 USD per Mscf is far below the 50 anchor, and the engine reads the price royalty curve at the gas price for a gas field.",
  "The oil price of 80.000000 in 2025 reads 0.000000 on the curve because the 50 anchor has escalated past it by 2025.",
  "The field is treated as frontier when it has no oil, and frontier is exempt from the price royalty outright."],
 "The 4500000.00 is 0.050000 on the gas, the gas rate in every terrain. The price royalty is charged on crude and condensate, each at its own price, and never on the gas revenue; there is no frontier switch, and 80.000000 in 2025 still reads 0.023910.")

q(1,
 "pia_frontier_exempt prints a production royalty of 21900000.00 on 292000000.00 of gross revenue and a price royalty of 0.000000, at a price of 80.000000 in 2025. What two things does the frontier terrain do to the royalties?",
 "It fixes the production royalty at 0.075000 at every daily rate, and it exempts the field from the price royalty outright, 0.000000 even at 200 USD/bbl.",
 ["It weights the production royalty at 0.050000 up to 50000 bopd and 0.075000 above like deep offshore, and defers the price royalty until that threshold is reached.",
  "It blends the production royalty across three tranches like an onshore field and reads the price royalty on the 2021 benchmarks without any escalation.",
  "It fixes the production royalty at 0.075000 and caps the price royalty at the 0.100000 ceiling, which at 80.000000 in 2025 happens to round to 0.000000."],
 "pia_onshore_new_lease on the same 292000000.00 of revenue, at 10000 bopd, pays 18250000.00 of production royalty at the weighted 0.062500 and 6981670.362158 of price royalty; frontier pays more production royalty, 7.5 percent flat, and no price royalty at all.")

q(2,
 "pia_deep_offshore_wi_50 and pia_deep_offshore_naive_30k both carry oil_bbl 10950000.00 on the 2025 row, yet the first pays 47450000.00 of production royalty and the second 43800000.00. Why do two rows with the same barrels pay different royalties?",
 "The tranche is read on the field's barrels and the share applied to the money after: WI 50 is still a 60000 bopd field at 0.054167, the naive upload a 30000 bopd one at 0.050000.",
 ["The WI 50 row adds its price royalty of 20945011.086475 into the production royalty column, and the naive row reports that same price royalty separately.",
  "The naive row is read at 2025 benchmarks and the WI 50 row at 2021 benchmarks, because a working interest below 100 percent fixes the price curve at the licence year.",
  "The WI 50 row applies 0.075000 to the field's 21900000.00 bbl and then halves, while the naive row applies 0.050000 and does not halve, and the scalings land on those figures."],
 "royalty_liquids_bopd reads 60000 on the WI 50 row and 30000 on the naive row, and cumulative_oil_bbl_lifetime reads 21900000.00 and 10950000.00; only the lifetime column and prod_alw_eligible_bbl remember the field. Half of 94900000.00 is 47450000.00.")

q(0,
 "pia_deep_offshore_naive_30k lands in the cheaper 0.050000 rate yet reports NPV 369073842.57, below the correct half share of 453861842.57. What pulls it down?",
 "It still bears the full 100000000.00 of capex, 100000000.00 of opex, 5100000.00 of HCDT and 15000000.00 of NDDC against half the revenue; two errors in opposite directions, and neither cancels the other.",
 ["The lower rate lowers the royalty but the hydrocarbon tax rises to take back the difference, since deep offshore under the conservative reading charges its tax on whatever royalty the smaller field has saved in the year.",
  "The engine detects the pre-scaled upload and charges a penalty royalty at the 0.075000 rate on the barrels it infers were left out of the file.",
  "The naive row is discounted one extra year because the halved production is read as starting in 2026, and the extra division by 1.1 costs the difference."],
 "The take reads 45.4033 percent against 41.5126 for both honest runs; the naive row is a different field with the wrong costs and cannot stand in for a share of the real one.")

q(3,
 "AKATA under the PIA at pia_working_interest_pct 50 reports NPV 29883398.29, exactly half of 59766796.57, and a take of 70.6449 percent that has not moved. Under joint venture terms the same field reads take 66.1723 percent at a working interest of 100, 60 and 25 alike. Why is take invariant under both regimes?",
 "Both ledgers scale every monetary line and the volumes together, so each line the ratio reads is cut with the rest and the ratio is the number it was.",
 ["The PIA scales the whole ledger, while the JV take is invariant for a different reason, the partners' royalty and tax being charged at the operator's rates.",
  "Take is computed before the working interest is applied in either regime, so the ratio never sees a share at all and reports the field's number.",
  "The royalties are field-level tiers in both regimes and do not scale with the working interest, so the state's share stays the same fraction of a smaller revenue."],
 "Both regimes put every monetary line and the volumes at the share, so the ratio is unchanged. Under the PIA the royalties halve to 30162435.44 while the tranches and the allowance cap stay field-level, and the 2200000.00 barrels the allowance reads are the field's.")

q(1,
 "A production file has been pre-scaled to the operator's share before upload. What can the engine report to warn the reader?",
 "Nothing. It cannot tell a pre-scaled upload from a small field: the naive run reports working_interest_pct not reported exactly as the full run does.",
 ["A working_interest_pct of 50 inferred from the ratio of uploaded barrels to the lifetime cumulative, which it prints in the KPI block as a warning.",
  "A prod_alw_cap_applied flag of true on the first row, because a halved field reaches the wrong tier and the engine marks a tier it cannot reconcile.",
  "An ingestion refusal, since the volume columns of a pre-scaled file fail the per-well naming check that the production loader applies."],
 "The row's oil_bbl is the entitlement either way; the only honest scaling is pia_working_interest_pct on the full field, which keeps cumulative_oil_bbl_lifetime at 21900000.00.")

emit(Q, '/root/wt-ec7-recut/tools/course-banks/cashflow/advanced/ec1a_m02.json', expect_n=15)
finish()
